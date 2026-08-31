'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useMobileNative } from '@/shared/hooks/use-mobile-native';
import {
  User,
  LogOut,
  Sparkles,
  Tag,
  Bookmark,
  Store,
  ShieldCheck,
  ChevronDown,
  LogIn,
} from 'lucide-react';

export const UserMenuDropdown: React.FC = () => {
  const { user, isAuthenticated, isLoading, openAuthModal, logout } = useAuth();
  const { triggerHaptic } = useMobileNative();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // 點擊外部自動關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    triggerHaptic('light');
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
  };

  // 1. Loading 狀態骨架
  if (isLoading) {
    return (
      <div className="w-8 h-8 sm:w-24 h-8 rounded-full bg-slate-200/70 animate-pulse" />
    );
  }

  // 2. 未登入狀態：呈現 Pinterest 泡泡風「登入 / 註冊」按鈕
  if (!isAuthenticated || !user) {
    return (
      <button
        type="button"
        onClick={() => openAuthModal('login')}
        className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-xs font-black rounded-full shadow-bubble hover:shadow-md active:scale-95 transition-all cursor-pointer group"
      >
        <LogIn className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        <span>登入 / 註冊</span>
      </button>
    );
  }

  // 3. 已登入狀態：會員頭像與下拉選單
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={handleToggle}
        className="flex items-center gap-2 p-1 sm:pl-1.5 sm:pr-3 py-1 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-full shadow-xs active:scale-95 transition-all cursor-pointer"
      >
        {/* 頭像 */}
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-7 h-7 rounded-full object-cover ring-2 ring-rose-400/30"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-500 to-orange-400 text-white flex items-center justify-center text-xs font-black shadow-xs">
            {user.name.slice(0, 1).toUpperCase()}
          </div>
        )}

        {/* 姓名與 Google / Email 徽章 (電腦版) */}
        <div className="hidden sm:flex flex-col items-start text-left leading-tight">
          <span className="text-xs font-bold text-slate-800 max-w-[90px] truncate">
            {user.name}
          </span>
          <span className="text-[9px] font-semibold text-slate-400 flex items-center gap-1">
            {user.provider === 'google' ? 'Google 會員' : '一般會員'}
          </span>
        </div>

        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {/* 下拉選單主體 */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-3xl p-2 shadow-2xl border border-slate-100 z-50 animate-scaleUp origin-top-right">
          {/* 使用者名片 */}
          <div className="p-3 bg-slate-50/80 rounded-2xl mb-1">
            <p className="text-xs font-black text-slate-900 truncate">{user.name}</p>
            <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
            <div className="mt-1.5 flex items-center gap-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-600">
                {user.role === 'ADMIN' ? '系統管理員' : user.role === 'MERCHANT' ? '官方小編' : '✨ 尊榮會員'}
              </span>
            </div>
          </div>

          {/* 選單連結 */}
          <div className="space-y-0.5 py-1 text-xs font-bold text-slate-700">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                pathname === '/profile'
                  ? 'bg-rose-50 text-rose-600'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <User className="w-4 h-4 text-slate-500" />
              <span>會員個人中心</span>
            </Link>

            <Link
              href="/profile#tags"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-700 transition-all"
            >
              <Tag className="w-4 h-4 text-orange-500" />
              <span>我的追蹤標籤</span>
            </Link>

            <Link
              href="/profile#bookmarks"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-700 transition-all"
            >
              <Bookmark className="w-4 h-4 text-rose-500" />
              <span>已收藏特惠情報</span>
            </Link>

            {(user.role === 'ADMIN' || user.role === 'MERCHANT') && (
              <div className="border-t border-slate-100 my-1 pt-1">
                <Link
                  href="/merchant"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-emerald-50 text-emerald-700 transition-all"
                >
                  <Store className="w-4 h-4 text-emerald-600" />
                  <span>官方小編工作台</span>
                </Link>
                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-900 transition-all"
                  >
                    <ShieldCheck className="w-4 h-4 text-rose-600" />
                    <span>最高管理後台</span>
                  </Link>
                )}
              </div>
            )}

            {/* 登出按鈕 */}
            <div className="border-t border-slate-100 my-1 pt-1">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 transition-all text-left cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>登出會員帳號</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
