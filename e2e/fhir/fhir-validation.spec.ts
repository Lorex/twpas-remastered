/**
 * @file fhir-validation.spec.ts
 * @description E2E tests for FHIR validation functionality
 * @bdd-generated: features/fhir/fhir-validation.feature
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

test.describe('FHIR 資料驗證 @fhir @validation', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  // ===========================================================================
  // Claim 驗證
  // ===========================================================================

  /**
   * @bdd-generated: features/fhir/fhir-validation.feature#驗證完整的 Claim 資源
   * @bdd-hash: c7d8e9f0
   */
  test('驗證完整的 Claim 資源', async ({ page }) => {
    // 假設 存在符合規範的 Claim 資源
    await page.goto('/claims/CASE-001');

    // 當 我點擊驗證按鈕
    await page.getByRole('button', { name: /驗證|Validate/i }).click();

    // 那麼 驗證結果應該為通過
    await expect(page.getByText(/驗證通過|Valid/)).toBeVisible();

    // 並且 不應該有任何錯誤
    await expect(page.getByText(/錯誤: 0|No errors/)).toBeVisible();
  });

  /**
   * @bdd-generated: features/fhir/fhir-validation.feature#Claim 缺少必填的 subType
   * @bdd-hash: d8e9f0g1
   */
  test('Claim 缺少必填欄位時顯示錯誤', async ({ page }) => {
    // 假設 存在一個缺少必填欄位的 Claim 資源
    await page.goto('/claims/CASE-INCOMPLETE');

    // 當 我驗證此 Claim
    await page.getByRole('button', { name: /驗證|Validate/i }).click();

    // 那麼 驗證結果應該為失敗
    await expect(page.getByText(/驗證失敗|Invalid|錯誤/)).toBeVisible();

    // 並且 錯誤應該顯示缺少的必填欄位
    await expect(page.getByText(/必填|required/i)).toBeVisible();
  });

  // ===========================================================================
  // SupportingInfo 驗證
  // ===========================================================================

  /**
   * @bdd-generated: features/fhir/fhir-validation.feature#驗證缺少體重 supportingInfo
   * @bdd-hash: e9f0g1h2
   */
  test('驗證缺少體重時顯示錯誤', async ({ page }) => {
    // 假設 存在一個缺少體重的 Claim
    await page.goto('/claims/CASE-NO-WEIGHT');

    // 當 我驗證此 Claim
    await page.getByRole('button', { name: /驗證/i }).click();

    // 那麼 驗證結果應該為失敗
    // 並且 錯誤應該包含 "體重" 相關訊息
    await expect(page.getByText(/體重.*必填|weight.*required/i)).toBeVisible();
  });

  // ===========================================================================
  // 業務規則驗證
  // ===========================================================================

  /**
   * @bdd-generated: features/fhir/fhir-validation.feature#supportingInfo-2 規則 - 一般事前審查需提供影像/檢查/基因
   * @bdd-hash: f0g1h2i3
   */
  test('一般事前審查需提供影像/檢查/基因資訊', async ({ page }) => {
    // 假設 存在一個一般事前審查 Claim
    // 並且 沒有提供影像報告、檢查報告或基因資訊
    await page.goto('/claims/CASE-NO-SUPPORTING');

    // 當 我驗證此 Claim
    await page.getByRole('button', { name: /驗證/i }).click();

    // 那麼 驗證結果應該為失敗
    // 並且 錯誤應該包含相關訊息
    await expect(page.getByText(/影像報告|檢查報告|基因資訊.*至少一項/i)).toBeVisible();
  });

  // ===========================================================================
  // Bundle 驗證
  // ===========================================================================

  /**
   * @bdd-generated: features/fhir/fhir-validation.feature#驗證完整的 Bundle
   * @bdd-hash: g1h2i3j4
   */
  test('驗證完整的 Bundle', async ({ page }) => {
    // 假設 存在符合規範的 Bundle
    await page.goto('/claims/CASE-001');
    await page.getByRole('button', { name: /FHIR 預覽/i }).click();

    // 當 我驗證此 Bundle
    await page.getByRole('button', { name: /驗證 Bundle|Validate/i }).click();

    // 那麼 驗證結果應該為通過
    await expect(page.getByText(/驗證通過|Valid/)).toBeVisible();
  });

  /**
   * @bdd-generated: features/fhir/fhir-validation.feature#Bundle 必須包含 Claim
   * @bdd-hash: h2i3j4k5
   */
  test('Bundle 必須包含 Claim', async ({ page }) => {
    // 假設 存在一個缺少 Claim 的 Bundle
    await page.goto('/claims/CASE-NO-CLAIM');
    await page.getByRole('button', { name: /FHIR 預覽/i }).click();

    // 當 我驗證此 Bundle
    await page.getByRole('button', { name: /驗證/i }).click();

    // 那麼 驗證結果應該為失敗
    // 並且 錯誤應該包含 "必須包含 Claim"
    await expect(page.getByText(/必須包含.*Claim/i)).toBeVisible();
  });

  // ===========================================================================
  // 驗證報告
  // ===========================================================================

  /**
   * @bdd-generated: features/fhir/fhir-validation.feature#產生驗證報告
   * @bdd-hash: i3j4k5l6
   */
  test('產生驗證報告', async ({ page }) => {
    // 當 我驗證案件的 FHIR Bundle
    await page.goto('/claims/CASE-001');
    await page.getByRole('button', { name: /驗證/i }).click();

    // 那麼 系統應該產生驗證報告
    await expect(page.locator('.validation-report')).toBeVisible();

    // 並且 報告應該包含相關資訊
    await expect(page.getByText(/驗證結果/)).toBeVisible();
    await expect(page.getByText(/錯誤數量/)).toBeVisible();
    await expect(page.getByText(/警告數量/)).toBeVisible();
  });

  /**
   * @bdd-generated: features/fhir/fhir-validation.feature#區分錯誤與警告
   * @bdd-hash: j4k5l6m7
   */
  test('區分錯誤與警告', async ({ page }) => {
    // 當 我驗證有問題的 FHIR Bundle
    await page.goto('/claims/CASE-WITH-WARNINGS');
    await page.getByRole('button', { name: /驗證/i }).click();

    // 那麼 驗證報告應該區分錯誤與警告
    const report = page.locator('.validation-report');
    await expect(report.getByText(/error|錯誤/i)).toBeVisible();
    await expect(report.getByText(/warning|警告/i)).toBeVisible();
  });
});

// ============================================================================
// Manual Tests - Add your custom tests below this line
// ============================================================================
