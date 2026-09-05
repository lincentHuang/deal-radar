# PRD: Costco 好市多優惠改爬今購百科 (Daybuy.tw) 專題專頁

## 1. 背景與動機
原 Costco 好市多特價情報站點採用 Facebook 粉絲專頁（`https://www.facebook.com/DAYBUY.TW`）抓取模式，受限於社群平台動態貼文排版雜亂、圖片多為拼貼、價格標註不齊全且難以追蹤完整產品編號與原價折價。
今購百科設有專屬的「Costco 優惠DM懶人包」文章分類目錄（`https://www.daybuy.tw/costco/promotions/`），彙整每期最新會員護照、現場隱藏優惠與特別加檔情報。每一篇優惠文章內皆結構化列出特惠品名、好市多貨號（#編號）、原價、折價、特價以及實拍商品/價卡照片。

因此，將好市多爬蟲管線升級為針對 `https://www.daybuy.tw/costco/promotions/` 的目錄深入文章爬取，能大幅提高資料完整度、價格精確度與圖文對齊品質。

## 2. 目標與範疇
- **主要目標**：
  1. 鎖定 `https://www.daybuy.tw/costco/promotions/` 為 Costco 爬蟲目標網址。
  2. 依「只要是有優惠的文章就進去爬」原則，自動過濾非促銷文章（如純試吃預告）。
  3. 進入文章後，完整擷取促銷檔期（起訖日）與各項特惠商品（品名、貨號、原價、特價、折價、配圖）。
  4. 輸出標準 `SmartDeal` 模型，並透過 `upsertCrawledDeals` 寫入資料庫，支援自動排程與後台即時爬取。
  5. 提供現有資料庫目標站點之平滑升級與去重。

## 3. 驗收標準 (Acceptance Criteria, AC)
- **AC-1 目錄文章自動篩選**：
  - 連線 `https://www.daybuy.tw/costco/promotions/`，精準解析出促銷文章連結。
  - 文章標題包含「優惠、特價、特惠、折扣、折價、護照、DM、加檔、好多金、買一送一」且排除純「試吃」預告。
- **AC-2 文章多商品結構化萃取**：
  - 擷取活動期間（例：`2026-08-31` 至 `2026-09-27`）。
  - 對文章內每項商品提取：商品名稱、貨號（例 `#150874`）、原價（originalPrice）、特價（discountPrice）、折價（priceDrop）與專屬配圖（imageUrl）。
- **AC-3 資料庫寫入與去重**：
  - 透過 `upsertCrawledDeals` 確保商品或貼文在更新時不產生無效重複資料。
- **AC-4 後台即時串流與排程整合**：
  - 在後台 `/admin/crawler` 點擊立即爬取時，SSE 能即時推播今購百科目錄檢索進度與文章商品數。
  - 定時排程執行時無縫支援今購百科管線。

## 4. 領域模型與資料映射
- **Merchant**：`Costco 好市多`
- **Category**：`grocery` (或依品項智能歸類)
- **ChannelType**：`offline`
- **Regions**：`['全台門市', '台北市', '新北市', '桃園市', '台中市', '嘉義市', '台南市', '高雄市']`
- **SourcePlatform**：`Daybuy.tw`
- **SourceUrl**：對應的今購百科促銷文章網址
