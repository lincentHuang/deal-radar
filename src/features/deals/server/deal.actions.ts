'use server';

import { getDeals, getDealById, createDeal, redeemVoucher } from '@/features/deals/server/deals-dal';
import { DealFilterState, SmartDeal } from '@/features/deals/types/deal.types';
import { MerchantCreateDealSchema, MerchantCreateDealInput } from '@/features/deals/schemas/deal.schema';
import { revalidatePath } from 'next/cache';

export async function fetchDealsAction(filters?: Partial<DealFilterState>): Promise<SmartDeal[]> {
  return await getDeals(filters);
}

export async function fetchDealByIdAction(id: string): Promise<SmartDeal | null> {
  return await getDealById(id);
}

export async function createMerchantDealAction(formData: FormData): Promise<{
  success: boolean;
  message: string;
  deal?: SmartDeal;
  errors?: Record<string, string[]>;
}> {
  const rawData: Record<string, any> = {
    title: formData.get('title'),
    merchantName: formData.get('merchantName'),
    channelType: formData.get('channelType'),
    category: formData.get('category'),
    city: formData.get('city'),
    district: formData.get('district') || undefined,
    originalPrice: formData.get('originalPrice') ? Number(formData.get('originalPrice')) : undefined,
    discountPrice: Number(formData.get('discountPrice')),
    targetItems: formData.get('targetItems'),
    conditions: formData.get('conditions'),
    eligibleCards: formData.get('eligibleCards') || undefined,
    tags: formData.get('tags') || undefined,
    startDate: formData.get('startDate') || new Date().toISOString(),
    endDate: formData.get('endDate') || new Date(Date.now() + 86400000 * 3).toISOString(),
    quota: formData.get('quota') ? Number(formData.get('quota')) : undefined,
    aspectRatio: formData.get('aspectRatio') || undefined,
    imageUrl: formData.get('imageUrl') || undefined,
  };

  const parsed = MerchantCreateDealSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      message: '表單資料驗證失敗，請檢查填寫內容',
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const created = await createDeal(parsed.data);
    revalidatePath('/');
    return {
      success: true,
      message: '🎉 優惠情報已成功發布並即時上線！',
      deal: created,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || '發布失敗，請稍後再試',
    };
  }
}

export async function redeemDealVoucherAction(dealId: string, voucherCode: string) {
  const res = await redeemVoucher(voucherCode, dealId);
  revalidatePath('/merchant');
  return res;
}

export async function updateDealAction(id: string, updates: Partial<SmartDeal>): Promise<{
  success: boolean;
  message: string;
  deal?: SmartDeal;
}> {
  const { updateDeal } = await import('@/features/deals/server/deals-dal');
  const updated = await updateDeal(id, updates);
  if (!updated) {
    return { success: false, message: '找不到欲修改的特價卡片' };
  }
  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/merchant');
  return { success: true, message: '特價卡片更新成功', deal: updated };
}

export async function deleteDealAction(id: string): Promise<{ success: boolean; message: string }> {
  const { deleteDeal } = await import('@/features/deals/server/deals-dal');
  const deleted = await deleteDeal(id);
  if (!deleted) {
    return { success: false, message: '找不到欲刪除的卡片或刪除失敗' };
  }
  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/merchant');
  return { success: true, message: '卡片已成功下架並刪除' };
}

export async function toggleDealHotAction(id: string): Promise<{ success: boolean; deal?: SmartDeal }> {
  const { toggleDealHot } = await import('@/features/deals/server/deals-dal');
  const deal = await toggleDealHot(id);
  revalidatePath('/');
  revalidatePath('/admin');
  return { success: !!deal, deal: deal || undefined };
}

export async function toggleDealFlashAction(id: string): Promise<{ success: boolean; deal?: SmartDeal }> {
  const { toggleDealFlash } = await import('@/features/deals/server/deals-dal');
  const deal = await toggleDealFlash(id);
  revalidatePath('/');
  revalidatePath('/admin');
  return { success: !!deal, deal: deal || undefined };
}

export async function fetchMerchantDealsAction(merchantName: string): Promise<SmartDeal[]> {
  const { getDealsByMerchant } = await import('@/features/deals/server/deals-dal');
  return await getDealsByMerchant(merchantName);
}

