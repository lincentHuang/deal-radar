import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { parseDealEndTimestamp, parseDealStartTimestamp } from '@/features/deals/utils/date-utils';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    maximumFractionDigits: 0,
  }).format(price);
}

export function calculateDiscount(originalPrice?: number, discountPrice?: number): {
  saved: number;
  percentage: number;
  discountString: string;
} {
  if (!originalPrice || !discountPrice || originalPrice <= discountPrice) {
    return { saved: 0, percentage: 0, discountString: '' };
  }
  const saved = originalPrice - discountPrice;
  const percentage = Math.round((1 - discountPrice / originalPrice) * 100);
  const fold = (discountPrice / originalPrice * 10).toFixed(1).replace('.0', '');
  return {
    saved,
    percentage,
    discountString: `${fold} 折`,
  };
}

export function formatRemainingTime(
  endDateString: string,
  startDateString?: string
): {
  text: string;
  isUrgent: boolean;
  isExpired: boolean;
  isUpcoming: boolean;
} {
  const nowTime = Date.now();

  // 若提供開始日期且尚未開跑
  if (startDateString) {
    const start = parseDealStartTimestamp(startDateString);
    if (start !== null && start > nowTime) {
      const sDate = new Date(start);
      const startMonth = sDate.getMonth() + 1;
      const startDay = sDate.getDate();
      return {
        text: `即將開跑 (${startMonth}/${startDay} 起)`,
        isUrgent: false,
        isExpired: false,
        isUpcoming: true,
      };
    }
  }

  const end = parseDealEndTimestamp(endDateString);

  if (end === null) {
    return { text: '長期優惠', isUrgent: false, isExpired: false, isUpcoming: false };
  }

  const diff = end - nowTime;

  if (diff <= 0) {
    return { text: '已結束', isUrgent: false, isExpired: true, isUpcoming: false };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  if (days > 0) {
    return {
      text: `剩 ${days} 天 ${remainingHours > 0 ? `${remainingHours} 時` : ''}`.trim(),
      isUrgent: days <= 3, // 3 天內視為即將到期
      isExpired: false,
      isUpcoming: false,
    };
  }

  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) {
    return {
      text: `剩 ${hours} 小時 ${minutes} 分`,
      isUrgent: true,
      isExpired: false,
      isUpcoming: false,
    };
  }

  return {
    text: `最後 ${minutes} 分鐘`,
    isUrgent: true,
    isExpired: false,
    isUpcoming: false,
  };
}
