import { getDeals } from '@/features/deals/server/deals-dal';
import { AdminDealManager } from '@/features/admin/components/admin-deal-manager';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: '全域特價卡片管理 | 特價情報站 Super Admin',
};

export default async function AdminDealsPage() {
  const deals = await getDeals();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            全域特價情報卡片管理
          </h1>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-700 border border-slate-200">
            DEALS OPS
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          檢視資料庫全量優惠項目、批次編輯通路標籤、設定熱門置頂或即期出清、過期活動清理。
        </p>
      </div>

      <AdminDealManager initialDeals={deals} />
    </div>
  );
}
