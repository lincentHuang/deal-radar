import { 
  getCrawlerTargets, 
  addCrawlerLog, 
  updateCrawlerTargetDetails 
} from '@/features/admin/server/admin-dal';
import { crawlLiveTargets } from '@/features/deals/server/fb-crawler.service';
import { upsertCrawledDeals, purgeExpiredDeals } from '@/features/deals/server/deals-dal';
import { CrawlerProgressEvent } from '@/features/admin/types/admin.types';
import { SmartDeal } from '@/features/deals/types/deal.types';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 支援長效串流

export async function POST(request: Request) {
  let body: { targetIds?: string[] | string; articleUrl?: string } = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (event: CrawlerProgressEvent) => {
        try {
          const payload = `data: ${JSON.stringify(event)}\n\n`;
          controller.enqueue(encoder.encode(payload));
        } catch {
          // Client disconnected
        }
      };

      const nowStr = () => new Date().toLocaleTimeString('zh-TW', { hour12: false });

      try {
        // 情境 A：單篇食尚玩家 / 美食部落格 URL 即時抓取
        if (body.articleUrl) {
          const targetUrl = body.articleUrl.trim();
          sendEvent({
            type: 'init',
            timestamp: nowStr(),
            message: `啟動單篇部落格即時採集：${targetUrl}`,
            totalTargets: 1,
            targetIndex: 1,
            targetName: '食尚玩家 / 部落格文章',
            currentStep: 'connecting',
            stepProgress: 15,
          });

          const { scrapeBlogArticle, parseBlogArticleWithGemini } = await import('@/features/deals/server/blog-crawler.service');
          
          sendEvent({
            type: 'step',
            timestamp: nowStr(),
            message: '正在抓取文章網頁內容與排版圖片...',
            currentStep: 'fetching_posts',
            stepProgress: 40,
          });

          const scraped = await scrapeBlogArticle(targetUrl);
          if (!scraped) {
            throw new Error('無法抓取該文章內容，請確認網址是否正確');
          }

          sendEvent({
            type: 'step',
            timestamp: nowStr(),
            message: `成功讀取文章「${scraped.title.slice(0, 30)}...」，Gemini AI 正在進行多品牌/品項結構化拆解...`,
            currentStep: 'gemini_ai_parsing',
            stepProgress: 75,
          });

          const deals = await parseBlogArticleWithGemini(scraped);

          sendEvent({
            type: 'step',
            timestamp: nowStr(),
            message: `Gemini AI 成功萃取出 ${deals.length} 筆特惠品項，正在存入資料庫...`,
            currentStep: 'db_upsert',
            stepProgress: 90,
          });

          const result = await upsertCrawledDeals(deals);

          await addCrawlerLog({
            type: 'manual',
            status: 'success',
            targetName: '食尚玩家單篇文章採集',
            crawledCount: deals.length,
            insertedCount: result.insertedCount,
            message: `即時採集成功：${targetUrl} 萃取出 ${deals.length} 筆特價卡片，新增入庫 ${result.insertedCount} 筆`,
          });

          sendEvent({
            type: 'complete',
            timestamp: nowStr(),
            message: `🎉 文章採集解析完成！共獲取 ${deals.length} 筆情報，成功入庫 ${result.insertedCount} 筆新卡片！`,
            crawledCount: deals.length,
            insertedCount: result.insertedCount,
            updatedCount: result.updatedCount,
            purgedCount: result.purgedCount,
            deals: result.createdDeals,
            stepProgress: 100,
          });

          controller.close();
          return;
        }

        // 情境 B：多站點 / 單站點 / 全站點即時抓取
        sendEvent({
          type: 'init',
          timestamp: nowStr(),
          message: '正在初始化爬蟲即時管線，讀取目標站點設定...',
          stepProgress: 5,
        });

        const allTargets = await getCrawlerTargets();
        let selectedTargets = allTargets;

        if (body.targetIds && body.targetIds !== 'all') {
          const ids = Array.isArray(body.targetIds) ? body.targetIds : [body.targetIds];
          selectedTargets = allTargets.filter((t) => ids.includes(t.id));
        } else {
          selectedTargets = allTargets.filter((t) => t.enabled);
        }

        if (selectedTargets.length === 0) {
          sendEvent({
            type: 'error',
            timestamp: nowStr(),
            message: '未選取或無啟用的爬蟲目標站點',
            error: '無有效目標站點',
          });
          controller.close();
          return;
        }

        sendEvent({
          type: 'step',
          timestamp: nowStr(),
          message: `已鎖定 ${selectedTargets.length} 個待抓取站點，即刻開始循序採集與 AI 萃取...`,
          totalTargets: selectedTargets.length,
          stepProgress: 10,
        });

        const allCrawledDeals: SmartDeal[] = [];
        let totalInserted = 0;
        let totalUpdated = 0;
        let totalPurged = 0;
        const createdDealsAccumulator: SmartDeal[] = [];

        for (let i = 0; i < selectedTargets.length; i++) {
          const target = selectedTargets[i];
          const targetIndex = i + 1;
          const isDaybuy = target.url.includes('daybuy.tw') || target.id === 'costco';
          const isBlog = !isDaybuy && (target.targetType === 'blog_media' || target.url.includes('supertaste'));

          sendEvent({
            type: 'target_start',
            timestamp: nowStr(),
            targetId: target.id,
            targetName: target.name,
            targetLogo: target.logo,
            targetIndex,
            totalTargets: selectedTargets.length,
            message: `[${targetIndex}/${selectedTargets.length}] 連線目標【${target.name}】(${isDaybuy ? '今購百科 Costco 優惠專區' : isBlog ? '綜合部落格' : '官方粉專/官網'})...`,
            currentStep: 'connecting',
            stepProgress: Math.round(10 + (i / selectedTargets.length) * 80),
          });

          const currentTargetDeals: SmartDeal[] = [];

          try {
            if (isDaybuy) {
              const { crawlDaybuyCostcoDeals } = await import('@/features/deals/server/daybuy-crawler.service');
              const { parseTargetCrawlRule } = await import('@/features/admin/types/admin.types');
              const ruleConfig = parseTargetCrawlRule(target.crawlRule);
              const maxArticles = ruleConfig.maxItems && ruleConfig.maxItems > 0 ? ruleConfig.maxItems : 3;

              sendEvent({
                type: 'step',
                timestamp: nowStr(),
                targetId: target.id,
                targetName: target.name,
                message: `正在檢索今購百科 Costco 優惠目錄，篩選有特惠標題之文章 (預計爬取 ${maxArticles} 篇)...`,
                currentStep: 'fetching_posts',
              });

              const deals = await crawlDaybuyCostcoDeals(maxArticles, (msg, step) => {
                sendEvent({
                  type: 'step',
                  timestamp: nowStr(),
                  targetId: target.id,
                  targetName: target.name,
                  message: msg,
                  currentStep: (step as any) || 'gemini_ai_parsing',
                });
              });

              currentTargetDeals.push(...deals);
            } else if (isBlog) {
              const { parseTargetCrawlRule } = await import('@/features/admin/types/admin.types');
              const ruleConfig = parseTargetCrawlRule(target.crawlRule);
              const maxArticles = ruleConfig.maxItems && ruleConfig.maxItems > 0 ? ruleConfig.maxItems : 2;
              const customPrompt = ruleConfig.customPrompt;

              sendEvent({
                type: 'step',
                timestamp: nowStr(),
                targetId: target.id,
                targetName: target.name,
                message: `正在抓取【${target.name}】活動與促銷專題頁面 (預計抓取 ${maxArticles} 篇)...`,
                currentStep: 'fetching_posts',
              });

              const { scrapeBlogArticle, scrapeBlogCategoryList, parseBlogArticleWithGemini } = await import('@/features/deals/server/blog-crawler.service');
              
              let articleUrls: string[] = [];
              if (target.url.match(/\/\d{5,7}$/)) {
                articleUrls = [target.url];
              } else {
                articleUrls = await scrapeBlogCategoryList(target.url, maxArticles);
              }

              for (const aUrl of articleUrls) {
                const scraped = await scrapeBlogArticle(aUrl);
                if (scraped) {
                  sendEvent({
                    type: 'step',
                    timestamp: nowStr(),
                    targetId: target.id,
                    targetName: target.name,
                    message: `Gemini AI 正在解析「${scraped.title.slice(0, 25)}...」${customPrompt ? '（套用客製提示詞）' : ''}...`,
                    currentStep: 'gemini_ai_parsing',
                  });
                  let deals = await parseBlogArticleWithGemini(scraped, customPrompt);

                  // 依關鍵字過濾
                  if (ruleConfig.includeKeywords && ruleConfig.includeKeywords.length > 0) {
                    const kw = ruleConfig.includeKeywords.map((k) => k.toLowerCase().trim()).filter(Boolean);
                    deals = deals.filter((d) => 
                      kw.some((k) => 
                        d.title.toLowerCase().includes(k) || 
                        (d.subtitle && d.subtitle.toLowerCase().includes(k)) ||
                        d.tags.some((t) => t.toLowerCase().includes(k))
                      )
                    );
                  }
                  if (ruleConfig.excludeKeywords && ruleConfig.excludeKeywords.length > 0) {
                    const exKw = ruleConfig.excludeKeywords.map((k) => k.toLowerCase().trim()).filter(Boolean);
                    deals = deals.filter((d) => 
                      !exKw.some((k) => 
                        d.title.toLowerCase().includes(k) || 
                        (d.subtitle && d.subtitle.toLowerCase().includes(k))
                      )
                    );
                  }

                  currentTargetDeals.push(...deals);
                }
              }
            } else {
              sendEvent({
                type: 'step',
                timestamp: nowStr(),
                targetId: target.id,
                targetName: target.name,
                message: `連線官方 Facebook 粉絲團 / 官網頁面，萃取促銷貼文與宣傳海報...`,
                currentStep: 'fetching_posts',
              });

              const deals = await crawlLiveTargets([{
                id: target.id,
                name: target.name,
                url: target.url,
                logo: target.logo || '',
                defaultCategory: (target.defaultCategory as any) || 'food',
              }]);
              currentTargetDeals.push(...deals);
            }

            // 存入資料庫
            sendEvent({
              type: 'step',
              timestamp: nowStr(),
              targetId: target.id,
              targetName: target.name,
              message: `【${target.name}】萃取到 ${currentTargetDeals.length} 筆情報，正在執行去重與資料庫寫入...`,
              currentStep: 'db_upsert',
            });

            const upsertRes = await upsertCrawledDeals(currentTargetDeals);
            totalInserted += upsertRes.insertedCount;
            totalUpdated += upsertRes.updatedCount;
            totalPurged += upsertRes.purgedCount;
            createdDealsAccumulator.push(...upsertRes.createdDeals);
            allCrawledDeals.push(...currentTargetDeals);

            // 更新站點最後狀態
            await updateCrawlerTargetDetails(target.id, {
              lastCrawledAt: new Date().toISOString(),
              lastStatus: 'success',
              crawledCount: (target.crawledCount || 0) + 1,
            });

            sendEvent({
              type: 'target_success',
              timestamp: nowStr(),
              targetId: target.id,
              targetName: target.name,
              targetIndex,
              totalTargets: selectedTargets.length,
              crawledCount: currentTargetDeals.length,
              insertedCount: upsertRes.insertedCount,
              currentStep: 'complete',
              stepProgress: Math.round(10 + ((i + 1) / selectedTargets.length) * 80),
              message: `✅【${target.name}】完成！採集 ${currentTargetDeals.length} 筆，成功入庫 ${upsertRes.insertedCount} 筆新卡片`,
            });
          } catch (tErr: any) {
            console.error(`[LiveStream] Error crawling ${target.name}:`, tErr);
            await updateCrawlerTargetDetails(target.id, {
              lastCrawledAt: new Date().toISOString(),
              lastStatus: 'error',
            });
            sendEvent({
              type: 'target_error',
              timestamp: nowStr(),
              targetId: target.id,
              targetName: target.name,
              targetIndex,
              totalTargets: selectedTargets.length,
              message: `⚠️【${target.name}】抓取時發生異常: ${tErr.message}，繼續後續站點...`,
              error: tErr.message,
            });
          }
        }

        // 過期巡檢
        sendEvent({
          type: 'step',
          timestamp: nowStr(),
          message: '全站採集完畢，執行資料庫過期特惠自動巡檢...',
          currentStep: 'db_upsert',
          stepProgress: 95,
        });
        const purgeRes = await purgeExpiredDeals();
        totalPurged += purgeRes.purgedCount;

        // 寫入真實爬蟲日誌到 PostgreSQL
        const targetNamesStr = selectedTargets.map((t) => t.name).join('、');
        await addCrawlerLog({
          targetName: selectedTargets.length === 1 ? selectedTargets[0].name : `${selectedTargets.length} 個選取站點`,
          type: 'manual',
          status: 'success',
          crawledCount: allCrawledDeals.length,
          insertedCount: totalInserted,
          message: `管理員即時抓取【${targetNamesStr}】完成：成功採集 ${allCrawledDeals.length} 筆特惠情報，寫入 ${totalInserted} 筆新卡片，更新 ${totalUpdated} 筆，清理 ${totalPurged} 筆過期活動`,
          details: {
            targetIds: selectedTargets.map((t) => t.id),
            totalDealsCount: allCrawledDeals.length,
            purgedCount: totalPurged,
          },
        });

        sendEvent({
          type: 'complete',
          timestamp: nowStr(),
          message: `🎉 爬蟲作業全數完成！已自 ${selectedTargets.length} 個站點採集 ${allCrawledDeals.length} 筆情報，成功入庫 ${totalInserted} 筆新特價卡片！`,
          crawledCount: allCrawledDeals.length,
          insertedCount: totalInserted,
          updatedCount: totalUpdated,
          purgedCount: totalPurged,
          deals: createdDealsAccumulator,
          stepProgress: 100,
        });

        controller.close();
      } catch (err: any) {
        console.error('[LiveStream] Fatal error:', err);
        sendEvent({
          type: 'error',
          timestamp: nowStr(),
          message: `執行中發生錯誤：${err.message}`,
          error: err.message,
        });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
