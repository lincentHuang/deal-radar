import { NextResponse } from 'next/server';
import { runHourlyAutoPurge } from '@/features/deals/server/crawler-scheduler-engine';
import { purgeExpiredDeals } from '@/features/deals/server/deals-dal';

export const dynamic = 'force-dynamic';

/**
 * 自動化排程端點：定時清理資料庫中所有已過期特價情報及孤立收藏，並真實記錄到 PostgreSQL 日誌表
 */
export async function GET(request: Request) {
  try {
    const startTime = Date.now();
    await runHourlyAutoPurge();
    const result = await purgeExpiredDeals();
    const durationMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      message: result.purgedCount > 0
        ? `✅ 成功自動清理 ${result.purgedCount} 筆過期特惠活動與 ${result.purgedBookmarkCount} 筆孤立收藏，已記錄至日誌庫`
        : '✨ 目前資料庫無過期特價情報，已寫入巡檢日誌',
      timestamp: new Date().toISOString(),
      durationMs,
      purgedCount: result.purgedCount,
      purgedBookmarkCount: result.purgedBookmarkCount,
    });
  } catch (error: any) {
    console.error('[API /api/cron/purge-expired] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || '清理過期情報時發生錯誤',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return GET(request);
}
