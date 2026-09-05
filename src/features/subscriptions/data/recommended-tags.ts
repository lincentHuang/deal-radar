export interface TagCategoryGroup {
  categoryName: string;
  categoryIcon: string;
  tags: {
    name: string;
    description?: string;
    dealCount?: number;
  }[];
}

export const RECOMMENDED_TAG_GROUPS: TagCategoryGroup[] = [
  {
    categoryName: '🔥 熱門促銷形式',
    categoryIcon: 'Sparkles',
    tags: [
      { name: '#買1送1', description: '買1送1超值好康', dealCount: 42 },
      { name: '#第2件5折', description: '揪團合購半價', dealCount: 28 },
      { name: '#滿千折百', description: '大檔期滿額立折', dealCount: 19 },
      { name: '#即期特惠', description: '惜福惜食出清破盤', dealCount: 15 },
      { name: '#免運', description: '各大電商免運快閃', dealCount: 33 },
    ],
  },
  {
    categoryName: '☕ 熱門咖啡與餐飲',
    categoryIcon: 'Coffee',
    tags: [
      { name: '#咖啡', description: '每日咖啡特惠情報', dealCount: 56 },
      { name: '#星巴克', description: 'Starbucks 好友分享日', dealCount: 24 },
      { name: '#全家', description: 'Let’s Café & 週末特選', dealCount: 38 },
      { name: '#7-11', description: 'City Cafe & 濃萃特價', dealCount: 35 },
      { name: '#路易莎', description: '黑卡專屬優惠', dealCount: 18 },
    ],
  },
  {
    categoryName: '🏪 超市與量販通路',
    categoryIcon: 'Store',
    tags: [
      { name: '#全聯', description: '福利中心檔期 DM 與特價', dealCount: 47 },
      { name: '#好市多', description: 'Costco 黑鑽會員省錢精選', dealCount: 31 },
      { name: '#萬家福', description: '量販即期與線上商城折價', dealCount: 22 },
      { name: '#屈臣氏', description: '開架美妝加一元多一件', dealCount: 20 },
    ],
  },
  {
    categoryName: '🛍️ 線上電商與 3C',
    categoryIcon: 'ShoppingBag',
    tags: [
      { name: '#Momo', description: 'Mo幣回饋與大牌直降', dealCount: 65 },
      { name: '#蝦皮', description: '商城月月節與免運券', dealCount: 58 },
      { name: '#PChome', description: '24h 到貨限時下殺', dealCount: 29 },
      { name: '#iPhone', description: 'Apple 官方與電商真特價', dealCount: 16 },
      { name: '#Switch', description: '主機遊戲折扣情報', dealCount: 14 },
    ],
  },
  {
    categoryName: '💳 信用卡與支付回饋',
    categoryIcon: 'CreditCard',
    tags: [
      { name: '#國泰CUBE', description: '小樹點 3%~8% 回饋', dealCount: 40 },
      { name: '#玉山UBear', description: '網購與影音 3%~13%', dealCount: 25 },
      { name: '#LINEPay', description: '點數抵用與優惠券疊加', dealCount: 36 },
      { name: '#台新FlyGo', description: '交通與海外高額回饋', dealCount: 18 },
    ],
  },
];

export const ALL_RECOMMENDED_TAG_NAMES = RECOMMENDED_TAG_GROUPS.flatMap((g) =>
  g.tags.map((t) => t.name)
);
