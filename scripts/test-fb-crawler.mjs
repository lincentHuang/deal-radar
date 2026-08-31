import { chromium } from 'playwright';

async function testCrawl() {
  console.log('🚀 Starting Playwright Chromium...');
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

  const targets = [
    { name: '7-ELEVEN', url: 'https://www.facebook.com/711open' },
    { name: 'FamilyMart 全家', url: 'https://www.facebook.com/FamilyMart' }
  ];

  for (const target of targets) {
    console.log(`\n========================================`);
    console.log(`🔍 Crawling ${target.name} (${target.url})...`);
    try {
      await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 25000 }).catch(e => {
        console.log('Timeout, continuing with current DOM state...');
      });

      await page.waitForTimeout(4000);

      // Close login prompt / dismiss dialog if any
      try {
        const closeBtn = await page.$('div[aria-label="關閉"], div[aria-label="Close"], [role="button"]:has-text("稍後再說"), [role="button"]:has-text("Not Now"), div[aria-label="隱藏"]');
        if (closeBtn) {
          console.log('Found close button for modal, clicking...');
          await closeBtn.click();
          await page.waitForTimeout(1000);
        }
      } catch (e) {
        // ignore
      }

      // Scroll a little bit to trigger lazy loading of posts
      await page.evaluate(() => window.scrollBy(0, 1000));
      await page.waitForTimeout(3000);

      const title = await page.title();
      console.log(`📌 Page Title: ${title}`);

      // Extract posts
      const posts = await page.evaluate(() => {
        const results = [];
        const articles = document.querySelectorAll('div[role="article"]');
        
        if (articles.length === 0) {
          const allText = document.body.innerText;
          return { count: 0, preview: allText.slice(0, 400) };
        }

        articles.forEach((art, idx) => {
          if (idx < 5) {
            const text = art.innerText || '';
            const images = Array.from(art.querySelectorAll('img'))
              .map(img => img.src)
              .filter(src => src && !src.includes('rsrc.php') && !src.includes('emoji') && !src.includes('data:image'));
            
            // Try to find post link / permalink
            const links = Array.from(art.querySelectorAll('a'))
              .map(a => a.href)
              .filter(href => href && (href.includes('/posts/') || href.includes('story.php') || href.includes('fbid=') || href.includes('/photo')));

            results.push({
              index: idx + 1,
              textSnippet: text.replace(/\n+/g, ' ').slice(0, 200),
              imageCount: images.length,
              sampleImage: images[0] || null,
              link: links[0] || null
            });
          }
        });

        return { count: articles.length, items: results };
      });

      console.log(`✅ Extracted ${posts.count || 0} articles/posts:`);
      console.log(JSON.stringify(posts, null, 2));

    } catch (err) {
      console.error(`❌ Error crawling ${target.name}:`, err.message);
    }
  }

  await browser.close();
  console.log('\n🏁 Crawler test finished.');
}

testCrawl();
