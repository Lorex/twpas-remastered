/**
 * @file nhi-upload.spec.ts
 * @description E2E tests for NHI platform upload functionality
 * @bdd-generated: features/nhi-platform/nhi-upload.feature
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

test.describe('健保平台調閱與上傳 @nhi-platform @upload', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  // ===========================================================================
  // 調閱 FHIR 資料
  // ===========================================================================

  /**
   * @bdd-generated: features/nhi-platform/nhi-upload.feature#調閱案件的 FHIR Bundle
   * @bdd-hash: k9l0m1n2
   */
  test('調閱案件的 FHIR Bundle', async ({ page }) => {
    // 當 我在案件 "CASE-001" 的詳情頁面
    await page.goto('/claims/CASE-001');

    // 並且 我點擊 "FHIR 預覽" 按鈕
    await page.getByRole('button', { name: /FHIR 預覽/i }).click();

    // 那麼 系統應該從 FHIR Server 調閱 Bundle
    // 並且 我應該看到 FHIR Bundle 的內容
    await expect(page.getByText(/Bundle|resourceType/)).toBeVisible();

    // 並且 內容應該以可讀格式顯示
    await expect(page.locator('pre, .json-viewer, .fhir-preview')).toBeVisible();
  });

  /**
   * @bdd-generated: features/nhi-platform/nhi-upload.feature#下載 FHIR Bundle JSON
   * @bdd-hash: l0m1n2o3
   */
  test('下載 FHIR Bundle JSON', async ({ page }) => {
    // 當 我在案件 "CASE-001" 的 FHIR 預覽頁面
    await page.goto('/claims/CASE-001');
    await page.getByRole('button', { name: /FHIR 預覽/i }).click();

    // 並且 我點擊 "下載 JSON" 按鈕
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /下載 JSON/i }).click();
    const download = await downloadPromise;

    // 那麼 系統應該下載一個 JSON 檔案
    expect(download.suggestedFilename()).toMatch(/\.json$/);

    // 並且 檔案名稱應該包含案件編號
    expect(download.suggestedFilename()).toContain('CASE-001');
  });

  // ===========================================================================
  // 調閱附件
  // ===========================================================================

  /**
   * @bdd-generated: features/nhi-platform/nhi-upload.feature#調閱案件的附件列表
   * @bdd-hash: m1n2o3p4
   */
  test('調閱案件的附件列表', async ({ page }) => {
    // 當 我在案件 "CASE-001" 的附件頁面
    await page.goto('/claims/CASE-001/attachments');

    // 那麼 我應該看到附件列表
    await expect(page.locator('.attachment-list, table')).toBeVisible();

    // 並且 列表應該顯示檔案資訊
    await expect(page.getByText(/PDF|PNG|JPEG/i)).toBeVisible();
  });

  /**
   * @bdd-generated: features/nhi-platform/nhi-upload.feature#預覽 PDF 附件
   * @bdd-hash: n2o3p4q5
   */
  test('預覽 PDF 附件', async ({ page }) => {
    // 當 我點擊附件的預覽按鈕
    await page.goto('/claims/CASE-001/attachments');
    await page.locator('.attachment-row').first().getByRole('button', { name: /預覽/i }).click();

    // 那麼 系統應該開啟預覽
    await expect(page.locator('.preview-modal, .pdf-viewer, iframe')).toBeVisible();
  });

  // ===========================================================================
  // 附件打包
  // ===========================================================================

  /**
   * @bdd-generated: features/nhi-platform/nhi-upload.feature#打包所有附件為 ZIP
   * @bdd-hash: o3p4q5r6
   */
  test('打包所有附件為 ZIP', async ({ page }) => {
    // 當 我在案件 "CASE-001" 的附件頁面
    await page.goto('/claims/CASE-001/attachments');

    // 並且 我點擊 "打包下載" 按鈕
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /打包下載/i }).click();
    const download = await downloadPromise;

    // 那麼 系統應該下載 ZIP 檔案
    expect(download.suggestedFilename()).toMatch(/\.zip$/);

    // 並且 檔案名稱應該包含案件編號
    expect(download.suggestedFilename()).toContain('CASE-001');
  });

  // ===========================================================================
  // 上傳至健保平台
  // ===========================================================================

  /**
   * @bdd-generated: features/nhi-platform/nhi-upload.feature#上傳申報資料至健保平台
   * @bdd-hash: p4q5r6s7
   */
  test('上傳申報資料至健保平台', async ({ page }) => {
    // 當 我在案件 "CASE-001" 的送審頁面
    await page.goto('/claims/CASE-001/submit');

    // 並且 案件驗證已通過
    // 並且 我點擊 "送審" 按鈕
    await page.getByRole('button', { name: /送審/i }).click();

    // 並且 我確認送審操作
    await page.getByRole('button', { name: /確認/i }).click();

    // 那麼 我應該看到上傳進度
    await expect(page.getByText(/上傳中|進度/)).toBeVisible();

    // 並且 上傳成功後應該顯示受理編號
    await expect(page.getByText(/受理編號|已送審/)).toBeVisible();
  });

  /**
   * @bdd-generated: features/nhi-platform/nhi-upload.feature#上傳前驗證失敗
   * @bdd-hash: q5r6s7t8
   */
  test('上傳前驗證失敗', async ({ page }) => {
    // 假設 案件有驗證錯誤
    await page.goto('/claims/CASE-INVALID/submit');

    // 當 我嘗試送審案件
    // 那麼 我應該看到驗證錯誤列表
    await expect(page.getByText(/驗證錯誤|必填/)).toBeVisible();

    // 並且 送審按鈕應該被停用
    const submitButton = page.getByRole('button', { name: /送審/i });
    await expect(submitButton).toBeDisabled();
  });

  /**
   * @bdd-generated: features/nhi-platform/nhi-upload.feature#查看上傳歷史紀錄
   * @bdd-hash: r6s7t8u9
   */
  test('查看上傳歷史紀錄', async ({ page }) => {
    // 當 我在案件的送審頁面
    await page.goto('/claims/CASE-001/submit');

    // 並且 我點擊 "上傳紀錄" 按鈕
    await page.getByRole('button', { name: /上傳紀錄/i }).click();

    // 那麼 我應該看到所有上傳嘗試的紀錄
    await expect(page.locator('.upload-history, table')).toBeVisible();

    // 並且 紀錄應該包含相關資訊
    await expect(page.getByText(/上傳時間|時間/)).toBeVisible();
    await expect(page.getByText(/狀態/)).toBeVisible();
  });

  // ===========================================================================
  // 查詢審查結果
  // ===========================================================================

  /**
   * @bdd-generated: features/nhi-platform/nhi-upload.feature#查詢審查結果
   * @bdd-hash: s7t8u9v0
   */
  test('查詢審查結果', async ({ page }) => {
    // 假設 案件 "CASE-001" 已送審
    await page.goto('/claims/CASE-001');

    // 當 我點擊 "查詢結果" 按鈕
    await page.getByRole('button', { name: /查詢結果/i }).click();

    // 那麼 系統應該向健保平台查詢審查狀態
    // 並且 我應該看到審查結果
    await expect(page.getByText(/審查結果|審核中|核准|駁回/)).toBeVisible();
  });

  /**
   * @bdd-generated: features/nhi-platform/nhi-upload.feature#審查結果 - 核准
   * @bdd-hash: t8u9v0w1
   */
  test('審查結果 - 核准', async ({ page }) => {
    // 假設 案件已被核准
    await page.goto('/claims/CASE-APPROVED');

    // 當 我查詢審查結果
    await page.getByRole('button', { name: /查詢結果/i }).click();

    // 那麼 審查狀態應該顯示 "核准"
    await expect(page.getByText('核准')).toBeVisible();

    // 並且 我應該看到核准的品項明細
    // 並且 我應該看到核准效期
  });

  /**
   * @bdd-generated: features/nhi-platform/nhi-upload.feature#審查結果 - 駁回
   * @bdd-hash: u9v0w1x2
   */
  test('審查結果 - 駁回', async ({ page }) => {
    // 假設 案件已被駁回
    await page.goto('/claims/CASE-REJECTED');

    // 當 我查詢審查結果
    await page.getByRole('button', { name: /查詢結果/i }).click();

    // 那麼 審查狀態應該顯示 "駁回"
    await expect(page.getByText('駁回')).toBeVisible();

    // 並且 我應該看到駁回原因
    await expect(page.getByText(/駁回原因|原因/)).toBeVisible();

    // 並且 我應該有申覆或重新申請的選項
    await expect(page.getByRole('button', { name: /申覆|重新申請/i })).toBeVisible();
  });

  // ===========================================================================
  // 補件上傳
  // ===========================================================================

  /**
   * @bdd-generated: features/nhi-platform/nhi-upload.feature#上傳補件資料
   * @bdd-hash: v0w1x2y3
   */
  test('上傳補件資料', async ({ page }) => {
    // 假設 案件狀態為 "補件中"
    await page.goto('/claims/CASE-SUPPLEMENTARY');

    // 當 我點擊 "上傳補件" 按鈕
    await page.getByRole('button', { name: /上傳補件/i }).click();

    // 並且 我上傳補件附件
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'supplement.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('fake-pdf-content'),
    });

    // 並且 我填寫補件說明
    await page.getByLabel(/補件說明/i).fill('補充影像報告');

    // 並且 我點擊送出
    await page.getByRole('button', { name: /送出|確認/i }).click();

    // 那麼 補件應該成功上傳至健保平台
    await expect(page.getByText(/補件.*成功|已上傳/)).toBeVisible();
  });
});

// ============================================================================
// Manual Tests - Add your custom tests below this line
// ============================================================================
