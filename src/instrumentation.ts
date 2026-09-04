/**
 * Next.js 伺服器啟動生命週期掛鉤 (Server Instrumentation)
 * 當 Next.js Node.js 執行環境啟動時自動調用 register()，
 * 確保伺服器常駐排程 Daemon (Crawler Scheduler Daemon) 自動依設定規劃運行。
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { startCrawlerSchedulerDaemon } = await import('@/features/deals/server/crawler-scheduler-engine');
    startCrawlerSchedulerDaemon();
  }
}
