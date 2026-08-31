import { SmartDeal } from '../types/deal.types';

export interface DuplicateDealGroup {
  id: string;
  reason: string;
  matchedFields: ('name' | 'item')[];
  sharedItems?: string[];
  deals: SmartDeal[];
  primaryTitle: string;
  merchantName: string;
}

/**
 * 清理並標準化活動標題與商品名稱字串
 */
export function normalizeText(text: string, merchantName?: string): string {
  let clean = text.toLowerCase();

  // 移除店家常見前綴與品牌名稱
  if (merchantName) {
    const cleanMerchant = merchantName.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]/gi, '');
    clean = clean.replace(new RegExp(cleanMerchant, 'gi'), '');
  }

  const brandKeywords = [
    '全家', 'familymart', '7-11', '7-eleven', '統一超商', 
    '星巴克', 'starbucks', '麥當勞', 'mcdonalds', '全聯', 
    'px mart', '迷客夏', 'milksha', '康康5', '康康五'
  ];
  for (const kw of brandKeywords) {
    clean = clean.replaceAll(kw, '');
  }

  // 移除多餘符號與空白
  clean = clean.replace(/[【】\[\]（）()_+\-~！!？?：:，,。.\/\s#＃]/g, '');

  return clean.trim();
}

/**
 * 依據「1. 活動名字」與「2. 商品品相」比對重複特價卡片
 */
export function findDuplicateDeals(deals: SmartDeal[]): DuplicateDealGroup[] {
  const groups: DuplicateDealGroup[] = [];
  const processedDealIds = new Set<string>();

  for (let i = 0; i < deals.length; i++) {
    const dealA = deals[i];
    if (processedDealIds.has(dealA.id)) continue;

    const matchedDeals: SmartDeal[] = [dealA];
    let matchedFields: ('name' | 'item')[] = [];
    let duplicateReason = '';
    let sharedItemsFound: string[] = [];

    const normTitleA = normalizeText(dealA.title, dealA.merchant.name);
    const normMerchantA = dealA.merchant.name.toLowerCase().trim();
    const itemsA = dealA.targetItems.map((s) => normalizeText(s)).filter(Boolean);

    for (let j = i + 1; j < deals.length; j++) {
      const dealB = deals[j];
      if (processedDealIds.has(dealB.id)) continue;

      const normTitleB = normalizeText(dealB.title, dealB.merchant.name);
      const normMerchantB = dealB.merchant.name.toLowerCase().trim();
      const itemsB = dealB.targetItems.map((s) => normalizeText(s)).filter(Boolean);

      // 1. 檢查是否屬於同一品牌通路
      const isSameMerchant = 
        normMerchantA === normMerchantB ||
        normMerchantA.includes(normMerchantB) ||
        normMerchantB.includes(normMerchantA);

      if (!isSameMerchant) continue;

      // ====== 雙核心比對：名字 (Name) 與 品相 (Item) ======

      // 1. 名字比對 (Title / Name)
      const isExactTitle = normTitleA.length > 2 && normTitleA === normTitleB;
      const isContainTitle = 
        normTitleA.length > 3 && 
        normTitleB.length > 3 && 
        (normTitleA.includes(normTitleB) || normTitleB.includes(normTitleA));
      const isTitleMatched = isExactTitle || isContainTitle;

      // 2. 品相比對 (Target Items / Product Variant)
      const sharedItems = dealA.targetItems.filter((itemA) =>
        dealB.targetItems.some((itemB) => {
          const cleanA = normalizeText(itemA);
          const cleanB = normalizeText(itemB);
          return (
            cleanA === cleanB ||
            (cleanA.length > 2 && cleanB.includes(cleanA)) ||
            (cleanB.length > 2 && cleanA.includes(cleanB))
          );
        })
      );
      const isItemMatched = sharedItems.length > 0;

      let isDuplicate = false;
      const currentMatchedFields: ('name' | 'item')[] = [];

      // 判定規則 1: 名字與品相皆相符 (最精確重複)
      if (isTitleMatched && isItemMatched) {
        isDuplicate = true;
        currentMatchedFields.push('name', 'item');
        duplicateReason = `活動名字與商品品相 (${sharedItems.join(', ')}) 完全一致`;
        sharedItemsFound = sharedItems;
      }
      // 判定規則 2: 品相完全相同
      else if (isItemMatched && dealA.targetItems.length > 0 && dealB.targetItems.length > 0) {
        isDuplicate = true;
        currentMatchedFields.push('item');
        duplicateReason = `商品品相完全相同【${sharedItems.join(', ')}】`;
        sharedItemsFound = sharedItems;
      }
      // 判定規則 3: 活動名字完全相同或高度相符
      else if (isExactTitle) {
        isDuplicate = true;
        currentMatchedFields.push('name');
        duplicateReason = `活動名字【${dealA.title}】高度一致`;
      }
      // 判定規則 4: 相同來源 URL
      else if (dealA.sourceUrl && dealB.sourceUrl && dealA.sourceUrl === dealB.sourceUrl) {
        isDuplicate = true;
        currentMatchedFields.push('name');
        duplicateReason = '相同來源情報網址之活動';
      }

      if (isDuplicate) {
        matchedDeals.push(dealB);
        processedDealIds.add(dealB.id);
        matchedFields = Array.from(new Set([...matchedFields, ...currentMatchedFields]));
      }
    }

    if (matchedDeals.length > 1) {
      processedDealIds.add(dealA.id);
      groups.push({
        id: `dup-group-${dealA.id}`,
        reason: duplicateReason || '活動名字與商品品相相符',
        matchedFields: matchedFields.length > 0 ? matchedFields : ['name', 'item'],
        sharedItems: sharedItemsFound.length > 0 ? sharedItemsFound : undefined,
        deals: matchedDeals,
        primaryTitle: dealA.title,
        merchantName: dealA.merchant.name,
      });
    }
  }

  return groups;
}
