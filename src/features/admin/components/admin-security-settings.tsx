'use client';

import React, { useState, useTransition } from 'react';
import { AdminSecurityConfig } from '../types/admin-permission.types';
import { 
  changeAdminPinAction, 
  toggleQuickDemoUnlockAction 
} from '../server/admin-permission.actions';
import { 
  ShieldCheck, 
  KeyRound, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Database, 
  Server, 
  Clock, 
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import { useMobileNative } from '@/shared/hooks/use-mobile-native';

interface AdminSecuritySettingsProps {
  initialConfig: AdminSecurityConfig;
}

export const AdminSecuritySettings: React.FC<AdminSecuritySettingsProps> = ({
  initialConfig,
}) => {
  const { triggerHaptic } = useMobileNative();
  const [isPending, startTransition] = useTransition();

  const [config, setConfig] = useState<AdminSecurityConfig>(initialConfig);

  // PIN 碼修改表單狀態
  const [currentPin, setCurrentPin] = useState<string>('');
  const [newPin, setNewPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');

  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // 處理變更 PIN 碼
  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPin || !newPin || !confirmPin) {
      setFeedback({ type: 'error', message: '請填寫所有 PIN 碼欄位' });
      triggerHaptic('warning');
      return;
    }

    if (newPin.length < 4 || newPin.length > 8) {
      setFeedback({ type: 'error', message: '新 PIN 碼長度必須介於 4 至 8 位數字之間' });
      triggerHaptic('warning');
      return;
    }

    if (newPin !== confirmPin) {
      setFeedback({ type: 'error', message: '兩次輸入的新 PIN 碼不一致，請再次確認' });
      triggerHaptic('warning');
      return;
    }

    startTransition(async () => {
      triggerHaptic('light');
      const res = await changeAdminPinAction({
        currentPin,
        newPin,
        confirmPin,
      });

      if (res.success) {
        triggerHaptic('success');
        setFeedback({ type: 'success', message: res.message });
        setCurrentPin('');
        setNewPin('');
        setConfirmPin('');
        setConfig((prev) => ({ ...prev, hasCustomPin: true }));
      } else {
        triggerHaptic('warning');
        setFeedback({ type: 'error', message: res.message });
      }
    });
  };

  // 處理切換演示模式
  const handleToggleDemo = () => {
    const nextState = !config.quickDemoUnlockEnabled;
    startTransition(async () => {
      triggerHaptic('medium');
      const res = await toggleQuickDemoUnlockAction(nextState);
      if (res.success) {
        triggerHaptic('success');
        setConfig((prev) => ({ ...prev, quickDemoUnlockEnabled: nextState }));
        setFeedback({ type: 'success', message: res.message });
      } else {
        triggerHaptic('warning');
        setFeedback({ type: 'error', message: res.message });
      }
      setTimeout(() => setFeedback(null), 4000);
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* 標題 */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            系統安全與管理設定
          </h1>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200">
            SECURITY & PREFERENCES
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          管理最高中控台的安全 PIN 碼、演示模式解鎖開關以及核心資料庫防禦層級。
        </p>
      </div>

      {/* 操作反饋 Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2.5 transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* 區塊 1: 安全 PIN 碼變更卡片 */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200 flex-shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                最高管理安全 PIN 碼變更
              </h3>
              <p className="text-xs text-slate-400">
                進入中控台時的安全金鑰。{config.hasCustomPin ? '（目前已設定自訂專屬 PIN 碼）' : '（目前使用系統環境預設 PIN 碼 8888）'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleChangePin} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              目前 PIN 碼
            </label>
            <input
              type="password"
              maxLength={8}
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value)}
              placeholder="請輸入原本的管理 PIN 碼"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                新 PIN 碼 (4-8 位)
              </label>
              <input
                type="password"
                maxLength={8}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="輸入新 PIN"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                再次確認新 PIN 碼
              </label>
              <input
                type="password"
                maxLength={8}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                placeholder="再次輸入新 PIN"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-2xl shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-2"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isPending ? '儲存更新中...' : '確認變更管理 PIN 碼'}</span>
          </button>
        </form>
      </div>

      {/* 區塊 2: 快速展示模式設定 */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900">
                  一鍵展示演示模式 (Demo Unlock)
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                  config.quickDemoUnlockEnabled
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  {config.quickDemoUnlockEnabled ? '已啟用' : '已關閉'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                啟用時，登入畫面將提供「快速展示驗證 (預設 8888)」一鍵解鎖功能。
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isPending}
            onClick={handleToggleDemo}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border cursor-pointer active:scale-95 disabled:opacity-50 ${
              config.quickDemoUnlockEnabled
                ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                : 'bg-slate-900 text-white border-transparent hover:bg-slate-800'
            }`}
          >
            {config.quickDemoUnlockEnabled ? '關閉快速演示（提升安全）' : '開啟快速演示'}
          </button>
        </div>

        {config.quickDemoUnlockEnabled && (
          <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl text-[11px] text-amber-800 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">安全提醒：</span>
              展示模式適合本機開發或展示簡報。若部署至公開正式生產環境，建議關閉此選項以確保僅持有專屬 PIN 碼之人員可進入後台。
            </div>
          </div>
        )}
      </div>

      {/* 區塊 3: 系統環境狀態指標 */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-base font-black text-slate-900">
          系統核心環境與防護狀態
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold">持久化資料庫</span>
              <Database className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Neon PostgreSQL 連線中</span>
            </div>
            <span className="text-[10px] text-slate-400">Prisma ORM Client 6.x</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold">爬蟲常駐 Daemon</span>
              <Server className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Instrumentation 監控中</span>
            </div>
            <span className="text-[10px] text-slate-400">Asia/Taipei 排程時間軸</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold">管理 Session 逾時</span>
              <Clock className="w-4 h-4 text-slate-500" />
            </div>
            <div className="text-sm font-black text-slate-900">
              瀏覽器關閉即鎖定
            </div>
            <span className="text-[10px] text-slate-400">SessionStorage 獨立沙盒</span>
          </div>
        </div>
      </div>
    </div>
  );
};
