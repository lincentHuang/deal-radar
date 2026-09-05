# PRD: 特價情報抓取極速化 (<500ms) 與排程自動清理快取 (Data Fetch Acceleration & Scheduled Cache)

## 1. 背景與問題陳述 (Background & Problem Statement)

目前前台特物情報局 (Dealbureau) 首頁與標籤頁在資料讀取與頁面導覽時存在兩大體驗瓶頸：
1. **資料讀取速度偏慢 (>1000ms)**：
   - 伺服器端資料存取層 (`deals-dal.ts`) 過去在請求時會調用 `ensureDealsSeeded()` (執行遠端 Neon PostgreSQL `count()`，跨海網路延遲達 1600ms+)。
   - 伺服器記憶體快取過短 (`CACHE_TTL_MS = 60s`)，過期後需重新執行 `findMany()` 遠端查詢 (500~700ms)。
   - 前端採用 Server Action 進行動態載入分頁，Next.js Server Action 具備額外的 RPC 封裝與 POST 傳輸延遲，缺少 HTTP 靜態/動態快取機制。
2. **轉跳外部或頁面後返回需重新載入**：
   - 使用者在點選特價卡片外部來源（「開啟來源」）或跳轉至標籤頁/會員頁後返回首頁，SWR 預設 `revalidateOnFocus: true` 觸發全量重複請求。
   - 客戶端無持久化二級快取，切換頁籤或返回時畫面會閃爍骨架屏 (`DealMasonrySkeleton`)，使用者體驗不流暢。
   - 快取缺乏與後台爬蟲排程機制的同步聯動，無法在後台爬蟲「黃金時段」或「自訂排程」觸發時精準自動清空快取。

---

## 2. 目標與驗收標準 (Objectives & Acceptance Criteria - AC)

### AC 1: 資料讀取極速化至 500ms 以內 (實測目標 < 100ms)
- [ ] **伺服器 DAL 極速化**：
  - `ensureDealsSeeded()` 改為非阻塞式背景檢查，不再阻塞任何使用者查詢請求。
  - 伺服器端實作高效率記憶體快取與 Stale-While-Revalidate 機制，熱資料命中時 10ms 內極速回傳。
  - 伺服器啟動時透過 `instrumentation.ts` 預熱 (Pre-warm) 特惠情報快取，消除首次冷啟動延遲。
- [ ] **RESTful `/api/deals` 讀取通道優化**：
  - `useDealsFeed` 改為優先請求高流通、低延遲的 GET `/api/deals` 端點。
  - 配置 `Cache-Control: public, max-age=30, stale-while-revalidate=300` 與 `ETag` 支援，大幅降低傳輸開銷。

### AC 2: 轉跳出去再返回 0ms 即時快取復原 (Instant Return)
- [ ] **客戶端多層級快取 (Multi-Level Client Cache)**：
  - 建立 `deal-cache-manager.ts`：結合 L1 (Memory) 與 L2 (`sessionStorage` / `localStorage`) 雙層快取。
  - 當使用者點選外部連結或導覽至其他頁面再返回（或切換分頁/App 回來）時，直接從快取 0ms 秒級還原前次瀏覽之瀑布流卡片，完全不閃爍骨架屏、不重新從遠端資料庫重複讀取。
- [ ] **SWR 智慧聚焦重驗策略**：
  - 在快取有效期內關閉無謂的 `revalidateOnFocus` 抖動，避免使用者切換視窗回來時不必要的卡片重繪。

### AC 3: 依後台排程時間自動清理快取 (Schedule-Driven Auto Cache Purge)
- [ ] **客戶端排程失效時間戳 (Schedule Invalidation Window)**：
  - 每筆客戶端快取紀錄攜帶 `validUntil`（對齊 `/api/deals/sync-schedule` 所算出的 `nextScheduledTime`）與 `scheduleVersion` (`latestDealUpdatedAt`)。
  - 快取若已超過排程時間點，自動判定過期並清空本地快取，向後端獲取最新情報。
- [ ] **主動排程觸發與更新監聽 (`useBackendScheduleSync`)**：
  - 當用戶端背景計時器到達排程觸發時間（如黃金時段 08:30, 12:00, 18:00, 21:30 或週四衝刺波），精準觸發全站快取清除 (`dealCacheManager.clearAll()`) 並無感刷新最新情報。
  - 當偵測到後台資料庫更新版本變更時，立即主動重設客戶端快取。
- [ ] **後台/商家發布連動清除**：
  - 商家或管理員新增/修改/刪除特價、批量操作、或執行爬蟲入庫時，即時使伺服器快取失效 (`invalidateDealsCache()`)，確保資料一致性。

---

## 3. 架構與快取生命週期 (Architecture & Cache Lifecycle)

```mermaid
flowchart TD
    subgraph Client ["客戶端 (Browser / Capacitor App)"]
        A[使用者瀏覽首頁 / 標籤頁] --> B{檢查 L1/L2 快取}
        B -->|快取命中且在排程有效時間內| C[⚡ 0ms 即時渲染卡片 (無骨架屏)]
        B -->|快取未命中或已過期| D[請求 GET /api/deals]
        
        E[使用者點擊外部連結 / 轉跳其他頁面] --> F[切換回本站 (Focus / PopState)]
        F --> B

        G[useBackendScheduleSync] -->|定時比對| H[GET /api/deals/sync-schedule]
        H -->|排程時間點到達 OR latestDealUpdatedAt 變更| I[🔔 自動清理客戶端快取 dealCacheManager.clearAll]
        I --> J[靜默向後端重拉最新特惠情報]
    end

    subgraph Server ["後端 (Next.js Node.js Runtime)"]
        D --> K{伺服器記憶體快取}
        K -->|快取命中| L[⚡ 10ms 內回傳 JSON]
        K -->|快取過期/未預熱| M[(Neon PostgreSQL)]
        M -->|查詢結果| N[寫入伺服器記憶體快取]
        N --> L

        O[Crawler Scheduler Daemon] -->|到達黃金時段/排程觸發| P[執行爬蟲入庫 upsertCrawledDeals]
        P --> Q[invalidateDealsCache]
        Q -->|更新 latestDealUpdatedAt| H
    end
```
