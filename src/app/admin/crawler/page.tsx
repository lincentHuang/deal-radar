import { 
  getCrawlerTargets, 
  getCrawlerSchedule, 
  getCrawlerLogs, 
  getBrandGroupIcons 
} from '@/features/admin/server/admin-dal';
import { AdminCrawlerScheduler } from '@/features/admin/components/admin-crawler-scheduler';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: '爬蟲站點與排程中控 | 特價情報站 Super Admin',
};

export default async function AdminCrawlerPage() {
  const [targets, schedule, logs, brandGroupIcons] = await Promise.all([
    getCrawlerTargets(),
    getCrawlerSchedule(),
    getCrawlerLogs(),
    getBrandGroupIcons(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            爬蟲站點與排程中控中樞
          </h1>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
            CRAWLER ENGINE
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          管理四大超商、量販美妝、食尚玩家等爬蟲來源、階梯式黃金波段時間排程及即時採集進度串流。
        </p>
      </div>

      <AdminCrawlerScheduler
        initialTargets={targets}
        initialSchedule={schedule}
        initialLogs={logs}
        initialBrandGroupIcons={brandGroupIcons}
      />
    </div>
  );
}
