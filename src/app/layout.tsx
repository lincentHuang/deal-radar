import type { Metadata } from 'next';
import './globals.css';
import { AppLayoutShell } from '@/shared/components/app-layout-shell';
import { DealDetailModal } from '@/features/deals/components/deal-detail-modal';

export const metadata: Metadata = {
  title: '特物情報局 Dealbureau | 全通路特價情報監聽站',
  description: '全台特惠，機密解碼！自選情報頻段與分類標籤，即時鎖定四大超商、連鎖超市、手搖咖啡與速食最新特惠情報。',
  icons: {
    icon: '/icon.png',
    apple: '/apple-touch-icon.png',
  },
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

