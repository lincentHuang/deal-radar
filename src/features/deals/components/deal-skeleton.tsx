'use client';

import React from 'react';

export const DealSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-1 border border-slate-100 shadow-bubble animate-pulse">
      {/* 大圖 Skeleton (4px 超窄邊框適配) */}
      <div className="w-full aspect-[4/3] bg-slate-200 rounded-xl sm:rounded-2xl mb-1.5 sm:mb-2" />

      {/* 標題 Skeleton */}
      <div className="px-1.5 sm:px-2">
        <div className="h-3.5 sm:h-4 w-4/5 bg-slate-200 rounded-md mb-1 sm:mb-1.5" />
        <div className="h-3.5 sm:h-4 w-3/5 bg-slate-200 rounded-md mb-1.5 sm:mb-2" />
      </div>

      {/* 價格 Skeleton */}
      <div className="flex justify-between items-center px-1.5 sm:px-2 mb-1.5 sm:mb-2">
        <div className="h-5 sm:h-6 w-16 sm:w-24 bg-slate-200 rounded-md" />
        <div className="h-3.5 sm:h-4 w-12 sm:w-16 bg-slate-100 rounded-full" />
      </div>

      {/* Icon 膠囊 Skeleton */}
      <div className="flex gap-1.5 sm:gap-2 px-1.5 sm:px-2 mb-2 sm:mb-2.5">
        <div className="h-4 sm:h-5 w-16 sm:w-24 bg-slate-100 rounded-full" />
        <div className="h-4 sm:h-5 w-14 sm:w-20 bg-slate-100 rounded-full hidden sm:block" />
      </div>

      {/* 底部 Skeleton */}
      <div className="pt-2 sm:pt-2.5 border-t border-slate-100 flex justify-between items-center px-1.5 sm:px-2 pb-0.5">
        <div className="h-3 sm:h-3.5 w-20 sm:w-28 bg-slate-200 rounded-md" />
        <div className="h-3 sm:h-3.5 w-8 sm:w-10 bg-slate-200 rounded-md" />
      </div>
    </div>
  );
};

export const DealMasonrySkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5 w-full items-start">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="w-full">
          <DealSkeleton />
        </div>
      ))}
    </div>
  );
};
