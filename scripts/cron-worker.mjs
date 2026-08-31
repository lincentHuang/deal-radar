import { crawlFacebookPages } from './crawl-fb-deals-poc.mjs';

/**
 * 智慧排程定義 (Smart Tiered Cron Schedule)
 * 1. 每日 4 大黃金時段: 08:30 (早餐咖啡), 12:00 (午餐午茶), 18:00 (下班採買), 21:30 (晚間爆文)
 * 2. 週四專屬衝刺時段: 17:00, 18:00, 19:00 (鎖定全家「康康5」與 7-11「超值五六日」買一送一海報)
 * 3. 深夜靜默期: 01:00 ~ 07:30 (全靜默不消耗運算)
 */

export const GOLDEN_SCHEDULE_SLOTS = [
  { hour: 8, minute: 30, desc: '🌅 早鳥通勤波 (早餐/咖啡/一日快閃)' },
  { hour: 12, minute: 0, desc: '🍱 午間午茶波 (手搖飲買一送一/外食折價)' },
  { hour: 18, minute: 0, desc: '🌆 下班採買波 (超市晚鳥/晚間主推)' },
  { hour: 21, minute: 30, desc: '🌙 晚間爆文波 (社群討論度破百優惠)' },
];

export const THURSDAY_RUSH_HOURS = [17, 18, 19]; // 每週四下午密集鎖定超商週末大促

const ACTIVE_TARGETS = [
  // 超商量販
  { id: '7eleven', name: '7-ELEVEN', url: 'https://www.facebook.com/711open' },
  { id: 'familymart', name: 'FamilyMart 全家', url: 'https://www.facebook.com/FamilyMart' },
  { id: 'costco', name: 'Costco 好市多特價情報', url: 'https://www.facebook.com/DAYBUY.TW' },
  // 連鎖咖啡與速食
  { id: 'starbucks', name: '星巴克 Starbucks', url: 'https://www.facebook.com/starbuckstaiwan' },
  { id: 'mcdonalds', name: '麥當勞 McDonald\'s', url: 'https://www.facebook.com/mcdonalds.tw' },
  { id: 'kfc', name: '肯德基 KFC', url: 'https://www.facebook.com/kfctaiwan' },
  // 人氣連鎖手搖飲
  { id: 'milksha', name: '迷客夏 Milksha', url: 'https://www.facebook.com/MilkshaTW' },
  { id: 'macu', name: '麻古茶坊 MACU', url: 'https://www.facebook.com/macu2008.tw' },
  { id: 'kebuke', name: '可不可熟成紅茶 KEBUKE', url: 'https://www.facebook.com/kebuke2008' },
];

console.log('================================================================');
console.log('🕒 [Smart Multi-Channel Deals Crawler & AI Worker Started]');
console.log('🎯 Targets: 7-11, 全家, Costco, 星巴克, 麥當勞, 肯德基, 迷客夏, 麻古, 可不可');
console.log('⏰ Daily Golden Slots: 08:30, 12:00, 18:00, 21:30');
console.log('🚀 Thursday Rush Window: 17:00, 18:00, 19:00 (Super Deals)');
console.log('💤 Night Quiet Mode: 01:00 ~ 07:30 (Paused to save compute)');
console.log('================================================================');

let lastExecutedKey = '';

export function isScheduledTime(now = new Date()) {
  const dayOfWeek = now.getDay(); // 0: Sun, 1: Mon, ..., 4: Thu, 5: Fri, 6: Sat
  const hour = now.getHours();
  const minute = now.getMinutes();

  // 1. 深夜靜默期 (01:00 ~ 07:29)
  if (hour >= 1 && (hour < 7 || (hour === 7 && minute < 30))) {
    return { shouldRun: false, reason: 'quiet_hours' };
  }

  // 2. 每日黃金時段判定
  const goldenMatch = GOLDEN_SCHEDULE_SLOTS.find(
    (slot) => slot.hour === hour && slot.minute === minute
  );
  if (goldenMatch) {
    return { shouldRun: true, type: 'golden', desc: goldenMatch.desc };
  }

  // 3. 週四超商週末大促衝刺時段判定 (週四 17:00, 18:00, 19:00 整點)
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

  // 異步執行不阻塞
  setImmediate(async () => {
    try {
      const results = await crawlFacebookPages(ACTIVE_TARGETS);
      console.log(`[${new Date().toLocaleString('zh-TW')}] ✅ Crawler completed! Successfully scraped and parsed ${results.length} deals.`);
    } catch (err) {
      console.error(`[${new Date().toLocaleString('zh-TW')}] ❌ Crawler execution failed:`, err.message);
    }
  });
}

// 每分鐘比對一次排程
setInterval(() => {
  const now = new Date();
  const timeKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}_${now.getHours()}:${now.getMinutes()}`;
  
  const scheduleCheck = isScheduledTime(now);
  if (scheduleCheck.shouldRun && lastExecutedKey !== timeKey) {
    lastExecutedKey = timeKey;
    executeCrawlJob(scheduleCheck);
  }
}, 60 * 1000);

// 首次啟動預熱執行一次
executeCrawlJob();

