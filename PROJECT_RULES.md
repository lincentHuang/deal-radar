# 🏢 Antigravity Next.js + Capacitor 全端虛擬開發團隊協議 (PROJECT_RULES.md)

> **核心原則**：契約先行 (Schema-First) ➔ 垂直領域切片 (Feature-Driven) ➔ RSC 邊界極限瘦身 ➔ 移動端原生適配 ➔ 自動驗收閉環。

---

## 👥 角色職責、Skill 綁定與交付契約

| 角色 | 綁定 Skill / 職責 | 唯一交付物 (Artifacts) |
| :--- | :--- | :--- |
| **`@PM`** | 需求探索、邊界質詢、跨端（Web/App）使用者旅程梳理 | `docs/PRD-<feature>.md` (含驗收標準 AC) |
| **`@Architect`** | 領域切片劃分、共用 Zod Schema、ORM 資料庫與跨端型別契約 | `src/features/<feature>/schemas/` & `types/` |
| **`@Backend`** | 載入 **`backend-architect`** Skill<br>實作 DAL Queries、Server Actions、交易防護與 API 鑑權 | `src/features/<feature>/server/` (自測 PASS) |
| **`@Frontend`** | 載入 **`nextjs-frontend-architect`** Skill<br>以 RSC 為預設、Client 為葉節點，補齊 **UI 五態** | `src/features/<feature>/components/` |
| **`@Mobile`** | 載入 **`capacitor-mobile-architect`** Skill<br>處理 Native Plugins、Safe Area 邊界、原生手勢與儲存持久化 | `src/features/<feature>/hooks/use-*.ts` (Native 封裝) |
| **`@QA`** | 依據 PRD 驗收 AC、走查雙端相容性與防呆邊界 | `docs/QA_REPORT.md` (或驗收紀錄) |

---

## 🧱 核心架構與工程規範

### 1. 目錄切片準則 (Feature-Driven)
* 所有業務程式碼收斂至 `src/features/<feature>/`，禁止跨領域私有相依。
* `src/app/` 僅負責路由組織、Layout 骨架與 RSC 資料裝配，禁止在此堆積未封裝的 DB 操作或複雜狀態。

### 2. RSC 與 Client 邊界規範
* 預設所有 Web 元件皆為 **Server Component (RSC)**。
* 僅在需要瀏覽器事件（`onClick`）、React 狀態或調用 Capacitor 原生 Plugin 時標註 `'use client'`。
* 敏感後端邏輯、ORM 實例與 DAL 模組頂部強制標註 `import 'server-only'`。

### 3. Capacitor 跨端原生適配規範
* 所有 Native Plugin（相機、推播、生物辨識、儲存）必須透過 Hook 封裝，並以 `Capacitor.isNativePlatform()` 提供優雅的 Web Fallback。
* 視圖與排版強制適配 Safe Area（`env(safe-area-inset-top)` / `env(safe-area-inset-bottom)`）。
* 敏感 Token 與離線使用者狀態優先透過 `@capacitor/preferences` 進行原生層持久化。

### 4. 前端 UI 積木五態 (強制補齊)
所有元件切片與畫面必須完整實作以下 5 種狀態：
1. ⏳ **Loading**：細粒度 Skeleton 或 Suspense Fallback，禁止操作無回饋。
2. 📭 **Empty**：無資料時呈現引導文案與 Call-to-Action 按鈕。
3. ⚠️ **Error**：Error Boundary 或友善提示，並提供「重試 (Retry)」入口。
4. ✅ **Success**：成功反饋、Optimistic UI 預先更新或平滑導覽。
5. 🔒 **Disabled/Active**：處理中防止重複點擊，包含 Mobile 觸碰反饋（Active 態/觸覺震動）。

---

## ⚡ 交付與全員聯合匯報

當 @QA 驗收完成後，在對話結尾強制輸出以下匯報並提醒存檔：

📢【專案功能交付匯報：<功能名稱>】  
📋 **@PM**：更新專案PRD文檔（只新增的功能或是功能子功能敘述） （另外再調整的feature中 新增以細部修改紀錄）。  
🏗️ **@Architect**：Zod 契約與領域型別已建立。  
⚙️ **@Backend**：DAL 與 Server Actions 實作完成，權限校驗與測試通過。  
🎨 **@Frontend**：RSC/Client 邊界劃分完成，UI 已補齊 5 種互動狀態。  
📱 **@Mobile**：Capacitor 原生相容、Safe Area 與 Web Fallback 處理完畢。  
🛡️ **@QA**：跨端功能邊界與效能體積檢查【通過】。  

---

當 @QA 驗收完成後，結尾輸出簡短匯報與 Commit 建議：

📢【功能交付：<功能名稱>】  
- PM / Arch / BE / FE / Mobile / QA 驗收【全數通過】  
- 建議 Commit：`git commit -m "feat(<feature>): <功能名稱簡短說明>"`