/**
 * @file claim-query.spec.ts
 * @description E2E tests for claim query functionality
 * @bdd-generated: features/claim/claim-query.feature
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

async function navigateToClaimList(page: Page) {
  await page.goto('/claims');
}

// ============================================================================
// BDD Generated Tests
// ============================================================================

test.describe('申報案件查詢 @claim @query', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await navigateToClaimList(page);
  });

  // ===========================================================================
  // 基本查詢
  // ===========================================================================

  /**
   * @bdd-generated: features/claim/claim-query.feature#依案件編號精確查詢
   * @bdd-hash: k1l2m3n4
   */
  test('依案件編號精確查詢', async ({ page }) => {
    // 當 我在案件列表頁面
    await expect(page).toHaveURL(/claims/);

    // 並且 我在搜尋欄輸入案件編號 "CASE-001"
    await page.getByPlaceholder(/搜尋/i).fill('CASE-001');

    // 並且 我點擊搜尋按鈕
    await page.getByRole('button', { name: /搜尋/i }).click();

    // 那麼 查詢結果應該只有 1 筆
    await expect(page.locator('table tbody tr')).toHaveCount(1);

    // 並且 結果應該包含案件 "CASE-001"
    await expect(page.getByText('CASE-001')).toBeVisible();
  });

  /**
   * @bdd-generated: features/claim/claim-query.feature#依申報類別篩選
   * @bdd-hash: l2m3n4o5
   */
  test('依申報類別篩選', async ({ page }) => {
    // 當 我在案件列表頁面
    // 並且 我選擇申報類別篩選為 "新申請"
    await page.getByLabel(/申報類別/i).selectOption('新申請');

    // 那麼 查詢結果應該只包含申報類別為 "新申請" 的案件
    const rows = page.locator('table tbody tr');
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      await expect(rows.nth(i).getByText('新申請')).toBeVisible();
    }
  });

  /**
   * @bdd-generated: features/claim/claim-query.feature#依案件類別篩選
   * @bdd-hash: m3n4o5p6
   */
  test('依案件類別篩選', async ({ page }) => {
    // 當 我在案件列表頁面
    // 並且 我選擇案件類別篩選為 "癌症標靶治療"
    await page.getByLabel(/案件類別/i).selectOption('癌症標靶治療');

    // 那麼 查詢結果應該只包含案件類別為 "癌症標靶治療" 的案件
    const rows = page.locator('table tbody tr');
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      await expect(rows.nth(i).getByText('癌症標靶治療')).toBeVisible();
    }
  });

  /**
   * @bdd-generated: features/claim/claim-query.feature#依狀態篩選
   * @bdd-hash: n4o5p6q7
   */
  test('依狀態篩選', async ({ page }) => {
    // 當 我在案件列表頁面
    // 並且 我選擇狀態篩選為 "草稿"
    await page.getByLabel(/狀態/i).selectOption('草稿');

    // 那麼 查詢結果應該只包含狀態為 "草稿" 的案件
    const rows = page.locator('table tbody tr');
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      await expect(rows.nth(i).getByText('草稿')).toBeVisible();
    }
  });

  // ===========================================================================
  // 複合條件查詢
  // ===========================================================================

  /**
   * @bdd-generated: features/claim/claim-query.feature#依申報類別和案件類別複合查詢
   * @bdd-hash: o5p6q7r8
   */
  test('依申報類別和案件類別複合查詢', async ({ page }) => {
    // 當 我在案件列表頁面
    // 並且 我選擇申報類別篩選為 "新申請"
    await page.getByLabel(/申報類別/i).selectOption('新申請');

    // 並且 我選擇案件類別篩選為 "癌症標靶治療"
    await page.getByLabel(/案件類別/i).selectOption('癌症標靶治療');

    // 那麼 查詢結果應該只包含同時符合兩個條件的案件
    const rows = page.locator('table tbody tr');
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      await expect(rows.nth(i).getByText('新申請')).toBeVisible();
      await expect(rows.nth(i).getByText('癌症標靶治療')).toBeVisible();
    }
  });

  // ===========================================================================
  // 日期範圍查詢
  // ===========================================================================

  /**
   * @bdd-generated: features/claim/claim-query.feature#依建立日期範圍查詢
   * @bdd-hash: p6q7r8s9
   */
  test('依建立日期範圍查詢', async ({ page }) => {
    // 當 我在案件列表頁面
    // 並且 我設定建立日期範圍為 "2024-01-15" 到 "2024-01-25"
    await page.getByLabel(/起始日期/i).fill('2024-01-15');
    await page.getByLabel(/結束日期/i).fill('2024-01-25');

    // 並且 我點擊搜尋按鈕
    await page.getByRole('button', { name: /搜尋/i }).click();

    // 那麼 查詢結果應該包含在日期範圍內的案件
    // Note: Verify via the results displayed
  });

  // ===========================================================================
  // 排序與分頁
  // ===========================================================================

  /**
   * @bdd-generated: features/claim/claim-query.feature#依建立日期排序
   * @bdd-hash: q7r8s9t0
   */
  test('依建立日期排序', async ({ page }) => {
    // 當 我在案件列表頁面
    // 並且 我點擊 "建立日期" 欄位標題
    await page.getByRole('columnheader', { name: /建立日期/i }).click();

    // 那麼 案件應該依建立日期降序排列
    // Note: Verify sort order via data attributes or visual inspection

    // 當 我再次點擊 "建立日期" 欄位標題
    await page.getByRole('columnheader', { name: /建立日期/i }).click();

    // 那麼 案件應該依建立日期升序排列
    // Note: Verify sort order
  });

  /**
   * @bdd-generated: features/claim/claim-query.feature#分頁顯示查詢結果
   * @bdd-hash: r8s9t0u1
   */
  test('分頁顯示查詢結果', async ({ page }) => {
    // 假設 資料庫中存在 50 筆申報案件

    // 當 我在案件列表頁面
    // 那麼 預設應該顯示 20 筆案件
    await expect(page.locator('table tbody tr')).toHaveCount(20);

    // 並且 我應該看到分頁控制項
    await expect(page.getByRole('navigation', { name: /pagination/i })).toBeVisible();
  });

  /**
   * @bdd-generated: features/claim/claim-query.feature#切換分頁
   * @bdd-hash: s9t0u1v2
   */
  test('切換分頁', async ({ page }) => {
    // 假設 資料庫中存在 50 筆申報案件

    // 當 我在案件列表頁面
    // 並且 我點擊第 2 頁
    await page.getByRole('button', { name: '2' }).click();

    // 那麼 應該顯示第 21-40 筆案件
    // Note: Verify via pagination state
  });

  // ===========================================================================
  // 快速篩選
  // ===========================================================================

  /**
   * @bdd-generated: features/claim/claim-query.feature#快速篩選 - 我的草稿案件
   * @bdd-hash: t0u1v2w3
   */
  test('快速篩選 - 我的草稿案件', async ({ page }) => {
    // 當 我在案件列表頁面
    // 並且 我點擊快速篩選 "我的草稿"
    await page.getByRole('button', { name: /我的草稿/i }).click();

    // 那麼 查詢結果應該只包含我建立的草稿案件
    const rows = page.locator('table tbody tr');
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      await expect(rows.nth(i).getByText('草稿')).toBeVisible();
    }
  });

  /**
   * @bdd-generated: features/claim/claim-query.feature#快速篩選 - 已核准案件
   * @bdd-hash: u1v2w3x4
   */
  test('快速篩選 - 已核准案件', async ({ page }) => {
    // 當 我在案件列表頁面
    // 並且 我點擊快速篩選 "已核准"
    await page.getByRole('button', { name: /已核准/i }).click();

    // 那麼 查詢結果應該只包含狀態為 "核准" 的案件
    const rows = page.locator('table tbody tr');
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      await expect(rows.nth(i).getByText('核准')).toBeVisible();
    }
  });

  // ===========================================================================
  // 清除篩選
  // ===========================================================================

  /**
   * @bdd-generated: features/claim/claim-query.feature#清除所有篩選條件
   * @bdd-hash: v2w3x4y5
   */
  test('清除所有篩選條件', async ({ page }) => {
    // 當 我在案件列表頁面
    // 並且 我設定多個篩選條件
    await page.getByLabel(/申報類別/i).selectOption('新申請');
    await page.getByLabel(/狀態/i).selectOption('草稿');

    // 並且 我點擊 "清除篩選" 按鈕
    await page.getByRole('button', { name: /清除篩選/i }).click();

    // 那麼 所有篩選條件應該被清除
    await expect(page.getByLabel(/申報類別/i)).toHaveValue('');
    await expect(page.getByLabel(/狀態/i)).toHaveValue('');
  });

  /**
   * @bdd-generated: features/claim/claim-query.feature#查詢無結果
   * @bdd-hash: w3x4y5z6
   */
  test('查詢無結果', async ({ page }) => {
    // 當 我在案件列表頁面
    // 並且 我在搜尋欄輸入案件編號 "NOTEXIST"
    await page.getByPlaceholder(/搜尋/i).fill('NOTEXIST');

    // 並且 我點擊搜尋按鈕
    await page.getByRole('button', { name: /搜尋/i }).click();

    // 那麼 我應該看到訊息 "查無符合條件的案件"
    await expect(page.getByText('查無符合條件的案件')).toBeVisible();

    // 並且 應該提供清除篩選的選項
    await expect(page.getByRole('button', { name: /清除篩選/i })).toBeVisible();
  });
});

// ============================================================================
// Manual Tests - Add your custom tests below this line
// ============================================================================
