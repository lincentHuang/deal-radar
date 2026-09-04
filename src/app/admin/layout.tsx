import React from 'react';
import { AdminShell } from '@/features/admin/components/admin-shell';

export const metadata = {
  title: '最高管理權限中控台 | 特價情報站 Super Admin',
  description: '全域特價卡片管理、爬蟲排程與站點中控台、廣告全域監控、管理權限編輯與安全設定',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
