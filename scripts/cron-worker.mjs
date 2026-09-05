import { crawlFacebookPages } from './crawl-fb-deals-poc.mjs';
import { runPurgeExpiredJob } from './purge-expired-deals.mjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 智慧排程與自動過期清理 Worker (Smart Tiered Cron & Auto Purge Worker)
 * 1. 每日 4 大黃金時段: 08:30 (早餐咖啡), 12:00 (午餐午茶), 18:00 (下班採買), 21:30 (晚間爆文)
 * 2. 週四專屬衝刺時段: 17:00, 18:00, 19:00 (鎖定全家「康康5」與 7-11「超值五六日」買一送一海報)
 * 3. 24 小時整點自動過期清理巡檢: 每小時 00 分自動掃描並刪除已過期特惠活動與孤立收藏
 * 4. 深夜爬蟲靜默期: 01:00 ~ 07:30 (全靜默不消耗運算)
 */

export const GOLDEN_SCHEDULE_SLOTS = [
  { hour: 8, minute: 30, desc: '🌅 早鳥通勤波 (早餐/咖啡/一日快閃)' },
  { hour: 12, minute: 0, desc: '🍱 午間午茶波 (手搖飲買一送一/外食折價)' },
  { hour: 18, minute: 0, desc: '🌆 下班採買波 (超市晚鳥/晚間主推)' },
  { hour: 21, minute: 30, desc: '🌙 晚間爆文波 (社群討論度破百優惠)' },
];

export const THURSDAY_RUSH_HOURS = [17, 18, 19];

const ACTIVE_TARGETS = [
  // 超商與超市量販
  { id: '7eleven', name: '7-ELEVEN', url: 'https://www.facebook.com/711open' },
  { id: 'familymart', name: 'FamilyMart 全家', url: 'https://www.facebook.com/FamilyMart' },
  { id: 'pxmart', name: '全聯福利中心', url: 'https://www.facebook.com/pxmartchannel' },
  { id: 'carrefour', name: '家樂福 Carrefour', url: 'https://www.facebook.com/carrefour.tw' },
  { id: 'costco', name: 'Costco 好市多特價情報 (今購百科)', url: 'https://www.daybuy.tw/costco/promotions/' },
  { id: 'rtmart', name: '大潤發 RT-MART', url: 'https://www.facebook.com/rtmart.tw' },
  { id: 'hilife', name: '萊爾富 Hi-Life', url: 'https://www.facebook.com/hihilife' },
  { id: 'okmart', name: 'OK超商 OKmart', url: 'https://www.facebook.com/okmart.tw' },
  // 美妝與百貨
  { id: 'watsons', name: '屈臣氏 Watsons', url: 'https://www.facebook.com/WatsonsTaiwan' },
  { id: 'cosmed', name: '康是美 COSMED', url: 'https://www.facebook.com/cosmedtw' },
  { id: 'poya', name: '寶雅 POYA', url: 'https://www.facebook.com/poyatw' },
  { id: 'muji', name: '無印良品 MUJI', url: 'https://www.facebook.com/MUJI.view.tw' },
  // 連鎖速食與餐飲
  { id: 'mcdonalds', name: '麥當勞 McDonald\'s', url: 'https://www.facebook.com/mcdonalds.tw' },
  { id: 'kfc', name: '肯德基 KFC', url: 'https://www.facebook.com/kfctaiwan' },
  { id: 'mosburger', name: '摩斯漢堡 MOS Burger', url: 'https://www.facebook.com/mosburger.tw' },
  { id: 'burgerking', name: '漢堡王 Burger King', url: 'https://www.facebook.com/BurgerKingTW' },
  { id: 'pizzahut', name: '必勝客 Pizza Hut', url: 'https://www.facebook.com/PizzaHut.TW' },
  { id: 'dominos', name: '達美樂 Domino\'s Pizza', url: 'https://www.facebook.com/Dominos.tw' },
  { id: 'sushiro', name: '壽司郎 Sushiro Taiwan', url: 'https://www.facebook.com/Sushiro.TW' },
  { id: 'kurasushi', name: '藏壽司 Kura Sushi', url: 'https://www.facebook.com/kurasushi.tw' },
  { id: 'wanggroup', name: '王品集團 / 王品瘋美食', url: 'https://www.facebook.com/wanggroup.brand' },
  { id: 'sushiexpress', name: '爭鮮迴轉壽司', url: 'https://www.facebook.com/sushiexpress.tw' },
  // 連鎖咖啡與手搖飲
  { id: 'starbucks', name: '星巴克 Starbucks', url: 'https://www.facebook.com/starbuckstaiwan' },
  { id: 'louisa', name: '路易莎咖啡 Louisa Coffee', url: 'https://www.facebook.com/louisacoffeeofficial' },
  { id: 'milksha', name: '迷客夏 Milksha', url: 'https://www.facebook.com/MilkshaTW' },
  { id: 'macu', name: '麻古茶坊 MACU', url: 'https://www.facebook.com/macu2008.tw' },
  { id: 'kebuke', name: '可不可熟成紅茶 KEBUKE', url: 'https://www.facebook.com/kebuke2008' },
  { id: 'wootea', name: '五桐號 WooTEA', url: 'https://www.facebook.com/WooTeaTW' },
  { id: 'dejeng', name: '得正 Oolong Tea', url: 'https://www.facebook.com/dejeng.oolongtea' },
  // 甜點與生活 3C
  { id: 'misterdonut', name: 'Mister Donut 統一多拿滋', url: 'https://www.facebook.com/Japan.misterdonut' },
  { id: 'coldstone', name: 'COLD STONE 酷聖石冰淇淋', url: 'https://www.facebook.com/ColdStone.tw' },
  { id: 'haagendazs', name: 'Häagen-Dazs 哈根達斯', url: 'https://www.facebook.com/haagen.dazs.taiwan' },
  { id: 'uniqlo', name: 'UNIQLO Taiwan', url: 'https://www.facebook.com/uniqlo.tw' },
  { id: 'tkec', name: '燦坤 3C', url: 'https://www.facebook.com/TKEC.tw' },
  { id: 'elifemall', name: '全國電子', url: 'https://www.facebook.com/Elifemall.com.tw' },
];

console.log('================================================================');
console.log('🕒 [Smart Multi-Channel Deals Crawler & Auto-Purge Worker Started]');
console.log(`🎯 Targets: ${ACTIVE_TARGETS.length} 家台灣知名連鎖官方粉絲團全覆蓋`);
console.log('⏰ Daily Golden Slots: 08:30, 12:00, 18:00, 21:30');
console.log('🚀 Thursday Rush Window: 17:00, 18:00, 19:00 (Super Deals)');
console.log('🧹 Hourly Auto-Purge: 24/7 每小時整點與午夜自動自資料庫刪除過期情報');
console.log('💤 Crawler Quiet Mode: 01:00 ~ 07:30 (Paused to save compute)');
console.log('================================================================');

let lastExecutedKey = '';
let lastPurgeHourKey = '';

export function isScheduledTime(now = new Date()) {
  const dayOfWeek = now.getDay();
  const hour = now.getHours();
  const minute = now.getMinutes();

  if (hour >= 1 && (hour < 7 || (hour === 7 && minute < 30))) {
    return { shouldRun: false, reason: 'quiet_hours' };
  }

  const goldenMatch = GOLDEN_SCHEDULE_SLOTS.find(
    (slot) => slot.hour === hour && slot.minute === minute
  );
  if (goldenMatch) {
    return { shouldRun: true, type: 'golden', desc: goldenMatch.desc };
  }

  if (dayOfWeek === 4 && THURSDAY_RUSH_HOURS.includes(hour) && minute === 0) {
    return {
      shouldRun: true,
      type: 'thursday_rush',
      desc: `🔥 週四超商週末買一送一大促衝刺波 (${hour}:00)`,
    };
  }

  return { shouldRun: false, reason: 'off_schedule' };
}

async function executeCrawlJob(triggerInfo = { desc: '手動啟動 / 預熱執行' }) {
  const now = new Date();
  console.log(`\n[${now.toLocaleString('zh-TW')}] 🚀 [Async Worker] Triggering Scheduled Crawler: ${triggerInfo.desc}`);

  setImmediate(async () => {
    try {
      // 爬取前先執行過期清理
      await runPurgeExpiredJob().catch((e) => console.error('Auto purge error before crawl:', e));

      const results = await crawlFacebookPages(ACTIVE_TARGETS);
      console.log(`[${new Date().toLocaleString('zh-TW')}] ✅ Crawler completed! Scraped and upserted ${results.length} deals.`);

      await prisma.crawlerLog.create({
        data: {
          targetName: `${ACTIVE_TARGETS.length} 個連鎖官方粉專`,
          type: 'scheduled',
          status: 'success',
          crawledCount: results.length,
          insertedCount: results.length,
          message: `獨立 Worker 排程【${triggerInfo.desc}】：成功採集 ${results.length} 筆特惠情報並更新至資料庫`,
        },
      }).catch((e) => console.error('Error logging to prisma in cron-worker:', e));
    } catch (err) {
      console.error(`[${new Date().toLocaleString('zh-TW')}] ❌ Crawler execution failed:`, err.message);
      await prisma.crawlerLog.create({
        data: {
          targetName: `${ACTIVE_TARGETS.length} 個連鎖官方粉專`,
          type: 'scheduled',
          status: 'failed',
          crawledCount: 0,
          insertedCount: 0,
          message: `獨立 Worker 排程執行異常：${err.message}`,
        },
      }).catch(() => {});
    }
  });
}

// 每分鐘比對一次排程
setInterval(() => {
  const now = new Date();
  const timeKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}_${now.getHours()}:${now.getMinutes()}`;
  const hourKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}_${now.getHours()}`;
  
  // 1. 每小時整點 (minute === 0) 自動執行過期情報清除
  if (now.getMinutes() === 0 && lastPurgeHourKey !== hourKey) {
    lastPurgeHourKey = hourKey;
    runPurgeExpiredJob().catch((err) => {
      console.error('[Hourly Purge Error]:', err.message);
    });
  }

  // 2. 爬蟲黃金時段比對
  const scheduleCheck = isScheduledTime(now);
  if (scheduleCheck.shouldRun && lastExecutedKey !== timeKey) {
    lastExecutedKey = timeKey;
    executeCrawlJob(scheduleCheck);
  }
}, 60 * 1000);

// 首次啟動：立即執行過期清理並預熱爬蟲
runPurgeExpiredJob().then(() => {
  executeCrawlJob();
}).catch(() => {
  executeCrawlJob();
});
