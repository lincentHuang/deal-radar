import { NextResponse } from 'next/server';
import { getDeals, getPaginatedDeals } from '@/features/deals/server/deals-dal';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city') || undefined;
  const channel = (searchParams.get('channel') as any) || undefined;
  const tag = searchParams.get('tag') || undefined;
  const pageParam = searchParams.get('page');
  const pageSizeParam = searchParams.get('pageSize');

  const filters = {
    selectedCity: city,
    channelType: channel,
    selectedTag: tag,
  };

  if (pageParam || pageSizeParam) {
    const page = parseInt(pageParam || '1', 10) || 1;
    const pageSize = parseInt(pageSizeParam || '12', 10) || 12;
    const result = await getPaginatedDeals(filters, page, pageSize);
    return NextResponse.json({
      success: true,
      ...result,
    });
  }

  const deals = await getDeals(filters);

  return NextResponse.json({
    success: true,
    total: deals.length,
    data: deals,
  });
}
