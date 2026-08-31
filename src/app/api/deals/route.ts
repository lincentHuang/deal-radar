import { NextResponse } from 'next/server';
import { getDeals } from '@/features/deals/server/deals-dal';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city') || undefined;
  const channel = (searchParams.get('channel') as any) || undefined;
  const tag = searchParams.get('tag') || undefined;

  const deals = await getDeals({
    selectedCity: city,
    channelType: channel,
    selectedTag: tag,
  });

  return NextResponse.json({
    success: true,
    total: deals.length,
    data: deals,
  });
}
