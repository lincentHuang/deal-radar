import { NextResponse } from 'next/server';
import { getCrawlerSchedule, getCrawlerLogs } from '@/features/admin/server/admin-dal';
import { prisma } from '@/shared/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * 計算下一個後台排程觸發時間點
 */
function calculateNextScheduleTime(
  goldenWindows: string[],
  thursdayRushHours: string[],
  customIntervalMinutes: number
): { nextScheduleIso: string; msUntilNext: number; triggerType: string } {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const dayOfWeek = now.getDay(); // 0: 日, 1: 一, ..., 4: 四

  const candidateDates: { date: Date; type: string }[] = [];

  // 1. 每日黃金時段
  for (const win of goldenWindows) {
    const [h, m] = win.split(':').map((s) => parseInt(s, 10));
    if (!isNaN(h) && !isNaN(m)) {
      const candidateToday = new Date(now);
      candidateToday.setHours(h, m, 0, 0);
      if (candidateToday.getTime() > now.getTime()) {
        candidateDates.push({ date: candidateToday, type: `golden_window_${win}` });
      } else {
        const candidateTomorrow = new Date(now);
        candidateTomorrow.setDate(candidateTomorrow.getDate() + 1);
        candidateTomorrow.setHours(h, m, 0, 0);
        candidateDates.push({ date: candidateTomorrow, type: `golden_window_${win}` });
      }
    }
  }

  // 2. 週四衝刺時段 (17:00, 18:00, 19:00)
  for (const rush of thursdayRushHours) {
    const rushHour = parseInt(rush.split(':')[0], 10);
    const rushMinute = parseInt(rush.split(':')[1] || '0', 10);
    if (!isNaN(rushHour)) {
      const daysUntilThursday = (4 - dayOfWeek + 7) % 7;
      const rushDate = new Date(now);
      rushDate.setDate(rushDate.getDate() + daysUntilThursday);
      rushDate.setHours(rushHour, rushMinute, 0, 0);

      if (rushDate.getTime() > now.getTime()) {
        candidateDates.push({ date: rushDate, type: `thursday_rush_${rush}` });
      } else {
        const nextThursday = new Date(rushDate);
        nextThursday.setDate(nextThursday.getDate() + 7);
        candidateDates.push({ date: nextThursday, type: `thursday_rush_${rush}` });
      }
    }
  }

  // 3. 自訂週期 interval (從當前時間往後推 customIntervalMinutes 分鐘)
  if (customIntervalMinutes && customIntervalMinutes > 0) {
    const intervalDate = new Date(now.getTime() + customIntervalMinutes * 60 * 1000);
    candidateDates.push({ date: intervalDate, type: `interval_${customIntervalMinutes}m` });
  }

  // 排序找出最近的一個時間點
  candidateDates.sort((a, b) => a.date.getTime() - b.date.getTime());
  const nextItem = candidateDates[0] || {
    date: new Date(now.getTime() + 60 * 60 * 1000),
    type: 'fallback_1h',
  };

  const msUntilNext = Math.max(1000, nextItem.date.getTime() - now.getTime());

  return {
    nextScheduleIso: nextItem.date.toISOString(),
    msUntilNext,
    triggerType: nextItem.type,
  };
}

export async function GET() {
  try {
    const schedule = await getCrawlerSchedule();
    const logs = await getCrawlerLogs();
    const latestLog = logs[0] || null;

    // 取得最新一筆 Deal 更新時間或當前時間戳
    let latestDealUpdate: string | null = null;
    try {
      if (process.env.DATABASE_URL) {
        const latestRecord = await prisma.deal.findFirst({
          orderBy: { createdAt: 'desc' },
          select: { createdAt: true },
        });
        if (latestRecord) {
          latestDealUpdate = latestRecord.createdAt.toISOString();
        }
      }
    } catch {
      // ignore
    }

    const { nextScheduleIso, msUntilNext, triggerType } = calculateNextScheduleTime(
      schedule.goldenWindows || ['08:30', '12:00', '18:00', '21:30'],
      schedule.thursdayRushHours || ['17:00', '18:00', '19:00'],
      schedule.customIntervalMinutes || 60
    );

    return NextResponse.json({
      success: true,
      serverTime: new Date().toISOString(),
      schedule: {
        enabled: schedule.enabled,
        goldenWindows: schedule.goldenWindows,
        thursdayRushHours: schedule.thursdayRushHours,
        nightQuietStart: schedule.nightQuietStart,
        nightQuietEnd: schedule.nightQuietEnd,
        customIntervalMinutes: schedule.customIntervalMinutes,
      },
      latestLog: latestLog ? {
        id: latestLog.id,
        timestamp: latestLog.timestamp,
        status: latestLog.status,
        message: latestLog.message,
      } : null,
      latestDealUpdatedAt: latestDealUpdate || new Date().toISOString(),
      nextScheduledTime: nextScheduleIso,
      msUntilNextScheduledTime: msUntilNext,
      nextTriggerType: triggerType,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || '無法取得排程同步設定',
        serverTime: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
