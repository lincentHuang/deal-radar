import assert from 'node:assert';

function levenshteinDistance(a, b) {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

function isExactOrOneCharDiff(s1, s2) {
  if (!s1 || !s2) return { isMatch: false, isExact: false, diffCount: -1 };
  if (s1 === s2) return { isMatch: true, isExact: true, diffCount: 0 };
  if (s1.length >= 2 && s2.length >= 2) {
    const dist = levenshteinDistance(s1, s2);
    if (dist <= 1) {
      return { isMatch: true, isExact: false, diffCount: dist };
    }
  }
  return { isMatch: false, isExact: false, diffCount: -1 };
}

function normalizeText(text, merchantName) {
  if (!text) return '';
  let clean = text.toLowerCase();

  if (merchantName) {
    const cleanMerchant = merchantName.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]/gi, '');
    if (cleanMerchant) {
      clean = clean.replace(new RegExp(cleanMerchant, 'gi'), '');
    }
  }

  const brandKeywords = [
    '全家', 'familymart', '7-11', '7-eleven', '統一超商', 
    '星巴克', 'starbucks', '麥當勞', 'mcdonalds', '全聯', 
    'px mart', '迷客夏', 'milksha', '康康5', '康康五',
    '超值五六日', '週末特惠', '限時特賣', '買一送一', '買1送1'
  ];
  for (const kw of brandKeywords) {
    clean = clean.replaceAll(kw, '');
  }

  clean = clean.replace(/[【】\[\]（）()_+\-~！!？?：:，,。.\/\s#＃*★☆◆◇\^]/g, '');
  return clean.trim();
}

function getDuplicatePairKey(id1, id2) {
  return [id1, id2].sort().join('::');
}

function findDuplicateDeals(deals, dismissedPairsInput) {
  const dismissedSet = dismissedPairsInput instanceof Set 
    ? dismissedPairsInput 
    : new Set(dismissedPairsInput || []);

  const groups = [];
  const processedDealIds = new Set();

  for (let i = 0; i < deals.length; i++) {
    const dealA = deals[i];
    if (processedDealIds.has(dealA.id)) continue;

    const matchedDeals = [dealA];
    let matchedFields = [];
    let duplicateReason = '';
    const allSharedItems = [];
    let hasAnyUnresolvedPair = false;

    const normTitleA = normalizeText(dealA.title, dealA.merchant.name);
    const normMerchantA = dealA.merchant.name.toLowerCase().trim();

    for (let j = i + 1; j < deals.length; j++) {
      const dealB = deals[j];
      if (processedDealIds.has(dealB.id)) continue;

      const normTitleB = normalizeText(dealB.title, dealB.merchant.name);
      const normMerchantB = dealB.merchant.name.toLowerCase().trim();

      const isSameMerchant = 
        normMerchantA === normMerchantB ||
        (normMerchantA.length >= 2 && normMerchantB.length >= 2 && (
          normMerchantA.includes(normMerchantB) ||
          normMerchantB.includes(normMerchantA)
        ));

      if (!isSameMerchant) continue;

      // 1. 活動名稱比對
      const titleMatchResult = isExactOrOneCharDiff(normTitleA, normTitleB);
      const isTitleMatched = titleMatchResult.isMatch;

      // 2. 活動品項比對
      const matchedItemsBetweenPair = [];
      let isItemMatched = false;

      if (dealA.targetItems && dealB.targetItems) {
        for (const itemA of dealA.targetItems) {
          const cleanItemA = normalizeText(itemA, dealA.merchant.name);
          if (!cleanItemA) continue;

          for (const itemB of dealB.targetItems) {
            const cleanItemB = normalizeText(itemB, dealB.merchant.name);
            if (!cleanItemB) continue;

            const itemMatchResult = isExactOrOneCharDiff(cleanItemA, cleanItemB);
            if (itemMatchResult.isMatch) {
              isItemMatched = true;
              matchedItemsBetweenPair.push(itemA === itemB ? itemA : `${itemA} ≈ ${itemB}`);
            }
          }
        }
      }

      const isDuplicate = isTitleMatched || isItemMatched;
      if (!isDuplicate) continue;

      const pairKey = getDuplicatePairKey(dealA.id, dealB.id);
      if (!dismissedSet.has(pairKey)) {
        hasAnyUnresolvedPair = true;
      }

      const currentMatchedFields = [];

      if (isTitleMatched && isItemMatched) {
        currentMatchedFields.push('name', 'item');
        duplicateReason = `活動名稱與品項 (${matchedItemsBetweenPair.join(', ')}) 皆相符（完全一致/容錯1字）`;
      } else if (isItemMatched) {
        currentMatchedFields.push('item');
        duplicateReason = `活動品項相符【${matchedItemsBetweenPair.join(', ')}】（完全一致/容錯1字）`;
      } else if (isTitleMatched) {
        currentMatchedFields.push('name');
        duplicateReason = titleMatchResult.isExact 
          ? `活動名稱完全一致【${dealA.title}】` 
          : `活動名稱相符（容錯1字）【${dealA.title} ≈ ${dealB.title}】`;
      }

      matchedDeals.push(dealB);
      processedDealIds.add(dealB.id);
      matchedFields = Array.from(new Set([...matchedFields, ...currentMatchedFields]));
      matchedItemsBetweenPair.forEach((item) => {
        if (!allSharedItems.includes(item)) allSharedItems.push(item);
      });
    }

    if (matchedDeals.length > 1) {
      processedDealIds.add(dealA.id);
      if (hasAnyUnresolvedPair) {
        groups.push({
          id: `dup-group-${dealA.id}`,
          reason: duplicateReason || '活動名稱或活動品項完全一致/容錯一個字',
          matchedFields: matchedFields.length > 0 ? matchedFields : ['name', 'item'],
          sharedItems: allSharedItems.length > 0 ? allSharedItems : undefined,
          deals: matchedDeals,
          primaryTitle: dealA.title,
          merchantName: dealA.merchant.name,
        });
      }
    }
  }

  return groups;
}

// 測試案例
console.log('--- 測試 1: 完全一致活動名稱 ---');
const test1 = findDuplicateDeals([
  { id: '1', title: '星巴克特大杯那堤買一送一', merchant: { name: '星巴克' }, targetItems: [] },
  { id: '2', title: '星巴克特大杯那堤買一送一', merchant: { name: '星巴克' }, targetItems: [] },
]);
assert.strictEqual(test1.length, 1);
assert.strictEqual(test1[0].deals.length, 2);
console.log('✅ PASS: 完全一致活動名稱成功歸組');

console.log('--- 測試 2: 容錯一個字活動名稱 (那堤 vs 拿堤) ---');
const test2 = findDuplicateDeals([
  { id: '1', title: '星巴克特大杯那堤買一送一', merchant: { name: '星巴克' }, targetItems: [] },
  { id: '2', title: '星巴克特大杯拿堤買一送一', merchant: { name: '星巴克' }, targetItems: [] },
]);
assert.strictEqual(test2.length, 1);
console.log('✅ PASS: 容錯一個字活動名稱成功歸組');

console.log('--- 測試 3: 品項完全一致 ---');
const test3 = findDuplicateDeals([
  { id: '1', title: '超值特惠 A', merchant: { name: '全家' }, targetItems: ['黑松沙士'] },
  { id: '2', title: '週末狂歡 B', merchant: { name: '全家' }, targetItems: ['黑松沙士'] },
]);
assert.strictEqual(test3.length, 1);
assert.strictEqual(test3[0].matchedFields.includes('item'), true);
console.log('✅ PASS: 品項完全一致成功歸組');

console.log('--- 測試 4: 品項容錯一個字 (冰淇淋 vs 冰淇林) ---');
const test4 = findDuplicateDeals([
  { id: '1', title: '大促 A', merchant: { name: '全家' }, targetItems: ['布丁冰淇淋'] },
  { id: '2', title: '大促 B', merchant: { name: '全家' }, targetItems: ['布丁冰淇林'] },
]);
assert.strictEqual(test4.length, 1);
console.log('✅ PASS: 品項容錯一個字成功歸組');

console.log('--- 測試 5: 完全不同品項與名稱不應歸組 ---');
const test5 = findDuplicateDeals([
  { id: '1', title: '星巴克特大杯那堤買一送一', merchant: { name: '星巴克' }, targetItems: ['特大杯那堤'] },
  { id: '2', title: '星巴克巧克力可可碎片星冰樂第2杯半價', merchant: { name: '星巴克' }, targetItems: ['可可碎片星冰樂'] },
]);
assert.strictEqual(test5.length, 0);
console.log('✅ PASS: 不同品項與名稱未誤判');

console.log('--- 測試 6: 不同店家不應歸組 ---');
const test6 = findDuplicateDeals([
  { id: '1', title: '特大杯那堤買一送一', merchant: { name: '星巴克' }, targetItems: ['特大杯那堤'] },
  { id: '2', title: '特大杯那堤買一送一', merchant: { name: '7-ELEVEN' }, targetItems: ['特大杯那堤'] },
]);
assert.strictEqual(test6.length, 0);
console.log('✅ PASS: 不同通路不跨店歸組');

console.log('--- 測試 7: 全部保留 (不再提示) 機制 ---');
const dismissedSet = new Set(['1::2']);
const test7 = findDuplicateDeals([
  { id: '1', title: '星巴克特大杯那堤買一送一', merchant: { name: '星巴克' }, targetItems: [] },
  { id: '2', title: '星巴克特大杯那堤買一送一', merchant: { name: '星巴克' }, targetItems: [] },
], dismissedSet);
assert.strictEqual(test7.length, 0);
console.log('✅ PASS: 已選擇「全部保留」之重複情報不再提示比對');

console.log('--- 測試 8: 新的一樣情報抵達時，重新觸發比對 ---');
const test8 = findDuplicateDeals([
  { id: '1', title: '星巴克特大杯那堤買一送一', merchant: { name: '星巴克' }, targetItems: [] },
  { id: '2', title: '星巴克特大杯那堤買一送一', merchant: { name: '星巴克' }, targetItems: [] },
  { id: '3', title: '星巴克特大杯那堤買一送一', merchant: { name: '星巴克' }, targetItems: [] },
], dismissedSet);
assert.strictEqual(test8.length, 1);
assert.strictEqual(test8[0].deals.length, 3);
console.log('✅ PASS: 抵達新一樣情報 (Deal 3) 時，精確重新觸發重複比對');

console.log('🎉 所有 8 大測試案例 100% 成功通過！');

