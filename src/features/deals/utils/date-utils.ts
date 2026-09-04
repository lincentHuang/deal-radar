/**
 * 專用特惠活動結束日期與時間解析模組 (支援純日期、帶時間、ISO 時區)
 */

/**
 * 解析結束日期時間字串為絕對 Unix 毫秒時間戳
 * 支援格式：
 * 1. 純日期: "2026-09-01" 或 "2026/09/01" -> 預設延續至當天營業結束 23:59:59.999 (Asia/Taipei UTC+8)
 * 2. 帶時間無時區: "2026-09-01 18:00" 或 "2026-09-01 18:30:00" -> 視為 2026-09-01T18:00:00+08:00
 * 3. 帶 ISO 時間: "2026-09-01T18:00:00" 或 "2026-09-01T18:00:00+08:00" 或 "2026-09-01T10:00:00Z"
 */
export function parseDealEndTimestamp(endDateStr?: string | null): number | null {
  if (!endDateStr || typeof endDateStr !== 'string') return null;

  const raw = endDateStr.trim();
  if (!raw) return null;

  try {
    // 1. 若已經包含完整時區標記 (+08:00, -05:00, Z)
    if (/[+-]\d{2}:\d{2}$|Z$/i.test(raw)) {
      const parsed = Date.parse(raw);
      return isNaN(parsed) ? null : parsed;
    }

    // 2. 判斷是否包含具體時間部分 (例如 18:00, 18:00:00, 09:30)
    const hasTimeComponent = /[\sT]\d{1,2}:\d{2}(:\d{2}(\.\d+)?)?/.test(raw);

    if (hasTimeComponent) {
      // 替換空格為 T，並預設套用台灣時區 +08:00
      let normalized = raw.replace(/\s+/, 'T').replace(/\//g, '-');
      // 如果時間只有 HH:mm，補上 :00
      if (/T\d{1,2}:\d{2}$/.test(normalized)) {
        normalized += ':00';
      }
      // 附加台灣時區 +08:00
      normalized += '+08:00';

      const parsed = Date.parse(normalized);
      if (!isNaN(parsed)) return parsed;
    }

    // 3. 純日期格式 (例如 2026-09-01, 2026/09/01)
    const dateOnlyMatch = raw.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
    if (dateOnlyMatch) {
      const [, y, m, d] = dateOnlyMatch;
      const year = y;
      const month = m.padStart(2, '0');
      const day = d.padStart(2, '0');
      // 純日期代表整個營業日有效，過期時間為當日 23:59:59.999 台灣時間
      const endOfDayIso = `${year}-${month}-${day}T23:59:59.999+08:00`;
      const parsed = Date.parse(endOfDayIso);
      if (!isNaN(parsed)) return parsed;
    }

    // 4. 一般 Date.parse 兜底
    const fallback = Date.parse(raw);
    return isNaN(fallback) ? null : fallback;
  } catch {
    return null;
  }
}

/**
 * 解析開始日期時間字串為絕對 Unix 毫秒時間戳
 */
export function parseDealStartTimestamp(startDateStr?: string | null): number | null {
  if (!startDateStr || typeof startDateStr !== 'string') return null;

  const raw = startDateStr.trim();
  if (!raw) return null;

  try {
    if (/[+-]\d{2}:\d{2}$|Z$/i.test(raw)) {
      const parsed = Date.parse(raw);
      return isNaN(parsed) ? null : parsed;
    }

    const hasTimeComponent = /[\sT]\d{1,2}:\d{2}(:\d{2}(\.\d+)?)?/.test(raw);

    if (hasTimeComponent) {
      let normalized = raw.replace(/\s+/, 'T').replace(/\//g, '-');
      if (/T\d{1,2}:\d{2}$/.test(normalized)) {
        normalized += ':00';
      }
      normalized += '+08:00';
      const parsed = Date.parse(normalized);
      if (!isNaN(parsed)) return parsed;
    }

    const dateOnlyMatch = raw.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
    if (dateOnlyMatch) {
      const [, y, m, d] = dateOnlyMatch;
      const year = y;
      const month = m.padStart(2, '0');
      const day = d.padStart(2, '0');
      const startOfDayIso = `${year}-${month}-${day}T00:00:00.000+08:00`;
      const parsed = Date.parse(startOfDayIso);
      if (!isNaN(parsed)) return parsed;
    }

    const fallback = Date.parse(raw);
    return isNaN(fallback) ? null : fallback;
  } catch {
    return null;
  }
}

/**
 * 判斷特價情報是否已過期 (以當前毫秒時間戳比對)
 */
export function isDealExpired(endDateStr?: string | null, nowMs: number = Date.now()): boolean {
  if (!endDateStr) return false;
  const endTimestamp = parseDealEndTimestamp(endDateStr);
  if (endTimestamp === null) return false; // 無法解析時採取安全保留策略
  return endTimestamp < nowMs;
}

/**
 * 獲取當前台灣時區 (Asia/Taipei UTC+8) 的 YYYY-MM-DD 日期字串
 */
export function getTaipeiDateString(date: Date = new Date()): string {
  const tzOffset = 8 * 60; // in minutes
  const localTime = new Date(date.getTime() + (tzOffset + date.getTimezoneOffset()) * 60000);
  const year = localTime.getFullYear();
  const month = String(localTime.getMonth() + 1).padStart(2, '0');
  const day = String(localTime.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
