'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAtom } from 'jotai';
import * as Dialog from '@radix-ui/react-dialog';
import { isAccountSheetOpenAtom } from '@/features/subscriptions/atoms/subscription-atoms';
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
  X,
  LogIn,
  ChevronRight
} from 'lucide-react';

export const MobileAccountSheet: React.FC = () => {
  const [isOpen, setIsOpen] = useAtom(isAccountSheetOpenAtom);
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const { triggerHaptic } = useMobileNative();
  const pathname = usePathname();

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    triggerHaptic('medium');
    setIsOpen(false);
    await logout();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 animate-fadeIn" />
        <Dialog.Content className="fixed bottom-0 inset-x-0 bg-white rounded-t-3xl p-5 pb-8 shadow-2xl z-50 border-t border-slate-100 animate-slideUp focus:outline-none max-h-[85vh] overflow-y-auto">
          
          {/* 頂部拖拽小指示條 */}
          <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-4" />

          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-rose-500 to-orange-400 text-white flex items-center justify-center shadow-xs">
                <User className="w-4 h-4" />
              </div>
              <Dialog.Title className="text-base font-black text-slate-900">
                會員帳戶中心
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* 未登入狀態 */}
          {!isAuthenticated || !user ? (
            <div className="py-6 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center mb-3 shadow-bubble">
                <Sparkles className="w-7 h-7 animate-pulse" />
              </div>
              <h3 className="text-base font-black text-slate-900">立即登入享受專屬特價追蹤</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mb-5">
                同步追蹤標籤、一鍵收藏最愛折扣與掌握第一手破盤優惠
              </p>
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  openAuthModal('login');
                }}
                className="w-full py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white text-sm font-black rounded-2xl shadow-bubble active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>登入 / 免費註冊會員</span>
              </button>
            </div>
          ) : (
            /* 已登入狀態 */
            <div className="mt-4 space-y-4">
              {/* 使用者名片 */}
              <div className="p-3.5 bg-slate-50/90 rounded-2xl flex items-center gap-3 border border-slate-100">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-rose-400/40"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-500 to-orange-400 text-white flex items-center justify-center text-base font-black shadow-xs">
                    {user.name.slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-black text-slate-900 truncate">{user.name}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 flex-shrink-0">
                      {user.role === 'ADMIN' ? '管理員' : user.role === 'MERCHANT' ? '官方小編' : '尊榮會員'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
                </div>
              </div>

              {/* 功能連結列表 */}
              <div className="space-y-1.5 text-xs font-bold text-slate-700">
                <Link
                  href="/profile"
                  onClick={handleClose}
                  className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                    pathname === '/profile'
                      ? 'bg-rose-50 text-rose-600'
                      : 'bg-slate-50/70 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-slate-500" />
                    <span>會員個人中心</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>

                <Link
                  href="/profile#tags"
                  onClick={handleClose}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 hover:bg-slate-100 text-slate-700 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <Tag className="w-4 h-4 text-orange-500" />
                    <span>我的追蹤標籤</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>

                <Link
                  href="/profile#bookmarks"
                  onClick={handleClose}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 hover:bg-slate-100 text-slate-700 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <Bookmark className="w-4 h-4 text-rose-500" />
                    <span>已收藏特惠情報</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>

                {/* 小編與管理員專屬後台 */}
                {(user.role === 'ADMIN' || user.role === 'MERCHANT') && (
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <Link
                      href="/merchant"
                      onClick={handleClose}
                      className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/80 hover:bg-emerald-100/80 text-emerald-800 transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <Store className="w-4 h-4 text-emerald-600" />
                        <span>官方小編工作台</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-emerald-500" />
                    </Link>

                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        onClick={handleClose}
                        className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 text-rose-400 hover:bg-slate-800 transition-all"
                      >
                        <div className="flex items-center gap-2.5">
                          <ShieldCheck className="w-4 h-4 text-rose-400" />
                          <span className="font-black text-white">最高管理後台</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-rose-400" />
                      </Link>
                    )}
                  </div>
                )}

                {/* 登出按鈕 */}
                <div className="pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold transition-all cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>登出會員帳號</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
