'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, KeyRound, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { verifyAdminPinAction } from '../server/admin.actions';
import { useMobileNative } from '@/shared/hooks/use-mobile-native';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

const STORAGE_KEY = 'deal_aggregator_admin_auth_token';

export const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pin, setPin] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { triggerHaptic } = useMobileNative();

  useEffect(() => {
    // 檢查既有認證狀態
    const token = sessionStorage.getItem(STORAGE_KEY);
    if (token === 'super_admin_verified') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin || pin.length < 4) {
      setErrorMessage('請輸入至少 4 碼 PIN');
      triggerHaptic('warning');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await verifyAdminPinAction(pin);
      if (res.success) {
        triggerHaptic('success');
        sessionStorage.setItem(STORAGE_KEY, 'super_admin_verified');
        setIsAuthenticated(true);
      } else {
        triggerHaptic('warning');
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || '驗證失敗');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoUnlock = async () => {
    setPin('8888');
    setIsLoading(true);
    setErrorMessage('');
    const res = await verifyAdminPinAction('8888');
    if (res.success) {
      triggerHaptic('success');
      sessionStorage.setItem(STORAGE_KEY, 'super_admin_verified');
      setIsAuthenticated(true);
    } else {
      triggerHaptic('warning');
      setErrorMessage(res.message || '快速展示模式已被管理員關閉，請輸入真實安全 PIN 碼');
    }
    setIsLoading(false);
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-slate-200/80 relative overflow-hidden">
        {/* 背景裝飾 */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-rose-500/10 rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl -ml-12 -mb-12 pointer-events-none" />

        <div className="relative text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-700 text-rose-400 flex items-center justify-center mx-auto shadow-lg mb-4">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
            最高管理權限驗證
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mb-6">
            此頁面僅限系統最高管理員（Super Admin）存取。請輸入專屬管理安全 PIN 碼以解鎖全域後台。
          </p>

          <form onSubmit={handleVerify} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-rose-500" />
                <span>安全 PIN 碼</span>
              </label>
              <input
                type="password"
                maxLength={8}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="請輸入 4-8 位 PIN (預設 8888)"
                autoFocus
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-center text-lg font-bold tracking-widest text-slate-900 focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-200 focus:outline-none transition-all"
              />
            </div>

            {errorMessage && (
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-2xl shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>驗證中...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>解鎖管理後台</span>
                </>
              )}
            </button>
          </form>

          {/* 開發/展示用一鍵解鎖 */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleQuickDemoUnlock}
              className="w-full py-2.5 px-3 bg-rose-50 hover:bg-rose-100/80 text-rose-700 text-xs font-bold rounded-xl border border-rose-200/80 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>快速展示驗證 (預設 PIN: 8888)</span>
            </button>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 py-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>返回情報站首頁</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
