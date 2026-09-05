import { SmartDeal } from '../types/deal.types';

export interface DealPricingDisplayInfo {
  isMechanismPromo: boolean; // 是否屬於「買1送1」、「買多送多」、「全館X折」等機制優惠
  displayTitle: string;      // 主視覺直接呈現的價格或文字（例如：「買1送1」、「全館9折」、「NT$ 159」）
  subText?: string;          // 輔助原價資訊（例如：「原價 NT$ 140」）
  calculatedUnitPrice?: number;     // 推算每件價格數值（例如：105、70、48）
  calculatedUnitPriceText?: string; // 推算每件價格字串（例如：「單件 NT$ 105」）
  originalPrice?: number;
  discountPrice?: number;
  unit?: string;             // 例如 "杯", "瓶", "件"
  badgeText?: string;        // 頂部小標籤文字（例如："買1送1"）
}

const CHINESE_NUM_MAP: Record<string, number> = {
  '一': 1, '二': 2, '兩': 2, '三': 3, '四': 4,
  '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '十': 10,
};

function parseNumberToken(token: string): number {
  if (!token) return 1;
  const trimmed = token.trim();
  if (/^\d+$/.test(trimmed)) return parseInt(trimmed, 10);
  if (CHINESE_NUM_MAP[trimmed] !== undefined) return CHINESE_NUM_MAP[trimmed];
  return 1;
}

/**
 * 將中文數字促銷（如「買一送一」、「第二件半價」）標準化為阿拉伯數字（「買1送1」、「第2件半價」）
 */
export function normalizePromoMechanism(text: string): string {
  if (!text) return '';
  let result = text
    .replace(/買[一1]送[一1]/g, '買1送1')
    .replace(/買[二2兩]送[一1]/g, '買2送1')
    .replace(/買[二2兩]送[二2兩]/g, '買2送2')
    .replace(/買[三3]送[一1]/g, '買3送1')
    .replace(/買[三3]送[三3]/g, '買3送3')
    .replace(/買([一二兩三四五六七八九\d]+)送([一二兩三四五六七八九\d]+)/g, (_, x, y) => {
      const numX = parseNumberToken(x);
      const numY = parseNumberToken(y);
      return `買${numX}送${numY}`;
    })
    .replace(/第[二2兩]件\s*半價/g, '第2件半價')
    .replace(/第[二2兩]件\s*(\d+(?:\.\d+)?)\s*折/g, '第2件$1折')
    .replace(/第[二2兩]件\s*(\d+)\s*元/g, '第2件$1元')
    .replace(/加\s*(\d+)\s*元多[一1件支杯瓶包入]/g, '加$1元多1件');

  return result.replace(/\s+/g, '');
}

/**
 * 依促銷機制與原價/特價推算「單件多少錢」
 */
function calculateUnitPrice(
  deal: SmartDeal,
  mechanism: string,
  combinedText: string
): { calculatedUnitPrice?: number; calculatedUnitPriceText?: string } {
  const orig = deal.originalPrice && deal.originalPrice > 0 ? deal.originalPrice : undefined;
  const disc = deal.discountPrice && deal.discountPrice > 0 ? deal.discountPrice : undefined;

  // 1. 若資料庫內已有 discountPrice 且小於 originalPrice，優先作為單件折算均價
  if (disc && orig && disc < orig) {
    const formatted = Number.isInteger(disc) ? `${disc}` : disc.toFixed(1).replace(/\.0$/, '');
    return {
      calculatedUnitPrice: disc,
      calculatedUnitPriceText: `單件 NT$ ${formatted}`,
    };
  }

  // 2. 匹配「買X送Y」機制
  const buyMatch = mechanism.match(/買(\d+)送(\d+)/);
  if (buyMatch && orig) {
    const x = parseInt(buyMatch[1], 10);
    const y = parseInt(buyMatch[2], 10);
    if (x > 0 && y > 0) {
      const unitVal = (orig * x) / (x + y);
      const rounded = Math.round(unitVal * 10) / 10;
      const formatted = Number.isInteger(rounded) ? `${rounded}` : rounded.toFixed(1);
      return {
        calculatedUnitPrice: rounded,
        calculatedUnitPriceText: `單件 NT$ ${formatted}`,
      };
    }
  }

  // 3. 匹配「任X件Y元 / X入Y元 / X支Y元」多件優惠
  const multiMatch = combinedText.match(
    /(?:任選?\s*)?(\d+)\s*(?:件|瓶|杯|包|入|支)\s*(?:只要)?\s*[$|NT$|NT|\$]?\s*(\d+)\s*元/i
  );
  if (multiMatch) {
    const count = parseInt(multiMatch[1], 10);
    const totalCost = parseFloat(multiMatch[2]);
    if (count > 0 && totalCost > 0) {
      const unitVal = totalCost / count;
      const rounded = Math.round(unitVal * 10) / 10;
      const formatted = Number.isInteger(rounded) ? `${rounded}` : rounded.toFixed(1);
      return {
        calculatedUnitPrice: rounded,
        calculatedUnitPriceText: `單件 NT$ ${formatted}`,
      };
    }
  }

  // 4. 匹配「第2件半價」
  if (mechanism.includes('第2件半價') && orig) {
    const unitVal = (orig * 1.5) / 2;
    const rounded = Math.round(unitVal * 10) / 10;
    const formatted = Number.isInteger(rounded) ? `${rounded}` : rounded.toFixed(1);
    return {
      calculatedUnitPrice: rounded,
      calculatedUnitPriceText: `單件 NT$ ${formatted}`,
    };
  }

  // 5. 匹配「第2件X折」
  const secondDiscountMatch = mechanism.match(/第2件(\d+(?:\.\d+)?)折/);
  if (secondDiscountMatch && orig) {
    const discountRate = parseFloat(secondDiscountMatch[1]) / 10;
    const unitVal = (orig * (1 + discountRate)) / 2;
    const rounded = Math.round(unitVal * 10) / 10;
    const formatted = Number.isInteger(rounded) ? `${rounded}` : rounded.toFixed(1);
    return {
      calculatedUnitPrice: rounded,
      calculatedUnitPriceText: `單件 NT$ ${formatted}`,
    };
  }

  // 6. 匹配「第2件X元」或「加X元多1件」
  const secondAddMatch = mechanism.match(/(?:第2件(\d+)元|加(\d+)元多1件)/);
  if (secondAddMatch && orig) {
    const extra = parseFloat(secondAddMatch[1] || secondAddMatch[2]);
    const unitVal = (orig + extra) / 2;
    const rounded = Math.round(unitVal * 10) / 10;
    const formatted = Number.isInteger(rounded) ? `${rounded}` : rounded.toFixed(1);
    return {
      calculatedUnitPrice: rounded,
      calculatedUnitPriceText: `單件 NT$ ${formatted}`,
    };
  }

  // 7. 若只有 discountPrice 但沒有 originalPrice
  if (disc) {
    const formatted = Number.isInteger(disc) ? `${disc}` : disc.toFixed(1).replace(/\.0$/, '');
    return {
      calculatedUnitPrice: disc,
      calculatedUnitPriceText: `單件 NT$ ${formatted}`,
    };
  }

  return {};
}

/**
 * 智慧判定特價呈現機制：
 * 依據使用者需求：「買一送一 改為 買1送1（並且如果有價格的話 就直接推算一件多少錢）（以此類推）」
 */
export function getDealPricingDisplay(deal: SmartDeal): DealPricingDisplayInfo {
  const combinedSearchText = [
    deal.promoDisplayBadge || '',
    deal.title || '',
    ...(deal.conditions || []),
    ...(deal.tags || []),
    deal.subtitle || '',
  ].join(' ');

  // 1. 若資料已明確標註 promoDisplayBadge
  if (deal.promoDisplayBadge && deal.promoDisplayBadge.trim()) {
    const badge = normalizePromoMechanism(deal.promoDisplayBadge.trim());
    const isMech = /(買|送|折|半價|加\d+元|\d+元)/i.test(badge);
    const unitInfo = calculateUnitPrice(deal, badge, combinedSearchText);

    return {
      isMechanismPromo: isMech,
      displayTitle: badge,
      subText: deal.originalPrice ? `原價 NT$ ${deal.originalPrice}` : undefined,
      calculatedUnitPrice: unitInfo.calculatedUnitPrice,
      calculatedUnitPriceText: unitInfo.calculatedUnitPriceText,
      originalPrice: deal.originalPrice,
      discountPrice: deal.discountPrice,
      unit: deal.priceUnit,
      badgeText: isMech ? badge : undefined,
    };
  }

  // 2. 判定「買1送1 / 買X送Y」機制
  const buyXGetYMatch = combinedSearchText.match(
    /(買[一1]送[一1]|買[二2兩]送[一1]|買[二2兩]送[二2兩]|買[三3]送[一1]|買[三3]送[三3]|買\d+送\d+|買.+送.+)/i
  );
  if (buyXGetYMatch) {
    const cleanMechanism = normalizePromoMechanism(buyXGetYMatch[1]);
    const unitInfo = calculateUnitPrice(deal, cleanMechanism, combinedSearchText);

    return {
      isMechanismPromo: true,
      displayTitle: cleanMechanism,
      subText: deal.originalPrice ? `原價 NT$ ${deal.originalPrice}` : undefined,
      calculatedUnitPrice: unitInfo.calculatedUnitPrice,
      calculatedUnitPriceText: unitInfo.calculatedUnitPriceText,
      originalPrice: deal.originalPrice,
      discountPrice: deal.discountPrice,
      unit: deal.priceUnit,
      badgeText: cleanMechanism,
    };
  }

  // 3. 判定「全館X折 / X折 / 第2件X折 / 第2件半價」
  const discountMatch = combinedSearchText.match(
    /(全館\s*\d+(?:\.\d+)?\s*折|\d+(?:\.\d+)?\s*折|第[二2兩]件\s*半價|第[二2兩]件\s*\d+(?:\.\d+)?\s*折|第[二2兩]件\s*\d+\s*元|加\s*\d+\s*元多[一1件支杯瓶包入])/i
  );
  if (discountMatch) {
    const cleanDiscount = normalizePromoMechanism(discountMatch[1]);
    const unitInfo = calculateUnitPrice(deal, cleanDiscount, combinedSearchText);

    return {
      isMechanismPromo: true,
      displayTitle: cleanDiscount,
      subText: deal.originalPrice ? `原價 NT$ ${deal.originalPrice}` : undefined,
      calculatedUnitPrice: unitInfo.calculatedUnitPrice,
      calculatedUnitPriceText: unitInfo.calculatedUnitPriceText,
      originalPrice: deal.originalPrice,
      discountPrice: deal.discountPrice,
      unit: deal.priceUnit,
      badgeText: cleanDiscount,
    };
  }

  // 4. 判定「多件優惠 / 任X件XX元」（例如「任2瓶96元」、「2入59元」、「2支只要55元」）
  const multiItemMatch = combinedSearchText.match(
    /(任選?\s*\d+\s*(?:件|瓶|杯|包|入|支)\s*[$|NT$|NT|\$]?\s*\d+\s*元|\d+\s*(?:件|瓶|杯|包|入|支)(?:只要)?\s*[$|NT$|NT|\$]?\s*\d+\s*元)/i
  );
  if (multiItemMatch) {
    const cleanMulti = normalizePromoMechanism(multiItemMatch[1]);
    const unitInfo = calculateUnitPrice(deal, cleanMulti, combinedSearchText);

    return {
      isMechanismPromo: true,
      displayTitle: cleanMulti,
      subText: deal.originalPrice ? `原價 NT$ ${deal.originalPrice}` : undefined,
      calculatedUnitPrice: unitInfo.calculatedUnitPrice,
      calculatedUnitPriceText: unitInfo.calculatedUnitPriceText,
      originalPrice: deal.originalPrice,
      discountPrice: deal.discountPrice,
      unit: deal.priceUnit,
      badgeText: cleanMulti,
    };
  }

  // 5. 一般具備具體特價金額之商品（例如：林鳳營鮮乳 特價 159元）
  if (deal.discountPrice && deal.discountPrice > 0) {
    return {
      isMechanismPromo: false,
      displayTitle: `NT$ ${deal.discountPrice}`,
      subText: deal.originalPrice && deal.originalPrice > deal.discountPrice ? `NT$ ${deal.originalPrice}` : undefined,
      calculatedUnitPrice: deal.discountPrice,
      calculatedUnitPriceText: `單件 NT$ ${deal.discountPrice}`,
      originalPrice: deal.originalPrice,
      discountPrice: deal.discountPrice,
      unit: deal.priceUnit,
    };
  }

  // 6. 無明確數字特價之保底顯示（避免空洞的「促銷特惠 / 件」）
  const firstCondition = deal.conditions?.find(
    (c) => c && !c.includes('門市') && !c.includes('最新情報') && !c.includes('依現場')
  );

  return {
    isMechanismPromo: false,
    displayTitle: firstCondition ? normalizePromoMechanism(firstCondition) : '門市促銷特惠',
    subText: deal.originalPrice ? `原價 NT$ ${deal.originalPrice}` : undefined,
    originalPrice: deal.originalPrice,
    discountPrice: deal.discountPrice,
    unit: deal.priceUnit,
  };
}

