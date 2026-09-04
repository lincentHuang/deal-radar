import { NextResponse } from 'next/server';
import { 
  getDueCrawlerTargets, 
  executeCrawlPipelineForTargets 
} from '@/features/deals/server/crawler-scheduler-engine';
import { getCrawlerTargets } from '@/features/admin/server/admin-dal';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const forceAll = searchParams.get('all') === 'true';

    let targetsToCrawl: any[] = [];
    let reason = '';

    if (forceAll) {
      const allTargets = await getCrawlerTargets();
      targetsToCrawl = allTargets.filter((t) => t.enabled);
      reason = '全站強制排程執行';
    } else {
      const { dueTargets, triggerReason } = await getDueCrawlerTargets(new Date());
      targetsToCrawl = dueTargets;
      reason = triggerReason;
    }

    if (targetsToCrawl.length === 0) {
      return NextResponse.json({
        success: true,
        message: `目前無應執行的排程站點 (狀態: ${reason})`,
        timestamp: new Date().toISOString(),
        crawledCount: 0,
      });
    }

    console.log(`[API /api/cron/crawl-fb] Executing crawl for ${targetsToCrawl.length} targets (${reason})...`);
    const result = await executeCrawlPipelineForTargets(targetsToCrawl, 'scheduled', reason);

    return NextResponse.json({
      success: true,
      mode: 'scheduled',
      timestamp: new Date().toISOString(),
      reason,
      crawledCount: result.crawledCount,
      insertedCount: result.insertedCount,
      updatedCount: result.updatedCount,
      totalDealsCount: result.totalDealsCount,
    });
  } catch (error: any) {
    console.error('[API /api/cron/crawl-fb] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || '排程執行失敗',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return GET(request);
}
