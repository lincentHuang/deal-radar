import { NextResponse } from 'next/server';
import { getDeals, getPaginatedDeals } from '@/features/deals/server/deals-dal';
import { DealFilterState, SelectedRegionItem } from '@/features/deals/types/deal.types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('search') || searchParams.get('q') || undefined;
    const city = searchParams.get('city') || undefined;
    const district = searchParams.get('district') || undefined;
    const channel = (searchParams.get('channel') as any) || undefined;
    const category = (searchParams.get('category') as any) || undefined;
    const tag = searchParams.get('tag') || undefined;
    const card = searchParams.get('card') || undefined;
    const sortBy = (searchParams.get('sortBy') as any) || undefined;
    const regionsParam = searchParams.get('regions');
    const subscribedTagsParam = searchParams.get('subscribedTags');

    let selectedRegions: SelectedRegionItem[] = [];
    if (regionsParam) {
      try {
        const parsed = JSON.parse(regionsParam);
        if (Array.isArray(parsed)) {
          selectedRegions = parsed.map((item) =>
            typeof item === 'string'
              ? { city: item, district: null }
              : { city: item.city || '', district: item.district || null }
          );
        }
      } catch {
        selectedRegions = regionsParam
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
          .map((c) => ({ city: c, district: null }));
      }
    }

    let subscribedTags: string[] = [];
    if (subscribedTagsParam) {
      try {
        subscribedTags = JSON.parse(subscribedTagsParam);
      } catch {
        subscribedTags = subscribedTagsParam.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }

    const filters: Partial<DealFilterState> & { subscribedTags?: string[] } = {
      searchQuery: searchQuery || '',
      selectedCity: city || '全部地區',
      selectedDistrict: district || null,
      selectedRegions,
      channelType: channel || 'all',
      category: category || 'all',
      selectedCard: card || null,
      selectedTag: tag || null,
      sortBy: sortBy || 'latest',
      subscribedTags,
    };

    const pageParam = searchParams.get('page');
    const pageSizeParam = searchParams.get('pageSize');
    const offsetParam = searchParams.get('offset');

    const page = pageParam ? parseInt(pageParam, 10) : 1;
    const pageSize = pageSizeParam ? parseInt(pageSizeParam, 10) : 12;
    const offset = offsetParam !== null ? parseInt(offsetParam, 10) : undefined;

    const result = await getPaginatedDeals(filters, page, pageSize, offset);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || '查詢特價情報失敗',
        deals: [],
        total: 0,
        page: 1,
        pageSize: 12,
        hasMore: false,
      },
      { status: 500 }
    );
  }
}
