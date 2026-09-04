# PRD: 最高管理後台 Sidebar 側邊欄重構與管理權限編輯獨立子頁面

## 1. 背景與問題陳述 (Background & Problem Statement)

目前「特價情報站」之最高管理後台 (`/admin`) 為單一頁面 (`AdminDashboard`)，透過頂部橫向水平 Tab（`deals`、`crawler`、`ads`）進行功能切換。隨著系統管理功能增加，產生以下三大痛點：

1. **導覽空間受限且擴充不易**：橫向水平 Tab 難以容納更多設定頁面，缺乏現代後台系統清晰的階層化分類（維運、權限、設定）。
2. **缺乏真正的管理權限與角色編輯功能**：雖然系統設計有 `USER`、`MERCHANT`、`ADMIN` 三種權限角色，且具備最高管理 PIN 碼驗證，但後台缺乏直觀的使用者權限編輯介面、角色提升/降級機制以及安全設定面板。
3. **頁面未切分 (單一巨大頁面)**：所有模組集中於 `/admin`，無法直接透過專屬 URL 路由書籤收藏特定管理頁面，也難以針對個別頁面進行細緻的權限隔離與效能加載優化。

---

## 2. 目標與驗收標準 (Objectives & Acceptance Criteria - AC)

### AC 1: 響應式 Sidebar 側邊欄導覽體系 (Admin Sidebar Navigation)
- [x] 桌面端提供現代簡約風格的左側 Sidebar（260px），具備摺疊 (Collapse) 與展開 (Expand) 切換。
- [x] 移動端提供直覺的漢堡選單抽屜 (Drawer Sheet)，適配 Safe Area（頂部與底部安全邊界），並支援觸覺回饋 (`useMobileNative`)。
- [x] 導覽項目分類清晰：
  - **情報維運**：
    - 📊 後台總覽 (`/admin`)
    - 🏷️ 全域特價卡片 (`/admin/deals`)
    - 🤖 爬蟲排程中控 (`/admin/crawler`)
    - 📢 廣告全域監控 (`/admin/ads`)
  - **管理與安全**：
    - 🛡️ 管理權限編輯 (`/admin/permissions`)
    - ⚙️ 系統安全設定 (`/admin/settings`)
- [x] 側邊欄提供快捷功能：系統爬蟲節點狀態、重新整理、快速鎖定後台、返回前台首頁。

### AC 2: 獨立子路由切片 (Dedicated Sub-pages Routing)
- [x] 改造 `src/app/admin/` 為 Next.js App Router 子路由架構：
  - `/admin/layout.tsx`：提供統一後台 Shell 與全域 `AdminAuthGuard` 安全鎖定屏。
  - `/admin/page.tsx`：中控台總覽頁面，整合核心數據統計與快速入口卡片。
  - `/admin/deals/page.tsx`：專屬全域特價卡片管理頁面。
  - `/admin/crawler/page.tsx`：專屬爬蟲目標站點與排程中控頁面。
  - `/admin/ads/page.tsx`：專屬廣告投放監控頁面。
  - `/admin/permissions/page.tsx`：專屬管理權限編輯頁面。
  - `/admin/settings/page.tsx`：專屬系統安全設定頁面。

### AC 3: 管理權限編輯 (Permission Management) 深度功能
- [x] **使用者清單與權限檢視**：即時查詢註冊使用者（姓名、Email、頭像、目前角色、註冊來源、註冊時間）。
- [x] **角色即時編輯**：管理員可直接在表格中將使用者權限調整為 `USER`、`MERCHANT` 或 `ADMIN`，並提供確認防呆提示。
- [x] **權限階層說明矩陣 (Role Matrix)**：以可視化表格清晰對照一般會員、特約商家、最高管理員的權限劃分。
- [x] **搜尋與篩選**：支援以姓名/Email 即時搜尋，並可按角色過濾。

### AC 4: 系統安全設定 (Security & PIN Settings)
- [x] **安全 PIN 碼線上變更**：支援管理員輸入舊 PIN 碼驗證後，設定新 4-8 位 PIN 碼，並持久化保存。
- [x] **快速展示模式開關 (Demo Mode Toggle)**：支援在生產環境關閉「8888 一鍵解鎖」，防範未授權存取。
- [x] **操作稽核日誌**：任何權限調整與 PIN 碼變更，均自動寫入後台日誌資料庫。

### AC 5: 前端 UI 積木五態全覆蓋
- [x] 完整落實 Loading（細粒度 Skeleton）、Empty（無資料/搜尋無果引導）、Error（重試入口）、Success（Toast 回饋）、Disabled（防重複觸發）五種狀態。

---

## 3. 系統架構與流程圖 (System Architecture & Flow)

```mermaid
flowchart TD
    A[進入 /admin/* 任意子路徑] --> B[AdminLayout]
    B --> C{AdminAuthGuard 驗證}
    C -- 未通過 --> D[PIN 碼鎖定屏 (預設 8888)]
    C -- 驗證通過 --> E[AdminShell]
    E --> F[響應式 Sidebar 側邊欄]
    E --> G[頂部 Header 與麵包屑]
    E --> H[主視圖 Sub-routes]

    F -->|點擊| I1[/admin: 總覽儀表板]
    F -->|點擊| I2[/admin/deals: 全域特價卡片]
    F -->|點擊| I3[/admin/crawler: 爬蟲排程中控]
    F -->|點擊| I4[/admin/ads: 廣告全域監控]
    F -->|點擊| I5[/admin/permissions: 管理權限編輯]
    F -->|點擊| I6[/admin/settings: 系統安全設定]

    I5 --> J1[使用者名冊表格]
    I5 --> J2[角色變更 Action (USER/MERCHANT/ADMIN)]
    I5 --> J3[權限矩陣對照表]

    I6 --> K1[變更安全 PIN 碼]
    I6 --> K2[切換 8888 演示模式]
```
