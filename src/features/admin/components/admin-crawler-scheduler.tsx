'use client';

import React, { useState } from 'react';
import { 
  CrawlerTargetConfig, 
  CrawlerScheduleConfig, 
  CrawlerJobLog, 
  CrawlerScheduleMode,
  CrawlerExecutionResult
} from '../types/admin.types';
import { CrawlerResultModal } from './crawler-result-modal';
import { 
  updateCrawlerTargetAction, 
  updateCrawlerScheduleAction, 
  triggerManualCrawlAction,
  createCrawlerTargetAction,
  updateCrawlerTargetDetailsAction,
  batchUpdateCrawlerTargetsAction,
  deleteCrawlerTargetAction
} from '../server/admin.actions';
import { 
  Bot, 
  Clock, 
  Play, 
  RefreshCw, 
  Check, 
  AlertCircle, 
  Terminal, 
  Globe, 
  Sliders, 
  Sparkles, 
  Store,
  Zap,
  Plus,
  Edit3,
  Trash2,
  X,
  CheckSquare,
  Square,
  Layers,
  Settings2,
  Calendar
} from 'lucide-react';
import { useMobileNative } from '@/shared/hooks/use-mobile-native';
import Image from 'next/image';
import { SmartDeal } from '@/features/deals/types/deal.types';

interface AdminCrawlerSchedulerProps {
  initialTargets: CrawlerTargetConfig[];
  initialSchedule: CrawlerScheduleConfig;
  initialLogs: CrawlerJobLog[];
  onRefresh?: () => void;
  onViewDealsTab?: () => void;
}

export const AdminCrawlerScheduler: React.FC<AdminCrawlerSchedulerProps> = ({
  initialTargets,
  initialSchedule,
  initialLogs,
  onRefresh,
  onViewDealsTab,
}) => {
  const [targets, setTargets] = useState<CrawlerTargetConfig[]>(initialTargets);
  const [schedule, setSchedule] = useState<CrawlerScheduleConfig>(initialSchedule);
  const [logs, setLogs] = useState<CrawlerJobLog[]>(initialLogs);
  const [selectedTargetIds, setSelectedTargetIds] = useState<string[]>([]);
  
  // 狀態與彈窗
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [runningTargetId, setRunningTargetId] = useState<string | null>(null);
  const [extractedPreviewDeals, setExtractedPreviewDeals] = useState<SmartDeal[]>([]);
  const [crawlerExecutionResult, setCrawlerExecutionResult] = useState<CrawlerExecutionResult | null>(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isAddTargetModalOpen, setIsAddTargetModalOpen] = useState<boolean>(false);
  const [editingTarget, setEditingTarget] = useState<CrawlerTargetConfig | null>(null);
  const [isBatchScheduleModalOpen, setIsBatchScheduleModalOpen] = useState<boolean>(false);


  // 批量排程設定表單狀態
  const [batchScheduleMode, setBatchScheduleMode] = useState<CrawlerScheduleMode>('inherit');
  const [batchCustomTimes, setBatchCustomTimes] = useState<string>('09:00, 15:00');
  const [batchIntervalMinutes, setBatchIntervalMinutes] = useState<number>(60);

  const { triggerHaptic } = useMobileNative();

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  // 全選 / 取消全選
  const handleToggleSelectAll = () => {
    triggerHaptic('light');
    if (selectedTargetIds.length === targets.length) {
      setSelectedTargetIds([]);
    } else {
      setSelectedTargetIds(targets.map((t) => t.id));
    }
  };

  const handleToggleSelectOne = (targetId: string) => {
    triggerHaptic('light');
    if (selectedTargetIds.includes(targetId)) {
      setSelectedTargetIds(selectedTargetIds.filter((id) => id !== targetId));
    } else {
      setSelectedTargetIds([...selectedTargetIds, targetId]);
    }
  };

  // 單站開關
  const handleToggleTarget = async (targetId: string, currentEnabled: boolean) => {
    triggerHaptic('light');
    const res = await updateCrawlerTargetAction(targetId, !currentEnabled);
    if (res.success && res.target) {
      setTargets((prev) => prev.map((t) => (t.id === targetId ? res.target! : t)));
      showFeedback(`已${!currentEnabled ? '啟用' : '停用'}【${res.target.name}】爬蟲`);
      onRefresh?.();
    }
  };

  // 批量啟用 / 批量停用
  const handleBatchToggleEnabled = async (enabled: boolean) => {
    if (selectedTargetIds.length === 0) return;
    triggerHaptic('medium');
    const res = await batchUpdateCrawlerTargetsAction(selectedTargetIds, { enabled });
    if (res.success) {
      setTargets((prev) =>
        prev.map((t) => (selectedTargetIds.includes(t.id) ? { ...t, enabled } : t))
      );
      showFeedback(`已批量將 ${res.updatedCount} 個站點設定為：${enabled ? '啟用' : '停用'}`);
      onRefresh?.();
    }
  };

  // 批量設定排程提交
  const handleBatchScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTargetIds.length === 0) return;

    triggerHaptic('medium');
    const times = batchCustomTimes.split(/[,，、\s]/).map((s) => s.trim()).filter(Boolean);
    const res = await batchUpdateCrawlerTargetsAction(selectedTargetIds, {
      scheduleMode: batchScheduleMode,
      customScheduleTimes: times,
      customIntervalMinutes: batchIntervalMinutes,
    });

    if (res.success) {
      setTargets((prev) =>
        prev.map((t) =>
          selectedTargetIds.includes(t.id)
            ? {
                ...t,
                scheduleMode: batchScheduleMode,
                customScheduleTimes: times,
                customIntervalMinutes: batchIntervalMinutes,
              }
            : t
        )
      );
      setIsBatchScheduleModalOpen(false);
      showFeedback(`🎉 已成功為 ${res.updatedCount} 個站點更新排程設定！`);
      onRefresh?.();
    }
  };

  // 單站編輯提交
  const handleSaveEditingTarget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTarget) return;

    triggerHaptic('medium');
    const res = await updateCrawlerTargetDetailsAction(editingTarget.id, {
      name: editingTarget.name,
      url: editingTarget.url,
      defaultCategory: editingTarget.defaultCategory,
      scheduleMode: editingTarget.scheduleMode,
      customScheduleTimes: editingTarget.customScheduleTimes,
      customIntervalMinutes: editingTarget.customIntervalMinutes,
      crawlRule: editingTarget.crawlRule,
    });

    if (res.success && res.target) {
      setTargets((prev) => prev.map((t) => (t.id === editingTarget.id ? res.target! : t)));
      setEditingTarget(null);
      showFeedback(res.message);
      onRefresh?.();
    } else {
      showFeedback(res.message || '更新失敗', 'error');
    }
  };

  // 新增站點提交
  const handleCreateTargetSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    triggerHaptic('medium');
    const formData = new FormData(e.currentTarget);
    const res = await createCrawlerTargetAction(formData);

    if (res.success && res.target) {
      setTargets([res.target, ...targets]);
      setIsAddTargetModalOpen(false);
      showFeedback(res.message);
      onRefresh?.();
    } else {
      showFeedback(res.message || '新增站點失敗', 'error');
    }
  };

  // 刪除自訂站點
  const handleDeleteTarget = async (targetId: string, name: string) => {
    if (!confirm(`確定要刪除自訂爬蟲站點【${name}】嗎？`)) return;
    triggerHaptic('warning');
    const res = await deleteCrawlerTargetAction(targetId);
    if (res.success) {
      setTargets((prev) => prev.filter((t) => t.id !== targetId));
      setSelectedTargetIds((prev) => prev.filter((id) => id !== targetId));
      showFeedback(`已成功刪除站點【${name}】`);
      onRefresh?.();
    } else {
      showFeedback(res.message, 'error');
    }
  };

  // 全域排程時間儲存
  const handleSaveGlobalSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic('medium');
    const res = await updateCrawlerScheduleAction(schedule);
    if (res.success) {
      showFeedback('全域排程設定已儲存！');
      onRefresh?.();
    }
  };

  // 觸發爬蟲
  const handleTriggerCrawl = async (targetIds?: string | string[]) => {
    triggerHaptic('warning');
    setIsRunning(true);
    const targetLabel = Array.isArray(targetIds)
      ? `${targetIds.length} 個選取站點`
      : targetIds || 'all';
    setRunningTargetId(targetLabel);
    setExtractedPreviewDeals([]);

    try {
      const res = await triggerManualCrawlAction(targetIds);
      if (res.success) {
        triggerHaptic('success');
        showFeedback(res.message);
        setExtractedPreviewDeals(res.createdDeals || []);
        setCrawlerExecutionResult(res);
        setIsResultModalOpen(true);
        setLogs((prev) => [
          {
            id: `log-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString('zh-TW', { hour12: false }),
            targetName: Array.isArray(targetIds)
              ? `${targetIds.length} 個站點`
              : targetIds ? targets.find((t) => t.id === targetIds)?.name : '全站站點',
            type: 'manual',
            status: 'success',
            crawledCount: res.crawledCount,
            insertedCount: res.insertedCount,
            message: res.message,
          },
          ...prev,
        ]);
        onRefresh?.();
      } else {
        triggerHaptic('warning');
        showFeedback(res.message, 'error');
      }
    } catch (err: any) {
      triggerHaptic('warning');
      showFeedback(err.message || '抓取失敗', 'error');
    } finally {
      setIsRunning(false);
      setRunningTargetId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 頂部操作看板 (簡約高對比白底 / 經典泡泡風格) */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold">
              <Bot className="w-3.5 h-3.5 text-rose-400" />
              <span>自動化爬蟲 & 排程中控核心</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              全站情報即時採集與排程控制中樞
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              支援自訂新增爬蟲網站、單站獨立排程自訂、多選批量設定與手動即時採集。
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto flex-shrink-0">
            {/* 新增爬蟲目標站點按鈕 */}
            <button
              type="button"
              onClick={() => setIsAddTargetModalOpen(true)}
              className="px-4 py-3 bg-white hover:bg-slate-100 text-slate-900 text-xs sm:text-sm font-black rounded-2xl shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-rose-600" />
              <span>新增爬蟲網站</span>
            </button>

            {/* 一鍵全站抓取 */}
            <button
              type="button"
              disabled={isRunning}
              onClick={() => handleTriggerCrawl()}
              className="px-5 py-3 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white text-xs sm:text-sm font-black rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              {isRunning && runningTargetId === 'all' ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>全量爬蟲抓取中...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>⚡ 全通路全量抓取</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {feedback && (
        <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 border transition-all ${
          feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          {feedback.type === 'success' ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* 抓取即時預覽卡片 */}
      {extractedPreviewDeals.length > 0 && (
        <div className="bg-emerald-50/80 border border-emerald-200 p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-black text-emerald-950">
                🎉 即時抓取成功預覽（共 {extractedPreviewDeals.length} 筆特惠已即時寫入情報牆）
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setExtractedPreviewDeals([])}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-bold cursor-pointer"
            >
              收起預覽
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {extractedPreviewDeals.map((deal) => (
              <div key={deal.id} className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1.5">
                    <span>{deal.merchant.name}</span>
                    <span className="text-rose-600">${deal.discountPrice}</span>
                  </div>
                  <h4 className="text-xs font-black text-slate-900 line-clamp-2">{deal.title}</h4>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{deal.targetItems[0] || '特惠品項'}</span>
                  <span className="text-emerald-600 font-bold">✓ 已即時上線</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 浮動多選批量操作列 */}
      {selectedTargetIds.length > 0 && (
        <div className="sticky top-20 z-30 bg-slate-900 text-white p-4 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-3 border border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-rose-500 text-white text-xs font-black flex items-center justify-center">
              {selectedTargetIds.length}
            </span>
            <span className="text-xs font-bold text-slate-200">
              已勾選 {selectedTargetIds.length} 個站點
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleBatchToggleEnabled(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold cursor-pointer transition-all active:scale-95 text-white"
            >
              批量啟用
            </button>
            <button
              type="button"
              onClick={() => handleBatchToggleEnabled(false)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold cursor-pointer transition-all active:scale-95 text-slate-300"
            >
              批量暫停
            </button>
            <button
              type="button"
              onClick={() => setIsBatchScheduleModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold cursor-pointer transition-all active:scale-95 flex items-center gap-1 text-white"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>批量設定排程</span>
            </button>
            <button
              type="button"
              disabled={isRunning}
              onClick={() => handleTriggerCrawl(selectedTargetIds)}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold cursor-pointer transition-all active:scale-95 flex items-center gap-1 text-white"
            >
              <Play className="w-3.5 h-3.5" />
              <span>批量立即抓取</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedTargetIds([])}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              title="取消全選"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 左側：爬蟲目標清單管理 (8 欄) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleToggleSelectAll}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer select-none"
              >
                {selectedTargetIds.length === targets.length ? (
                  <CheckSquare className="w-4 h-4 text-rose-600" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400" />
                )}
                <span>全選 ({targets.length})</span>
              </button>
              <h3 className="text-base font-black text-slate-900">爬蟲站點清單</h3>
            </div>
            <span className="text-xs font-bold text-slate-500">
              已啟用 {targets.filter((t) => t.enabled).length} / {targets.length} 個站點
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {targets.map((target) => {
              const isSelected = selectedTargetIds.includes(target.id);
              return (
                <div 
                  key={target.id} 
                  className={`p-4 sm:p-5 flex items-center justify-between gap-4 transition-colors ${
                    isSelected ? 'bg-rose-50/40' : 'hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* 勾選框 */}
                    <button
                      type="button"
                      onClick={() => handleToggleSelectOne(target.id)}
                      className="text-slate-400 hover:text-slate-700 cursor-pointer flex-shrink-0"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-rose-600" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-300" />
                      )}
                    </button>

                    {target.logo ? (
                      <div className="w-11 h-11 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/80 p-1 flex-shrink-0 flex items-center justify-center relative">
                        <Image
                          src={target.logo}
                          alt={target.name}
                          width={36}
                          height={36}
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0">
                        <Store className="w-5 h-5" />
                      </div>
                    )}

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-xs sm:text-sm truncate">
                          {target.name}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          target.enabled ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {target.enabled ? '🟢 監控中' : '⚪ 已暫停'}
                        </span>
                        {target.isCustom && (
                          <span className="px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 text-[9px] font-bold border border-indigo-200">
                            自訂站點
                          </span>
                        )}
                      </div>

                      {/* 排程模式標記 */}
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                        <span className="text-slate-700 font-semibold">
                          {target.scheduleMode === 'inherit' && '🌐 跟隨全域黃金波段'}
                          {target.scheduleMode === 'custom' && `⏱️ 自訂時段: ${(target.customScheduleTimes || []).join(', ') || '尚未設定'}`}
                          {target.scheduleMode === 'interval' && `⏳ 每 ${target.customIntervalMinutes} 分鐘`}
                        </span>
                        <span>·</span>
                        <span className="truncate max-w-[200px] text-slate-400">{target.url}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* 單站編輯排程按鈕 */}
                    <button
                      type="button"
                      onClick={() => setEditingTarget(target)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                      title="單獨編輯排程與規則"
                    >
                      <Settings2 className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="hidden sm:inline">排程</span>
                    </button>

                    {/* 單站即時抓取按鈕 */}
                    <button
                      type="button"
                      disabled={isRunning || !target.enabled}
                      onClick={() => handleTriggerCrawl(target.id)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1"
                      title="立即手動抓取此站點"
                    >
                      {isRunning && runningTargetId === target.id ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-rose-600" />
                      ) : (
                        <Play className="w-3.5 h-3.5 text-slate-600" />
                      )}
                      <span className="hidden sm:inline">抓取</span>
                    </button>

                    {/* 啟用開關 Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleTarget(target.id, target.enabled)}
                      className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer flex items-center ${
                        target.enabled ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full bg-white shadow-md" />
                    </button>

                    {/* 刪除按鈕 (僅自訂站點) */}
                    {target.isCustom && (
                      <button
                        type="button"
                        onClick={() => handleDeleteTarget(target.id, target.name)}
                        className="p-1.5 rounded-xl hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
                        title="刪除此站點"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 右側：全域排程設定與即時日誌 (4 欄) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-700" />
            <h3 className="text-base font-black text-slate-900">全域排程時段設定</h3>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            <form onSubmit={handleSaveGlobalSchedule} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 font-bold mb-1">4 大黃金波段 (逗號分隔)</label>
                <input
                  type="text"
                  value={schedule.goldenWindows.join(', ')}
                  onChange={(e) => setSchedule({
                    ...schedule,
                    goldenWindows: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                  })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none"
                  placeholder="08:30, 12:00, 18:00, 21:30"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">週四超商週末大促衝刺時段</label>
                <input
                  type="text"
                  value={schedule.thursdayRushHours.join(', ')}
                  onChange={(e) => setSchedule({
                    ...schedule,
                    thursdayRushHours: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                  })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none"
                  placeholder="17:00, 18:00, 19:00"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">深夜靜默開始</label>
                  <input
                    type="text"
                    value={schedule.nightQuietStart}
                    onChange={(e) => setSchedule({ ...schedule, nightQuietStart: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">深夜靜默結束</label>
                  <input
                    type="text"
                    value={schedule.nightQuietEnd}
                    onChange={(e) => setSchedule({ ...schedule, nightQuietEnd: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer mt-2"
              >
                儲存全域排程設定
              </button>
            </form>
          </div>

          {/* 即時日誌 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-slate-600" />
              <h4 className="text-xs font-black text-slate-900">爬蟲執行即時日誌</h4>
            </div>

            <div className="bg-slate-950 rounded-2xl p-4 text-[11px] font-mono text-emerald-400 max-h-56 overflow-y-auto space-y-2 border border-slate-800 shadow-inner">
              {logs.map((log) => (
                <div key={log.id} className="leading-tight border-b border-slate-900 pb-1.5">
                  <span className="text-slate-500">[{log.timestamp}] </span>
                  <span className="text-cyan-300 font-bold">[{log.type.toUpperCase()}] </span>
                  <span className={log.status === 'success' ? 'text-emerald-300' : 'text-rose-400'}>
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 彈窗 1：新增爬蟲目標網站 Modal */}
      {isAddTargetModalOpen && (
        <div className="fixed inset-0 !m-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-base font-black flex items-center gap-2 text-slate-900">
                <Plus className="w-5 h-5 text-rose-600" />
                <span>新增爬蟲目標網站</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddTargetModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTargetSubmit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 mb-1">通路 / 品牌網站名稱</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="例如：壽司郎 Sushiro 官方優惠"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">網站 / 粉絲專頁 URL</label>
                <input
                  type="url"
                  name="url"
                  required
                  placeholder="https://www.facebook.com/... 或 https://..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">預設商品分類</label>
                  <select
                    name="defaultCategory"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  >
                    <option value="food">美食餐飲 (food)</option>
                    <option value="grocery">超商生活 (grocery)</option>
                    <option value="tech">3C 科技 (tech)</option>
                    <option value="fashion">服飾穿搭 (fashion)</option>
                    <option value="entertainment">休閒娛樂</option>
                    <option value="travel">旅遊住宿</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">排程模式</label>
                  <select
                    name="scheduleMode"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  >
                    <option value="inherit">跟隨全域黃金波段</option>
                    <option value="custom">自訂特定執行時段</option>
                    <option value="interval">固定間隔時間</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">自訂執行時段 (選用，逗號分隔)</label>
                <input
                  type="text"
                  name="customScheduleTimes"
                  placeholder="例如: 09:00, 14:00, 20:00"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Logo 圖檔網址 (選用)</label>
                <input
                  type="url"
                  name="logo"
                  placeholder="https://... logo.png"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddTargetModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-sm"
                >
                  確認新增站點
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 彈窗 2：單站編輯排程 Modal */}
      {editingTarget && (
        <div className="fixed inset-0 !m-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-base font-black flex items-center gap-2 text-slate-900">
                <Settings2 className="w-5 h-5 text-indigo-600" />
                <span>編輯【{editingTarget.name}】獨立排程與設定</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingTarget(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditingTarget} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 mb-1">排程模式</label>
                <select
                  value={editingTarget.scheduleMode}
                  onChange={(e) => setEditingTarget({ ...editingTarget, scheduleMode: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                >
                  <option value="inherit">跟隨全域黃金波段 (08:30, 12:00, 18:00, 21:30)</option>
                  <option value="custom">自訂特定時段 (Custom Times)</option>
                  <option value="interval">固定間隔分鐘 (Interval)</option>
                </select>
              </div>

              {editingTarget.scheduleMode === 'custom' && (
                <div>
                  <label className="block text-slate-700 mb-1">自訂時段 (逗號分隔)</label>
                  <input
                    type="text"
                    value={(editingTarget.customScheduleTimes || []).join(', ')}
                    onChange={(e) => setEditingTarget({
                      ...editingTarget,
                      customScheduleTimes: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                    })}
                    placeholder="09:00, 15:30, 21:00"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
              )}

              {editingTarget.scheduleMode === 'interval' && (
                <div>
                  <label className="block text-slate-700 mb-1">間隔分鐘數 (分鐘)</label>
                  <input
                    type="number"
                    min={5}
                    max={1440}
                    value={editingTarget.customIntervalMinutes || 60}
                    onChange={(e) => setEditingTarget({
                      ...editingTarget,
                      customIntervalMinutes: Number(e.target.value)
                    })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-700 mb-1">爬取規則備註</label>
                <input
                  type="text"
                  value={editingTarget.crawlRule || ''}
                  onChange={(e) => setEditingTarget({ ...editingTarget, crawlRule: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingTarget(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-sm"
                >
                  儲存排程設定
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 彈窗 3：多選批量編輯排程 Modal */}
      {isBatchScheduleModalOpen && (
        <div className="fixed inset-0 !m-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-base font-black flex items-center gap-2 text-slate-900">
                <Clock className="w-5 h-5 text-indigo-600" />
                <span>批量設定 {selectedTargetIds.length} 個站點的排程</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsBatchScheduleModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBatchScheduleSubmit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 mb-1">排程模式</label>
                <select
                  value={batchScheduleMode}
                  onChange={(e) => setBatchScheduleMode(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                >
                  <option value="inherit">跟隨全域黃金波段 (08:30, 12:00, 18:00, 21:30)</option>
                  <option value="custom">自訂特定時段 (Custom Times)</option>
                  <option value="interval">固定間隔分鐘 (Interval)</option>
                </select>
              </div>

              {batchScheduleMode === 'custom' && (
                <div>
                  <label className="block text-slate-700 mb-1">統一自訂時段 (逗號分隔)</label>
                  <input
                    type="text"
                    value={batchCustomTimes}
                    onChange={(e) => setBatchCustomTimes(e.target.value)}
                    placeholder="09:00, 15:00, 20:00"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    required
                  />
                </div>
              )}

              {batchScheduleMode === 'interval' && (
                <div>
                  <label className="block text-slate-700 mb-1">統一間隔分鐘數</label>
                  <input
                    type="number"
                    min={5}
                    max={1440}
                    value={batchIntervalMinutes}
                    onChange={(e) => setBatchIntervalMinutes(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    required
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBatchScheduleModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-sm"
                >
                  套用至所選 {selectedTargetIds.length} 個站點
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 彈窗 4：爬蟲完成成果與新建立卡片報告 Modal */}
      <CrawlerResultModal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        result={crawlerExecutionResult}
        onViewDealsTab={onViewDealsTab}
        onDealsChange={onRefresh}
      />
    </div>
  );
};

