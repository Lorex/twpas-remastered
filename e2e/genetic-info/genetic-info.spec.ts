/**
 * @file genetic-info.spec.ts
 * @description E2E tests for genetic information management
 * @bdd-generated: features/genetic-info/genetic-info.feature
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

async function navigateToGeneticInfo(page: Page, caseId: string = 'CASE-001') {
  await page.goto(`/claims/${caseId}/genetic-info`);
}

// ============================================================================
// BDD Generated Tests
// ============================================================================

test.describe('基因資訊管理 @genetic-info', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await navigateToGeneticInfo(page);
  });

  // ===========================================================================
  // 基因檢測資料
  // ===========================================================================

  /**
   * @bdd-generated: features/genetic-info/genetic-info.feature#新增基因檢測資料
   * @bdd-hash: k1l2m3n4
   */
  test('新增基因檢測資料', async ({ page }) => {
    // 當 我點擊 "新增基因檢測" 按鈕
    await page.getByRole('button', { name: /新增基因檢測/i }).click();

    // 並且 我填寫以下基因檢測資料
    await page.getByLabel(/檢測類型/i).selectOption('次世代定序面板 (NGS)');
    await page.getByLabel(/檢體類型/i).selectOption('組織');
    await page.getByLabel(/檢體採集日期/i).fill('2024-01-10');
    await page.getByLabel(/檢測日期/i).fill('2024-01-15');
    await page.getByLabel(/報告日期/i).fill('2024-01-18');
    await page.getByLabel(/基因符號/i).fill('EGFR');
    await page.getByLabel(/突變類型/i).selectOption('點突變');
    await page.getByLabel(/突變細節/i).fill('L858R');
    await page.getByLabel(/VAF/i).fill('35.5');
    await page.getByLabel(/結果/i).selectOption('陽性');
    await page.getByLabel(/結果判讀/i).fill('建議使用 EGFR-TKI');

    // 選擇檢測機構
    await page.getByLabel(/檢測機構/i).click();
    await page.getByText('基因科技公司 (LAB001)').click();

    // 並且 我點擊儲存按鈕
    await page.getByRole('button', { name: /儲存/i }).click();

    // 那麼 我應該看到成功訊息 "基因檢測資料已新增"
    await expect(page.getByText('基因檢測資料已新增')).toBeVisible();

    // 並且 基因檢測列表應該包含此檢測
    await expect(page.getByText('EGFR')).toBeVisible();
    await expect(page.getByText('L858R')).toBeVisible();
  });

  /**
   * @bdd-generated: features/genetic-info/genetic-info.feature#選擇檢測機構
   * @bdd-hash: l2m3n4o5
   */
  test('選擇檢測機構', async ({ page }) => {
    // 當 我在新增基因檢測
    await page.getByRole('button', { name: /新增基因檢測/i }).click();

    // 並且 我點擊檢測機構選擇欄位
    await page.getByLabel(/檢測機構/i).click();

    // 並且 我輸入 "基因" 進行搜尋
    await page.getByPlaceholder(/搜尋機構/i).fill('基因');

    // 那麼 我應該看到符合條件的機構列表
    await expect(page.getByText('基因科技公司')).toBeVisible();

    // 並且 列表應該顯示機構的認證資訊
    await expect(page.getByText('CAP/CLIA')).toBeVisible();

    // 當 我選擇 "基因科技公司"
    await page.getByText('基因科技公司 (LAB001)').click();

    // 那麼 檢測機構欄位應該顯示 "基因科技公司 (LAB001)"
    await expect(page.getByLabel(/檢測機構/i)).toHaveValue(/基因科技公司.*LAB001/);
  });

  // ===========================================================================
  // 常見基因突變
  // ===========================================================================

  /**
   * @bdd-generated: features/genetic-info/genetic-info.feature#記錄 EGFR 突變
   * @bdd-hash: m3n4o5p6
   */
  test('記錄 EGFR 突變', async ({ page }) => {
    // 當 我新增基因檢測資料
    await page.getByRole('button', { name: /新增基因檢測/i }).click();

    // 並且 我選擇基因符號為 "EGFR"
    await page.getByLabel(/基因符號/i).fill('EGFR');

    // 那麼 系統應該提示常見的 EGFR 突變
    await expect(page.getByText('L858R')).toBeVisible();
    await expect(page.getByText('T790M')).toBeVisible();
    await expect(page.getByText('exon 19 deletion')).toBeVisible();
  });

  /**
   * @bdd-generated: features/genetic-info/genetic-info.feature#記錄 ALK 融合基因
   * @bdd-hash: n4o5p6q7
   */
  test('記錄 ALK 融合基因', async ({ page }) => {
    // 當 我新增基因檢測資料
    await page.getByRole('button', { name: /新增基因檢測/i }).click();

    // 並且 我選擇基因符號為 "ALK"
    await page.getByLabel(/基因符號/i).fill('ALK');

    // 並且 我選擇突變類型為 "融合"
    await page.getByLabel(/突變類型/i).selectOption('融合');

    // 那麼 系統應該提示常見的融合夥伴
    await expect(page.getByText('EML4')).toBeVisible();
    await expect(page.getByText('KIF5B')).toBeVisible();
  });

  // ===========================================================================
  // 附件管理
  // ===========================================================================

  /**
   * @bdd-generated: features/genetic-info/genetic-info.feature#上傳基因報告 PDF 附件
   * @bdd-hash: o5p6q7r8
   */
  test('上傳基因報告 PDF 附件', async ({ page }) => {
    // 當 我在新增基因檢測
    await page.getByRole('button', { name: /新增基因檢測/i }).click();

    // 並且 我點擊 "上傳報告" 按鈕
    // 並且 我選擇一個 PDF 檔案
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'genetic-report.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('fake-pdf-content'),
    });

    // 那麼 附件應該上傳成功
    await expect(page.getByText('genetic-report.pdf')).toBeVisible();
  });

  /**
   * @bdd-generated: features/genetic-info/genetic-info.feature#基因報告附件格式限制
   * @bdd-hash: p6q7r8s9
   */
  test('基因報告附件格式限制', async ({ page }) => {
    // 當 我在新增基因檢測
    await page.getByRole('button', { name: /新增基因檢測/i }).click();

    // 並且 我嘗試上傳一個 .xlsx 檔案
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'report.xlsx',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      buffer: Buffer.from('fake-xlsx-content'),
    });

    // 那麼 我應該看到錯誤訊息
    await expect(page.getByText(/不支援的檔案格式.*PDF/)).toBeVisible();
  });

  // ===========================================================================
  // 多筆基因檢測
  // ===========================================================================

  /**
   * @bdd-generated: features/genetic-info/genetic-info.feature#新增多筆不同基因的檢測
   * @bdd-hash: q7r8s9t0
   */
  test('新增多筆不同基因的檢測', async ({ page }) => {
    const genes = [
      { symbol: 'EGFR', mutationType: '點突變', result: '陽性' },
      { symbol: 'ALK', mutationType: '融合', result: '陰性' },
      { symbol: 'ROS1', mutationType: '重排', result: '陰性' },
    ];

    for (const gene of genes) {
      await page.getByRole('button', { name: /新增基因檢測/i }).click();
      await page.getByLabel(/基因符號/i).fill(gene.symbol);
      await page.getByLabel(/突變類型/i).selectOption(gene.mutationType);
      await page.getByLabel(/結果/i).selectOption(gene.result);
      await page.getByLabel(/檢測類型/i).selectOption('次世代定序面板 (NGS)');
      await page.getByLabel(/檢體類型/i).selectOption('組織');
      await page.getByLabel(/檢測日期/i).fill('2024-01-15');
      await page.getByRole('button', { name: /儲存/i }).click();
      await expect(page.getByText('基因檢測資料已新增')).toBeVisible();
    }

    // 那麼 基因檢測列表應該有 3 筆記錄
    await expect(page.locator('.genetic-test-row')).toHaveCount(3);
  });

  // ===========================================================================
  // 編輯與刪除
  // ===========================================================================

  /**
   * @bdd-generated: features/genetic-info/genetic-info.feature#編輯已存在的基因檢測
   * @bdd-hash: r8s9t0u1
   */
  test('編輯已存在的基因檢測', async ({ page }) => {
    // 假設 案件已有一筆 EGFR 基因檢測

    // 當 我點擊該基因檢測的編輯按鈕
    await page.locator('.genetic-test-row').first().getByRole('button', { name: /編輯/i }).click();

    // 並且 我修改結果判讀為 "更新後的判讀"
    await page.getByLabel(/結果判讀/i).fill('更新後的判讀');

    // 並且 我點擊儲存按鈕
    await page.getByRole('button', { name: /儲存/i }).click();

    // 那麼 我應該看到成功訊息 "基因檢測資料已更新"
    await expect(page.getByText('基因檢測資料已更新')).toBeVisible();
  });

  /**
   * @bdd-generated: features/genetic-info/genetic-info.feature#刪除基因檢測
   * @bdd-hash: s9t0u1v2
   */
  test('刪除基因檢測', async ({ page }) => {
    // 假設 案件已有一筆基因檢測

    // 當 我點擊該基因檢測的刪除按鈕
    await page.locator('.genetic-test-row').first().getByRole('button', { name: /刪除/i }).click();

    // 並且 我確認刪除操作
    await page.getByRole('button', { name: /確認/i }).click();

    // 那麼 我應該看到成功訊息 "基因檢測資料已刪除"
    await expect(page.getByText('基因檢測資料已刪除')).toBeVisible();
  });

  // ===========================================================================
  // 驗證規則
  // ===========================================================================

  /**
   * @bdd-generated: features/genetic-info/genetic-info.feature#基因檢測必填欄位驗證
   * @bdd-hash: t0u1v2w3
   */
  test('基因檢測必填欄位驗證', async ({ page }) => {
    // 當 我在新增基因檢測
    await page.getByRole('button', { name: /新增基因檢測/i }).click();

    // 並且 我只填寫基因符號
    await page.getByLabel(/基因符號/i).fill('EGFR');

    // 並且 我點擊儲存按鈕
    await page.getByRole('button', { name: /儲存/i }).click();

    // 那麼 我應該看到錯誤訊息
    await expect(page.getByText(/檢測類型為必填/)).toBeVisible();
    await expect(page.getByText(/檢體類型為必填/)).toBeVisible();
    await expect(page.getByText(/檢測日期為必填/)).toBeVisible();
    await expect(page.getByText(/結果為必填/)).toBeVisible();
  });

  /**
   * @bdd-generated: features/genetic-info/genetic-info.feature#VAF 數值範圍驗證
   * @bdd-hash: u1v2w3x4
   */
  test('VAF 數值範圍驗證', async ({ page }) => {
    // 當 我在新增基因檢測
    await page.getByRole('button', { name: /新增基因檢測/i }).click();

    // 並且 我填寫 VAF 為 "150"
    await page.getByLabel(/VAF/i).fill('150');

    // 那麼 我應該看到錯誤訊息 "VAF 必須介於 0 到 100 之間"
    await expect(page.getByText(/VAF 必須介於 0 到 100 之間/)).toBeVisible();
  });
});

// ============================================================================
// Manual Tests - Add your custom tests below this line
// ============================================================================
