'use server';

import { getAdCampaigns, createAdCampaign, updateAdCampaignStatus, calculateTrafficEstimate } from './ads-dal';
import { CreateAdCampaignInput, CreateAdCampaignSchema } from '../schemas/ad-campaign.schema';
import { AdCampaign, AdCampaignStatus, TrafficEstimate, AdBiddingModel } from '../types/ad.types';
import { revalidatePath } from 'next/cache';

export async function fetchAdCampaignsAction(merchantName?: string): Promise<AdCampaign[]> {
  return await getAdCampaigns(merchantName);
}

export async function createAdCampaignAction(formData: FormData): Promise<{
  success: boolean;
  message: string;
  campaign?: AdCampaign;
  errors?: Record<string, string[]>;
}> {
  const rawTargetCategories = formData.get('targetCategories');
  const targetCategories = rawTargetCategories 
    ? String(rawTargetCategories).split(',').map((s) => s.trim()).filter(Boolean)
    : ['all'];

  const rawTargetRegions = formData.get('targetRegions');
  const targetRegions = rawTargetRegions
    ? String(rawTargetRegions).split(',').map((s) => s.trim()).filter(Boolean)
    : ['全部地區'];

  const rawTargetTags = formData.get('targetTags');
  const targetTags = rawTargetTags
    ? String(rawTargetTags).split(/[,，、\s]/).filter(Boolean)
    : [];

  const rawData: Record<string, any> = {
    merchantName: formData.get('merchantName'),
    merchantLogo: formData.get('merchantLogo') || undefined,
    title: formData.get('title'),
    subtitle: formData.get('subtitle'),
    imageUrl: formData.get('imageUrl'),
    targetDealId: formData.get('targetDealId') || undefined,
    targetUrl: formData.get('targetUrl') || undefined,
    ctaText: formData.get('ctaText') || '立即搶購',
    discountBadge: formData.get('discountBadge') || '品牌獨家',
    placement: formData.get('placement') || 'hero_banner',
    biddingModel: formData.get('biddingModel') || 'cpm',
    dailyBudget: Number(formData.get('dailyBudget')),
    durationDays: Number(formData.get('durationDays')),
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate'),
    targetCategories,
    targetRegions,
    targetTags,
  };

  const parsed = CreateAdCampaignSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      message: '廣告活動建立失敗，請檢查欄位資料',
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const created = await createAdCampaign(parsed.data);
    revalidatePath('/');
    revalidatePath('/merchant');
    revalidatePath('/admin');
    return {
      success: true,
      message: '🎉 廣告活動建立成功！預算已生效並排入投放隊列',
      campaign: created,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || '廣告建立失敗',
    };
  }
}

export async function calculateAdEstimateAction(
  biddingModel: AdBiddingModel,
  dailyBudget: number,
  durationDays: number
): Promise<TrafficEstimate> {
  return calculateTrafficEstimate(biddingModel, dailyBudget, durationDays);
}

export async function updateAdStatusAction(id: string, status: AdCampaignStatus): Promise<{
  success: boolean;
  message: string;
  campaign?: AdCampaign;
}> {
  const updated = await updateAdCampaignStatus(id, status);
  if (!updated) {
    return { success: false, message: '找不到廣告活動' };
  }
  revalidatePath('/');
  revalidatePath('/merchant');
  revalidatePath('/admin');
  return { success: true, message: `廣告狀態已切換為【${status}】`, campaign: updated };
}
