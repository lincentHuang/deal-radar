const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function render() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1024, height: 1024 },
    deviceScaleFactor: 2
  });

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1024px;
      height: 1024px;
      background: #F4F5F7;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    /* 背景柔和格線，呼應參考圖的 iOS App Store/Grid 氛圍 */
    .bg-grid {
      position: absolute;
      inset: 0;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, 1fr);
      gap: 36px;
      padding: 36px;
      opacity: 0.6;
    }
    .bg-cell {
      background: #FFFFFF;
      border-radius: 96px;
    }

    /* 主 App Icon 容器 (Squircle) */
    .icon-wrapper {
      position: relative;
      z-index: 10;
      width: 540px;
      height: 540px;
      background: #18191B;
      border-radius: 125px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 
        0 40px 80px -15px rgba(0, 0, 0, 0.35),
        0 20px 40px -10px rgba(0, 0, 0, 0.25),
        inset 0 1px 1px rgba(255, 255, 255, 0.12),
        inset 0 -1px 1px rgba(0, 0, 0, 0.5);
    }

    /* 四角星光 (Sparkle) */
    .sparkle {
      position: absolute;
      top: 76px;
      right: 76px;
      width: 46px;
      height: 46px;
      filter: drop-shadow(0 2px 8px rgba(255, 255, 255, 0.4));
    }

    /* 特價標籤本體 (Pearl Deal Tag) */
    .tag-container {
      position: relative;
      width: 250px;
      height: 330px;
      filter: drop-shadow(0 18px 24px rgba(0, 0, 0, 0.45));
    }
  </style>
</head>
<body>
  <div class="bg-grid">
    <div class="bg-cell"></div><div class="bg-cell"></div><div class="bg-cell"></div>
    <div class="bg-cell"></div><div class="bg-cell"></div><div class="bg-cell"></div>
    <div class="bg-cell"></div><div class="bg-cell"></div><div class="bg-cell"></div>
  </div>

  <div class="icon-wrapper">
    <!-- 右上角 4 角星光芒 -->
    <svg class="sparkle" viewBox="0 0 100 100">
      <path d="M 50 0 C 50 35, 65 50, 100 50 C 65 50, 50 65, 50 100 C 50 65, 35 50, 0 50 C 35 50, 50 35, 50 0 Z" fill="#FFFFFF"/>
    </svg>

    <!-- 特價吊牌本體 -->
    <div class="tag-container">
      <svg viewBox="0 0 260 340" width="260" height="340">
        <defs>
          <!-- 珠光幻彩網格漸層 (完全還原參考圖的薄荷綠、紫丁香、純白珍珠色) -->
          <linearGradient id="pearlBase" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#E8EFFF" />
            <stop offset="30%" stop-color="#D7E1FF" />
            <stop offset="60%" stop-color="#D2F7EE" />
            <stop offset="100%" stop-color="#CEF3EB" />
          </linearGradient>

          <radialGradient id="lilacGlow" cx="25%" cy="45%" r="55%">
            <stop offset="0%" stop-color="#C7CEFF" stop-opacity="0.9" />
            <stop offset="60%" stop-color="#C7CEFF" stop-opacity="0" />
          </radialGradient>

          <radialGradient id="mintGlow" cx="85%" cy="35%" r="60%">
            <stop offset="0%" stop-color="#A7F3D0" stop-opacity="0.85" />
            <stop offset="60%" stop-color="#A7F3D0" stop-opacity="0" />
          </radialGradient>

          <linearGradient id="topHighlight" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95" />
            <stop offset="35%" stop-color="#FFFFFF" stop-opacity="0.2" />
            <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
          </linearGradient>

          <!-- 吊牌孔深邃立體陰影 -->
          <radialGradient id="holeInnerShadow" cx="50%" cy="35%" r="50%">
            <stop offset="70%" stop-color="#18191B" />
            <stop offset="100%" stop-color="#0E0F10" />
          </radialGradient>

          <!-- 柔和微腮紅 -->
          <radialGradient id="blushGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#F472B6" stop-opacity="0.35" />
            <stop offset="100%" stop-color="#F472B6" stop-opacity="0" />
          </radialGradient>
        </defs>

        <!-- 1. 吊牌實體路徑 (經典特價標籤：頂部斜肩折角 + 圓角 + 底部圓潤收邊) -->
        <path d="
          M 75 12
          L 185 12
          C 200 12, 212 18, 222 30
          L 250 68
          C 258 78, 258 90, 258 102
          L 258 300
          C 258 322, 240 336, 218 336
          L 42 336
          C 20 336, 2 322, 2 300
          L 2 102
          C 2 90, 2 78, 10 68
          L 38 30
          C 48 18, 60 12, 75 12 Z
        " fill="url(#pearlBase)" />

        <!-- 幻彩光澤層 -->
        <path d="
          M 75 12 L 185 12 C 200 12, 212 18, 222 30 L 250 68 C 258 78, 258 90, 258 102 L 258 300 C 258 322, 240 336, 218 336 L 42 336 C 20 336, 2 322, 2 300 L 2 102 C 2 90, 2 78, 10 68 L 38 30 C 48 18, 60 12, 75 12 Z
        " fill="url(#lilacGlow)" />

        <path d="
          M 75 12 L 185 12 C 200 12, 212 18, 222 30 L 250 68 C 258 78, 258 90, 258 102 L 258 300 C 258 322, 240 336, 218 336 L 42 336 C 20 336, 2 322, 2 300 L 2 102 C 2 90, 2 78, 10 68 L 38 30 C 48 18, 60 12, 75 12 Z
        " fill="url(#mintGlow)" />

        <!-- 頂部高光倒角 -->
        <path d="
          M 75 12 L 185 12 C 200 12, 212 18, 222 30 L 250 68 C 258 78, 258 90, 258 102 L 258 300 C 258 322, 240 336, 218 336 L 42 336 C 20 336, 2 322, 2 300 L 2 102 C 2 90, 2 78, 10 68 L 38 30 C 48 18, 60 12, 75 12 Z
        " fill="url(#topHighlight)" />

        <!-- 2. 特價吊牌頂部穿繩圓孔 (Grommet Hole) -->
        <circle cx="130" cy="50" r="14" fill="url(#holeInnerShadow)" />
        <circle cx="130" cy="50" r="14" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" fill="none" />
        <circle cx="130" cy="51" r="13" stroke="rgba(0,0,0,0.4)" stroke-width="1" fill="none" />

        <!-- 3. 可愛粉嫩微腮紅 -->
        <ellipse cx="64" cy="208" rx="18" ry="10" fill="url(#blushGlow)" />
        <ellipse cx="196" cy="208" rx="18" ry="10" fill="url(#blushGlow)" />

        <!-- 4. 超萌可愛特務雙眼 (帶靈動高光) -->
        <!-- 左眼 -->
        <g transform="translate(94, 185)">
          <ellipse cx="0" cy="0" rx="14" ry="22" fill="#18191B" />
          <!-- 主大高光 -->
          <circle cx="-3.5" cy="-8" r="6" fill="#FFFFFF" />
          <!-- 副微光 -->
          <circle cx="4" cy="5" r="3" fill="#FFFFFF" opacity="0.85" />
        </g>

        <!-- 右眼 -->
        <g transform="translate(166, 185)">
          <ellipse cx="0" cy="0" rx="14" ry="22" fill="#18191B" />
          <!-- 主大高光 -->
          <circle cx="-3.5" cy="-8" r="6" fill="#FFFFFF" />
          <!-- 副微光 -->
          <circle cx="4" cy="5" r="3" fill="#FFFFFF" opacity="0.85" />
        </g>
      </svg>
    </div>
  </div>
</body>
</html>
  `;

  await page.setContent(htmlContent, { waitUntil: 'networkidle' });

  const outputDirArtifact = '/Users/huanglingcheng/.gemini/antigravity/brain/7b8a3e8e-276e-4f3f-a42c-ac072fcb94db';
  const outputDirPublic = '/Users/huanglingcheng/Documents/特價情報站/public/images';

  if (!fs.existsSync(outputDirPublic)) {
    fs.mkdirSync(outputDirPublic, { recursive: true });
  }

  const outputPathArtifact = path.join(outputDirArtifact, 'deal_tag_cute_eyes.png');
  const outputPathPublic = path.join(outputDirPublic, 'deal_tag_cute_eyes.png');

  await page.screenshot({ path: outputPathArtifact, type: 'png' });
  await page.screenshot({ path: outputPathPublic, type: 'png' });

  console.log('SUCCESS: Rendered logo image to:');
  console.log('- ' + outputPathArtifact);
  console.log('- ' + outputPathPublic);

  await browser.close();
}

render().catch(err => {
  console.error(err);
  process.exit(1);
});
