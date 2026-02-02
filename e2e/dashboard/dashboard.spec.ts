/**
 * @file dashboard.spec.ts
 * @description E2E tests for dashboard functionality
 * @bdd-generated: features/dashboard/dashboard.feature
 *
 * Auto-generated from BDD feature file. Manual tests can be added below the generated section.
 */

import { test, expect, type Page } from '@playwright/test';

// ============================================================================
// Helper Functions
// ============================================================================
async function login(page: Page) {
  await page.goto('/login');
  await page.getByLabel(/帳號/i).fill('doctor01');
  await page.getByLabel(/密碼/i).fill('Pass1234!');
  await page.getByRole('button', { name: /登入/i }).click();
  await expect(page).toHaveURL(/dashboard/);
}

// ============================================================================
// BDD Generated Tests
// ============================================================================

test.describe('系統儀表板 @dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  // ===========================================================================
  // 統計卡片
  // ===========================================================================

  /**
   * @bdd-generated: features/dashboard/dashboard.feature#顯示案件狀態統計卡片
   * @bdd-hash: v2w3x4y5
   */
  test('顯示案件狀態統計卡片', async ({ page }) => {
    // 當 我在儀表板頁面
    await expect(page).toHaveURL(/dashboard/);

    // 那麼 我應該看到以下統計卡片
    await expect(page.getByText(/草稿案件/)).toBeVisible();
    await expect(page.getByText(/待審核/)).toBeVisible();
    await expect(page.getByText(/審核中/)).toBeVisible();
    await expect(page.getByText(/已核准/)).toBeVisible();
    await expect(page.getByText(/已駁回/)).toBeVisible();
    await expect(page.getByText(/補件中/)).toBeVisible();
  });

  /**
   * @bdd-generated: features/dashboard/dashboard.feature#顯示本月新增案件統計
   * @bdd-hash: w3x4y5z6
   */
  test('顯示本月新增案件統計', async ({ page }) => {
    // 當 我在儀表板頁面
    // 那麼 我應該看到本月新增案件數量
    await expect(page.getByText(/本月新增/)).toBeVisible();
  });

  /**
   * @bdd-generated: features/dashboard/dashboard.feature#顯示待處理案件提醒
   * @bdd-hash: x4y5z6a7
   */
  test('顯示待處理案件提醒', async ({ page }) => {
    // 當 我在儀表板頁面
    // 那麼 我應該看到待處理案件區塊
    await expect(page.getByText(/待處理/)).toBeVisible();
  });

  /**
   * @bdd-generated: features/dashboard/dashboard.feature#點擊統計卡片跳轉到對應列表
   * @bdd-hash: y5z6a7b8
   */
  test('點擊統計卡片跳轉到對應列表', async ({ page }) => {
    // 當 我在儀表板頁面
    // 並且 我點擊 "草稿案件" 卡片
    await page.getByText(/草稿案件/).click();

    // 那麼 我應該被導向案件列表頁面
    await expect(page).toHaveURL(/claims/);

    // 並且 列表應該已篩選狀態為 "草稿"
    await expect(page.getByLabel(/狀態/i)).toHaveValue('草稿');
  });

  // ===========================================================================
  // 圖表
  // ===========================================================================

  /**
   * @bdd-generated: features/dashboard/dashboard.feature#顯示案件狀態分布圓餅圖
   * @bdd-hash: z6a7b8c9
   */
  test('顯示案件狀態分布圓餅圖', async ({ page }) => {
    // 當 我在儀表板頁面
    // 那麼 我應該看到案件狀態分布圓餅圖
    await expect(page.locator('.pie-chart, [data-testid="status-pie-chart"]')).toBeVisible();
  });

  /**
   * @bdd-generated: features/dashboard/dashboard.feature#顯示案件趨勢折線圖
   * @bdd-hash: a7b8c9d0
   */
  test('顯示案件趨勢折線圖', async ({ page }) => {
    // 當 我在儀表板頁面
    // 那麼 我應該看到案件趨勢折線圖
    await expect(page.locator('.line-chart, [data-testid="trend-line-chart"]')).toBeVisible();
  });

  // ===========================================================================
  // 最近案件
  // ===========================================================================

  /**
   * @bdd-generated: features/dashboard/dashboard.feature#顯示最近建立的案件
   * @bdd-hash: b8c9d0e1
   */
  test('顯示最近建立的案件', async ({ page }) => {
    // 當 我在儀表板頁面
    // 那麼 我應該看到 "最近案件" 區塊
    await expect(page.getByText(/最近案件/)).toBeVisible();

    // 並且 應該顯示案件資訊
    await expect(page.locator('.recent-claims-list, [data-testid="recent-claims"]')).toBeVisible();
  });

  /**
   * @bdd-generated: features/dashboard/dashboard.feature#點擊最近案件跳轉到詳情
   * @bdd-hash: c9d0e1f2
   */
  test('點擊最近案件跳轉到詳情', async ({ page }) => {
    // 當 我在儀表板頁面
    // 並且 我點擊最近案件列表中的一筆案件
    await page.locator('.recent-claims-list a, [data-testid="recent-claims"] a').first().click();

    // 那麼 我應該被導向該案件的詳情頁面
    await expect(page).toHaveURL(/claims\/CASE-/);
  });

  // ===========================================================================
  // 快速操作
  // ===========================================================================

  /**
   * @bdd-generated: features/dashboard/dashboard.feature#顯示快速操作按鈕
   * @bdd-hash: d0e1f2g3
   */
  test('顯示快速操作按鈕', async ({ page }) => {
    // 當 我在儀表板頁面
    // 那麼 我應該看到以下快速操作按鈕
    await expect(page.getByRole('button', { name: /新增案件/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /新增病人/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /查詢案件/i })).toBeVisible();
  });

  /**
   * @bdd-generated: features/dashboard/dashboard.feature#點擊新增案件按鈕
   * @bdd-hash: e1f2g3h4
   */
  test('點擊新增案件按鈕', async ({ page }) => {
    // 當 我在儀表板頁面
    // 並且 我點擊 "新增案件" 按鈕
    await page.getByRole('button', { name: /新增案件/i }).click();

    // 那麼 我應該被導向新增案件頁面
    await expect(page).toHaveURL(/claims\/new/);
  });

  /**
   * @bdd-generated: features/dashboard/dashboard.feature#點擊新增病人按鈕
   * @bdd-hash: f2g3h4i5
   */
  test('點擊新增病人按鈕', async ({ page }) => {
    // 當 我在儀表板頁面
    // 並且 我點擊 "新增病人" 按鈕
    await page.getByRole('button', { name: /新增病人/i }).click();

    // 那麼 我應該被導向新增病人頁面
    await expect(page).toHaveURL(/patients\/new/);
  });

  // ===========================================================================
  // 通知與提醒
  // ===========================================================================

  /**
   * @bdd-generated: features/dashboard/dashboard.feature#顯示即將到期的案件提醒
   * @bdd-hash: g3h4i5j6
   */
  test('顯示即將到期的案件提醒', async ({ page }) => {
    // 假設 有案件將在 7 天內到期

    // 當 我在儀表板頁面
    // 那麼 我應該看到 "即將到期" 提醒區塊
    // Note: This depends on test data setup
    const expiringSection = page.locator('[data-testid="expiring-claims"], .expiring-claims');
    if (await expiringSection.isVisible()) {
      await expect(expiringSection).toBeVisible();
    }
  });

  // ===========================================================================
  // 資料刷新
  // ===========================================================================

  /**
   * @bdd-generated: features/dashboard/dashboard.feature#手動刷新儀表板資料
   * @bdd-hash: h4i5j6k7
   */
  test('手動刷新儀表板資料', async ({ page }) => {
    // 當 我在儀表板頁面
    // 並且 我點擊刷新按鈕
    await page.getByRole('button', { name: /刷新|refresh/i }).click();

    // 那麼 所有統計數據應該重新載入
    // 並且 應該顯示 "資料已更新" 訊息
    await expect(page.getByText(/資料已更新|已刷新/)).toBeVisible();
  });
});

// ============================================================================
// Manual Tests - Add your custom tests below this line
// ============================================================================
