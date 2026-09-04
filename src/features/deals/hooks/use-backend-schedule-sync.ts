'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import useSWR, { mutate } from 'swr';

interface SyncScheduleResponse {
  success: boolean;
  serverTime: string;
  schedule: {
    enabled: boolean;
    goldenWindows: string[];
    thursdayRushHours: string[];
    nightQuietStart: string;
    nightQuietEnd: string;
    customIntervalMinutes: number;
  };
  latestLog: {
    id: string;
    timestamp: string;
    status: string;
    message: string;
  } | null;
  latestDealUpdatedAt: string;
  nextScheduledTime: string;
  msUntilNextScheduledTime: number;
  nextTriggerType: string;
}

const scheduleFetcher = async (url: string): Promise<SyncScheduleResponse> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('無法取得後台排程設定');
  }
  return res.json();
};

/**
 * 依據後台排程時段進行用戶端定時強制同步更新 Hook
 */
export function useBackendScheduleSync() {
  const { data, error, mutate: revalidateSchedule } = useSWR<SyncScheduleResponse>(
    '/api/deals/sync-schedule',
    scheduleFetcher,
    {
      refreshInterval: 60 * 1000, // 每分鐘定期比對一次後台最新排程與更新戳記
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 10 * 1000,
    }
  );

  const prevUpdateTimestampRef = useRef<string | null>(null);
  const scheduledTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [isForceSyncing, setIsForceSyncing] = useState<boolean>(false);

  // 強制觸發全域 SWR 重新載入所有特價情報資料庫
  const triggerGlobalDealsRefresh = useCallback(async () => {
    setIsForceSyncing(true);
    try {
      await mutate(
        (key) => {
          if (typeof key === 'string' && (key.startsWith('/api/deals') || key.startsWith('deals'))) {
            return true;
          }
          if (Array.isArray(key) && (key[0] === 'deals' || key[0] === '/api/deals')) {
            return true;
          }
          return false;
        },
        undefined,
        { revalidate: true }
      );
      setLastSyncTime(new Date());
    } finally {
      setIsForceSyncing(false);
    }
  }, []);

  // 1. 當後台 latestDealUpdatedAt 發生改變時（例如排程或後台執行了新增/爬蟲），立即強制刷新
  useEffect(() => {
    if (!data?.latestDealUpdatedAt) return;

    if (prevUpdateTimestampRef.current && prevUpdateTimestampRef.current !== data.latestDealUpdatedAt) {
      console.log(`[ScheduleSync] ⚡ 偵測到後台資料庫更新 (${data.latestDealUpdatedAt})，正在強制刷新用戶端情報...`);
      triggerGlobalDealsRefresh();
    }
    prevUpdateTimestampRef.current = data.latestDealUpdatedAt;
  }, [data?.latestDealUpdatedAt, triggerGlobalDealsRefresh]);

  // 2. 精確計算距離「下一個後台排程時間點」的倒數計時器
  useEffect(() => {
    if (!data?.msUntilNextScheduledTime) return;

    if (scheduledTimerRef.current) {
      clearTimeout(scheduledTimerRef.current);
    }

    const delay = Math.min(data.msUntilNextScheduledTime, 24 * 60 * 60 * 1000);
    console.log(`[ScheduleSync] ⏰ 下一次後台排程同步時間：${data.nextScheduledTime} (${data.nextTriggerType}, ${Math.round(delay / 1000)}秒後)`);

    scheduledTimerRef.current = setTimeout(() => {
      console.log(`[ScheduleSync] 🔔 到達後台排程觸發點 (${data.nextTriggerType})，執行全站強制同步...`);
      triggerGlobalDealsRefresh();
      revalidateSchedule();
    }, delay);

    return () => {
      if (scheduledTimerRef.current) {
        clearTimeout(scheduledTimerRef.current);
      }
    };
  }, [data?.msUntilNextScheduledTime, data?.nextScheduledTime, data?.nextTriggerType, triggerGlobalDealsRefresh, revalidateSchedule]);

  return {
    schedule: data?.schedule,
    serverTime: data?.serverTime,
    latestLog: data?.latestLog,
    latestDealUpdatedAt: data?.latestDealUpdatedAt,
    nextScheduledTime: data?.nextScheduledTime,
    nextTriggerType: data?.nextTriggerType,
    lastSyncTime,
    isForceSyncing,
    forceSyncNow: triggerGlobalDealsRefresh,
    error,
  };
}
