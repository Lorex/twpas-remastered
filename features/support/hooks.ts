import { Before, After, BeforeAll, AfterAll, Status } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext, Page } from '@playwright/test';
import { ICustomWorld } from './world';

let browser: Browser;

BeforeAll(async function () {
  // 啟動瀏覽器 (全域共用)
  browser = await chromium.launch({
    headless: process.env.HEADLESS !== 'false',
    slowMo: process.env.SLOWMO ? parseInt(process.env.SLOWMO) : 0,
  });
});

AfterAll(async function () {
  // 關閉瀏覽器
  if (browser) {
    await browser.close();
  }
});

Before(async function (this: ICustomWorld) {
  // 每個場景建立新的瀏覽器上下文
  this.context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    locale: 'zh-TW',
    timezoneId: 'Asia/Taipei',
  });
  this.page = await this.context.newPage();
  this.browser = browser;

  // 設定預設逾時
  this.page.setDefaultTimeout(30000);
});

Before({ tags: '@api' }, async function (this: ICustomWorld) {
  // API 測試不需要瀏覽器
  if (this.context) {
    await this.context.close();
    this.context = undefined;
    this.page = undefined;
  }
});

Before({ tags: '@login-required' }, async function (this: ICustomWorld) {
  // 需要登入的場景，先執行登入
  const defaultUser = process.env.TEST_USER || 'doctor01';
  const defaultPassword = process.env.TEST_PASSWORD || 'Pass1234!';
  await this.login(defaultUser, defaultPassword);
});

After(async function (this: ICustomWorld, scenario) {
  // 失敗的場景截圖
  if (scenario.result?.status === Status.FAILED && this.page) {
    const scenarioName = scenario.gherkinDocument?.feature?.name || 'unknown';
    const screenshotPath = `./test-results/screenshots/${scenarioName.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
    this.attach(await this.page.screenshot(), 'image/png');
  }

  // 清理瀏覽器上下文
  if (this.context) {
    await this.context.close();
  }

  // 登出
  if (this.authToken) {
    await this.logout();
  }

  // 清理測試資料
  this.currentPatient = undefined;
  this.currentClaim = undefined;
  this.currentFhirBundle = undefined;
});

Before({ tags: '@database-seed' }, async function (this: ICustomWorld) {
  // 需要種子資料的場景
  await this.apiPost('/test/seed', {});
});

After({ tags: '@database-cleanup' }, async function (this: ICustomWorld) {
  // 需要清理資料的場景
  await this.apiPost('/test/cleanup', {});
});
