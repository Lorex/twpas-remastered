/**
 * @file fhir-conversion.spec.ts
 * @description E2E tests for FHIR conversion functionality
 * @bdd-generated: features/fhir/fhir-conversion.feature
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

test.describe('FHIR 資料轉換 @fhir @conversion', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  // ===========================================================================
  // Bundle 轉換
  // ===========================================================================

  /**
   * @bdd-generated: features/fhir/fhir-conversion.feature#轉換完整案件為 FHIR Bundle
   * @bdd-hash: w1x2y3z4
   */
  test('轉換完整案件為 FHIR Bundle', async ({ page }) => {
    // 當 我在案件詳情頁面
    await page.goto('/claims/CASE-001');

    // 並且 我點擊 "FHIR 預覽" 按鈕
    await page.getByRole('button', { name: /FHIR 預覽/i }).click();

    // 那麼 產生的 Bundle 應該符合規範
    await expect(page.getByText('"resourceType": "Bundle"')).toBeVisible();

    // 並且 Bundle.type 應該為 "collection"
    await expect(page.getByText('"type": "collection"')).toBeVisible();
  });

  /**
   * @bdd-generated: features/fhir/fhir-conversion.feature#Bundle 應該包含所有必要的 entry
   * @bdd-hash: x2y3z4a5
   */
  test('Bundle 應該包含所有必要的 entry', async ({ page }) => {
    // 當 我在案件 FHIR 預覽頁面
    await page.goto('/claims/CASE-001');
    await page.getByRole('button', { name: /FHIR 預覽/i }).click();

    // 那麼 Bundle 應該包含必要資源類型
    const content = await page.locator('.fhir-preview, pre').textContent();
    expect(content).toContain('Claim');
    expect(content).toContain('Patient');
    expect(content).toContain('Practitioner');
    expect(content).toContain('Organization');
    expect(content).toContain('MedicationRequest');
  });

  // ===========================================================================
  // JSON 輸出
  // ===========================================================================

  /**
   * @bdd-generated: features/fhir/fhir-conversion.feature#輸出 FHIR Bundle 為 JSON 格式
   * @bdd-hash: y3z4a5b6
   */
  test('輸出 FHIR Bundle 為 JSON 格式', async ({ page }) => {
    // 當 我將案件轉換並輸出為 JSON
    await page.goto('/claims/CASE-001');
    await page.getByRole('button', { name: /FHIR 預覽/i }).click();

    // 那麼 輸出應該為有效的 JSON 格式
    const content = await page.locator('.fhir-preview, pre').textContent();
    expect(() => JSON.parse(content || '{}')).not.toThrow();
  });

  /**
   * @bdd-generated: features/fhir/fhir-conversion.feature#下載 FHIR Bundle JSON 檔案
   * @bdd-hash: z4a5b6c7
   */
  test('下載 FHIR Bundle JSON 檔案', async ({ page }) => {
    // 當 我在案件詳情頁面點擊 "匯出 FHIR"
    await page.goto('/claims/CASE-001');

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /匯出 FHIR|下載 JSON/i }).click();
    const download = await downloadPromise;

    // 那麼 系統應該下載一個 JSON 檔案
    expect(download.suggestedFilename()).toMatch(/\.json$/);

    // 並且 檔案名稱應該包含案件編號
    expect(download.suggestedFilename()).toContain('CASE-001');
  });

  // ===========================================================================
  // 儲存至 FHIR Server
  // ===========================================================================

  /**
   * @bdd-generated: features/fhir/fhir-conversion.feature#儲存 Bundle 至 HAPI FHIR Server
   * @bdd-hash: a5b6c7d8
   */
  test('儲存 Bundle 至 HAPI FHIR Server', async ({ page }) => {
    // 當 我在案件詳情頁面
    await page.goto('/claims/CASE-001');

    // 並且 我點擊 "儲存至 FHIR Server" 按鈕
    await page.getByRole('button', { name: /儲存至 FHIR|同步/i }).click();

    // 那麼 FHIR Server 應該回傳成功狀態
    await expect(page.getByText(/儲存成功|同步完成/)).toBeVisible();
  });

  /**
   * @bdd-generated: features/fhir/fhir-conversion.feature#FHIR Server 連線失敗處理
   * @bdd-hash: b6c7d8e9
   */
  test.skip('FHIR Server 連線失敗處理', async ({ page }) => {
    // 假設 HAPI FHIR Server 暫時不可用
    // Note: This requires mocking FHIR server to be unavailable

    // 當 我嘗試儲存 Bundle 至 FHIR Server
    await page.goto('/claims/CASE-001');
    await page.getByRole('button', { name: /儲存至 FHIR/i }).click();

    // 那麼 系統應該顯示錯誤訊息 "FHIR Server 連線失敗"
    await expect(page.getByText('FHIR Server 連線失敗')).toBeVisible();

    // 並且 系統應該提供重試選項
    await expect(page.getByRole('button', { name: /重試/i })).toBeVisible();
  });
});

// ============================================================================
// Manual Tests - Add your custom tests below this line
// ============================================================================
