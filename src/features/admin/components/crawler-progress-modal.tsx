'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Check, 
  X, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink, 
  Sparkles, 
  Layers, 
  Clock, 
  ChevronRight,
  Database,
  Globe,
  Radio,
  Store
} from 'lucide-react';
import Image from 'next/image';
import { SmartDeal } from '@/features/deals/types/deal.types';
import { CrawlerProgressEvent } from '../types/admin.types';
import { useMobileNative } from '@/shared/hooks/use-mobile-native';

interface CrawlerProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetScopeLabel?: string;
  onFinished?: (createdDeals: SmartDeal[]) => void;
  onViewDealsTab?: () => void;
  // 啟動參數
  startParams: {
    targetIds?: string[] | string;
    articleUrl?: string;
  } | null;
}

export const CrawlerProgressModal: React.FC<CrawlerProgressModalProps> = ({
  isOpen,
  onClose,
  targetScopeLabel = '全通路選取站點',
  onFinished,
  onViewDealsTab,
  startParams,
}) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // 當前進度狀態
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [currentTarget, setCurrentTarget] = useState<{
    id?: string;
    name?: string;
    logo?: string;
    index?: number;
    total?: number;
    step?: string;
    message?: string;
  }>({});

  // 成果累積
  const [summary, setSummary] = useState<{
    crawledCount: number;
    insertedCount: number;
    updatedCount: number;
    purgedCount: number;
    createdDeals: SmartDeal[];
  }>({
    crawledCount: 0,
    insertedCount: 0,
    updatedCount: 0,
    purgedCount: 0,
    createdDeals: [],
  });

  // 即時日誌串流
  const [logs, setLogs] = useState<{ id: string; time: string; type: string; message: string }[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { triggerHaptic } = useMobileNative();

  // 自動滾動終端機日誌
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // 計時器
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  // 格式化秒數為 mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // 啟動即時爬蟲 SSE 請求
  const runLiveCrawl = async () => {
    if (!startParams) return;

    setIsRunning(true);
    setIsCompleted(false);
    setErrorMessage(null);
    setElapsedSeconds(0);
    setProgressPercent(5);
    setLogs([]);
    setSummary({
      crawledCount: 0,
      insertedCount: 0,
      updatedCount: 0,
      purgedCount: 0,
      createdDeals: [],
    });

    triggerHaptic('medium');

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const res = await fetch('/api/admin/crawler/live-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(startParams),
        signal: abortController.signal,
      });

      if (!res.ok || !res.body) {
        throw new Error(`伺服器連線異常 (${res.status} ${res.statusText})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data: ')) continue;
          const jsonStr = trimmed.slice(6);

          try {
            const event: CrawlerProgressEvent = JSON.parse(jsonStr);

            // 更新日誌
            setLogs((prev) => [
              ...prev,
              {
                id: `${Date.now()}-${Math.random()}`,
                time: event.timestamp,
                type: event.type,
                message: event.message,
              },
            ]);

            // 依事件類型處理
            if (event.stepProgress !== undefined) {
              setProgressPercent(event.stepProgress);
            }

            if (event.type === 'target_start') {
              setCurrentTarget({
                id: event.targetId,
                name: event.targetName,
                logo: event.targetLogo,
                index: event.targetIndex,
                total: event.totalTargets,
                step: event.currentStep || 'connecting',
                message: event.message,
              });
            } else if (event.type === 'step') {
              setCurrentTarget((prev) => ({
                ...prev,
                step: event.currentStep || prev.step,
                message: event.message,
              }));
            } else if (event.type === 'target_success') {
              setCurrentTarget((prev) => ({
                ...prev,
                step: 'complete',
                message: event.message,
              }));
            } else if (event.type === 'complete') {
              setProgressPercent(100);
              setIsCompleted(true);
              setIsRunning(false);
              triggerHaptic('success');
              setSummary({
                crawledCount: event.crawledCount || 0,
                insertedCount: event.insertedCount || 0,
                updatedCount: event.updatedCount || 0,
                purgedCount: event.purgedCount || 0,
                createdDeals: event.deals || [],
              });
              onFinished?.(event.deals || []);
            } else if (event.type === 'error') {
              setErrorMessage(event.message || '執行時發生未知錯誤');
              setIsRunning(false);
              triggerHaptic('warning');
            }
          } catch (parseErr) {
            console.error('SSE JSON parse error:', parseErr);
          }
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setErrorMessage(err.message || '與伺服器串流連線中斷');
        setIsRunning(false);
        triggerHaptic('warning');
      }
    }
  };

  // 當彈窗開啟且有 startParams 時自動啟動
  useEffect(() => {
    if (isOpen && startParams && !isRunning && !isCompleted && !errorMessage) {
      runLiveCrawl();
    }
  }, [isOpen, startParams]);

  // 關閉或卸載時中止請求
  const handleClose = () => {
    if (isRunning) {
      if (!confirm('爬蟲正在背景運行中，確定要關閉監控視窗嗎？（伺服器將繼續執行完畢）')) {
        return;
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    }
    setIsRunning(false);
    setIsCompleted(false);
    setErrorMessage(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 !m-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden text-slate-900">
        
        {/* 頂部標題列 */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
              isCompleted 
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                : errorMessage 
                ? 'bg-rose-500 text-white' 
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}>
              {isCompleted ? (
                <Check className="w-5 h-5" />
              ) : errorMessage ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <Radio className="w-5 h-5 animate-pulse text-rose-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black tracking-tight text-white">
                  {isCompleted ? '🎉 爬蟲作業已圓滿完成' : errorMessage ? '⚠️ 爬蟲作業發生中斷' : '即時爬蟲處理狀況中樞'}
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  isCompleted 
                    ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30' 
                    : errorMessage 
                    ? 'bg-rose-400/20 text-rose-300' 
                    : 'bg-indigo-400/20 text-indigo-300 border border-indigo-400/30'
                }`}>
                  {isCompleted ? '已入庫' : errorMessage ? '異常' : '實時串流中'}
                </span>
              </div>
              <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                {targetScopeLabel}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* 計時器 */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-mono text-amber-300 font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(elapsedSeconds)}</span>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 內容區塊 */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-slate-800">

          {/* 錯誤警告態 */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 text-xs font-bold">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-extrabold text-rose-900">執行中發生錯誤：</p>
                <p className="text-rose-700">{errorMessage}</p>
                <button
                  type="button"
                  onClick={runLiveCrawl}
                  className="mt-2 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  重新嘗試抓取
                </button>
              </div>
            </div>
          )}

          {/* 1. 進度條與站點計數 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-black text-slate-700">
              <div className="flex items-center gap-1.5">
                {isRunning && <RefreshCw className="w-3.5 h-3.5 animate-spin text-rose-500" />}
                <span>
                  {isCompleted 
                    ? '所有目標處理完畢' 
                    : currentTarget.total 
                    ? `正在執行第 ${currentTarget.index || 1} / ${currentTarget.total} 個站點` 
                    : '準備初始化管線...'}
                </span>
              </div>
              <span className="font-mono text-sm text-indigo-600 font-extrabold">
                {progressPercent}%
              </span>
            </div>

            {/* 進度條 */}
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/70 p-0.5 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-rose-500 via-orange-500 to-amber-400 rounded-full transition-all duration-300"
                style={{ width: `${Math.max(4, Math.min(100, progressPercent))}%` }}
              />
            </div>
          </div>

          {/* 2. 當前目標卡片 (Active Target Spotlight Card) */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4.5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-xs overflow-hidden flex-shrink-0">
                  {currentTarget.logo ? (
                    <Image
                      src={currentTarget.logo}
                      alt={currentTarget.name || '站點'}
                      width={44}
                      height={44}
                      className="w-full h-full object-contain p-1"
                    />
                  ) : (
                    <Store className="w-5 h-5 text-indigo-600" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-slate-900">
                      {currentTarget.name || '載入目標站點中...'}
                    </h4>
                    {currentTarget.index && (
                      <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-extrabold">
                        第 {currentTarget.index} 站
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {currentTarget.message || '正在連線中...'}
                  </p>
                </div>
              </div>
            </div>

            {/* 四大執行階段指示燈 */}
            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-200/60">
              <div className={`p-2 rounded-xl text-center text-[10px] font-extrabold transition-all ${
                currentTarget.step === 'connecting'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-500 border border-slate-200/60'
              }`}>
                1. 連線目標
              </div>
              <div className={`p-2 rounded-xl text-center text-[10px] font-extrabold transition-all ${
                currentTarget.step === 'fetching_posts'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-500 border border-slate-200/60'
              }`}>
                2. 貼文/文章擷取
              </div>
              <div className={`p-2 rounded-xl text-center text-[10px] font-extrabold transition-all ${
                currentTarget.step === 'gemini_ai_parsing'
                  ? 'bg-rose-600 text-white shadow-xs animate-pulse'
                  : 'bg-white text-slate-500 border border-slate-200/60'
              }`}>
                3. Gemini AI 拆解
              </div>
              <div className={`p-2 rounded-xl text-center text-[10px] font-extrabold transition-all ${
                currentTarget.step === 'db_upsert' || currentTarget.step === 'complete'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-500 border border-slate-200/60'
              }`}>
                4. 入庫去重
              </div>
            </div>
          </div>

          {/* 3. 完成狀態摘要看板 */}
          {isCompleted && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4.5 space-y-3 animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-2 text-emerald-950 font-black text-sm">
                <Check className="w-5 h-5 text-emerald-600" />
                <span>採集成果全數就緒，資料庫已自動更新！</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-xs">
                  <p className="text-[10px] text-slate-500 font-bold">採集情報總數</p>
                  <p className="text-base font-black text-slate-900 mt-0.5">{summary.crawledCount} 筆</p>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-xs">
                  <p className="text-[10px] text-slate-500 font-bold">新卡片成功入庫</p>
                  <p className="text-base font-black text-emerald-600 mt-0.5">+{summary.insertedCount} 筆</p>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-xs">
                  <p className="text-[10px] text-slate-500 font-bold">現有情報更新</p>
                  <p className="text-base font-black text-indigo-600 mt-0.5">{summary.updatedCount} 筆</p>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-xs">
                  <p className="text-[10px] text-slate-500 font-bold">過期巡檢清理</p>
                  <p className="text-base font-black text-amber-600 mt-0.5">{summary.purgedCount} 筆</p>
                </div>
              </div>

              {/* 最新萃取情報縮圖卡片 */}
              {summary.createdDeals.length > 0 && (
                <div className="pt-2 border-t border-emerald-100 space-y-2">
                  <p className="text-[11px] font-bold text-emerald-900">
                    最新寫入的特價情報（共 {summary.createdDeals.length} 筆）：
                  </p>
                  <div className="flex gap-2.5 overflow-x-auto pb-1 max-w-full">
                    {summary.createdDeals.slice(0, 5).map((deal) => (
                      <div 
                        key={deal.id}
                        className="flex-shrink-0 w-44 bg-white p-2.5 rounded-xl border border-emerald-100 text-xs shadow-xs space-y-1"
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold">
                          <span className="truncate max-w-[80px]">{deal.merchant.name}</span>
                          <span className="text-rose-600 font-black">${deal.discountPrice}</span>
                        </div>
                        <p className="text-[11px] font-black text-slate-900 line-clamp-1">{deal.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. 即時終端機日誌串流 (Realtime Terminal Log Console) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                <span>即時處理紀錄串流 ({logs.length})</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">自動滾動至最新</span>
            </div>

            <div 
              ref={logContainerRef}
              className="bg-slate-950 rounded-2xl p-4 text-[11px] font-mono text-emerald-400 h-44 overflow-y-auto space-y-1.5 border border-slate-800 shadow-inner"
            >
              {logs.length === 0 ? (
                <div className="text-slate-500 text-center py-6">正在連接即時管線，等待串流訊息...</div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="leading-relaxed border-b border-slate-900/60 pb-1">
                    <span className="text-slate-500">[{log.time}] </span>
                    <span className={`font-bold ${
                      log.type === 'target_start' ? 'text-cyan-300' :
                      log.type === 'target_success' ? 'text-emerald-300' :
                      log.type === 'target_error' || log.type === 'error' ? 'text-rose-400' :
                      log.type === 'complete' ? 'text-amber-300' : 'text-slate-300'
                    }`}>
                      {log.message}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* 底部動作列 */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between rounded-b-3xl">
          <div className="text-xs text-slate-500">
            {isRunning ? (
              <span className="flex items-center gap-1.5 text-indigo-600 font-bold">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>正在進行網路連線與 Gemini AI 拆解，請稍候...</span>
              </span>
            ) : isCompleted ? (
              <span className="text-emerald-600 font-bold">✓ 伺服器已將所有最新資料庫狀態持久化保存</span>
            ) : (
              <span>已停止</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isCompleted && onViewDealsTab && (
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  onViewDealsTab();
                }}
                className="px-4 py-2 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white text-xs font-black rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>檢視情報牆卡片</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleClose}
              className={`px-5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                isCompleted 
                  ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm' 
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              }`}
            >
              {isRunning ? '轉為背景運行並關閉' : '關閉視窗'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
