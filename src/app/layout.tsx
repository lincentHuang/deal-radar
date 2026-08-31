import type { Metadata } from 'next';
import './globals.css';
import { AppLayoutShell } from '@/shared/components/app-layout-shell';
import { DealDetailModal } from '@/features/deals/components/deal-detail-modal';

export const metadata: Metadata = {
  title: '特價情報站 | 全通路特價情報聚合平台',
  description: '結合線上電商破盤比價與線下實體門市特惠，以 Pinterest 簡約泡泡風呈現一眼看懂的 7 大優惠要素。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <body className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col antialiased" suppressHydrationWarning>
        <AppLayoutShell>
          {children}
        </AppLayoutShell>

        {/* 全域詳情彈窗 */}
        <DealDetailModal />
      </body>
    </html>
  );
}

