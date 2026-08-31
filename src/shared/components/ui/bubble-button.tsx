'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';
import { useMobileNative } from '@/shared/hooks/use-mobile-native';

export type BubbleButtonVariant = 'primary' | 'secondary' | 'mint' | 'outline' | 'ghost';

interface BubbleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BubbleButtonVariant;
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const BubbleButton = React.forwardRef<HTMLButtonElement, BubbleButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    leftIcon, 
    rightIcon, 
    disabled, 
    className, 
    onClick,
    ...props 
  }, ref) => {
    const { triggerHaptic } = useMobileNative();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || isLoading) return;
      triggerHaptic('light');
      onClick?.(e);
    };

    const variantStyles: Record<BubbleButtonVariant, string> = {
      primary: 'bg-rose-500 hover:bg-rose-600 text-white shadow-sm hover:shadow-md border border-rose-400/30',
      secondary: 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:shadow-md border border-slate-700/30',
      mint: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm hover:shadow-md border border-emerald-400/30',
      outline: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 shadow-sm',
      ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900',
    };

    const sizeStyles = {
      sm: 'text-xs px-3 py-1.5 rounded-full gap-1.5',
      md: 'text-sm px-4 py-2.5 rounded-full gap-2 font-medium',
      lg: 'text-base px-6 py-3 rounded-full gap-2.5 font-semibold',
      icon: 'p-2.5 rounded-full aspect-square',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        onClick={handleClick}
        className={cn(
          'inline-flex items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 select-none',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

BubbleButton.displayName = 'BubbleButton';
