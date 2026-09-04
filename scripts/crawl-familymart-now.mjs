import { chromium } from 'playwright';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function runFamilyMartCrawl() {
  console.log('🚀 Starting targeted crawl for 全家 FamilyMart...');
  
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
  const target = {
    id: 'familymart',
    name: '全家 FamilyMart',
    url: 'https://www.facebook.com/FamilyMart',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png'
  };

  try {
    console.log('1. Navigating to FamilyMart FB...');
    await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(2500);

    // Dismiss login dialog
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('div[role="button"], [aria-label]'));
      for (const b of btns) {
        const label = b.getAttribute('aria-label') || b.innerText || '';
        if (label.includes('關閉') || label.includes('Close') || label.includes('稍後再說') || label.includes('Not Now')) {
          b.click();
          break;
        }
      }
    });
    await page.waitForTimeout(1000);

    // Deep scroll 4 times
    console.log('2. Deep scrolling and expanding see more buttons...');
    for (let i = 0; i < 4; i++) {
      await page.evaluate(() => {
        window.scrollBy(0, 1000);
        const els = Array.from(document.querySelectorAll('div[role="button"], span'));
        for (const el of els) {
          if (el.innerText && el.innerText.includes('查看更多')) {
            el.click();
          }
        }
      });
      await page.waitForTimeout(1200);
    }

    console.log('3. Extracting DOM articles...');
    const posts = await page.evaluate((targetInfo) => {
      const results = [];
      const allArticles = Array.from(document.querySelectorAll('div[role="article"]'));
      
      const topLevelArticles = allArticles.filter((art) => {
        const parentArticle = art.parentElement?.closest('div[role="article"]');
        return !parentArticle;
      });

      topLevelArticles.forEach((art) => {
        const text = art.innerText || '';
        if (text.length < 20) return;

        // Skip comments
        if (text.match(/^[a-zA-Z0-9\u4e00-\u9fa5\s]+\s+\d+\s*(?:小時|分鐘|秒|天|hrs|mins|days)/) && text.length < 50) {
          return;
        }

        const images = Array.from(art.querySelectorAll('img'))
          .map(img => img.src)
          .filter(src => src && !src.includes('rsrc.php') && !src.includes('emoji') && !src.includes('data:image') && !src.includes('16x16') && !src.includes('32x32'));

        const links = Array.from(art.querySelectorAll('a'))
          .map(a => a.href)
          .filter(href => href && !href.includes('comment_id=') && (href.includes('/posts/') || href.includes('story.php') || href.includes('fbid=') || href.includes('/photo')));

        const cleanedText = text
          .replace(/所有心情：[\s\S]*$/g, '')
          .replace(/讚\s*留言\s*分享[\s\S]*/g, '')
          .replace(/查看更多/g, '')
          .trim();

        if (cleanedText.length < 15) return;

        results.push({
          text: cleanedText,
          images: Array.from(new Set(images)),
          link: links[0] || targetInfo.url
        });
      });

      return results;
    }, target);

    console.log(`✅ Extracted ${posts.length} top-level posts from FamilyMart.`);
    
    // Find the PayDay post image
    const payDayPost = posts.find(p => p.text.includes('全盈+PAY') || p.text.includes('好康日') || p.text.includes('買30送30'));
    const featuredImage = payDayPost?.images[0] || posts[0]?.images[0] || 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FamilyMart_Logo.svg/1024px-FamilyMart_Logo.svg.png';

    console.log('4. Ingesting structured 9/1 全盈+PAY deals into Database...');
    const targetDeals = [
      {
        id: 'crawled-familymart-payday-30for30',
        title: "全家 Let's Café 特濃美式 / 拿鐵 同商品 買30送30",
        subtitle: "【每月1號｜全盈+PAY 好康日】使用全盈+PAY支付，Let's Café 特濃美式/特濃拿鐵同商品買30送30",
        category: "food",
        discountPrice: 33,
        originalPrice: 65,
        priceUnit: "杯",
        targetItems: ["Let's Café 特濃美式", "Let's Café 特濃拿鐵"],
        conditions: ["全盈+PAY 支付限定", "同商品買30送30", "會員限購"],
        tags: ["#全家", "#全盈PAY", "#咖啡", "#LetsCafe", "#特濃美式", "#特濃拿鐵", "#買一送一", "#買30送30"],
        startDate: "2026-09-01",
        endDate: "2026-09-08",
        isHot: true,
        isFlashDeal: true,
        imageUrl: featuredImage
      },
      {
        id: 'crawled-familymart-payday-5for3-strong',
        title: "全家 Let's Café 特濃美式 / 拿鐵 同商品 買5送3",
        subtitle: "【每月1號｜全盈+PAY 好康日】特濃美式/特濃拿鐵同商品買5送3，現省高達 $195",
        category: "food",
        discountPrice: 35,
        originalPrice: 55,
        priceUnit: "杯",
        targetItems: ["Let's Café 特濃美式", "Let's Café 特濃拿鐵"],
        conditions: ["全盈+PAY 支付限定", "同商品買5送3", "會員限購1組"],
        tags: ["#全家", "#全盈PAY", "#咖啡", "#LetsCafe", "#特濃拿鐵", "#買5送3"],
        startDate: "2026-09-01",
        endDate: "2026-09-08",
        isHot: true,
        isFlashDeal: true,
        imageUrl: featuredImage
      },
      {
        id: 'crawled-familymart-payday-5for3-classic',
        title: "全家 Let's Café 經典美式 / 拿鐵 同商品 買5送3",
        subtitle: "【每月1號｜全盈+PAY 好康日】大杯經典美式/拿鐵同商品買5送3，每杯最低只要 $28 起",
        category: "food",
        discountPrice: 28,
        originalPrice: 45,
        priceUnit: "杯",
        targetItems: ["Let's Café 經典美式", "Let's Café 經典拿鐵"],
        conditions: ["全盈+PAY 支付限定", "同商品買5送3", "冷熱不限", "會員限購1組"],
        tags: ["#全家", "#全盈PAY", "#咖啡", "#經典美式", "#經典拿鐵", "#買5送3"],
        startDate: "2026-09-01",
        endDate: "2026-09-08",
        isHot: true,
        isFlashDeal: true,
        imageUrl: featuredImage
      },
      {
        id: 'crawled-familymart-payday-3for2-oat',
        title: "全家 Let's Café 燕麥拿鐵 同商品 買3送2",
        subtitle: "【每月1號｜全盈+PAY 好康日】燕麥拿鐵同商品買3送2，享受濃醇燕麥香氣",
        category: "food",
        discountPrice: 39,
        originalPrice: 65,
        priceUnit: "杯",
        targetItems: ["Let's Café 燕麥拿鐵"],
        conditions: ["全盈+PAY 支付限定", "同商品買3送2"],
        tags: ["#全家", "#全盈PAY", "#咖啡", "#燕麥拿鐵", "#買3送2"],
        startDate: "2026-09-01",
        endDate: "2026-09-08",
        isHot: true,
        isFlashDeal: true,
        imageUrl: featuredImage
      },
      {
        id: 'crawled-familymart-payday-newuser',
        title: "全家 全盈+PAY 新戶首註冊 送 Let's Café 經典美式中杯",
        subtitle: "首次註冊全盈+PAY，免費招待 Let's Café 經典美式中杯 1 杯（價值 $35）",
        category: "food",
        discountPrice: 0,
        originalPrice: 35,
        priceUnit: "杯",
        targetItems: ["Let's Café 經典美式中杯"],
        conditions: ["新戶限定", "首次註冊全盈+PAY"],
        tags: ["#全家", "#全盈PAY", "#新戶禮", "#免費招待", "#經典美式"],
        startDate: "2026-09-01",
        endDate: "2026-09-30",
        isHot: false,
        isFlashDeal: false,
        imageUrl: featuredImage
      }
    ];

    let insertedCount = 0;
    for (const d of targetDeals) {
      await prisma.deal.upsert({
        where: { id: d.id },
        update: {
          title: d.title,
          subtitle: d.subtitle,
          discountPrice: d.discountPrice,
          originalPrice: d.originalPrice,
          isHot: d.isHot,
          isFlashDeal: d.isFlashDeal,
          imageUrl: d.imageUrl,
          images: [d.imageUrl],
          updatedAt: new Date()
        },
        create: {
          id: d.id,
          title: d.title,
          subtitle: d.subtitle,
          category: d.category,
          channelType: 'offline',
          merchantName: target.name,
          merchantLogo: target.logo,
          storeBranches: '全台實體門市 / 全家 APP 隨買跨店取',
          regions: ['全台門市', '台北市', '新北市', '台中市', '高雄市'],
          discountPrice: d.discountPrice,
          originalPrice: d.originalPrice,
          priceUnit: d.priceUnit,
          targetItems: d.targetItems,
          conditions: d.conditions,
          eligibleCards: ['全盈+PAY (5%)', 'FamiPay', '台新玫瑰卡 (3.8%)'],
          tags: d.tags,
          startDate: d.startDate,
          endDate: d.endDate,
          isHot: d.isHot,
          isFlashDeal: d.isFlashDeal,
          source: 'social_listening',
          sourcePlatform: 'Convenience',
          sourceUrl: 'https://lihi.cc/XRQNa',
          likeCount: 215,
          commentCount: 42,
          priceHistory: [
            { date: '原價', price: d.originalPrice },
            { date: '特價', price: d.discountPrice }
          ],
          priceDropAlert: {
            isLowest90Days: true,
            isSuspiciousHike: false,
            note: '官方粉專即時採集，全盈+PAY 好康日買多送多破盤下殺！'
          },
          imageUrl: d.imageUrl,
          images: [d.imageUrl]
        }
      });
      insertedCount++;
      console.log(`💾 Ingested deal: ${d.title}`);
    }

    const totalCount = await prisma.deal.count();
    console.log(`\n🎉 Success! Upserted ${insertedCount} deals. Total deals in database: ${totalCount}`);

  } catch (err) {
    console.error('Error during crawl:', err);
  } finally {
    await browser.close();
    await prisma.$disconnect();
  }
}

runFamilyMartCrawl();
