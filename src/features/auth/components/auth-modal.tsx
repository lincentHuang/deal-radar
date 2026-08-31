'use client';

import React, { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useMobileNative } from '@/shared/hooks/use-mobile-native';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Sparkles, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    setAuthModalTab,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
  } = useAuth();
  const { triggerHaptic } = useMobileNative();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleTabChange = (tab: 'login' | 'register') => {
    triggerHaptic('light');
    setAuthModalTab(tab);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (authModalTab === 'login') {
        const res = await loginWithEmail({ email, password });
        if (!res.success) {
          setErrorMessage(res.error || '登入失敗，請檢查帳號密碼');
          triggerHaptic('error');
        } else {
          setSuccessMessage(res.message || '登入成功！');
          triggerHaptic('success');
          try {
            confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
          } catch (e) {}
          setTimeout(() => {
            closeAuthModal();
            resetForm();
          }, 800);
        }
      } else {
        const res = await registerWithEmail({
          name,
          email,
          password,
          confirmPassword,
        });
        if (!res.success) {
          setErrorMessage(res.error || '註冊失敗，請稍後再試');
          triggerHaptic('error');
        } else {
          setSuccessMessage(res.message || '註冊成功！');
          triggerHaptic('success');
          try {
            confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
          } catch (e) {}
          setTimeout(() => {
            closeAuthModal();
            resetForm();
          }, 800);
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || '操作發生錯誤，請稍後再試');
      triggerHaptic('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Google SSO 一鍵登入 (支援真實 Google OAuth 2.0 跳轉與開發環境模擬)
  const handleGoogleLogin = async (mockGoogleUser?: { name: string; email: string; avatar: string; googleId: string }) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const hasRealGoogleConfig = Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

    // 若有設定真實 Google Client ID，直接導向真實 Google OAuth 2.0 授權畫面
    if (hasRealGoogleConfig && !mockGoogleUser) {
      triggerHaptic('medium');
      setIsLoading(true);
      const returnTo = typeof window !== 'undefined' ? window.location.pathname : '/';
      window.location.href = `/api/auth/google?returnTo=${encodeURIComponent(returnTo)}`;
      return;
    }

    setIsLoading(true);

    try {
      // 預設 Google 快速登入資料（若尚未配置 Google Client ID 授權，提供高擬真一鍵登入帳號方便即時自測）
      const googleData = mockGoogleUser || {
        googleId: 'google_user_' + Math.floor(100000 + Math.random() * 900000),
        name: '特惠省錢達人 (Google)',
        email: email && email.includes('@') ? email : 'deals.lover@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      };

      const res = await loginWithGoogle(googleData);
      if (res.success) {
        setSuccessMessage(res.message || 'Google 帳號連線成功！');
        triggerHaptic('success');
        try {
          confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
        } catch (e) {}
        setTimeout(() => {
          closeAuthModal();
          resetForm();
        }, 800);
      } else {
        setErrorMessage(res.error || 'Google 登入失敗');
        triggerHaptic('error');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Google 認證發生錯誤');
      triggerHaptic('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      {/* 點擊背景關閉 */}
      <div 
        className="fixed inset-0" 
        onClick={() => {
          if (!isLoading) {
            triggerHaptic('light');
            closeAuthModal();
            resetForm();
          }
        }} 
      />

      {/* 彈窗主體 (Pinterest 泡泡風) */}
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 z-10 animate-scaleUp overflow-hidden">
        {/* 右上角關閉按鈕 */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            closeAuthModal();
            resetForm();
          }}
          disabled={isLoading}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-all active:scale-90 cursor-pointer disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 頂部品牌與標題 */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 via-rose-600 to-orange-400 text-white shadow-md mb-3">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {authModalTab === 'login' ? '歡迎回到特價情報站' : '加入會員，鎖定全台特惠'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {authModalTab === 'login'
              ? '登入以同步個人追蹤標籤、收藏清單與即時降價推播'
              : '免費註冊即可享有專屬特惠情報與買一送一提醒'}
          </p>
        </div>

        {/* 登入 / 註冊 切換 Tab (膠囊風) */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => handleTabChange('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              authModalTab === 'login'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            會員登入
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('register')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              authModalTab === 'register'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            免費註冊
          </button>
        </div>

        {/* 錯誤 / 成功 提示膠囊 */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* 1. Google SSO 一鍵登入按鈕 */}
        <div className="space-y-3 mb-5">
          <button
            type="button"
            onClick={() => handleGoogleLogin()}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm rounded-2xl border border-slate-200 shadow-xs active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer group"
          >
            {/* Google SVG Logo */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>使用 Google 帳號一鍵{authModalTab === 'login' ? '登入' : '註冊'}</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              或使用 Email
            </span>
          </div>
        </div>

        {/* 2. Email 表單 */}
        <form onSubmit={handleEmailSubmit} className="space-y-3.5">
          {authModalTab === 'register' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                會員暱稱
              </label>
              <div className="relative flex items-center">
                <UserIcon className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="例如：省錢小達人"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 focus:bg-white text-xs sm:text-sm text-slate-900 rounded-2xl border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-200/60 focus:outline-none transition-all placeholder:text-slate-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              電子郵件 (Email)
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 focus:bg-white text-xs sm:text-sm text-slate-900 rounded-2xl border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-200/60 focus:outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              密碼
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="至少 6 個字元"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full pl-10 pr-10 py-2 bg-slate-50 focus:bg-white text-xs sm:text-sm text-slate-900 rounded-2xl border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-200/60 focus:outline-none transition-all placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-3 text-slate-400 hover:text-slate-600 p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {authModalTab === 'register' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                再次輸入密碼
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="請再次輸入相同密碼"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 focus:bg-white text-xs sm:text-sm text-slate-900 rounded-2xl border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-200/60 focus:outline-none transition-all placeholder:text-slate-400"
                />
              </div>
            </div>
          )}

          {/* 提交按鈕 */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-rose-500 via-rose-600 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>處理中...</span>
              </>
            ) : (
              <>
                <span>{authModalTab === 'login' ? '立即登入' : '完成註冊'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* 快速切換底部文字 */}
        <div className="mt-5 text-center text-xs text-slate-500">
          {authModalTab === 'login' ? (
            <p>
              還沒有帳號？{' '}
              <button
                type="button"
                onClick={() => handleTabChange('register')}
                className="font-bold text-rose-600 hover:underline cursor-pointer"
              >
                免費註冊會員
              </button>
            </p>
          ) : (
            <p>
              已經有帳號？{' '}
              <button
                type="button"
                onClick={() => handleTabChange('login')}
                className="font-bold text-rose-600 hover:underline cursor-pointer"
              >
                直接登入
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
