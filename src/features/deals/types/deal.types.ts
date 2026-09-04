export type ChannelType = 'online' | 'offline' | 'all';

export type DealCategory = 
  | 'food'        // 美食飲品 / 咖啡
  | 'tech'        // 3C 數位
  | 'grocery'     // 日用超市 / 買一送一
  | 'fashion'     // 美妝服飾
  | 'entertainment' // 娛樂生活
  | 'travel';     // 旅遊住宿

export type DealAspectRatio = '1:1' | '3:4' | '4:3' | '16:9' | '9:16';

export interface PriceHistoryPoint {
  date: string;
  price: number;
}

export interface SmartDeal {
  id: string;
  title: string;
  subtitle?: string;
  category: DealCategory;
  channelType: 'online' | 'offline';
  merchant: {
    name: string;
    logo?: string;
    storeBranches?: string; // e.g. "全台門市 (部分商場除外)"
  };
  regions: string[]; // e.g. ["全台通用", "台北市 / 信義區", "台中市 / 西區"]
  
  // 價格要素
  originalPrice?: number;
  discountPrice?: number;
  priceUnit?: string; // e.g. "元 / 杯", "元 / 盒"
  
  // 7大要素之特惠條件與品項
  targetItems: string[]; // e.g. ["特大杯風味那堤", "特大杯美式"]
  conditions: string[];  // e.g. ["11:00-20:00 購買", "每人每次最多買二送二", "需自備環保杯再折5元"]
  eligibleCards: string[]; // e.g. ["國泰 CUBE 3%", "玉山 U Bear 5%", "LINE Pay 滿 $150 折 $20"]
  
  // 標籤體系
  tags: string[]; // e.g. ["#咖啡", "#星巴克", "#買一送一", "#國泰CUBE", "#台北信義"]
  
  // 時間與狀態
  startDate: string;
  endDate: string;
  isHot?: boolean;
  isFlashDeal?: boolean; // 限時快閃
  
  // 數據與社群情報
  source: 'affiliate' | 'social_listening' | 'merchant_post' | 'official' | 'blog_curation';
  sourcePlatform?: 'Dcard' | 'Momo' | 'Shopee' | 'PChome' | 'Costco' | 'Carrefour' | 'PXMart' | 'Convenience' | 'Merchant' | 'Supertaste' | 'Media';
  sourceUrl?: string;
  likeCount: number;
  commentCount: number;
  priceHistory?: PriceHistoryPoint[];
  
  // 假促銷偵測
  priceDropAlert?: {
    isLowest90Days: boolean;
    isSuspiciousHike: boolean; // 是否疑似先漲後折
    note?: string;
  };
  
  imageUrl?: string;
  images?: string[];
  aspectRatio?: DealAspectRatio; // 圖片規格比例 (1:1, 3:4, 4:3, 16:9, 9:16)
}

export interface RegionOption {
  city: string;
  districts: string[];
}

export interface SelectedRegionItem {
  city: string;
  district: string | null;
}

export interface DealFilterState {
  searchQuery: string;
  selectedCity: string;
  selectedDistrict: string | null;
  selectedRegions?: SelectedRegionItem[];
  channelType: ChannelType;
  category: DealCategory | 'all';
  selectedCard: string | null;
  selectedTag: string | null; // e.g. '#咖啡' 或 '__MY_TAGS__'
  subscribedTags?: string[]; // 當 selectedTag === '__MY_TAGS__' 時傳入使用者訂閱的標籤陣列
  sortBy: 'latest' | 'discount' | 'popular' | 'expiring';
}

