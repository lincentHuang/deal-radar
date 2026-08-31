'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';

export type BubbleBadgeVariant = 
  | 'default'
  | 'peach'     // 特價條件
  | 'mint'      // 信用卡/支付
  | 'blue'      // 適用品項/地區
  | 'pink'      // 破盤折扣
  | 'lemon'     // 倒數計時
  | 'purple'    // 標籤
  | 'outline';

interface BubbleBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BubbleBadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  clickable?: boolean;
}

export const BubbleBadge: React.FC<BubbleBadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  icon,
  clickable = false,
  className,
  ...props
}) => {
  const variantStyles: Record<BubbleBadgeVariant, string> = {
    default: 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200/60',
    peach: 'bg-bubble-peach-light text-bubble-peach-dark border-orange-200/70',
    mint: 'bg-bubble-mint-light text-bubble-mint-dark border-emerald-200/70',
    blue: 'bg-bubble-blue-light text-bubble-blue-dark border-blue-200/70',
    pink: 'bg-bubble-pink-light text-bubble-pink-dark border-rose-200/70 font-semibold',
    lemon: 'bg-bubble-lemon-light text-bubble-lemon-dark border-amber-200/70 font-medium',
    purple: 'bg-bubble-purple-light text-bubble-purple-dark border-purple-200/70',
    outline: 'bg-white/80 text-slate-700 border-slate-300 hover:border-slate-400',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5 gap-1',
    md: 'text-xs px-3 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-4 py-1.5 gap-2 font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border transition-all duration-200 select-none',
        variantStyles[variant],
        sizeStyles[size],
        clickable && 'cursor-pointer hover:scale-105 active:scale-95 shadow-sm',
        className
      )}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
