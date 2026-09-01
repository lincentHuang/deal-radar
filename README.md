# 🛒 全通路特價情報聚合平台 (Deal Aggregation Platform)

> **全台灣在地特惠情報第一站**：聚合四大超商、量販超市、美式賣場、手搖茶飲與連鎖咖啡速食最新優惠，結合 **Google Gemini AI 視覺解析**、**自動化爬蟲排程**、**雙核心 1-Char 容錯比對** 與 **Neon Serverless PostgreSQL** 雲端持久化架構。

---

## 📑 目錄

1. [專案簡介與核心價值](#-專案簡介與核心價值)
2. [技術架構與選型](#-技術架構與選型)
3. [核心系統功能介紹](#-核心系統功能介紹)
   - [1. 前台情報牆與消費端體驗](#1-前台情報牆與消費端體驗)
   - [2. 會員系統與雲端雙向同步](#2-會員系統與雲端雙向同步)
   - [3. 官方小編品牌工作台 (`/merchant`)](#3-官方小編品牌工作台-merchant)
   - [4. 最高管理中控台 (`/admin`)](#4-最高管理中控台-admin)
   - [5. 智慧爬蟲與排程系統](#5-智慧爬蟲與排程系統)
4. [重點演算法與深度優化項目](#-重點演算法與深度優化項目)
   - [⚡ 效能與排版優化](#-效能與排版優化)
   - [🧠 演算法與 AI 智慧化優化](#-演算法與-ai-智慧化優化)
   - [🎨 使用者體驗與互動優化 (UI 五態)](#-使用者體驗與互動優化-ui-五態)
5. [專案目錄切片結構](#-專案目錄切片結構)
6. [環境變數與快速啟動](#-環境變數與快速啟動)

---

## 🌟 專案簡介與核心價值

全通路特價情報聚合平台旨在解決現代消費者「優惠資訊分散、海報字太小、促銷真假難辨、重複情報過多」的痛點。透過現代化 **Next.js 15 App Router** 與 **Pinterest 泡泡風瀑布流**，提供極致流暢的跨裝置瀏覽體驗；後台深度整合 **Gemini 2.0 Multimodal AI**，小編只要上傳一張 DM 海報，即可自動解析並拆解出多項特惠情報，實現智慧化、自動化的全通路特價生態系。

```
[通路來源/小編DM/FB官方粉專]
          │
          ▼
  [Playwright 爬蟲 / DM 上傳] ──▶ [Gemini 2.0 Flash Vision 智能解析]
                                                │
                                                ▼ (結構化 7 大要素提取)
[Neon Serverless PostgreSQL (Prisma)] ◀── [Levenshtein 1-Char 容錯去重]
          │
          ├──────────────────────────┬──────────────────────────┐
          ▼                          ▼                          ▼
  【前台情報牆 Feed】        【品牌小編 Studio】        【Super Admin 中控台】
  • 純 CSS 響應式瀑布流      • DM 批量製卡發布          • 全通路卡片管理 & 批量編輯
  • 4px 超窄邊框卡片         • CPM/CPC 廣告競價投放     • 疑似重複情報中控台
  • 手機左右滑動切換 Tab     • 門市優惠券核銷掃描       • 爬蟲排程與站點中控
  • 歷史價格真假促銷分析     • 品牌情報隔離管理         • 爬蟲成果彈窗 (新建/更新/清理)
```

---

## 🛠️ 技術架構與選型

### 前端層 (Frontend Ecosystem)
* **核心框架**：[Next.js 15.1 (App Router)](https://nextjs.org/) + [React 19](https://react.dev/)
* **語言系統**：[TypeScript 5.7](https://www.typescriptlang.org/)（全站強型別契約）
* **樣式與主題**：[Tailwind CSS 3.4](https://tailwindcss.com/)（自適應 Safe Area、4px 超窄邊框、毛玻璃特效）
* **狀態管理**：[Jotai 2.11](https://jotai.org/)（原子化狀態，管理篩選條件、訂閱標籤與訪客收藏）
* **UI 互動與動效**：
  * `@radix-ui/react-*`（Dialog, DropdownMenu, Popover, Tabs, Toast 原生無障礙基底）
  * `lucide-react`（現代化向量圖示庫）
  * `embla-carousel-react` + `embla-carousel-autoplay`（高效能廣告輪播）
  * `canvas-confetti`（追蹤/收藏互動彩帶反饋）

### 後端與資料層 (Backend & Database)
* **資料庫**：[Neon](https://neon.tech/)（Serverless PostgreSQL 雲端資料庫，支援 Auto-scaling 與 Scale-to-zero）
* **ORM 框架**：[Prisma ORM 6.4](https://www.prisma.io/)（型別安全 Schema 映射與 Migration）
* **後端架構**：Next.js Server Actions + Data Access Layer (DAL)，頂部強制標註 `import 'server-only'`
* **鑑權系統**：Google OAuth 2.0 SSO + Email/密碼雙軌登入（`bcryptjs` 雜湊 + `jose` JWT / DB Session）
* **資料驗證**：[Zod 3.24](https://zod.dev/)（前後端共用 Schema 契約校驗）

### AI 與自動化 (AI & Automation)
* **多模態視覺 AI**：[Google Gemini 2.0 Flash (`@google/genai`)](https://ai.google.dev/)（海報 OCR、品項拆解、價格/起訖日/信用卡回饋結構化提取）
* **爬蟲引擎**：Playwright + Cheerio（全通路官方網站與社群粉專特惠採集）
* **排程系統**：自訂 Cron Worker + RESTful Cron API（支援 4 大黃金窗口與深夜靜默模式）

---

## 🚀 核心系統功能介紹

### 1. 前台情報牆與消費端體驗
* **Pinterest / 小紅書風格純 CSS 瀑布流**：
  * 手機端（`< 768px`）自動適配雙欄瀑布流（2 Columns）。
  * 平板端（`768px ~ 1023px`）適配 3 欄（3 Columns）。
  * 電腦端（`>= 1024px`）維持極致沉浸的 4 欄排版（4 Columns）。
* **4px 超窄邊框特價卡片 (`SmartDealCard`)**：
  * 採用 `p-1` 超窄邊框搭配自然自適應圖片比例，資訊可視面積最大化，徹底消除標題與標籤折行擠壓。
  * 卡片完整呈現 7 大要素：品牌、特價標題、副標題、條件膠囊（買一送一/第2件5折）、折數（如 5 折 · 省 $60）、適用信用卡加碼與活動起訖日。
* **手機端左右手勢滑動切換 Tab**：
  * 在情報牆直接向左/向右滑動即可切換上一/下一分類標籤，頂部標籤列自動平滑滾動置中並觸發輕量觸覺反饋。
* **全功能優惠詳情彈窗 (`DealDetailModal`)**：
  * **高清大圖與 Lightbox 燈箱**：支援點擊圖片開啟全螢幕毛玻璃放大鏡，支援多圖縮圖切換列。
  * **真假促銷歷史價格分析**：展示歷史價格區間、真實折扣幅度與 AI 促銷合理性評鑑。
  * **互動標籤雲**：展示 `#7-ELEVEN`、`#買一送一`、`#國泰CUBE` 等標籤，支援單鍵追蹤/退訂並附帶直達專屬標籤頁面連結（`/tag/[tagName]`）。
  * **情報來源與查驗**：標註官方貼文來源管道與社群數據（👍 讚數、💬 留言數），提供一鍵複製網址與直達官方貼文。
* **多維度進階篩選 (`DealFilterModal`)**：
  * 支援依通路類型（超商/超市/量販/餐飲/手搖）、折扣幅度（5折以下/買一送一）、指定信用卡（國泰/玉山/富邦/台新）、商圈區域等複合篩選。
* **頂部品牌廣告輪播 (`MerchantAdBanner`)**：
  * 電腦端 `3:1`、手機端 `4:3` 黃金比例，搭配右下角懸浮毛玻璃頁碼標籤（如 `1 / 4`）。

### 2. 會員系統與雲端雙向同步
* **雙軌認證機制**：支援 Google SSO 一鍵登入與 Email / 密碼註冊登入（含 Zod 嚴格格式檢驗與密碼強度防呆）。
* **訪客資料無縫合併 (Cloud Sync Service)**：未登入時於 LocalStorage 儲存的追蹤標籤與收藏清單，在登入當下自動無縫整併並持久化至 Neon 遠端資料庫。
* **個人會員中心 (`/profile`)**：支援管理已追蹤標籤池、檢視已收藏特惠清單、帳號安全與登出操作。

### 3. 官方小編品牌工作台 (`/merchant`)
* **品牌專屬隔離權限**：官方小編登入後僅可管理與瀏覽自身品牌的特惠情報。
* **DM 海報批量上傳 ➔ Gemini AI 智能製卡**：
  * 支援小編批量上傳多張促銷海報圖或 URL。
  * Gemini 2.0 Flash 自動識別多品項、特惠價、起訖日與促銷規則，1 秒生成預覽草稿並支援一鍵批量發布。
* **廣告版面競價與投放系統 (`AdCampaign`)**：
  * 支援 **CPM (每千次曝光計費，NT$ 120 / 千次)** 與 **CPC (每次點擊計費，NT$ 3.5 / 點擊)** 兩種廣告模式。
  * 支援版位選擇（首頁 Hero Banner、瀑布流原生贊助卡片、分類置頂廣告）。
  * 內建即時預算成效試算器，即時預估曝光數、點擊數與預估 CTR，並具備投放成效數據儀表板。
* **門市優惠券核銷掃描 (`MerchantQrScanner`)**：提供門市人員現場掃描 QR Code 進行快速特惠核銷模擬。

### 4. 最高管理中控台 (`/admin`)
* **安全防護**：Super Admin 專屬 Layout，具備安全 PIN 碼（`8888`）防護與權限守門員。
* **全通路特價情報 CRUD 與批量操作**：
  * 即時新增、編輯、刪除全站卡片，一鍵切換「🔥 熱門推薦 (isHot)」與「⚡ 破盤快閃 (isFlashDeal)」。
  * **多選批量工具列 (`BatchEditModal`)**：支援多選卡片批量修改分類、通路、起訖日、新增/覆蓋標籤或批量刪除。
* **重複情報比對中控台 (`DuplicateDealsModal`)**：
  * 整合 1-Char 容錯比對演算法，自動分組列出疑似重複卡片。
  * 支援「保留此筆刪除其他」、「合併情報」與「全部保留 (不再提示)」。
* **爬蟲排程與自訂站點中控台 (`AdminCrawlerScheduler`)**：
  * 支援啟用/停用各通路爬蟲、新增自訂爬蟲站點（輸入名稱、網址、Logo 與預設分類）。
  * 支援單站獨立排程配置（跟隨黃金波段、自訂時段、固定間隔分鐘數）與多選批量排程配置。
  * 提供「單站立即抓取」與「全站全量即時抓取」。
* **爬蟲執行成果彈窗 (`CrawlerResultModal`)**：
  * 爬取完成後自動彈窗展示 4 大成果指標（✨ 新建立卡片數、🔄 已更新情報數、🧹 自動清理過期數、📊 總解析特惠筆數）。
  * 提供「全部卡片」、「✨ 新建立」與「🔄 已更新」篩選切換與卡片完整預覽。
* **全站廣告投放監控 (`AdminAdsMonitor`)**：統計全站廣告總預算、已消耗金額、總曝光、總點擊與平均 CTR。

### 5. 智慧爬蟲與排程系統
* **4 大黃金窗口監控**：`08:30` (早餐咖啡快閃)、`12:00` (午間外食手搖飲買1送1)、`18:00` (下班採買促銷)、`21:30` (社群爆文/次日早鳥搶先看)。
* **週四超商週末大促衝刺窗口**：每週四 `17:00`、`18:00`、`19:00` 密集追蹤全家「康康5」與 7-11「超值五六日」買一送一海報發布。
* **深夜靜默機制 (Night Quiet Mode)**：`01:00 ~ 07:30` 全程停止爬蟲與 Headless 瀏覽器運作，節省 80% 閒置雲端運算資源。
* **自動過期清理 (Auto Purge)**：查詢與爬蟲執行時自動在資料庫層清除已過期活動，保持資料庫高效清新。

---

## 🔬 重點演算法與深度優化項目

### ⚡ 效能與排版優化
1. **純 CSS 響應式瀑布流架構（消除 Hydration Layout Shift）**：
   * 徹底廢除舊版依賴 JavaScript `window.innerWidth` 與 `useState` 的分欄重算機制。
   * 改採高效能純 CSS `columns-2 md:columns-3 lg:columns-4` 搭配 `break-inside-avoid`，解決電腦版重整時出現「2 欄 ➔ 4 欄」的畫面跳動閃爍，首幀渲染速度提升 60%。
2. **4px 超窄邊框與自適應圖片比例（Zero Distortion）**：
   * 移除強制固定比例限制，卡片封面與詳情大圖採純自然自適應渲染（`w-full h-auto object-cover`），支援全螢幕 Lightbox 放大檢視，完美呈現海報頂部與底部的文字與價目表。
3. **RSC 極限瘦身與 Server-First 架構**：
   * 頁面 Layout 與資料抓取全面在 Server 端完成，僅在需要使用者互動（彈窗、拖曳、點擊）的葉節點掛載 `'use client'`。
   * DAL 模組與資料庫連線實例強制標註 `import 'server-only'`，防止敏感金鑰洩漏至客戶端。

### 🧠 演算法與 AI 智慧化優化
1. **雙核心 1-Char 容錯重複情報比對（Levenshtein Distance $\le 1$）**：
   * 徹底移除過往寬鬆的子字串包含（`includes`）判定，僅在**活動名稱**或**活動品項**標準化後編輯距離 $\le 1$ 時才歸組（如「拿堤」vs「那堤」、「特大杯美式」vs「中杯美式」）。
   * **持久化防打擾與動態重觸發**：管理者點擊「全部保留 (不再提示)」後持久化記錄已忽略配對；若未來爬蟲抓取到**全新未忽略的重複情報**，系統將自動精準再次發起提示。
2. **Gemini 2.0 Flash 1-to-N 海報全品項拆解與圖片隔離**：
   * 針對一張多格促銷海報（如全家 5 康康），精準拆解出全數 16 筆獨立優惠商品，包含共享促銷（買1送1）與任選多口味機制。
   * 嚴格實施「商品圖卡 1 對 1 精準綁定」，杜絕多圖貼文中非相關商品圖片混雜。

### 🎨 使用者體驗與互動優化 (UI 五態)
全站所有模組嚴格落實 **UI 五態（Five UI States）** 標準：
* ⏳ **Loading**：細粒度骨架屏 (`DealSkeleton`) 或非阻塞 Spinner，禁止空白操作無回饋。
* 📭 **Empty**：無資料時呈現趣味插圖、引導文案與 Call-to-Action 引導按鈕。
* ⚠️ **Error**：友善錯誤提示邊界，並提供一鍵「重試 (Retry)」機制。
* ✅ **Success**：Optimistic UI 樂觀更新、操作成功 Toast 提示與 Canvas Confetti 彩帶動畫。
* 🔒 **Disabled/Active**：處理中防止重複連擊，並提供 Mobile 觸碰震動反饋。

---

## 📁 專案目錄切片結構

本專案依循 **垂直領域切片 (Feature-Driven)** 與 **契約先行 (Schema-First)** 原則設計：

```text
deal-aggregation-platform/
├── prisma/
│   └── schema.prisma            # Neon PostgreSQL 實體模型 (User, Deal, AdCampaign 等)
├── scripts/
│   ├── cron-worker.mjs          # 定時排程工作腳本 (黃金波段 / 深夜靜默)
│   ├── crawl-fb-deals-poc.mjs   # FB 粉專爬蟲原型腳本
│   └── test-duplicate-detector.mjs # 1-Char 容錯比對演算法測試腳本
├── src/
│   ├── app/                     # Next.js App Router 路由裝配層
│   │   ├── admin/               # Super Admin 最高管理中控台頁面
│   │   ├── merchant/            # 官方小編品牌工作台頁面
│   │   ├── profile/             # 會員個人中心頁面
│   │   ├── tag/[tagName]/       # 標籤聚合情報專頁
│   │   ├── api/                 # Route Handlers (auth, deals, cron)
│   │   ├── globals.css          # 全域樣式與 Tailwind 基礎設定
│   │   └── page.tsx             # 前台首頁情報牆
│   ├── features/                # 垂直領域業務切片 (Feature-Driven)
│   │   ├── deals/               # 特價情報模組 (卡片、瀑布流、詳情、1-Char 去重、Gemini Parser)
│   │   ├── ads/                 # 廣告投放與競價模組 (CPM/CPC 建立器、廣告清單)
│   │   ├── admin/               # 最高後台模組 (卡片中控、爬蟲排程、成果彈窗、廣告監控)
│   │   ├── merchant/            # 品牌後台模組 (DM 智能上傳製卡、品牌特惠管理、QR 核銷)
│   │   ├── auth/                # 會員鑑權模組 (Google SSO, Email 登入, AuthModal, 雲端同步)
│   │   ├── subscriptions/       # 標籤訂閱追蹤模組
│   │   └── regions/             # 商圈與區域定義模組
│   └── shared/                  # 全域共用模組 (AppHeader, LayoutShell, Radix UI 元件)
├── docs/
│   ├── PRD-deal-aggregation-platform.md # 產品需求規格書 (完整 PRD & Changelog)
│   └── QA_REPORT.md             # 雙端驗收與品質測試報告
├── PROJECT_RULES.md             # 虛擬開發團隊協作協議與架構規範
└── package.json                 # 專案依賴設定檔
```

---

## ⚙️ 環境變數與快速啟動

### 1. 環境變數配置 (`.env` 或 `.env.local`)

在專案根目錄建立 `.env.local` 檔案並填入以下設定：

```env
# Database (Neon Serverless PostgreSQL)
DATABASE_URL="postgresql://<user>:<password>@<neon-host>/neondb?sslmode=require"

# Google Gemini AI API (用於海報 OCR 與智慧製卡)
GEMINI_API_KEY="your-gemini-api-key"

# Auth / Session Secret (用於 JWT 加密簽章)
JWT_SECRET="your-jwt-secret-key-at-least-32-chars"

# Google OAuth 2.0 (用於 Google SSO 一鍵登入)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Super Admin 安全 PIN 碼 (預設: 8888)
ADMIN_SECURITY_PIN="8888"
```

### 2. 安裝依賴與資料庫初始化

```bash
# 1. 安裝套件依賴
npm install

# 2. 生成 Prisma Client
npx prisma generate

# 3. 推送資料庫結構至 Neon PostgreSQL
npx prisma db push
```

### 3. 啟動開發伺服器

```bash
npm run dev
```

開啟瀏覽器前往 [http://localhost:3000](http://localhost:3000) 即可開始瀏覽全通路特價情報牆！

* **前台情報牆**：`http://localhost:3000`
* **會員個人中心**：`http://localhost:3000/profile`
* **官方小編工作台**：`http://localhost:3000/merchant`
* **最高管理中控台**：`http://localhost:3000/admin`（預設 PIN: `8888`）

---

## 📄 開發與交付規範

本專案遵循 `PROJECT_RULES.md` 所定義之虛擬全端開發團隊標準流程：
* **@PM**：PRD 文檔維護與驗收標準梳理。
* **@Architect**：Zod 契約先行與領域切片劃分。
* **@Backend**：DAL 與 Server Actions 安全實作。
* **@Frontend**：RSC 極限瘦身與 UI 五態完整補齊。
* **@QA**：雙端相容性與全流程自動驗收。

---

*Made with ❤️ by Deal Aggregation Platform Team.*
