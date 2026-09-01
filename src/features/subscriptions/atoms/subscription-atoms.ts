import { atom } from 'jotai';
import { DealFilterState, SmartDeal } from '@/features/deals/types/deal.types';

// 初始篩選狀態
export const initialFilterState: DealFilterState = {
  searchQuery: '',
  selectedCity: '全部地區',
  selectedDistrict: null,
  selectedRegions: [],
  channelType: 'all',
  category: 'all',
  selectedCard: null,
  selectedTag: null,
  sortBy: 'latest',
};

// 全域篩選原子
export const dealFiltersAtom = atom<DealFilterState>(initialFilterState);

// 使用者訂閱標籤池（支援 LocalStorage 初始預設）
export const subscribedTagsAtom = atom<string[]>([
  '#咖啡',
  '#買一送一',
  '#國泰CUBE',
]);

// 使用者已收藏的情報 ID
export const bookmarkedDealIdsAtom = atom<string[]>([]);

// 目前正在查看詳情的情報物件 (供 Modal 使用)
export const activeDealDetailAtom = atom<SmartDeal | null>(null);

// 全域彈窗開關原子
export const isSearchModalOpenAtom = atom<boolean>(false);
export const isFilterModalOpenAtom = atom<boolean>(false);
export const isAccountSheetOpenAtom = atom<boolean>(false);

// 站內模擬推播 Toast 通知隊列
export interface DealNotification {
  id: string;
  title: string;
  message: string;
  tag: string;
  dealId: string;
  timestamp: string;
}

export const dealNotificationsAtom = atom<DealNotification[]>([]);

