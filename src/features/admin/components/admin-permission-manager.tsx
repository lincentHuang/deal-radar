'use client';

import React, { useState, useTransition, useMemo } from 'react';
import { 
  AdminUserItem, 
  AdminUserStats, 
  RolePermissionMatrixItem 
} from '../types/admin-permission.types';
import { UserRole } from '@/features/auth/types/auth.types';
import { 
  updateUserRoleAction, 
  getRolePermissionMatrix 
} from '../server/admin-permission.actions';
import { 
  Users, 
  ShieldCheck, 
  Store, 
  User as UserIcon, 
  Search, 
  Filter, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  HelpCircle, 
  ArrowUpDown, 
  Sparkles,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useMobileNative } from '@/shared/hooks/use-mobile-native';
import Image from 'next/image';

interface AdminPermissionManagerProps {
  initialUsers: AdminUserItem[];
  initialStats: AdminUserStats;
  permissionMatrix: RolePermissionMatrixItem[];
}

export const AdminPermissionManager: React.FC<AdminPermissionManagerProps> = ({
  initialUsers,
  initialStats,
  permissionMatrix,
}) => {
  const { triggerHaptic } = useMobileNative();
  const [isPending, startTransition] = useTransition();

  const [users, setUsers] = useState<AdminUserItem[]>(initialUsers);
  const [stats, setStats] = useState<AdminUserStats>(initialStats);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<UserRole | 'ALL'>('ALL');

  // 權限變更確認 Modal 狀態
  const [pendingChange, setPendingChange] = useState<{
    user: AdminUserItem;
    targetRole: UserRole;
  } | null>(null);

  // 權限矩陣 Modal 開關
  const [showMatrixModal, setShowMatrixModal] = useState<boolean>(false);

  // 操作反饋訊息
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // 依搜尋與角色過濾
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchRole = selectedRoleFilter === 'ALL' || u.role === selectedRoleFilter;
      const query = searchQuery.toLowerCase().trim();
      const matchQuery = !query || 
        u.name.toLowerCase().includes(query) || 
        u.email.toLowerCase().includes(query);
      return matchRole && matchQuery;
    });
  }, [users, selectedRoleFilter, searchQuery]);

  // 開啟角色變更防呆確認
  const handleInitiateRoleChange = (user: AdminUserItem, targetRole: UserRole) => {
    if (user.role === targetRole) return;
    triggerHaptic('medium');
    setPendingChange({ user, targetRole });
  };

  // 確認執行角色變更
  const handleConfirmRoleChange = () => {
    if (!pendingChange) return;
    const { user, targetRole } = pendingChange;

    startTransition(async () => {
      triggerHaptic('light');
      const res = await updateUserRoleAction({
        userId: user.id,
        role: targetRole,
        userName: user.name,
      });

      if (res.success) {
        triggerHaptic('success');
        setFeedback({ type: 'success', message: res.message });

        // Optimistic UI 更新
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, role: targetRole } : u))
        );

        // 更新統計數
        setStats((prev) => {
          const oldRole = user.role;
          const next = { ...prev };
          if (oldRole === 'ADMIN') next.adminCount = Math.max(0, next.adminCount - 1);
          if (oldRole === 'MERCHANT') next.merchantCount = Math.max(0, next.merchantCount - 1);
          if (oldRole === 'USER') next.userCount = Math.max(0, next.userCount - 1);

          if (targetRole === 'ADMIN') next.adminCount += 1;
          if (targetRole === 'MERCHANT') next.merchantCount += 1;
          if (targetRole === 'USER') next.userCount += 1;
          return next;
        });
      } else {
        triggerHaptic('warning');
        setFeedback({ type: 'error', message: res.message });
      }

      setPendingChange(null);
      setTimeout(() => setFeedback(null), 4000);
    });
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-rose-50 text-rose-700 border border-rose-200">
            <ShieldCheck className="w-3 h-3 text-rose-500" />
            <span>最高管理員</span>
          </span>
        );
      case 'MERCHANT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-700 border border-amber-200">
            <Store className="w-3 h-3 text-amber-500" />
            <span>特約品牌商家</span>
          </span>
        );
      case 'USER':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200/80">
            <UserIcon className="w-3 h-3 text-slate-400" />
            <span>一般會員</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 標題與權限矩陣按鈕 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              管理權限編輯與成員名冊
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
              ROLE & PERMISSIONS
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            指派與調度平台成員角色權限（一般會員、特約商家、最高管理員），即時套用系統存取範圍。
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            setShowMatrixModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200/80 shadow-xs transition-all active:scale-95 cursor-pointer flex-shrink-0 self-start sm:self-auto"
        >
          <HelpCircle className="w-4 h-4 text-indigo-500" />
          <span>檢視權限階層說明矩陣</span>
        </button>
      </div>

      {/* 統計概況泡泡卡片 (簡約白底風格) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold">全站總用戶數</span>
            <Users className="w-4 h-4 text-slate-500" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">{stats.totalUsers} 人</h3>
          <span className="text-[10px] text-slate-400">含 Google 與 Email 註冊</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold">最高管理員 (ADMIN)</span>
            <ShieldCheck className="w-4 h-4 text-rose-500" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-rose-600">{stats.adminCount} 人</h3>
          <span className="text-[10px] text-rose-500/80 font-medium">擁有爬蟲與全域資料庫讀寫</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold">特約品牌商家 (MERCHANT)</span>
            <Store className="w-4 h-4 text-amber-500" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-amber-600">{stats.merchantCount} 家</h3>
          <span className="text-[10px] text-amber-600/80 font-medium">可建立廣告與品牌特惠</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold">一般註冊會員 (USER)</span>
            <UserIcon className="w-4 h-4 text-emerald-500" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-emerald-600">{stats.userCount} 人</h3>
          <span className="text-[10px] text-emerald-600/80 font-medium">特價情報追蹤與收藏體驗</span>
        </div>
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

      {/* 搜尋與角色篩選工具列 */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* 搜尋框 */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜尋成員姓名或 Email 帳號..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-900 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 角色分頁過濾按鈕 */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(
            [
              { key: 'ALL', label: '全部成員' },
              { key: 'ADMIN', label: '最高管理員' },
              { key: 'MERCHANT', label: '特約商家' },
              { key: 'USER', label: '一般會員' },
            ] as const
          ).map((filter) => {
            const isActive = selectedRoleFilter === filter.key;
            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setSelectedRoleFilter(filter.key);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 使用者清單表格視圖 */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredUsers.length === 0 ? (
          // Empty 狀態
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-700">查無符合條件之成員</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              未找到符合「{searchQuery}」或該角色篩選的使用者。請確認輸入關鍵字或清除篩選。
            </p>
            {(searchQuery || selectedRoleFilter !== 'ALL') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedRoleFilter('ALL');
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
              >
                重置所有搜尋條件
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-slate-400 font-extrabold border-b border-slate-100 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">成員資料</th>
                  <th className="py-3.5 px-4">帳號來源</th>
                  <th className="py-3.5 px-4">活躍指標</th>
                  <th className="py-3.5 px-4">目前身分</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">角色權限指派</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => {
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* 使用者資訊 */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-slate-600 overflow-hidden flex-shrink-0">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span>{user.name.slice(0, 1).toUpperCase()}</span>
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-slate-900 truncate">
                              {user.name}
                            </span>
                            <span className="text-[11px] text-slate-400 truncate">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 註冊來源 */}
                      <td className="py-4 px-4">
                        {user.provider === 'google' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                            Google
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                            Email
                          </span>
                        )}
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {new Date(user.createdAt).toLocaleDateString('zh-TW')}
                        </div>
                      </td>

                      {/* 活躍指標 */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="font-medium text-slate-600">
                            {user.bookmarksCount} 收藏
                          </span>
                          <span className="text-slate-300">·</span>
                          <span className="font-medium text-slate-600">
                            {user.tagsCount} 標籤
                          </span>
                        </div>
                      </td>

                      {/* 目前角色 */}
                      <td className="py-4 px-4">
                        {getRoleBadge(user.role)}
                      </td>

                      {/* 角色權限指派下拉選單 */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="inline-flex items-center gap-1">
                          <select
                            value={user.role}
                            disabled={isPending}
                            onChange={(e) =>
                              handleInitiateRoleChange(user, e.target.value as UserRole)
                            }
                            className="text-xs font-bold px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all cursor-pointer disabled:opacity-50"
                          >
                            <option value="USER">一般會員 (USER)</option>
                            <option value="MERCHANT">特約商家 (MERCHANT)</option>
                            <option value="ADMIN">最高管理員 (ADMIN)</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 角色變更防呆確認對話框 (Confirmation Modal) */}
      {pendingChange && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black text-center text-slate-900 mb-1">
              確認權限變更？
            </h3>
            <p className="text-xs text-center text-slate-500 mb-6">
              您即將調整成員【{pendingChange.user.name}】（{pendingChange.user.email}）之系統角色：
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 mb-6 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400">目前身分：</span>
                {getRoleBadge(pendingChange.user.role)}
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400">變更為：</span>
                {getRoleBadge(pendingChange.targetRole)}
              </div>

              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200/60 leading-relaxed">
                {pendingChange.targetRole === 'ADMIN' && (
                  <span className="text-rose-600 font-semibold">
                    ⚠️ 注意：升級為最高管理員後，該帳號將擁有全站特價卡片批次修改、排程爬蟲觸發與資料庫完整讀寫權限！
                  </span>
                )}
                {pendingChange.targetRole === 'MERCHANT' && (
                  <span>
                    💡 提示：成為特約商家後，可登入商家中心投放全網廣告與發布專屬品牌特惠活動。
                  </span>
                )}
                {pendingChange.targetRole === 'USER' && (
                  <span>
                    ℹ️ 說明：調整為一般會員將撤銷其後台與商家投放權限。
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPendingChange(null)}
                disabled={isPending}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-2xl transition-all cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmRoleChange}
                disabled={isPending}
                className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-2xl shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isPending ? '處理中...' : '確認變更權限'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 權限階層說明矩陣 Modal (Permission Matrix Modal) */}
      {showMatrixModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    系統角色權限矩陣對照表
                  </h3>
                  <span className="text-[10px] text-slate-400">
                    定義一般會員、特約商家與最高管理員之權責範圍
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowMatrixModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-400 font-extrabold uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">功能模組</th>
                      <th className="py-2.5 px-3">操作權限</th>
                      <th className="py-2.5 px-2 text-center">一般會員</th>
                      <th className="py-2.5 px-2 text-center">特約商家</th>
                      <th className="py-2.5 px-2 text-center">最高管理員</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {permissionMatrix.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-3 px-3 font-bold text-slate-800">
                          {item.module}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-700">{item.action}</div>
                          <div className="text-[10px] text-slate-400">{item.description}</div>
                        </td>
                        <td className="py-3 px-2 text-center">
                          {item.user ? (
                            <span className="text-emerald-500 font-bold">✓</span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {item.merchant ? (
                            <span className="text-amber-500 font-bold">✓</span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {item.admin ? (
                            <span className="text-rose-500 font-bold">✓</span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowMatrixModal(false)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                我了解了
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
