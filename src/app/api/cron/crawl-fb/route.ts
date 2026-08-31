import { NextResponse } from 'next/server';
import { crawlFacebookDeals, triggerAsyncCrawlerJob } from '@/features/deals/server/fb-crawler.service';
import { upsertCrawledDeals } from '@/features/deals/server/deals-dal';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isSync = searchParams.get('sync') === 'true';

    // 若指定同步模式（供手動自測），等待爬蟲完成
    if (isSync) {
      console.log('[API /api/cron/crawl-fb] Triggered synchronous FB crawl...');
      const deals = await crawlFacebookDeals();
      const result = await upsertCrawledDeals(deals);
      return NextResponse.json({
        success: true,
        mode: 'synchronous',
        timestamp: new Date().toISOString(),
        crawledCount: deals.length,
        insertedCount: result.insertedCount,
        totalDealsCount: result.totalCount,
      });
    }

    // 預設採用「異步非阻塞 (Asynchronous)」排程架構
    console.log('[API /api/cron/crawl-fb] Received request. Dispatching async background crawl job...');
    triggerAsyncCrawlerJob();

    return NextResponse.json(
      {
        success: true,
        mode: 'asynchronous',
        status: 'processing',
        message: '已成功於背景異步啟動超商、量販、星巴克、麥當勞、肯德基、手搖飲與 Costco 爬蟲與 Gemini AI 整合管線',
        timestamp: new Date().toISOString(),
        schedule: '每日 4 大黃金窗口 (08:30, 12:00, 18:00, 21:30) + 週四超商週末大促衝刺 (17:00, 18:00, 19:00)',
      },
      { status: 202 }
    );
  } catch (error) {
    console.error('[API /api/cron/crawl-fb] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return GET(request);
}
