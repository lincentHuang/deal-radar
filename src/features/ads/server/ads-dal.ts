import 'server-only';
import { AdCampaign, CreateAdCampaignInput, AdCampaignStatus, TrafficEstimate, AdBiddingModel } from '../types/ad.types';

// 初始廣告活動快取
let inMemoryCampaigns: AdCampaign[] = [
  {
    id: 'ad-camp-starbucks-01',
    merchantName: '星巴克 Starbucks',
    merchantLogo: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=120&auto=format&fit=crop&q=80',
    title: '好友分享日 · 指定特大杯飲品買一送一',
    subtitle: '限時兩天！全台實體門市指定特大杯好友分享，國泰 CUBE 卡享 3% 回饋無上限',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&auto=format&fit=crop&q=80',
    ctaText: '立即查看優惠詳情',
    discountBadge: '🔥 買一送一',
    placement: 'hero_banner',
    biddingModel: 'cpm',
    dailyBudget: 600,
    durationDays: 5,
    startDate: '2026-08-30',
    endDate: '2026-09-04',
    totalBudget: 3000,
    spentBudget: 1450,
    impressions: 12080,
    clicks: 423,
    ctr: 3.5,
    status: 'active',
    targetCategories: ['food'],
    targetRegions: ['全部地區'],
    targetTags: ['#咖啡', '#星巴克', '#買一送一'],
    createdAt: '2026-08-30 10:00:00',
  },
  {
    id: 'ad-camp-pxmart-02',
    merchantName: '全聯福利中心 PX MART',
    merchantLogo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=120&auto=format&fit=crop&q=80',
    title: '週末會員狂歡購！舒潔頂級抽取式衛生紙 第 2 件 5 折',
    subtitle: '滿千再贈 800 點福利點，全支付綁定玉山銀行享 3% 全點回饋，家庭囤貨必衝',
    imageUrl: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=1200&auto=format&fit=crop&q=80',
    ctaText: '查看門市特惠條件',
    discountBadge: '🏷️ 第 2 件 5 折',
    placement: 'hero_banner',
    biddingModel: 'cpc',
    dailyBudget: 500,
    durationDays: 3,
    startDate: '2026-08-31',
    endDate: '2026-09-02',
    totalBudget: 1500,
    spentBudget: 520,
    impressions: 4800,
    clicks: 148,
    ctr: 3.08,
    status: 'active',
    targetCategories: ['grocery'],
    targetRegions: ['全部地區'],
    targetTags: ['#全聯', '#衛生紙', '#生活用品'],
    createdAt: '2026-08-31 09:00:00',
  },
];

export async function getAdCampaigns(merchantName?: string): Promise<AdCampaign[]> {
  if (!merchantName || merchantName === 'all') {
    return inMemoryCampaigns;
  }
  const cleanName = merchantName.toLowerCase().trim();
  return inMemoryCampaigns.filter((c) => 
    c.merchantName.toLowerCase().includes(cleanName) ||
    cleanName.includes(c.merchantName.toLowerCase())
  );
}

export async function createAdCampaign(input: CreateAdCampaignInput): Promise<AdCampaign> {
  const totalBudget = input.dailyBudget * input.durationDays;
  const newCampaign: AdCampaign = {
    ...input,
    id: `ad-camp-${Date.now()}`,
    totalBudget,
    spentBudget: 0,
    impressions: 0,
    clicks: 0,
    ctr: 0,
    status: 'active', // 建立即啟動投放
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
  };

  inMemoryCampaigns = [newCampaign, ...inMemoryCampaigns];
  return newCampaign;
}

export async function updateAdCampaignStatus(id: string, status: AdCampaignStatus): Promise<AdCampaign | null> {
  const campaign = inMemoryCampaigns.find((c) => c.id === id);
  if (!campaign) return null;
  campaign.status = status;
  return campaign;
}

export function calculateTrafficEstimate(
  biddingModel: AdBiddingModel,
  dailyBudget: number,
  durationDays: number
): TrafficEstimate {
  const totalBudget = dailyBudget * durationDays;

  if (biddingModel === 'cpm') {
    const cpmRate = 120; // NT$ 120 / 1000 曝光
    const expectedImpressions = Math.round((totalBudget / cpmRate) * 1000);
    const minImpressions = Math.round(expectedImpressions * 0.85);
    const maxImpressions = Math.round(expectedImpressions * 1.2);

    const avgCtr = 3.2; // 3.2%
    const minClicks = Math.round((minImpressions * (avgCtr - 0.5)) / 100);
    const maxClicks = Math.round((maxImpressions * (avgCtr + 0.8)) / 100);

    return {
      estimatedImpressions: { min: minImpressions, max: maxImpressions },
      estimatedClicks: { min: minClicks, max: maxClicks },
      estimatedAvgCtr: avgCtr,
      unitCost: cpmRate,
      totalBudget,
    };
  } else {
    const cpcRate = 3.5; // NT$ 3.5 / 點擊
    const expectedClicks = Math.round(totalBudget / cpcRate);
    const minClicks = Math.round(expectedClicks * 0.9);
    const maxClicks = Math.round(expectedClicks * 1.15);

    const avgCtr = 3.8;
    const minImpressions = Math.round((minClicks / (avgCtr / 100)));
    const maxImpressions = Math.round((maxClicks / (avgCtr / 100)));

    return {
      estimatedImpressions: { min: minImpressions, max: maxImpressions },
      estimatedClicks: { min: minClicks, max: maxClicks },
      estimatedAvgCtr: avgCtr,
      unitCost: cpcRate,
      totalBudget,
    };
  }
}
