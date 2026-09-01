import 'server-only';
import { AdCampaign, CreateAdCampaignInput, AdCampaignStatus, TrafficEstimate, AdBiddingModel } from '../types/ad.types';
import { prisma } from '@/shared/lib/prisma';

const INITIAL_CAMPAIGNS = [
  {
    id: 'ad-camp-starbucks-01',
    merchantName: '星巴克 Starbucks',
    merchantLogo: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=120&auto=format&fit=crop&q=80',
    title: '好友分享日 · 指定特大杯飲品買一送一',
    subtitle: '限時兩天！全台實體門市指定特大杯好友分享，國泰 CUBE 卡享 3% 回饋無上限',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&auto=format&fit=crop&q=80',
    ctaText: '立即查看優惠詳情',
    discountBadge: '🔥 買一送一',
    placement: 'hero_banner' as const,
    biddingModel: 'cpm' as const,
    dailyBudget: 600,
    durationDays: 5,
    startDate: '2026-08-30',
    endDate: '2026-09-04',
    totalBudget: 3000,
    spentBudget: 1450,
    impressions: 12080,
    clicks: 423,
    ctr: 3.5,
    status: 'active' as const,
    targetCategories: ['food'],
    targetRegions: ['全部地區'],
    targetTags: ['#咖啡', '#星巴克', '#買一送一'],
  },
  {
    id: 'ad-camp-pxmart-02',
    merchantName: '全聯福利中心 PX MART',
    merchantLogo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=120&auto=format&fit=crop&q=80',
    title: '週末會員狂歡購！舒潔頂級抽取式衛生紙 第 2 件 5折',
    subtitle: '滿千再贈 800 點福利點，全支付綁定玉山銀行享 3% 全點回饋，家庭囤貨必衝',
    imageUrl: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=1200&auto=format&fit=crop&q=80',
    ctaText: '查看門市特惠條件',
    discountBadge: '🏷️ 第 2 件 5 折',
    placement: 'hero_banner' as const,
    biddingModel: 'cpc' as const,
    dailyBudget: 500,
    durationDays: 3,
    startDate: '2026-08-31',
    endDate: '2026-09-02',
    totalBudget: 1500,
    spentBudget: 520,
    impressions: 4800,
    clicks: 148,
    ctr: 3.08,
    status: 'active' as const,
    targetCategories: ['grocery'],
    targetRegions: ['全部地區'],
    targetTags: ['#全聯', '#衛生紙', '#生活用品'],
  },
];

function mapDbCampaignToAdCampaign(record: any): AdCampaign {
  return {
    id: record.id,
    merchantName: record.merchantName,
    merchantLogo: record.merchantLogo ?? undefined,
    title: record.title,
    subtitle: record.subtitle ?? undefined,
    imageUrl: record.imageUrl,
    ctaText: record.ctaText ?? undefined,
    discountBadge: record.discountBadge ?? undefined,
    placement: record.placement as any,
    biddingModel: record.biddingModel as any,
    dailyBudget: record.dailyBudget,
    durationDays: record.durationDays,
    startDate: record.startDate,
    endDate: record.endDate,
    totalBudget: record.totalBudget,
    spentBudget: record.spentBudget,
    impressions: record.impressions,
    clicks: record.clicks,
    ctr: record.ctr,
    status: record.status as any,
    targetCategories: record.targetCategories ?? [],
    targetRegions: record.targetRegions ?? [],
    targetTags: record.targetTags ?? [],
    createdAt: record.createdAt instanceof Date ? record.createdAt.toISOString().replace('T', ' ').substring(0, 19) : record.createdAt,
  };
}

let isAdsSeeding = false;
async function ensureCampaignsSeeded(): Promise<void> {
  if (isAdsSeeding) return;
  try {
    const count = await prisma.adCampaign.count();
    if (count === 0) {
      isAdsSeeding = true;
      for (const camp of INITIAL_CAMPAIGNS) {
        await prisma.adCampaign.create({
          data: camp,
        });
      }
      console.log('[Ads-DAL] ✅ Auto-seeded initial ad campaigns into remote database.');
    }
  } catch (err) {
    console.error('[Ads-DAL] ⚠️ ensureCampaignsSeeded error:', err);
  } finally {
    isAdsSeeding = false;
  }
}

export async function getAdCampaigns(merchantName?: string): Promise<AdCampaign[]> {
  try {
    if (!process.env.DATABASE_URL) {
      console.warn('[Ads-DAL] ⚠️ DATABASE_URL is not set. Using INITIAL_CAMPAIGNS fallback.');
      let list = INITIAL_CAMPAIGNS.map(mapDbCampaignToAdCampaign);
      if (merchantName && merchantName !== 'all') {
        list = list.filter((c) => c.merchantName.toLowerCase().includes(merchantName.trim().toLowerCase()));
      }
      return list;
    }

    await ensureCampaignsSeeded();
    
    let where: any = {};
    if (merchantName && merchantName !== 'all') {
      where = {
        merchantName: {
          contains: merchantName.trim(),
          mode: 'insensitive',
        },
      };
    }

    const records = await prisma.adCampaign.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return records.map(mapDbCampaignToAdCampaign);
  } catch (err) {
    console.error('[Ads-DAL] ⚠️ Database query failed, falling back to INITIAL_CAMPAIGNS:', err);
    let list = INITIAL_CAMPAIGNS.map(mapDbCampaignToAdCampaign);
    if (merchantName && merchantName !== 'all') {
      list = list.filter((c) => c.merchantName.toLowerCase().includes(merchantName.trim().toLowerCase()));
    }
    return list;
  }
}

export async function createAdCampaign(input: CreateAdCampaignInput): Promise<AdCampaign> {
  const totalBudget = input.dailyBudget * input.durationDays;
  const newCampaign = await prisma.adCampaign.create({
    data: {
      id: `ad-camp-${Date.now()}`,
      merchantName: input.merchantName,
      merchantLogo: input.merchantLogo ?? null,
      title: input.title,
      subtitle: input.subtitle ?? null,
      imageUrl: input.imageUrl,
      ctaText: input.ctaText ?? null,
      discountBadge: input.discountBadge ?? null,
      placement: input.placement,
      biddingModel: input.biddingModel,
      dailyBudget: input.dailyBudget,
      durationDays: input.durationDays,
      startDate: input.startDate,
      endDate: input.endDate,
      totalBudget,
      spentBudget: 0,
      impressions: 0,
      clicks: 0,
      ctr: 0,
      status: 'active',
      targetCategories: input.targetCategories || [],
      targetRegions: input.targetRegions || [],
      targetTags: input.targetTags || [],
    },
  });

  return mapDbCampaignToAdCampaign(newCampaign);
}

export async function updateAdCampaignStatus(id: string, status: AdCampaignStatus): Promise<AdCampaign | null> {
  try {
    const updated = await prisma.adCampaign.update({
      where: { id },
      data: { status },
    });
    return mapDbCampaignToAdCampaign(updated);
  } catch (err) {
    console.error(`[Ads-DAL] Update status for ${id} failed:`, err);
    return null;
  }
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
