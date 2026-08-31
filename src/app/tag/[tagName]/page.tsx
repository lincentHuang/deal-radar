import React from 'react';
import { getDeals } from '@/features/deals/server/deals-dal';
import { DealMasonryFeed } from '@/features/deals/components/deal-masonry-feed';
import { DealDetailModal } from '@/features/deals/components/deal-detail-modal';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface TagPageProps {
  params: Promise<{
    tagName: string;
  }>;
}

export default async function TagPage({ params }: TagPageProps) {
  const resolvedParams = await params;
  const rawTag = decodeURIComponent(resolvedParams.tagName);
  const cleanTag = rawTag.startsWith('#') ? rawTag : `#${rawTag}`;

  const deals = await getDeals({
    selectedTag: cleanTag,
  });

  return (
    <main className="min-h-screen bg-slate-50/50 pb-16">
      {/* 頂部快捷返回 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-xs transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>返回特價首頁</span>
        </Link>
      </div>

      {/* 核心 Feed 列表 */}
      <DealMasonryFeed initialDeals={deals} />

      {/* 彈窗詳情 */}
      <DealDetailModal />
    </main>
  );
}
