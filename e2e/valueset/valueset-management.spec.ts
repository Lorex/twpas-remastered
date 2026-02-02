/**
 * @file valueset-management.spec.ts
 * @description E2E tests for valueset management functionality
 * @bdd-generated: features/valueset/valueset-management.feature
 *
 * Auto-generated from BDD feature file. Manual tests can be added below the generated section.
 */

import { test, expect, type Page } from '@playwright/test';

// ============================================================================
// Helper Functions
// ============================================================================
async function login(page: Page) {
  await page.goto('/login');
  await page.getByLabel(/帳號/i).fill('admin01');
  await page.getByLabel(/密碼/i).fill('Pass1234!');
  await page.getByRole('button', { name: /登入/i }).click();
  await expect(page).toHaveURL(/dashboard/);
}

async function navigateToValuesetManagement(page: Page) {
  await page.goto('/admin/valuesets');
}

// ============================================================================
// BDD Generated Tests
// ============================================================================

test.describe('值集管理 @valueset', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await navigateToValuesetManagement(page);
  });

  // ===========================================================================
  // 值集查詢
  // ===========================================================================

  /**
   * @bdd-generated: features/valueset/valueset-management.feature#查看所有值集列表
   * @bdd-hash: y7z8a9b0
   */
  test('查看所有值集列表', async ({ page }) => {
    // 當 我在值集管理頁面
    await expect(page).toHaveURL(/valuesets/);

    // 那麼 我應該看到值集列表
    await expect(page.locator('table, .valueset-list')).toBeVisible();

    // 並且 列表應該包含主要值集
    await expect(page.getByText('NHI-申報類別')).toBeVisible();
    await expect(page.getByText('NHI-案件類別')).toBeVisible();
    await expect(page.getByText('NHI-用藥品項')).toBeVisible();
  });

  /**
   * @bdd-generated: features/valueset/valueset-management.feature#依名稱搜尋值集
   * @bdd-hash: z8a9b0c1
   */
  test('依名稱搜尋值集', async ({ page }) => {
    // 當 我在值集管理頁面
    // 並且 我在搜尋欄輸入 "申報"
    await page.getByPlaceholder(/搜尋/i).fill('申報');

    // 那麼 我應該看到 "NHI-申報類別" 值集
    await expect(page.getByText('NHI-申報類別')).toBeVisible();

    // 並且 結果不應該包含 "NHI-用藥品項"
    await expect(page.getByText('NHI-用藥品項')).not.toBeVisible();
  });

  /**
   * @bdd-generated: features/valueset/valueset-management.feature#查看值集詳情
   * @bdd-hash: a9b0c1d2
   */
  test('查看值集詳情', async ({ page }) => {
    // 當 我點擊 "NHI-申報類別" 值集
    await page.getByText('NHI-申報類別').click();

    // 那麼 我應該看到值集詳情頁面
    // 並且 頁面應該顯示相關資訊
    await expect(page.getByText(/識別碼/)).toBeVisible();
    await expect(page.getByText(/名稱/)).toBeVisible();
    await expect(page.getByText(/版本/)).toBeVisible();
    await expect(page.getByText(/狀態/)).toBeVisible();
  });

  /**
   * @bdd-generated: features/valueset/valueset-management.feature#查看值集的代碼列表
   * @bdd-hash: b0c1d2e3
   */
  test('查看值集的代碼列表', async ({ page }) => {
    // 當 我點擊 "NHI-申報類別" 值集
    await page.getByText('NHI-申報類別').click();

    // 那麼 我應該看到代碼列表
    await expect(page.getByText('1')).toBeVisible();
    await expect(page.getByText('新申請')).toBeVisible();
    await expect(page.getByText('2')).toBeVisible();
    await expect(page.getByText('補件')).toBeVisible();
    await expect(page.getByText('3')).toBeVisible();
    await expect(page.getByText('申覆')).toBeVisible();
  });

  // ===========================================================================
  // 值集代碼搜尋
  // ===========================================================================

  /**
   * @bdd-generated: features/valueset/valueset-management.feature#依代碼搜尋
   * @bdd-hash: c1d2e3f4
   */
  test('依代碼搜尋', async ({ page }) => {
    // 當 我在 "NHI-用藥品項" 值集頁面
    await page.getByText('NHI-用藥品項').click();

    // 並且 我在代碼搜尋欄輸入 "KC00"
    await page.getByPlaceholder(/搜尋代碼/i).fill('KC00');

    // 那麼 我應該看到代碼以 "KC00" 開頭的藥品
    await expect(page.getByText(/KC00/)).toBeVisible();
  });

  /**
   * @bdd-generated: features/valueset/valueset-management.feature#搜尋無結果
   * @bdd-hash: d2e3f4g5
   */
  test('搜尋無結果', async ({ page }) => {
    // 當 我在 "NHI-用藥品項" 值集頁面
    await page.getByText('NHI-用藥品項').click();

    // 並且 我搜尋 "NOTEXISTDRUG"
    await page.getByPlaceholder(/搜尋/i).fill('NOTEXISTDRUG');

    // 那麼 我應該看到訊息 "查無符合條件的代碼"
    await expect(page.getByText('查無符合條件的代碼')).toBeVisible();
  });

  // ===========================================================================
  // 代碼系統管理
  // ===========================================================================

  /**
   * @bdd-generated: features/valueset/valueset-management.feature#查看代碼系統列表
   * @bdd-hash: e3f4g5h6
   */
  test('查看代碼系統列表', async ({ page }) => {
    // 當 我在代碼系統頁面
    await page.goto('/admin/codesystems');

    // 那麼 我應該看到代碼系統列表
    await expect(page.getByText('NHI 申報類別')).toBeVisible();
    await expect(page.getByText('NHI 案件類別')).toBeVisible();
    await expect(page.getByText('LOINC')).toBeVisible();
  });

  // ===========================================================================
  // 值集 CRUD
  // ===========================================================================

  /**
   * @bdd-generated: features/valueset/valueset-management.feature#新增自訂值集
   * @bdd-hash: f4g5h6i7
   */
  test('新增自訂值集', async ({ page }) => {
    // 當 我在值集管理頁面
    // 並且 我點擊 "新增值集" 按鈕
    await page.getByRole('button', { name: /新增值集/i }).click();

    // 並且 我填寫以下值集資料
    await page.getByLabel(/識別碼/i).fill('custom-test-valueset');
    await page.getByLabel(/名稱/i).fill('測試值集');
    await page.getByLabel(/版本/i).fill('1.0.0');
    await page.getByLabel(/說明/i).fill('用於測試的自訂值集');

    // 並且 我點擊儲存按鈕
    await page.getByRole('button', { name: /儲存/i }).click();

    // 那麼 我應該看到成功訊息 "值集已新增"
    await expect(page.getByText('值集已新增')).toBeVisible();
  });

  /**
   * @bdd-generated: features/valueset/valueset-management.feature#無法刪除系統值集
   * @bdd-hash: g5h6i7j8
   */
  test('無法刪除系統值集', async ({ page }) => {
    // 當 我嘗試刪除 "NHI-申報類別" 值集
    await page.getByText('NHI-申報類別').click();

    // 那麼 刪除按鈕應該被停用
    const deleteButton = page.getByRole('button', { name: /刪除/i });
    await expect(deleteButton).toBeDisabled();

    // 或者 我應該看到錯誤訊息 "系統值集無法刪除"
    // await expect(page.getByText('系統值集無法刪除')).toBeVisible();
  });

  /**
   * @bdd-generated: features/valueset/valueset-management.feature#無法修改系統值集的代碼
   * @bdd-hash: h6i7j8k9
   */
  test('無法修改系統值集的代碼', async ({ page }) => {
    // 當 我嘗試編輯 "NHI-申報類別" 值集的代碼
    await page.getByText('NHI-申報類別').click();

    // 那麼 編輯按鈕應該被停用
    const editButton = page.locator('.code-row').first().getByRole('button', { name: /編輯/i });
    await expect(editButton).toBeDisabled();
  });

  // ===========================================================================
  // 值集同步
  // ===========================================================================

  /**
   * @bdd-generated: features/valueset/valueset-management.feature#從 FHIR IG 同步值集
   * @bdd-hash: i7j8k9l0
   */
  test('從 FHIR IG 同步值集', async ({ page }) => {
    // 當 我點擊 "同步值集" 按鈕
    await page.getByRole('button', { name: /同步值集/i }).click();

    // 那麼 系統應該從 FHIR IG 載入最新的值集
    // 並且 應該顯示同步結果
    await expect(page.getByText(/同步.*完成|更新.*數量/)).toBeVisible();
  });

  /**
   * @bdd-generated: features/valueset/valueset-management.feature#值集快取刷新
   * @bdd-hash: j8k9l0m1
   */
  test('值集快取刷新', async ({ page }) => {
    // 當 我點擊 "刷新快取" 按鈕
    await page.getByRole('button', { name: /刷新快取/i }).click();

    // 那麼 系統應該清除並重新載入所有值集快取
    // 並且 應該顯示成功訊息 "快取已刷新"
    await expect(page.getByText('快取已刷新')).toBeVisible();
  });
});

// ============================================================================
// Manual Tests - Add your custom tests below this line
// ============================================================================
