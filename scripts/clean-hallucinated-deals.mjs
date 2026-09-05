import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanHallucinatedDeals() {
  console.log('========================================================');
  console.log('🚀 開始執行：【特價情報站】資料庫防幻覺治理與品質清洗');
  console.log('========================================================');

  const beforeCount = await prisma.deal.count();
  console.log(`📊 目前資料庫中特價情報總數：${beforeCount} 筆`);

  // 1. 定義刪除的 58 筆不良資料 ID 清單
  // (A) deal-tw-chain-* (35 筆純粉專首頁導流虛構情報)
  const twChainDeals = await prisma.deal.findMany({
    where: { id: { startsWith: 'deal-tw-chain' } },
    select: { id: true }
  });
  const twChainIds = twChainDeals.map(d => d.id);

  // (B) deal-okmart-0-* (3 筆純粉專首頁假價格情報)
  const okmartRootDeals = await prisma.deal.findMany({
    where: { id: { startsWith: 'deal-okmart-0' } },
    select: { id: true }
  });
  const okmartRootIds = okmartRootDeals.map(d => d.id);

  // (C) 爬蟲雜訊無具體商品之純導流貼文
  const noiseIds = ['crawled-costco-436f7374636f20e5'];

  // (D) 食尚玩家食記裝潢、菜單標題、非優惠切片或過期單日活動 (19 筆)
  const supertasteCandidates = await prisma.deal.findMany({
    where: {
      OR: [
        { id: { startsWith: 'deal-supertaste' } },
        { sourcePlatform: 'Supertaste' }
      ]
    },
    select: { id: true, title: true, merchantName: true }
  });

  const supertasteDecorOrMenuIds = supertasteCandidates.filter(d => {
    return (
      d.title.includes('私人招待所') || 
      d.title.includes('菜單、價位一覽') || 
      d.title.includes('老井第１間火鍋') ||
      d.title.includes('香氣濃郁') ||
      d.title.includes('59元起開吃') ||
      d.title.includes('「撈王鍋物」插旗信義區！') ||
      d.title.includes('「撈王鍋物料理」插旗信義區') ||
      d.title.includes('首推必點') ||
      d.title.includes('【優惠看這裡】') ||
      d.title.includes('插旗東區') ||
      d.title.includes('軍人節優惠') ||
      d.title.includes('榮耀93') ||
      d.title.includes('台北最難訂') ||
      d.title.includes('9/7試營運') ||
      d.merchantName.includes('【優惠看這裡】') ||
      d.merchantName.includes('私人招待所') ||
      d.merchantName.includes('精選店家')
    );
  }).map(d => d.id);

  const allDeleteIds = Array.from(new Set([
    ...twChainIds,
    ...okmartRootIds,
    ...noiseIds,
    ...supertasteDecorOrMenuIds
  ]));

  console.log(`\n🔍 篩選出待刪除的幻覺與低品質情報共 ${allDeleteIds.length} 筆：`);
  console.log(`   - 純首頁導流 (deal-tw-chain-*): ${twChainIds.length} 筆`);
  console.log(`   - 純首頁導流 (deal-okmart-0-*): ${okmartRootIds.length} 筆`);
  console.log(`   - 無商品導流雜訊: ${noiseIds.length} 筆`);
  console.log(`   - 食記裝潢/菜單/過期切片: ${supertasteDecorOrMenuIds.length} 筆`);

  // 2. 執行刪除
  const deleteResult = await prisma.deal.deleteMany({
    where: { id: { in: allDeleteIds } }
  });
  console.log(`\n🗑️ 成功刪除 ${deleteResult.count} 筆幻覺/無效來源情報！`);

  // 3. 修復 2 筆具備真實官方活動貼文但標題曾被爬蟲誤抓的情報
  console.log('\n🛠️ 正在修復 2 筆具備真實官方活動貼文的情報...');

  // 修復 1: 全家 FamiPort 繳學雜費
  await prisma.deal.updateMany({
    where: { id: 'crawled-famiport-e585a8e5aeb62046' },
    data: {
      title: '全家 FamiPort 繳學雜費 免費送客製開學姓名貼',
      subtitle: '開學季專屬！至全家門市繳交指定學雜費，憑繳費小白單即贈客製化開學姓名貼乙份！',
      merchantName: '全家',
      targetItems: ['全家 FamiPort 學雜費代收', '客製開學姓名貼'],
      conditions: ['門市繳費限定', '憑小白單免費兌換'],
      tags: ['#全家', '#FamiPort', '#開學季', '#學雜費', '#免費送', '#超商優惠'],
      isHot: true
    }
  });
  console.log('   ✅ 已修復: 全家 FamiPort 繳學雜費 免費送客製開學姓名貼');

  // 修復 2: 7-ELEVEN 開學季週末微醺 CupiCho 頂級巧克力
  await prisma.deal.updateMany({
    where: { id: 'crawled-7eleven-372d454c4556454e' },
    data: {
      title: '7-ELEVEN 開學季週末微醺 CupiCho 頂級巧克力 3日限定特惠',
      subtitle: '週末夜放鬆必備！7-ELEVEN 開學季微醺補給站，精選 CupiCho 頂級進口巧克力 3 日限定登場',
      merchantName: '7-11',
      targetItems: ['CupiCho 精選頂級進口巧克力'],
      conditions: ['週末限定', '門市促銷特惠'],
      tags: ['#7-11', '#開學季', '#微醺補給站', '#巧克力', '#限時特惠', '#新品情報'],
      isHot: true
    }
  });
  console.log('   ✅ 已修復: 7-ELEVEN 開學季週末微醺 CupiCho 頂級巧克力 3日限定特惠');

  // 4. 驗收剩餘資料庫統計
  const afterCount = await prisma.deal.count();
  console.log('\n========================================================');
  console.log(`🎉 清洗完成！目前資料庫中特價與新品情報總數：${afterCount} 筆`);
  console.log('========================================================');

  // 驗證剩餘資料無純首頁網址
  const remainingDeals = await prisma.deal.findMany({
    select: { id: true, title: true, merchantName: true, sourceUrl: true, discountPrice: true }
  });

  let hasBadUrl = false;
  for (const d of remainingDeals) {
    if (!d.sourceUrl || d.sourceUrl.endsWith('.tw') || d.sourceUrl.endsWith('.tw/') || d.sourceUrl.match(/^https?:\/\/(www\.)?facebook\.com\/[^\/]+\/?$/)) {
      console.warn(`⚠️ 警告：仍有首頁網址殘留: [${d.id}] ${d.sourceUrl}`);
      hasBadUrl = true;
    }
  }

  if (!hasBadUrl) {
    console.log('✨ 驗核結果：剩餘 100% 情報皆具備具體活動貼文/報導網址，無任何純首頁導流！');
  }

  await prisma.$disconnect();
}

cleanHallucinatedDeals().catch(err => {
  console.error('❌ 清洗失敗:', err);
  process.exit(1);
});
