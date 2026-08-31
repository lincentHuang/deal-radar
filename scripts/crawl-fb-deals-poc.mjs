import { chromium } from 'playwright';

export async function crawlFacebookPages(targets) {
  console.log('🚀 Launching headless browser for FB Crawling...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox']
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 900 },
    locale: 'zh-TW',
  });

  const page = await context.newPage();
  const allDeals = [];

  for (const target of targets) {
    console.log(`\n========================================`);
    console.log(`🔍 Scraping: ${target.name} (${target.url})`);
    try {
      await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 25000 }).catch(() => {});
      await page.waitForTimeout(3000);

      // Close login modal if present
      try {
        const closeBtn = await page.$('div[aria-label="關閉"], div[aria-label="Close"], [role="button"]:has-text("稍後再說"), [role="button"]:has-text("Not Now"), div[aria-label="隱藏"]');
        if (closeBtn) {
          await closeBtn.click();
          await page.waitForTimeout(1000);
        }
      } catch (e) {}

      // Expand "查看更多" / "See more" buttons in feed
      try {
        const seeMoreBtns = await page.$$('div[role="button"]:has-text("查看更多"), span:has-text("查看更多")');
        for (const btn of seeMoreBtns.slice(0, 10)) {
          await btn.click().catch(() => {});
        }
        await page.waitForTimeout(1500);
      } catch (e) {}

      // Scroll slightly to load more
      await page.evaluate(() => window.scrollBy(0, 1200));
      await page.waitForTimeout(2500);

      // Extract detailed post data
      const extractedPosts = await page.evaluate((merchantInfo) => {
        const results = [];
        const articles = document.querySelectorAll('div[role="article"]');

        articles.forEach((art, idx) => {
          if (idx >= 6) return;

          // Get clean text
          const rawText = art.innerText || '';
          if (!rawText.trim()) return;

          // Filter out comment articles if any
          if (rawText.length < 20) return;

          // Get images
          const images = Array.from(art.querySelectorAll('img'))
            .map(img => img.src)
            .filter(src => src && !src.includes('rsrc.php') && !src.includes('emoji') && !src.includes('data:image'));

          // Get permalink
          const links = Array.from(art.querySelectorAll('a'))
            .map(a => a.href)
            .filter(href => href && (href.includes('/posts/') || href.includes('story.php') || href.includes('fbid=')));

          // Remove common UI noise from text
          const cleanedText = rawText
            .replace(/所有心情：.*$/gs, '')
            .replace(/讚\s*留言\s*分享.*/gs, '')
            .replace(/查看更多/g, '')
            .trim();

          results.push({
            id: `fb-${merchantInfo.id}-${Date.now()}-${idx}`,
            merchantName: merchantInfo.name,
            merchantId: merchantInfo.id,
            postText: cleanedText,
            images: Array.from(new Set(images)),
            sourceUrl: links[0] || merchantInfo.url,
            crawledAt: new Date().toISOString()
          });
        });

        return results;
      }, target);

      console.log(`✅ Extracted ${extractedPosts.length} posts from ${target.name}`);
      allDeals.push(...extractedPosts);

    } catch (err) {
      console.error(`❌ Failed scraping ${target.name}:`, err.message);
    }
  }

  await browser.close();
  return allDeals;
}

// Run test
(async () => {
  const targets = [
    { id: '7eleven', name: '7-ELEVEN', url: 'https://www.facebook.com/711open' },
    { id: 'familymart', name: 'FamilyMart 全家', url: 'https://www.facebook.com/FamilyMart' },
    { id: 'costco', name: 'Costco 好市多特價情報', url: 'https://www.facebook.com/DAYBUY.TW' },
    { id: 'starbucks', name: '星巴克 Starbucks', url: 'https://www.facebook.com/starbuckstaiwan' },
    { id: 'mcdonalds', name: '麥當勞 McDonald\'s', url: 'https://www.facebook.com/mcdonalds.tw' },
    { id: 'kfc', name: '肯德基 KFC', url: 'https://www.facebook.com/kfctaiwan' },
    { id: 'milksha', name: '迷客夏 Milksha', url: 'https://www.facebook.com/MilkshaTW' },
    { id: 'macu', name: '麻古茶坊 MACU', url: 'https://www.facebook.com/macu2008.tw' },
    { id: 'kebuke', name: '可不可熟成紅茶 KEBUKE', url: 'https://www.facebook.com/kebuke2008' },
  ];

  const results = await crawlFacebookPages(targets);
  console.log('\n🎉 Crawl completed! Summary of extracted posts:');
  results.forEach((post, i) => {
    console.log(`\n--- [${i + 1}] ${post.merchantName} ---`);
    console.log(`🔗 Link: ${post.sourceUrl}`);
    console.log(`🖼️ Images (${post.images.length}):`, post.images[0] || 'No image');
    console.log(`📝 Content snippet:\n${post.postText.slice(0, 150)}...`);
  });
})();
