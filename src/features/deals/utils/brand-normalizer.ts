import { BrandMappingEntry } from '../types/brand-dictionary.types';

export const TAIWAN_CHAIN_BRANDS: BrandMappingEntry[] = [
  // =================== 1. 超商與便利商店 (Convenience Stores) ===================
  {
    standardName: '全家',
    standardTag: '#全家',
    aliases: [
      '全家',
      'familymart',
      'family mart',
      '全家便利商店',
      '全家familymart',
      '全家 family mart',
      '全家便利店',
      '全家famiport',
      'famiport',
      'letscafe',
      "let's cafe",
      "let's café",
    ],
    category: 'food',
  },
  {
    standardName: '7-11',
    standardTag: '#7-11',
    aliases: [
      '7-11',
      '7-eleven',
      '7 eleven',
      '711',
      '統一超商',
      '7-11便利商店',
      '7-eleven便利商店',
      'city cafe',
      'cityprima',
      'city prima',
      'openpoint',
    ],
    category: 'food',
  },
  {
    standardName: '萊爾富',
    standardTag: '#萊爾富',
    aliases: [
      '萊爾富',
      'hi-life',
      'hilife',
      'hi life',
      '萊爾富hi-life',
      '萊爾富 hi-life',
      '萊爾富便利商店',
      'hicafe',
      'hi cafe',
    ],
    category: 'food',
  },
  {
    standardName: 'OK超商',
    standardTag: '#OK超商',
    aliases: [
      'ok超商',
      'okmart',
      'ok mart',
      'ok-mart',
      'ok·mart',
      'ok便利商店',
      'okcafe',
      'ok cafe',
    ],
    category: 'food',
  },
  {
    standardName: '美廉社',
    standardTag: '#美廉社',
    aliases: ['美廉社', 'simple mart', 'simplemart', '美廉社 simple mart'],
    category: 'grocery',
  },

  // =================== 2. 超市與量販賣場 (Supermarkets & Hypermarkets) ===================
  {
    standardName: '萬家福',
    standardTag: '#萬家福',
    aliases: [
      '萬家福',
      '家樂福',
      'carrefour',
      'carrefour taiwan',
      '家樂福 carrefour taiwan',
      '家樂福 carrefour',
      '家樂福量販',
      '家樂福超市',
      '家樂福線上購物',
    ],
    category: 'grocery',
  },
  {
    standardName: '全聯',
    standardTag: '#全聯',
    aliases: [
      '全聯',
      '全聯福利中心',
      'px mart',
      'pxmart',
      'px-mart',
      '全聯pxmart',
      '全支付',
      '全聯線上購',
    ],
    category: 'grocery',
  },
  {
    standardName: '好市多',
    standardTag: '#好市多',
    aliases: [
      '好市多',
      'costco',
      'costco 好市多',
      '好市多特價情報',
      'costco wholesale',
      'costco好市多',
      'kirkland',
    ],
    category: 'grocery',
  },
  {
    standardName: '大潤發',
    standardTag: '#大潤發',
    aliases: ['大潤發', 'rt-mart', 'rt mart', 'rtmart', '大潤發 rt-mart'],
    category: 'grocery',
  },
  {
    standardName: '愛買',
    standardTag: '#愛買',
    aliases: ['愛買', 'a.mart', 'amart', 'a mart', '愛買 a.mart', '遠東愛買'],
    category: 'grocery',
  },
  {
    standardName: '小北百貨',
    standardTag: '#小北百貨',
    aliases: ['小北百貨', 'showba', '小北', 'showba 小北百貨'],
    category: 'grocery',
  },
  {
    standardName: 'IKEA',
    standardTag: '#IKEA',
    aliases: ['ikea', '宜家家居', 'ikea taiwan', '宜家'],
    category: 'grocery',
  },
  {
    standardName: 'DONKI',
    standardTag: '#DONKI',
    aliases: ['donki', 'don don donki', 'dondondonki', '唐吉訶德', '唐吉軻德', '驚安殿堂'],
    category: 'grocery',
  },
  {
    standardName: '特力屋',
    standardTag: '#特力屋',
    aliases: ['特力屋', 'b&q', '特力屋 b&q', 'bnq'],
    category: 'grocery',
  },

  // =================== 3. 百貨公司與購物中心 (Department Stores & Malls) ===================
  {
    standardName: '新光三越',
    standardTag: '#新光三越',
    aliases: ['新光三越', 'shin kong mitsukoshi', 'skm', '新光三越百貨'],
    category: 'fashion',
  },
  {
    standardName: '遠東SOGO',
    standardTag: '#遠東SOGO',
    aliases: ['遠東sogo', 'sogo', '太平洋sogo', 'sogo百貨', '遠東 sogo'],
    category: 'fashion',
  },
  {
    standardName: '遠東百貨',
    standardTag: '#遠東百貨',
    aliases: ['遠東百貨', '遠百', 'far eastern', '大遠百', '遠東大遠百'],
    category: 'fashion',
  },
  {
    standardName: '微風',
    standardTag: '#微風',
    aliases: ['微風', 'breeze', '微風廣場', '微風信義', '微風南山', '微風台北車站'],
    category: 'fashion',
  },
  {
    standardName: '誠品',
    standardTag: '#誠品',
    aliases: ['誠品', '誠品生活', 'eslite', '誠品書店', 'eslite spectrum'],
    category: 'fashion',
  },
  {
    standardName: '漢神',
    standardTag: '#漢神',
    aliases: ['漢神', '漢神巨蛋', '漢神百貨', 'hanshin'],
    category: 'fashion',
  },
  {
    standardName: '台北101',
    standardTag: '#台北101',
    aliases: ['台北101', 'taipei 101', 'taipei101', '101購物中心'],
    category: 'fashion',
  },
  {
    standardName: '京站',
    standardTag: '#京站',
    aliases: ['京站', '京站時尚廣場', 'qsquare', 'q square'],
    category: 'fashion',
  },
  {
    standardName: '三井Outlet',
    standardTag: '#三井Outlet',
    aliases: [
      '三井outlet',
      'mitsui outlet park',
      'mitsui outlet',
      '三井lalaport',
      'lalaport',
      '三井奧特萊斯',
    ],
    category: 'fashion',
  },
  {
    standardName: '華泰名品城',
    standardTag: '#華泰名品城',
    aliases: ['華泰名品城', 'gloria outlets', 'gloriaoutlets', '華泰名品'],
    category: 'fashion',
  },

  // =================== 4. 連鎖速食與披薩 (Fast Food & Pizza) ===================
  {
    standardName: '麥當勞',
    standardTag: '#麥當勞',
    aliases: ['麥當勞', "mcdonald's", 'mcdonalds', "麥當勞 mcdonald's", 'mcd'],
    category: 'food',
  },
  {
    standardName: '肯德基',
    standardTag: '#肯德基',
    aliases: ['肯德基', 'kfc', '肯德基 kfc', '肯德基炸雞'],
    category: 'food',
  },
  {
    standardName: '摩斯漢堡',
    standardTag: '#摩斯漢堡',
    aliases: ['摩斯漢堡', 'mos burger', 'mos', '摩斯', 'mosburger'],
    category: 'food',
  },
  {
    standardName: '漢堡王',
    standardTag: '#漢堡王',
    aliases: ['漢堡王', 'burger king', 'burgerking', '漢堡王 burger king'],
    category: 'food',
  },
  {
    standardName: '必勝客',
    standardTag: '#必勝客',
    aliases: ['必勝客', 'pizza hut', 'pizzahut', '必勝客 pizza hut'],
    category: 'food',
  },
  {
    standardName: '達美樂',
    standardTag: '#達美樂',
    aliases: ["domino's pizza", 'dominos pizza', 'dominos', '達美樂', '達美樂披薩'],
    category: 'food',
  },
  {
    standardName: '拿坡里',
    standardTag: '#拿坡里',
    aliases: ['拿坡里', 'napoli', '拿坡里披薩·炸雞', '拿坡里披薩', '拿坡里炸雞'],
    category: 'food',
  },
  {
    standardName: '頂呱呱',
    standardTag: '#頂呱呱',
    aliases: ['頂呱呱', 'tkk', '頂呱呱 tkk', '頂呱呱 tkk taiwan'],
    category: 'food',
  },
  {
    standardName: 'Subway',
    standardTag: '#Subway',
    aliases: ['subway', '賽百味', 'subway taiwan', '潛艇堡'],
    category: 'food',
  },
  {
    standardName: '胖老爹',
    standardTag: '#胖老爹',
    aliases: ['胖老爹', '胖老爹美式炸雞'],
    category: 'food',
  },
  {
    standardName: '丹丹漢堡',
    standardTag: '#丹丹漢堡',
    aliases: ['丹丹漢堡', '丹丹'],
    category: 'food',
  },

  // =================== 5. 連鎖餐飲與鍋物壽司 (Restaurants & Hotpot) ===================
  {
    standardName: '爭鮮',
    standardTag: '#爭鮮',
    aliases: ['爭鮮', '爭鮮迴轉壽司', 'sushi express', 'sushiexpress', '爭鮮plus', '爭鮮gogo'],
    category: 'food',
  },
  {
    standardName: '壽司郎',
    standardTag: '#壽司郎',
    aliases: ['壽司郎', 'sushiro', '壽司郎 sushiro taiwan', '壽司郎sushiro'],
    category: 'food',
  },
  {
    standardName: '藏壽司',
    standardTag: '#藏壽司',
    aliases: ['藏壽司', 'kura sushi', 'kurasushi', '藏壽司 kura sushi'],
    category: 'food',
  },
  {
    standardName: '王品',
    standardTag: '#王品',
    aliases: ['王品', '王品集團', '王品瘋美食', '王品牛排', 'wowprime'],
    category: 'food',
  },
  {
    standardName: '石二鍋',
    standardTag: '#石二鍋',
    aliases: ['石二鍋', '王品石二鍋', '12hotpot'],
    category: 'food',
  },
  {
    standardName: '肉次方',
    standardTag: '#肉次方',
    aliases: ['肉次方', '燒肉肉次方'],
    category: 'food',
  },
  {
    standardName: '夏慕尼',
    standardTag: '#夏慕尼',
    aliases: ['夏慕尼', '夏慕尼新香榭鐵板燒', '夏慕尼鐵板燒'],
    category: 'food',
  },
  {
    standardName: '西堤',
    standardTag: '#西堤',
    aliases: ['西堤', '西堤牛排', 'tasty', 'tasty西堤牛排'],
    category: 'food',
  },
  {
    standardName: '陶板屋',
    standardTag: '#陶板屋',
    aliases: ['陶板屋', '陶板屋和風創作料理'],
    category: 'food',
  },
  {
    standardName: '瓦城',
    standardTag: '#瓦城',
    aliases: ['瓦城', '瓦城泰國料理', 'thai town', 'thaitown'],
    category: 'food',
  },
  {
    standardName: '八方雲集',
    standardTag: '#八方雲集',
    aliases: ['八方雲集', '八方', '8way'],
    category: 'food',
  },
  {
    standardName: '梁社漢',
    standardTag: '#梁社漢',
    aliases: ['梁社漢', '梁社漢排骨'],
    category: 'food',
  },
  {
    standardName: '三商巧福',
    standardTag: '#三商巧福',
    aliases: ['三商巧福', '3sfans', '3s fans', '三商牛肉麵'],
    category: 'food',
  },
  {
    standardName: '六扇門',
    standardTag: '#六扇門',
    aliases: ['六扇門', '六扇門時尚湯鍋', '六扇門平價小火鍋'],
    category: 'food',
  },
  {
    standardName: '築間',
    standardTag: '#築間',
    aliases: ['築間', '築間幸福鍋物', '築間鍋物'],
    category: 'food',
  },
  {
    standardName: '馬辣',
    standardTag: '#馬辣',
    aliases: ['馬辣', '新馬辣', '馬辣頂級麻辣鴛鴦火鍋', '新馬辣經典麻辣鍋'],
    category: 'food',
  },
  {
    standardName: '海底撈',
    standardTag: '#海底撈',
    aliases: ['海底撈', '海底撈火鍋', 'haidilao'],
    category: 'food',
  },
  {
    standardName: '乾杯',
    standardTag: '#乾杯',
    aliases: ['乾杯', '老乾杯', '乾杯燒肉居酒屋', '乾杯集團'],
    category: 'food',
  },
  {
    standardName: '鼎泰豐',
    standardTag: '#鼎泰豐',
    aliases: ['鼎泰豐', 'din tai fung', 'dintaifung'],
    category: 'food',
  },
  {
    standardName: '添好運',
    standardTag: '#添好運',
    aliases: ['添好運', 'timhowan', 'tim ho wan'],
    category: 'food',
  },

  // =================== 6. 連鎖咖啡與手搖茶飲 (Cafes & Drinks) ===================
  {
    standardName: '星巴克',
    standardTag: '#星巴克',
    aliases: ['星巴克', 'starbucks', '星巴克 starbucks', '星巴克隨行卡', '星禮程'],
    category: 'food',
  },
  {
    standardName: '路易莎',
    standardTag: '#路易莎',
    aliases: ['路易莎', 'louisa coffee', 'louisacoffee', '路易莎咖啡', '路易莎咖啡 louisa coffee', 'louisa'],
    category: 'food',
  },
  {
    standardName: 'cama',
    standardTag: '#cama',
    aliases: ['cama', 'cama café', 'cama cafe', 'camacafe', '咖碼', '咖碼咖啡'],
    category: 'food',
  },
  {
    standardName: '85度C',
    standardTag: '#85度C',
    aliases: ['85度c', '85°c', '85c', '85度c咖啡蛋糕烘焙專賣店'],
    category: 'food',
  },
  {
    standardName: '50嵐',
    standardTag: '#50嵐',
    aliases: ['50嵐', '五十嵐', '50lan', '50 lan'],
    category: 'food',
  },
  {
    standardName: '迷客夏',
    standardTag: '#迷客夏',
    aliases: ['迷客夏', 'milksha', '迷客夏 milksha'],
    category: 'food',
  },
  {
    standardName: '麻古茶坊',
    standardTag: '#麻古茶坊',
    aliases: ['麻古茶坊', 'macu', '麻古', '麻古茶坊 macu'],
    category: 'food',
  },
  {
    standardName: '可不可',
    standardTag: '#可不可',
    aliases: ['可不可', 'kebuke', '可不可熟成紅茶', '可不可熟成紅茶 kebuke'],
    category: 'food',
  },
  {
    standardName: '清心福全',
    standardTag: '#清心福全',
    aliases: ['清心福全', '清心', 'chingshin', 'ching shin'],
    category: 'food',
  },
  {
    standardName: '五桐號',
    standardTag: '#五桐號',
    aliases: ['五桐號', 'wootea', 'woo tea', '五桐', '五桐號 wootea'],
    category: 'food',
  },
  {
    standardName: '得正',
    standardTag: '#得正',
    aliases: ['得正', 'dejeng', 'oolong tea project', '得正 oolong tea', '得正dejeng'],
    category: 'food',
  },
  {
    standardName: '萬波',
    standardTag: '#萬波',
    aliases: ['萬波', 'wanpo', '萬波島嶼紅茶', '萬波 tea shop'],
    category: 'food',
  },
  {
    standardName: '珍煮丹',
    standardTag: '#珍煮丹',
    aliases: ['珍煮丹', 'truedan', 'true dan'],
    category: 'food',
  },
  {
    standardName: '大苑子',
    standardTag: '#大苑子',
    aliases: ['大苑子', 'dayungs', 'da yungs'],
    category: 'food',
  },
  {
    standardName: '龜記',
    standardTag: '#龜記',
    aliases: ['龜記', 'guiji', 'gui ji', '龜記茗品'],
    category: 'food',
  },
  {
    standardName: '先喝道',
    standardTag: '#先喝道',
    aliases: ['先喝道', 'taotaotea', 'tao tao tea'],
    category: 'food',
  },
  {
    standardName: '一沐日',
    standardTag: '#一沐日',
    aliases: ['一沐日', 'anmuday'],
    category: 'food',
  },
  {
    standardName: '鶴茶樓',
    standardTag: '#鶴茶樓',
    aliases: ['鶴茶樓', 'hechalou', 'he cha lou'],
    category: 'food',
  },
  {
    standardName: '茶湯會',
    standardTag: '#茶湯會',
    aliases: ['茶湯會', 'tp tea', 'tptea'],
    category: 'food',
  },
  {
    standardName: '再睡5分鐘',
    standardTag: '#再睡5分鐘',
    aliases: ['再睡5分鐘', '再睡五分鐘', 'nap tea', 'naptea'],
    category: 'food',
  },

  // =================== 7. 藥妝百貨、甜點與 3C (Beauty, Desserts & Tech) ===================
  {
    standardName: '屈臣氏',
    standardTag: '#屈臣氏',
    aliases: ['屈臣氏', 'watsons', '屈臣氏 watsons'],
    category: 'grocery',
  },
  {
    standardName: '康是美',
    standardTag: '#康是美',
    aliases: ['康是美', 'cosmed', '康是美 cosmed'],
    category: 'grocery',
  },
  {
    standardName: '寶雅',
    standardTag: '#寶雅',
    aliases: ['寶雅', 'poya', '寶雅 poya', '寶家', 'poya home'],
    category: 'fashion',
  },
  {
    standardName: '無印良品',
    standardTag: '#無印良品',
    aliases: ['無印良品', 'muji', 'muji taiwan', '無印良品 muji taiwan', '無印'],
    category: 'fashion',
  },
  {
    standardName: 'UNIQLO',
    standardTag: '#UNIQLO',
    aliases: ['uniqlo', '優衣庫', 'uniqlo taiwan'],
    category: 'fashion',
  },
  {
    standardName: 'GU',
    standardTag: '#GU',
    aliases: ['gu', 'gu taiwan', 'gu_taiwan'],
    category: 'fashion',
  },
  {
    standardName: '燦坤',
    standardTag: '#燦坤',
    aliases: ['燦坤', '燦坤 3c', '燦坤3c', 'tkec'],
    category: 'tech',
  },
  {
    standardName: '全國電子',
    standardTag: '#全國電子',
    aliases: ['全國電子', 'elifemall', 'elife mall'],
    category: 'tech',
  },
  {
    standardName: 'Mister Donut',
    standardTag: '#MisterDonut',
    aliases: ['mister donut', 'misterdonut', '統一多拿滋', 'mister donut 統一多拿滋', '多拿滋'],
    category: 'food',
  },
  {
    standardName: '酷聖石',
    standardTag: '#酷聖石',
    aliases: ['酷聖石', 'cold stone', 'coldstone', '酷聖石冰淇淋', 'cold stone 酷聖石冰淇淋'],
    category: 'food',
  },
  {
    standardName: '哈根達斯',
    standardTag: '#哈根達斯',
    aliases: ['哈根達斯', 'häagen-dazs', 'haagen-dazs', 'haagendazs', 'häagendazs'],
    category: 'food',
  },
  {
    standardName: '義美',
    standardTag: '#義美',
    aliases: ['義美', '義美食品', 'i-mei', 'imei', 'i mei'],
    category: 'food',
  },
];

/**
 * 建立快取索引表加速比對 (Clean text -> BrandMappingEntry)
 */
const BRAND_LOOKUP_MAP = new Map<string, BrandMappingEntry>();

// 初始化映射字典
for (const entry of TAIWAN_CHAIN_BRANDS) {
  BRAND_LOOKUP_MAP.set(entry.standardName.toLowerCase(), entry);
  BRAND_LOOKUP_MAP.set(entry.standardTag.toLowerCase(), entry);
  BRAND_LOOKUP_MAP.set(entry.standardTag.replace(/^#/, '').toLowerCase(), entry);

  for (const alias of entry.aliases) {
    const cleanAlias = alias.trim().toLowerCase();
    BRAND_LOOKUP_MAP.set(cleanAlias, entry);
    BRAND_LOOKUP_MAP.set(`#${cleanAlias}`, entry);
  }
}

/**
 * 尋找相符的品牌定義
 */
export function findBrandEntry(input?: string | null): BrandMappingEntry | undefined {
  if (!input) return undefined;
  const clean = input.trim().toLowerCase();
  const withoutHash = clean.replace(/^#/, '');

  // 1. 精準匹配 (含 alias)
  if (BRAND_LOOKUP_MAP.has(clean)) return BRAND_LOOKUP_MAP.get(clean);
  if (BRAND_LOOKUP_MAP.has(withoutHash)) return BRAND_LOOKUP_MAP.get(withoutHash);

  // 2. 包含字樣匹配 (從長字串先比對，避免短字串誤殺)
  // 特別處理家樂福/萬家福
  if (clean.includes('家樂福') || clean.includes('carrefour') || clean.includes('萬家福')) {
    return BRAND_LOOKUP_MAP.get('萬家福');
  }

  // 逐一檢查 aliases
  for (const entry of TAIWAN_CHAIN_BRANDS) {
    for (const alias of entry.aliases) {
      if (alias.length >= 2 && (clean === alias || clean.startsWith(alias) || clean.endsWith(alias) || clean.includes(alias))) {
        return entry;
      }
    }
  }

  return undefined;
}

/**
 * 自動將店家/品牌名稱正規化為最簡短之標準品牌名
 * 例如: "全家 FamilyMart" -> "全家", "家樂福 Carrefour" -> "萬家福", "7-ELEVEN" -> "7-11"
 */
export function normalizeBrandName(rawName?: string | null, fallbackDefault: string = '合作店家'): string {
  if (!rawName || !rawName.trim()) return fallbackDefault;
  const entry = findBrandEntry(rawName);
  if (entry) return entry.standardName;
  return rawName.trim();
}

/**
 * 自動將單一標籤正規化為標準精簡 Tag
 * 例如: "#全家便利商店" -> "#全家", "#familyMart" -> "#全家", "#Carrefour" -> "#萬家福"
 */
export function normalizeBrandTag(rawTag?: string | null): string {
  if (!rawTag || !rawTag.trim()) return '';
  const clean = rawTag.trim();
  const entry = findBrandEntry(clean);
  if (entry) return entry.standardTag;
  return clean.startsWith('#') ? clean : `#${clean}`;
}

/**
 * 自動清洗並收斂整個標籤清單 (Tags Array)
 * 1. 自動補齊 '#' 前綴
 * 2. 轉換所有品牌標籤為最短標準型態 (如 #全家, #7-11, #萬家福)
 * 3. 若已存在標準品牌標籤，自動過濾掉其冗贅的同義英文/別名標籤
 * 4. 保留促銷機制（#買一送一）與品類標籤（#咖啡、#霜淇淋）
 * 5. 去除重複項
 */
export function normalizeTags(rawTags?: (string | null | undefined)[], merchantName?: string): string[] {
  if (!rawTags || !Array.isArray(rawTags) || rawTags.length === 0) {
    if (merchantName) {
      const entry = findBrandEntry(merchantName);
      return entry ? [entry.standardTag] : [`#${merchantName.trim()}`];
    }
    return [];
  }

  const resultTags: string[] = [];
  const recognizedBrands = new Set<string>();

  // 若提供了店家名稱，優先登記該品牌標準標籤
  if (merchantName) {
    const merchantBrand = findBrandEntry(merchantName);
    if (merchantBrand) {
      recognizedBrands.add(merchantBrand.standardName);
      resultTags.push(merchantBrand.standardTag);
    }
  }

  for (const raw of rawTags) {
    if (!raw || typeof raw !== 'string' || !raw.trim()) continue;
    const clean = raw.trim();

    const brandEntry = findBrandEntry(clean);
    if (brandEntry) {
      recognizedBrands.add(brandEntry.standardName);
      if (!resultTags.includes(brandEntry.standardTag)) {
        resultTags.push(brandEntry.standardTag);
      }
    } else {
      // 一般非品牌標籤（如 #買一送一, #第二件5折, #咖啡, #霜淇淋）
      const formattedTag = clean.startsWith('#') ? clean : `#${clean}`;
      if (formattedTag.length > 1 && !resultTags.includes(formattedTag)) {
        resultTags.push(formattedTag);
      }
    }
  }

  // 二次清理：過濾掉含有已被識別品牌之冗長英文/別名次級標籤
  // 例如已有 #全家，則移除 #FamilyMart, #全家便利商店, #全家FamilyMart 等冗贅標籤
  const finalTags = resultTags.filter((tag) => {
    const brandEntry = findBrandEntry(tag);
    if (brandEntry) {
      // 若是品牌標籤，必須嚴格等於標準標籤才保留
      return tag === brandEntry.standardTag;
    }
    return true;
  });

  return Array.from(new Set(finalTags));
}
