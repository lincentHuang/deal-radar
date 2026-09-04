import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 解析結束日期時間字串為絕對 Unix 毫秒時間戳
 */
function parseDealEndTimestamp(endDateStr) {
  if (!endDateStr || typeof endDateStr !== 'string') return null;
  const raw = endDateStr.trim();
  if (!raw) return null;

  try {
    // 1. 若已經包含完整時區標記 (+08:00, -05:00, Z)
    if (/[+-]\d{2}:\d{2}$|Z$/i.test(raw)) {
      const parsed = Date.parse(raw);
      return isNaN(parsed) ? null : parsed;
    }

    // 2. 判斷是否包含具體時間部分 (例如 18:00, 18:00:00, 09:30)
    const hasTimeComponent = /[\sT]\d{1,2}:\d{2}(:\d{2}(\.\d+)?)?/.test(raw);
    if (hasTimeComponent) {
      let normalized = raw.replace(/\s+/, 'T').replace(/\//g, '-');
      if (/T\d{1,2}:\d{2}$/.test(normalized)) {
        normalized += ':00';
      }
      normalized += '+08:00';
      const parsed = Date.parse(normalized);
      if (!isNaN(parsed)) return parsed;
    }

    // 3. 純日期格式 (例如 2026-09-01, 2026/09/01)
    const dateOnlyMatch = raw.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
    if (dateOnlyMatch) {
      const [, y, m, d] = dateOnlyMatch;
      const year = y;
      const month = m.padStart(2, '0');
      const day = d.padStart(2, '0');
      const endOfDayIso = `${year}-${month}-${day}T23:59:59.999+08:00`;
      const parsed = Date.parse(endOfDayIso);
      if (!isNaN(parsed)) return parsed;
    }

    const fallback = Date.parse(raw);
    return isNaN(fallback) ? null : fallback;
  } catch {
    return null;
  }
}

function isDealExpired(endDateStr, nowMs = Date.now()) {
  if (!endDateStr) return false;
  const endTimestamp = parseDealEndTimestamp(endDateStr);
  if (endTimestamp === null) return false;
  return endTimestamp < nowMs;
}

export async function runPurgeExpiredJob() {
  const nowMs = Date.now();
  const nowTimeStr = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });
  console.log(`\n[${nowTimeStr}] 🧹 [Auto Purge Worker] Starting expired deals scan...`);

  try {
    const deals = await prisma.deal.findMany({
      select: {
        id: true,
        title: true,
        merchantName: true,
        endDate: true,
      },
    });

    const expiredDeals = deals.filter((d) => isDealExpired(d.endDate, nowMs));

    if (expiredDeals.length === 0) {
      console.log(`[${nowTimeStr}] ✨ All ${deals.length} deals in database are active. Zero expired deals found.`);
      return { purgedCount: 0, purgedBookmarksCount: 0, deals: [] };
    }

    console.log(`[${nowTimeStr}] 🔍 Found ${expiredDeals.length} expired deals out of ${deals.length} total deals:`);
    expiredDeals.forEach((d, idx) => {
      console.log(`   ${idx + 1}. [${d.merchantName}] ${d.title} (截止時間: ${d.endDate})`);
    });

    const expiredIds = expiredDeals.map((d) => d.id);

    // 清理孤立收藏
    const bookmarkRes = await prisma.bookmark.deleteMany({
      where: { dealId: { in: expiredIds } },
    });

    // 刪除過期活動
    const dealRes = await prisma.deal.deleteMany({
      where: { id: { in: expiredIds } },
    });

    console.log(`[${nowTimeStr}] ✅ Successfully deleted ${dealRes.count} expired deals and ${bookmarkRes.count} orphan bookmarks from database.\n`);

    return {
      purgedCount: dealRes.count,
      purgedBookmarksCount: bookmarkRes.count,
      deals: expiredDeals,
    };
  } catch (error) {
    console.error(`[${nowTimeStr}] ❌ Error during purge job:`, error);
    throw error;
  }
}

// 若直接由 CLI 執行
if (process.argv[1]?.endsWith('purge-expired-deals.mjs')) {
  runPurgeExpiredJob()
    .then(() => {
      process.exit(0);
    })
    .catch(() => {
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
