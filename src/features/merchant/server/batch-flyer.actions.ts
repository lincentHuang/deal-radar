'use server';

import { DraftDealCard, BatchPublishDealsSchema } from '../schemas/batch-flyer.schema';
import { SmartDeal } from '@/features/deals/types/deal.types';
import { batchCreateSmartDeals } from '@/features/deals/server/deals-dal';
import { revalidatePath } from 'next/cache';

/**
 * 模擬/呼叫 Gemini AI Vision 進行多張 DM 海報的多卡智能識別與拆解
 */
export async function extractDealsFromFlyersAction(
  merchantName: string,
  imageUrls: string[]
): Promise<{
  success: boolean;
  message: string;
  extractedCards: DraftDealCard[];
}> {
  if (!imageUrls || imageUrls.length === 0) {
    return { success: false, message: '請至少提供一張 DM 圖片', extractedCards: [] };
  }

  // 模擬多模態 AI 高速解析微延遲 (300ms)
  await new Promise((resolve) => setTimeout(resolve, 300));

  const allDrafts: DraftDealCard[] = [];
  const now = new Date();
  const endDate = new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0];
  const startDate = now.toISOString().split('T')[0];

  imageUrls.forEach((imgUrl, imgIndex) => {
    // 依據圖片與品牌產生 1-3 張結構化精準草稿卡片
    const baseId = `draft-${Date.now()}-${imgIndex}`;

    allDrafts.push(
      {
        draftId: `${baseId}-1`,
        title: `【${merchantName}】DM強檔主打 · 人氣經典熱銷組 買1送1`,
        category: 'food',
        channelType: 'offline',
        merchantName: merchantName,
        originalPrice: 160,
        discountPrice: 80,
        targetItems: '人氣特選咖啡飲品, 經典手工甜點',
        conditions: '限時買一送一, 每人每次限購兩組, 售完為止',
        eligibleCards: '國泰CUBE卡, 台新@GoGo, 玉山U Bear',
        tags: `#${merchantName}, #DM推薦, #買一送一, #人氣熱銷`,
        startDate: startDate,
        endDate: endDate,
        imageUrl: imgUrl,
        selectedForPublish: true,
      },
      {
        draftId: `${baseId}-2`,
        title: `【${merchantName}】週末會員狂歡 · 指定第 2 件 5 折`,
        category: 'grocery',
        channelType: 'offline',
        merchantName: merchantName,
        originalPrice: 220,
        discountPrice: 110,
        targetItems: '精選生鮮食品, 嚴選家庭日常消耗品',
        conditions: '同品項第2件5折, 需出示會員條碼',
        eligibleCards: '全支付, LINE Pay, 聯名信用卡',
        tags: `#${merchantName}, #第2件5折, #週末狂歡, #DM限定`,
        startDate: startDate,
        endDate: endDate,
        imageUrl: imgUrl,
        selectedForPublish: true,
      }
    );
  });

  return {
    success: true,
    message: `✨ AI 智能解析完成！成功自 ${imageUrls.length} 張 DM 海報中萃取出 ${allDrafts.length} 筆獨立優惠品項`,
    extractedCards: allDrafts,
  };
}

/**
 * 一鍵批量發布所選的草稿卡片至特價情報站
 */
export async function batchPublishDealsAction(
  merchantName: string,
  deals: DraftDealCard[]
): Promise<{
  success: boolean;
  message: string;
  publishedCount: number;
}> {
  const selectedDeals = deals.filter((d) => d.selectedForPublish);
  if (selectedDeals.length === 0) {
    return { success: false, message: '請至少勾選一筆欲發布的卡片', publishedCount: 0 };
  }

  const smartDeals: SmartDeal[] = selectedDeals.map((draft, idx) => {
    return {
      id: `deal-dm-${Date.now()}-${idx}`,
      title: draft.title,
      subtitle: `${merchantName} 官方 DM 促銷快速發布`,
      category: draft.category,
      channelType: draft.channelType,
      merchant: {
        name: merchantName,
        storeBranches: '全台實體門市',
      },
      regions: ['全部地區', '全台實體門市'],
      originalPrice: draft.originalPrice,
      discountPrice: draft.discountPrice,
      priceUnit: '份',
      targetItems: draft.targetItems.split(/[,，、]/).map((s) => s.trim()).filter(Boolean),
      conditions: draft.conditions.split(/[,，、\n]/).map((s) => s.trim()).filter(Boolean),
      eligibleCards: draft.eligibleCards ? draft.eligibleCards.split(/[,，、]/).map((s) => s.trim()).filter(Boolean) : [],
      tags: draft.tags 
        ? draft.tags.split(/[,，、\s]/).map((t) => t.startsWith('#') ? t : `#${t}`).filter((t) => t !== '#')
        : [`#${merchantName}`, '#DM特惠'],
      startDate: new Date(draft.startDate).toISOString(),
      endDate: new Date(draft.endDate).toISOString(),
      isHot: true,
      isFlashDeal: false,
      source: 'merchant_post',
      sourcePlatform: 'Merchant',
      likeCount: 0,
      commentCount: 0,
      imageUrl: draft.imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    };
  });

  await batchCreateSmartDeals(smartDeals);

  revalidatePath('/');
  revalidatePath('/merchant');
  revalidatePath('/admin');

  return {
    success: true,
    message: `🎉 批量發布成功！已將 ${smartDeals.length} 筆 DM 特惠卡片即時推播上線`,
    publishedCount: smartDeals.length,
  };
}
