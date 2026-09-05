import { PrismaClient } from '@prisma/client';
import { normalizeBrandName, normalizeTags } from '../src/features/deals/utils/brand-normalizer';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 開始執行：優惠卡片一拆多獨立解析與全站標籤標準化清洗...');

  // 1. 尋找並拆解美廉社 5 圖合一促銷卡片
  const targetMergedId = 'crawled-simplemart-e7be8ee5bb89e7a4';
  const mergedDeal = await prisma.deal.findUnique({
    where: { id: targetMergedId },
  });

  const logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Simple_Mart_Logo.svg/1200px-Simple_Mart_Logo.svg.png';
  const sourceUrl = mergedDeal?.sourceUrl || 'https://www.facebook.com/simplemart1';

  const splitDeals = [
    {
      id: 'deal-simplemart-weekend-01-pomelo',
      title: '美廉社 麻豆文旦 450g 2入59元',
      subtitle: '麻豆文旦 450g，原價 39 元/入，2入特價 59 元（APP隨買隨取·巷口3天限定）',
      category: 'grocery',
      channelType: 'offline',
      merchantName: '美廉社',
      merchantLogo: logoUrl,
      regions: ['全台門市'],
      originalPrice: 39,
      discountPrice: 30,
      priceUnit: '入',
      targetItems: ['麻豆文旦 450g'],
      conditions: ['2入59元', 'APP隨買隨取限定', '巷口3天限定'],
      eligibleCards: ['LINE Pay (3%)', '台灣Pay', '全支付'],
      tags: normalizeTags(['#美廉社', '#麻豆文旦', '#文旦', '#水果', '#特價'], '美廉社'),
      startDate: '2026-09-04',
      endDate: '2026-09-06',
      isHot: false,
      isFlashDeal: true,
      source: 'social_listening',
      sourcePlatform: 'Facebook',
      sourceUrl,
      imageUrl: 'https://scontent-lhr11-1.xx.fbcdn.net/v/t39.99422-6/793161564_1595569488877476_1110850674738370083_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_ohc=33-_PwUQmQMQ7kNvwHeWL12&_nc_oc=AdpkuNnOYbUINvrD8Be4gQ697BaUCDTtiYhul4fi4xkZxpMLWw0Yx0-ArKP8PZ0V6k8&_nc_zt=14&_nc_ht=scontent-lhr11-1.xx&_nc_gid=eMZfxCUcuGpBNc7jhzGscA&_nc_ss=7b289&oh=00_AQJfLmwZke8hUIPEZUpwX3BjdM48y6NxbFQtSGWu7CIBuQ&oe=6AA03368',
      images: ['https://scontent-lhr11-1.xx.fbcdn.net/v/t39.99422-6/793161564_1595569488877476_1110850674738370083_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_ohc=33-_PwUQmQMQ7kNvwHeWL12&_nc_oc=AdpkuNnOYbUINvrD8Be4gQ697BaUCDTtiYhul4fi4xkZxpMLWw0Yx0-ArKP8PZ0V6k8&_nc_zt=14&_nc_ht=scontent-lhr11-1.xx&_nc_gid=eMZfxCUcuGpBNc7jhzGscA&_nc_ss=7b289&oh=00_AQJfLmwZke8hUIPEZUpwX3BjdM48y6NxbFQtSGWu7CIBuQ&oe=6AA03368'],
    },
    {
      id: 'deal-simplemart-weekend-02-icepop',
      title: '美廉社 杜老爺 柚香蜜檸脆冰棒 買1送1',
      subtitle: '杜老爺柚香蜜檸脆冰棒 75g*4支，同商品買1送1（APP隨買隨取·巷口3天限定）',
      category: 'food',
      channelType: 'offline',
      merchantName: '美廉社',
      merchantLogo: logoUrl,
      regions: ['全台門市'],
      originalPrice: 140,
      discountPrice: 70,
      priceUnit: '盒',
      targetItems: ['杜老爺 柚香蜜檸脆冰棒 75g*4支'],
      conditions: ['同商品買1送1', 'APP隨買隨取限定', '巷口3天限定'],
      eligibleCards: ['LINE Pay (3%)', '台灣Pay', '全支付'],
      tags: normalizeTags(['#美廉社', '#杜老爺', '#冰品', '#買一送一'], '美廉社'),
      startDate: '2026-09-04',
      endDate: '2026-09-06',
      isHot: true,
      isFlashDeal: true,
      source: 'social_listening',
      sourcePlatform: 'Facebook',
      sourceUrl,
      imageUrl: 'https://scontent-lhr6-2.xx.fbcdn.net/v/t39.99422-6/793478596_1090035890130853_7926124502932025901_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=e3GwCg6JdiAQ7kNvwFfaUmv&_nc_oc=AdrsdECJ6GgzqtNOcnRH1fOd5xpGWh0Lo5PuMVdMPOdm5SreYIRdskZnZ8dYhlGH2Wg&_nc_zt=14&_nc_ht=scontent-lhr6-2.xx&_nc_gid=eMZfxCUcuGpBNc7jhzGscA&_nc_ss=7b289&oh=00_AQJGvXtVodvnOjZCNmFvkAb7J7lN5E46QR7UYlMAa9y9Eg&oe=6AA028A3',
      images: ['https://scontent-lhr6-2.xx.fbcdn.net/v/t39.99422-6/793478596_1090035890130853_7926124502932025901_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=e3GwCg6JdiAQ7kNvwFfaUmv&_nc_oc=AdrsdECJ6GgzqtNOcnRH1fOd5xpGWh0Lo5PuMVdMPOdm5SreYIRdskZnZ8dYhlGH2Wg&_nc_zt=14&_nc_ht=scontent-lhr6-2.xx&_nc_gid=eMZfxCUcuGpBNc7jhzGscA&_nc_ss=7b289&oh=00_AQJGvXtVodvnOjZCNmFvkAb7J7lN5E46QR7UYlMAa9y9Eg&oe=6AA028A3'],
    },
    {
      id: 'deal-simplemart-weekend-03-kimbap',
      title: '美廉社 韓國SAJO冷凍飯捲 買1送1',
      subtitle: '韓國SAJO冷凍飯捲（鮪魚/香菇蔬菜）230g-240g，買1送1（APP隨買隨取·巷口3天限定）',
      category: 'food',
      channelType: 'offline',
      merchantName: '美廉社',
      merchantLogo: logoUrl,
      regions: ['全台門市'],
      originalPrice: 135,
      discountPrice: 68,
      priceUnit: '包',
      targetItems: ['韓國SAJO冷凍飯捲 (鮪魚/香菇蔬菜)'],
      conditions: ['同商品買1送1', 'APP隨買隨取限定', '巷口3天限定'],
      eligibleCards: ['LINE Pay (3%)', '台灣Pay', '全支付'],
      tags: normalizeTags(['#美廉社', '#SAJO', '#冷凍飯捲', '#買一送一'], '美廉社'),
      startDate: '2026-09-04',
      endDate: '2026-09-06',
      isHot: true,
      isFlashDeal: true,
      source: 'social_listening',
      sourcePlatform: 'Facebook',
      sourceUrl,
      imageUrl: 'https://scontent-lhr6-1.xx.fbcdn.net/v/t39.99422-6/793903248_1547065589939484_4666923242318182161_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=8bX3ouuguOYQ7kNvwEgKKUv&_nc_oc=AdoSUOswLQoWcVOiloo6Y1Cejq8kLG-1UDkJ5yZYDVlZtprBitTfN0_WUia3mIuNXVg&_nc_zt=14&_nc_ht=scontent-lhr6-1.xx&_nc_gid=eMZfxCUcuGpBNc7jhzGscA&_nc_ss=7b289&oh=00_AQLkLBwh8Yuc-HgfrOZga8mPUn9bROGPba_SwUJleergeg&oe=6AA008E8',
      images: ['https://scontent-lhr6-1.xx.fbcdn.net/v/t39.99422-6/793903248_1547065589939484_4666923242318182161_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=8bX3ouuguOYQ7kNvwEgKKUv&_nc_oc=AdoSUOswLQoWcVOiloo6Y1Cejq8kLG-1UDkJ5yZYDVlZtprBitTfN0_WUia3mIuNXVg&_nc_zt=14&_nc_ht=scontent-lhr6-1.xx&_nc_gid=eMZfxCUcuGpBNc7jhzGscA&_nc_ss=7b289&oh=00_AQLkLBwh8Yuc-HgfrOZga8mPUn9bROGPba_SwUJleergeg&oe=6AA008E8'],
    },
    {
      id: 'deal-simplemart-weekend-04-juice',
      title: '美廉社 農搾 百香檸檬/檸檬飲/芭樂綜合 任2瓶96元',
      subtitle: '農搾系列 900ml，原價 64 元/瓶，任2瓶 96 元（APP隨買隨取·巷口3天限定）',
      category: 'food',
      channelType: 'offline',
      merchantName: '美廉社',
      merchantLogo: logoUrl,
      regions: ['全台門市'],
      originalPrice: 64,
      discountPrice: 48,
      priceUnit: '瓶',
      targetItems: ['農搾 900ml (百香檸檬/檸檬飲/美莓雷夢/芭樂綜合)'],
      conditions: ['任2瓶96元', 'APP隨買隨取限定', '巷口3天限定'],
      eligibleCards: ['LINE Pay (3%)', '台灣Pay', '全支付'],
      tags: normalizeTags(['#美廉社', '#農搾', '#飲品', '#果汁', '#任選優惠'], '美廉社'),
      startDate: '2026-09-04',
      endDate: '2026-09-06',
      isHot: false,
      isFlashDeal: true,
      source: 'social_listening',
      sourcePlatform: 'Facebook',
      sourceUrl,
      imageUrl: 'https://scontent-lhr11-1.xx.fbcdn.net/v/t39.99422-6/793497784_4279529125632612_9016323868256643628_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_ohc=WSVzJGkHVrIQ7kNvwFmpjao&_nc_oc=Adq_wREyvZZu64L-y7NygBLdWxN8F4zmod299eLK98WJ8Utfy3gibfzh2B9nGTnAaBQ&_nc_zt=14&_nc_ht=scontent-lhr11-1.xx&_nc_gid=eMZfxCUcuGpBNc7jhzGscA&_nc_ss=7b289&oh=00_AQLA6YXMpn8WhKBFxOM1rVtdz31k2ScfnWtF41acbUUlVw&oe=6AA0033B',
      images: ['https://scontent-lhr11-1.xx.fbcdn.net/v/t39.99422-6/793497784_4279529125632612_9016323868256643628_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_ohc=WSVzJGkHVrIQ7kNvwFmpjao&_nc_oc=Adq_wREyvZZu64L-y7NygBLdWxN8F4zmod299eLK98WJ8Utfy3gibfzh2B9nGTnAaBQ&_nc_zt=14&_nc_ht=scontent-lhr11-1.xx&_nc_gid=eMZfxCUcuGpBNc7jhzGscA&_nc_ss=7b289&oh=00_AQLA6YXMpn8WhKBFxOM1rVtdz31k2ScfnWtF41acbUUlVw&oe=6AA0033B'],
    },
    {
      id: 'deal-simplemart-weekend-05-milk',
      title: '美廉社 林鳳營 全脂鮮乳 1857ml 特價159元',
      subtitle: '林鳳營全脂鮮乳 1857ml，原價 194 元/瓶，特價 159 元（APP隨買隨取·巷口3天限定）',
      category: 'grocery',
      channelType: 'offline',
      merchantName: '美廉社',
      merchantLogo: logoUrl,
      regions: ['全台門市'],
      originalPrice: 194,
      discountPrice: 159,
      priceUnit: '瓶',
      targetItems: ['林鳳營 全脂鮮乳 1857ml'],
      conditions: ['特價優惠', 'APP隨買隨取限定', '巷口3天限定'],
      eligibleCards: ['LINE Pay (3%)', '台灣Pay', '全支付'],
      tags: normalizeTags(['#美廉社', '#林鳳營', '#鮮乳', '#特價'], '美廉社'),
      startDate: '2026-09-04',
      endDate: '2026-09-06',
      isHot: true,
      isFlashDeal: true,
      source: 'social_listening',
      sourcePlatform: 'Facebook',
      sourceUrl,
      imageUrl: 'https://scontent-lhr11-1.xx.fbcdn.net/v/t39.99422-6/793071351_2399148000494655_1318544129733006565_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_ohc=_9dchp4ixY0Q7kNvwFgCqeR&_nc_oc=AdrTMq4o_gDj_79vpUur1PqWvaEMSq8lyvsqu-BqNnElpRAF7bhkVq5oR4R5mw0x6Ow&_nc_zt=14&_nc_ht=scontent-lhr11-1.xx&_nc_gid=eMZfxCUcuGpBNc7jhzGscA&_nc_ss=7b289&oh=00_AQIuaVjQRIq8xvAOGgJygkVzsAur1KmUflqgcnvdtMZy6w&oe=6AA012F0',
      images: ['https://scontent-lhr11-1.xx.fbcdn.net/v/t39.99422-6/793071351_2399148000494655_1318544129733006565_n.png?stp=dst-jpg_tt6&cstp=mx1080x1080&ctp=s1080x1080&_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_ohc=_9dchp4ixY0Q7kNvwFgCqeR&_nc_oc=AdrTMq4o_gDj_79vpUur1PqWvaEMSq8lyvsqu-BqNnElpRAF7bhkVq5oR4R5mw0x6Ow&_nc_zt=14&_nc_ht=scontent-lhr11-1.xx&_nc_gid=eMZfxCUcuGpBNc7jhzGscA&_nc_ss=7b289&oh=00_AQIuaVjQRIq8xvAOGgJygkVzsAur1KmUflqgcnvdtMZy6w&oe=6AA012F0'],
    },
  ];

  // 寫入 5 筆獨立卡片
  for (const d of splitDeals) {
    await prisma.deal.upsert({
      where: { id: d.id },
      update: d,
      create: d,
    });
    console.log(`   ✨ [獨立卡片已就緒] ${d.title} (標籤: ${d.tags.join(' ')})`);
  }

  // 刪除舊的 5 圖合一卡片
  if (mergedDeal) {
    await prisma.deal.delete({
      where: { id: targetMergedId },
    });
    console.log(`   🗑️ 已成功刪除舊版 5 圖合一促銷卡片: ${targetMergedId}`);
  }

  // 2. 全站資料庫標籤與店家名稱標準化清洗 (確保無 `#美廉社 Simple Mart`、`#全家 FamilyMart` 等髒標籤)
  console.log('\n🧹 正在掃描全站資料庫標籤與店家名稱進行標準化收斂...');
  const allDeals = await prisma.deal.findMany();
  let cleanedCount = 0;

  for (const deal of allDeals) {
    if (splitDeals.some((sd) => sd.id === deal.id)) continue;

    const normMerchant = normalizeBrandName(deal.merchantName);
    const normTags = normalizeTags(deal.tags, normMerchant);

    const hasMerchantChanged = deal.merchantName !== normMerchant;
    const hasTagsChanged = JSON.stringify(deal.tags) !== JSON.stringify(normTags);

    if (hasMerchantChanged || hasTagsChanged) {
      await prisma.deal.update({
        where: { id: deal.id },
        data: {
          merchantName: normMerchant,
          tags: normTags,
        },
      });
      cleanedCount++;
      console.log(`   🔄 洗滌資料 [${deal.id}]: 店家「${deal.merchantName}」➔「${normMerchant}」，標籤: ${JSON.stringify(deal.tags)} ➔ ${JSON.stringify(normTags)}`);
    }
  }

  console.log(`\n🎉 清洗完成！共更新了 ${cleanedCount} 筆包含未標準化標籤的歷史資料。`);
  const totalCount = await prisma.deal.count();
  console.log(`📊 目前資料庫中特價情報總筆數: ${totalCount}`);
}

main()
  .catch((e) => {
    console.error('執行失敗:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
