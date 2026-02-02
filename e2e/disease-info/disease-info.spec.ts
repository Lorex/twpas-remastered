/**
 * @file disease-info.spec.ts
 * @description E2E tests for disease information management
 * @bdd-generated: features/disease-info/disease-info.feature
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

async function navigateToDiseaseInfo(page: Page, caseId: string = 'CASE-001') {
  await page.goto(`/claims/${caseId}/disease-info`);
}

// ============================================================================
// BDD Generated Tests
// ============================================================================

test.describe('疾病資訊管理 @disease-info', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await navigateToDiseaseInfo(page);
  });

  // ===========================================================================
  // 影像報告
  // ===========================================================================

  /**
   * @bdd-generated: features/disease-info/disease-info.feature#新增影像報告
   * @bdd-hash: a1b2c3d4
   */
  test('新增影像報告', async ({ page }) => {
    // 當 我點擊 "新增影像報告" 按鈕
    await page.getByRole('button', { name: /新增影像報告/i }).click();

    // 並且 我填寫以下影像報告資料
    await page.getByLabel(/影像類型/i).selectOption('電腦斷層 (CT)');
    await page.getByLabel(/檢查部位/i).fill('肺部');
    await page.getByLabel(/報告日期/i).fill('2024-01-15');
    await page.getByLabel(/發現/i).fill('右上葉可見 2.5cm 腫塊');
    await page.getByLabel(/結論/i).fill('高度懷疑為原發性肺癌');

    // 選擇簽發醫師
    await page.getByLabel(/簽發醫師/i).click();
    await page.getByText('張醫師 (DOC001)').click();

    // 並且 我點擊儲存按鈕
    await page.getByRole('button', { name: /儲存/i }).click();

    // 那麼 我應該看到成功訊息 "影像報告已新增"
    await expect(page.getByText('影像報告已新增')).toBeVisible();

    // 並且 影像報告列表應該包含此報告
    await expect(page.getByText('電腦斷層 (CT)')).toBeVisible();
  });

  /**
   * @bdd-generated: features/disease-info/disease-info.feature#選擇簽發影像報告醫師
   * @bdd-hash: b2c3d4e5
   */
  test('選擇簽發影像報告醫師', async ({ page }) => {
    // 當 我在新增影像報告
    await page.getByRole('button', { name: /新增影像報告/i }).click();

    // 並且 我點擊簽發醫師選擇欄位
    await page.getByLabel(/簽發醫師/i).click();

    // 並且 我輸入 "張" 進行搜尋
    await page.getByPlaceholder(/搜尋醫師/i).fill('張');

    // 那麼 我應該看到符合條件的醫師列表
    await expect(page.getByText('張醫師')).toBeVisible();

    // 並且 列表應該顯示醫師的專科資訊
    await expect(page.getByText('放射科')).toBeVisible();

    // 當 我選擇 "張醫師"
    await page.getByText('張醫師 (DOC001)').click();

    // 那麼 簽發醫師欄位應該顯示 "張醫師 (DOC001)"
    await expect(page.getByLabel(/簽發醫師/i)).toHaveValue(/張醫師.*DOC001/);
  });

  /**
   * @bdd-generated: features/disease-info/disease-info.feature#上傳影像報告附件
   * @bdd-hash: c3d4e5f6
   */
  test('上傳影像報告附件', async ({ page }) => {
    // 當 我在新增影像報告
    await page.getByRole('button', { name: /新增影像報告/i }).click();

    // 並且 我點擊 "上傳附件" 按鈕
    // 並且 我選擇一個 PNG 圖檔
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'scan.png',
      mimeType: 'image/png',
      buffer: Buffer.from('fake-image-content'),
    });

    // 那麼 附件應該上傳成功
    // 並且 我應該看到附件預覽
    await expect(page.getByText('scan.png')).toBeVisible();
  });

  /**
   * @bdd-generated: features/disease-info/disease-info.feature#影像報告附件格式限制
   * @bdd-hash: d4e5f6g7
   */
  test('影像報告附件格式限制', async ({ page }) => {
    // 當 我在新增影像報告
    await page.getByRole('button', { name: /新增影像報告/i }).click();

    // 並且 我嘗試上傳一個 .doc 檔案
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'document.doc',
      mimeType: 'application/msword',
      buffer: Buffer.from('fake-doc-content'),
    });

    // 那麼 我應該看到錯誤訊息
    await expect(page.getByText(/不支援的檔案格式/)).toBeVisible();
  });

  // ===========================================================================
  // 癌症分期
  // ===========================================================================

  /**
   * @bdd-generated: features/disease-info/disease-info.feature#新增癌症分期資料
   * @bdd-hash: e5f6g7h8
   */
  test('新增癌症分期資料', async ({ page }) => {
    // 當 我點擊 "新增癌症分期" 按鈕
    await page.getByRole('button', { name: /新增癌症分期/i }).click();

    // 並且 我填寫以下癌症分期資料
    await page.getByLabel(/分期系統/i).selectOption('AJCC 第 8 版');
    await page.getByLabel(/臨床分期/i).selectOption('Stage IIIA');
    await page.getByLabel(/T 分期/i).selectOption('T2');
    await page.getByLabel(/N 分期/i).selectOption('N2');
    await page.getByLabel(/M 分期/i).selectOption('M0');
    await page.getByLabel(/評估日期/i).fill('2024-01-20');

    await page.getByLabel(/簽發醫師/i).click();
    await page.getByText('王醫師 (DOC003)').click();

    // 並且 我點擊儲存按鈕
    await page.getByRole('button', { name: /儲存/i }).click();

    // 那麼 我應該看到成功訊息 "癌症分期已新增"
    await expect(page.getByText('癌症分期已新增')).toBeVisible();
  });

  /**
   * @bdd-generated: features/disease-info/disease-info.feature#使用 FIGO 分期系統 (婦科腫瘤)
   * @bdd-hash: f6g7h8i9
   */
  test('使用 FIGO 分期系統 (婦科腫瘤)', async ({ page }) => {
    // 當 我在新增癌症分期
    await page.getByRole('button', { name: /新增癌症分期/i }).click();

    // 並且 我選擇分期系統為 "FIGO"
    await page.getByLabel(/分期系統/i).selectOption('FIGO');

    // 那麼 分期結果選項應該包含 FIGO 分期
    await expect(page.getByLabel(/臨床分期/i).locator('option', { hasText: 'Stage I' })).toBeAttached();

    // 並且 T/N/M 分期欄位應該被隱藏
    await expect(page.getByLabel(/T 分期/i)).not.toBeVisible();
    await expect(page.getByLabel(/N 分期/i)).not.toBeVisible();
    await expect(page.getByLabel(/M 分期/i)).not.toBeVisible();
  });

  // ===========================================================================
  // 檢查報告
  // ===========================================================================

  /**
   * @bdd-generated: features/disease-info/disease-info.feature#新增檢查報告
   * @bdd-hash: g7h8i9j0
   */
  test('新增檢查報告', async ({ page }) => {
    // 當 我點擊 "新增檢查報告" 按鈕
    await page.getByRole('button', { name: /新增檢查報告/i }).click();

    // 並且 我填寫以下檢查報告資料
    await page.getByLabel(/檢查類型/i).selectOption('病理報告');
    await page.getByLabel(/報告日期/i).fill('2024-01-18');
    await page.getByLabel(/檢體/i).fill('肺部切片');
    await page.getByLabel(/發現/i).fill('非小細胞肺癌');
    await page.getByLabel(/結論/i).fill('腺癌, EGFR 突變陽性');

    await page.getByLabel(/簽發醫師/i).click();
    await page.getByText('李醫師 (DOC002)').click();

    // 並且 我點擊儲存按鈕
    await page.getByRole('button', { name: /儲存/i }).click();

    // 那麼 我應該看到成功訊息 "檢查報告已新增"
    await expect(page.getByText('檢查報告已新增')).toBeVisible();
  });

  // ===========================================================================
  // 疾病資訊總覽
  // ===========================================================================

  /**
   * @bdd-generated: features/disease-info/disease-info.feature#查看疾病資訊總覽
   * @bdd-hash: h8i9j0k1
   */
  test('查看疾病資訊總覽', async ({ page }) => {
    // 假設 案件已填寫疾病資訊

    // 當 我在疾病資訊頁面
    await expect(page).toHaveURL(/disease-info/);

    // 那麼 我應該看到影像報告列表
    await expect(page.getByText(/影像報告/)).toBeVisible();

    // 並且 我應該看到癌症分期列表
    await expect(page.getByText(/癌症分期/)).toBeVisible();

    // 並且 我應該看到檢查報告列表
    await expect(page.getByText(/檢查報告/)).toBeVisible();
  });

  /**
   * @bdd-generated: features/disease-info/disease-info.feature#編輯已存在的影像報告
   * @bdd-hash: i9j0k1l2
   */
  test('編輯已存在的影像報告', async ({ page }) => {
    // 假設 案件已有一筆影像報告

    // 當 我點擊該影像報告的編輯按鈕
    await page.locator('.imaging-report-row').first().getByRole('button', { name: /編輯/i }).click();

    // 並且 我修改結論為 "更新後的結論"
    await page.getByLabel(/結論/i).fill('更新後的結論');

    // 並且 我點擊儲存按鈕
    await page.getByRole('button', { name: /儲存/i }).click();

    // 那麼 我應該看到成功訊息 "影像報告已更新"
    await expect(page.getByText('影像報告已更新')).toBeVisible();

    // 並且 影像報告的結論應該為 "更新後的結論"
    await expect(page.getByText('更新後的結論')).toBeVisible();
  });

  /**
   * @bdd-generated: features/disease-info/disease-info.feature#刪除疾病資訊項目
   * @bdd-hash: j0k1l2m3
   */
  test('刪除疾病資訊項目', async ({ page }) => {
    // 假設 案件已有一筆影像報告

    // 當 我點擊該影像報告的刪除按鈕
    await page.locator('.imaging-report-row').first().getByRole('button', { name: /刪除/i }).click();

    // 並且 我確認刪除操作
    await page.getByRole('button', { name: /確認/i }).click();

    // 那麼 我應該看到成功訊息 "影像報告已刪除"
    await expect(page.getByText('影像報告已刪除')).toBeVisible();
  });
});

// ============================================================================
// Manual Tests - Add your custom tests below this line
// ============================================================================
