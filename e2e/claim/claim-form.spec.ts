/**
 * @file claim-form.spec.ts
 * @description E2E tests for claim form functionality
 * @bdd-generated: features/claim/claim-form.feature
 *
 * Auto-generated from BDD feature file. Manual tests can be added below the generated section.
 */

import { test, expect, type Page } from '@playwright/test';

// ============================================================================
// Test Data (from feature background)
// ============================================================================
const testPatient = {
  mrn: '1234567',
  idNumber: 'E125123456',
  name: '測試病人',
  gender: 'M',
  birthDate: '1995-12-09',
};

const testDrugs = [
  { code: 'KC01065221', name: 'Herceptin SC' },
  { code: 'KC01065222', name: 'Kadcyla (Ado-trastuzumab Emtansine)' },
  { code: 'KC01065223', name: 'Perjeta (Pertuzumab)' },
  { code: 'KC01065224', name: 'Phesgo' },
];

// ============================================================================
// Helper Functions
// ============================================================================
async function login(page: Page) {
  await page.goto('/login');
  await page.getByLabel(/帳號/i).fill('doctor01');
  await page.getByLabel(/密碼/i).fill('Pass1234!');
  await page.getByRole('button', { name: /登入/i }).click();
  await expect(page).toHaveURL(/profile|dashboard/);
}

async function navigateToNewClaimForm(page: Page) {
  await page.goto('/claim-form');
}

// ============================================================================
// BDD Generated Tests - DO NOT EDIT MANUALLY
// ============================================================================

test.describe('癌症用藥事前審查申請表單 @claim @form', () => {
  test.beforeEach(async ({ page }) => {
    // Background: 我已經登入為 "doctor01"
    await login(page);
  });

  // ===========================================================================
  // 申請表單 Tab 結構
  // ===========================================================================

  /**
   * @bdd-generated: features/claim/claim-form.feature#申請表單具有六個標籤頁
   * @bdd-hash: 1a2b3c4d
   */
  test('申請表單具有六個標籤頁', async ({ page }) => {
    // 當 我在新增申請案頁面
    await navigateToNewClaimForm(page);

    // 那麼 我應該看到以下標籤頁
    await expect(page.getByText('病歷摘要')).toBeVisible();
    await expect(page.getByText('檢驗結果')).toBeVisible();
    await expect(page.getByText('附件摘要')).toBeVisible();
    await expect(page.getByText('附件-其他')).toBeVisible();
    await expect(page.getByText('給付規定')).toBeVisible();
    await expect(page.getByText('補充附件')).toBeVisible();
  });

  /**
   * @bdd-generated: features/claim/claim-form.feature#預設顯示病歷摘要標籤頁
   * @bdd-hash: 2b3c4d5e
   */
  test('預設顯示病歷摘要標籤頁', async ({ page }) => {
    // 當 我在新增申請案頁面
    await navigateToNewClaimForm(page);

    // 那麼 病歷摘要標籤頁應該為選中狀態
    await expect(page.getByRole('tab', { name: /病歷摘要/ })).toHaveAttribute('aria-selected', 'true');

    // 並且 我應該看到病歷摘要表單
    await expect(page.getByText(/門診.*住院|姓名|身分證字號/)).toBeVisible();
  });

  /**
   * @bdd-generated: features/claim/claim-form.feature#切換標籤頁保留已填寫資料
   * @bdd-hash: 3c4d5e6f
   */
  test('切換標籤頁保留已填寫資料', async ({ page }) => {
    // 當 我在病歷摘要標籤頁填寫部分資料
    await navigateToNewClaimForm(page);
    await page.getByLabel(/姓名/i).fill('測試病人');

    // 並且 我切換到檢驗結果標籤頁
    await page.getByRole('tab', { name: /檢驗結果/ }).click();

    // 並且 我再切換回病歷摘要標籤頁
    await page.getByRole('tab', { name: /病歷摘要/ }).click();

    // 那麼 之前填寫的資料應該仍然保留
    await expect(page.getByLabel(/姓名/i)).toHaveValue('測試病人');
  });

  // ===========================================================================
  // 病歷摘要標籤頁
  // ===========================================================================

  /**
   * @bdd-generated: features/claim/claim-form.feature#填寫病歷摘要基本資料
   * @bdd-hash: 4d5e6f7a
   */
  test('填寫病歷摘要基本資料', async ({ page }) => {
    // 當 我在病歷摘要標籤頁
    await navigateToNewClaimForm(page);

    // 並且 我選擇門診/住院為 "門診"
    await page.getByLabel(/門診.*住院/i).selectOption('門診');

    // 並且 我填寫以下病人基本資料
    await page.getByLabel(/姓名/i).fill(testPatient.name);
    await page.getByLabel(/身分證字號/i).fill(testPatient.idNumber);
    await page.getByLabel(/病歷號/i).fill(testPatient.mrn);
    await page.getByLabel(/性別/i).fill(testPatient.gender);
    await page.getByLabel(/出生年月日/i).fill(testPatient.birthDate);

    // 那麼 年齡欄位應該自動計算並顯示
    await expect(page.getByLabel(/年齡/i)).not.toHaveValue('');
  });

  /**
   * @bdd-generated: features/claim/claim-form.feature#門診/住院選擇 - 門診
   * @bdd-hash: 5e6f7a8b
   */
  test('門診/住院選擇 - 門診', async ({ page }) => {
    // 當 我在病歷摘要標籤頁
    await navigateToNewClaimForm(page);

    // 並且 我選擇門診/住院為 "門診"
    await page.getByLabel(/門診.*住院/i).selectOption('門診');

    // 那麼 門診/住院欄位應該顯示 "門診"
    await expect(page.getByLabel(/門診.*住院/i)).toHaveValue('門診');
  });

  /**
   * @bdd-generated: features/claim/claim-form.feature#門診/住院選擇 - 住院
   * @bdd-hash: 6f7a8b9c
   */
  test('門診/住院選擇 - 住院', async ({ page }) => {
    // 當 我在病歷摘要標籤頁
    await navigateToNewClaimForm(page);

    // 並且 我選擇門診/住院為 "住院"
    await page.getByLabel(/門診.*住院/i).selectOption('住院');

    // 那麼 門診/住院欄位應該顯示 "住院"
    await expect(page.getByLabel(/門診.*住院/i)).toHaveValue('住院');
  });

  /**
   * @bdd-generated: features/claim/claim-form.feature#申請類別選擇 - 送核
   * @bdd-hash: 7a8b9c0d
   */
  test('申請類別選擇 - 送核', async ({ page }) => {
    await navigateToNewClaimForm(page);
    await page.getByLabel(/申請類別/i).selectOption('送核');
    await expect(page.getByLabel(/申請類別/i)).toHaveValue('送核');
  });

  /**
   * @bdd-generated: features/claim/claim-form.feature#申請類別選擇 - 補件
   * @bdd-hash: 8b9c0d1e
   */
  test('申請類別選擇 - 補件', async ({ page }) => {
    await navigateToNewClaimForm(page);
    await page.getByLabel(/申請類別/i).selectOption('補件');
    await expect(page.getByLabel(/申請類別/i)).toHaveValue('補件');
  });

  /**
   * @bdd-generated: features/claim/claim-form.feature#申請類別選擇 - 申復
   * @bdd-hash: 9c0d1e2f
   */
  test('申請類別選擇 - 申復', async ({ page }) => {
    await navigateToNewClaimForm(page);
    await page.getByLabel(/申請類別/i).selectOption('申復');
    await expect(page.getByLabel(/申請類別/i)).toHaveValue('申復');
  });

  /**
   * @bdd-generated: features/claim/claim-form.feature#選擇其他病況時需填寫描述
   * @bdd-hash: 0d1e2f3a
   */
  test('選擇其他病況時需填寫描述', async ({ page }) => {
    // 當 我在病歷摘要標籤頁
    await navigateToNewClaimForm(page);

    // 並且 我選擇目前病患病況為 "其他"
    await page.getByLabel(/目前病患病況/i).selectOption('其他');

    // 那麼 其他病況描述欄位應該變為必填
    await expect(page.getByLabel(/其他.*描述|其他病況/i)).toBeVisible();
  });

  /**
   * @bdd-generated: features/claim/claim-form.feature#填寫 ICD-10-CM 代碼
   * @bdd-hash: 1e2f3a4b
   */
  test('填寫 ICD-10-CM 代碼', async ({ page }) => {
    // 當 我在病歷摘要標籤頁
    await navigateToNewClaimForm(page);

    // 並且 我在 ICD-10-CM 代碼查詢器輸入 "C50"
    await page.getByPlaceholder(/ICD|疾病代碼/i).fill('C50');

    // 那麼 我應該看到相關的 ICD 代碼建議
    await expect(page.getByRole('listbox')).toBeVisible();

    // 當 我選擇代碼 "G009"
    await page.getByText('G009').click();

    // 那麼 申請疾病別應該顯示 "G009"
    await expect(page.getByText('G009')).toBeVisible();
  });

  /**
   * @bdd-generated: features/claim/claim-form.feature#清空申請疾病別
   * @bdd-hash: 2f3a4b5c
   */
  test('清空申請疾病別', async ({ page }) => {
    // 假設 我已選擇疾病別 "G009"
    await navigateToNewClaimForm(page);
    await page.getByPlaceholder(/ICD|疾病代碼/i).fill('G009');
    await page.getByText('G009').first().click();

    // 當 我點擊 "一鍵清空申請疾病別" 按鈕
    await page.getByRole('button', { name: /一鍵清空|清空.*疾病別/i }).click();

    // 那麼 申請疾病別應該被清空
    await expect(page.getByLabel(/申請疾病別/i)).toHaveValue('');
  });

  // ===========================================================================
  // 申請品項
  // ===========================================================================

  /**
   * @bdd-generated: features/claim/claim-form.feature#選擇乳癌藥品
   * @bdd-hash: 3a4b5c6d
   */
  test('選擇乳癌藥品', async ({ page }) => {
    // 當 我在病歷摘要標籤頁的申請品項區塊
    await navigateToNewClaimForm(page);

    // 並且 我填寫體重為 "70" kg
    await page.getByLabel(/體重/i).fill('70');

    // 並且 我選擇藥品名稱及代碼為 "Trastuzumab"
    await page.getByLabel(/藥品名稱/i).selectOption({ label: /Trastuzumab/i });

    // 那麼 應該顯示藥品的詳細資訊
    await expect(page.getByText(/Trastuzumab|KC01065/)).toBeVisible();
  });

  /**
   * @bdd-generated: features/claim/claim-form.feature#乳癌藥品選項 - Trastuzumab
   * @bdd-hash: 4b5c6d7e
   */
  test('乳癌藥品選項 - Trastuzumab', async ({ page }) => {
    await navigateToNewClaimForm(page);
    const drugSelect = page.getByLabel(/藥品名稱/i);
    await expect(drugSelect.getByText(/Trastuzumab/i)).toBeVisible();
  });

  /**
   * @bdd-generated: features/claim/claim-form.feature#填寫藥品使用日期
   * @bdd-hash: 5c6d7e8f
   */
  test('填寫藥品使用日期', async ({ page }) => {
    // 當 我在申請品項區塊
    await navigateToNewClaimForm(page);

    // 並且 我選擇藥品名稱及代碼為 "Trastuzumab"
    await page.getByLabel(/藥品名稱/i).selectOption({ label: /Trastuzumab/i });

    // 並且 我填寫使用日期起為 "2026-02-04"
    await page.getByLabel(/使用日期.*起/i).fill('2026-02-04');

    // 並且 我填寫使用日期訖為 "2026-10-04"
    await page.getByLabel(/使用日期.*訖/i).fill('2026-10-04');

    // 那麼 使用日期應該被記錄
    await expect(page.getByLabel(/使用日期.*起/i)).toHaveValue('2026-02-04');
    await expect(page.getByLabel(/使用日期.*訖/i)).toHaveValue('2026-10-04');
  });

  /**
   * @bdd-generated: features/claim/claim-form.feature#新增藥品到申請品項表格
   * @bdd-hash: 6d7e8f9a
   */
  test('新增藥品到申請品項表格', async ({ page }) => {
    // 當 我在申請品項區塊
    await navigateToNewClaimForm(page);

    // 並且 我完整填寫藥品資訊並確認
    await page.getByLabel(/藥品名稱/i).selectOption({ label: /Trastuzumab/i });
    await page.getByLabel(/體重/i).fill('70');
    await page.getByLabel(/使用日期.*起/i).fill('2026-02-04');
    await page.getByLabel(/使用日期.*訖/i).fill('2026-10-04');
    await page.getByRole('button', { name: /新增|加入/i }).click();

    // 那麼 申請品項表格應該新增一筆記錄
    await expect(page.locator('table tbody tr')).toHaveCount(1);

    // 並且 表格應該顯示相關欄位
    await expect(page.getByText(/藥品名稱及代碼/)).toBeVisible();
    await expect(page.getByText(/療程劑量/)).toBeVisible();
    await expect(page.getByText(/申請數量/)).toBeVisible();
  });

  /**
   * @bdd-generated: features/claim/claim-form.feature#刪除已新增的藥品品項
   * @bdd-hash: 7e8f9a0b
   */
  test('刪除已新增的藥品品項', async ({ page }) => {
    // 假設 申請品項表格已有一筆藥品記錄
    await navigateToNewClaimForm(page);
    await page.getByLabel(/藥品名稱/i).selectOption({ label: /Trastuzumab/i });
    await page.getByRole('button', { name: /新增|加入/i }).click();

    // 當 我點擊該藥品的刪除按鈕
    await page.locator('table tbody tr').first().getByRole('button', { name: /刪除/i }).click();

    // 那麼 該藥品應該從表格中移除
    await expect(page.locator('table tbody tr')).toHaveCount(0);
  });

  /**
   * @bdd-generated: features/claim/claim-form.feature#填寫手術日期
   * @bdd-hash: 8f9a0b1c
   */
  test('填寫手術日期', async ({ page }) => {
    // 當 我在申請品項區塊
    await navigateToNewClaimForm(page);

    // 並且 我填寫手術日期為 "2026-01-15"
    await page.getByLabel(/手術日期/i).fill('2026-01-15');

    // 那麼 手術日期欄位應該顯示 "2026-01-15"
    await expect(page.getByLabel(/手術日期/i)).toHaveValue('2026-01-15');
  });

  // ===========================================================================
  // 申請醫師資訊
  // ===========================================================================

  /**
   * @bdd-generated: features/claim/claim-form.feature#填寫申請醫師資訊
   * @bdd-hash: 9a0b1c2d
   */
  test('填寫申請醫師資訊', async ({ page }) => {
    // 當 我在病歷摘要標籤頁
    await navigateToNewClaimForm(page);

    // 並且 我填寫申請醫師為 "洪主任"
    await page.getByLabel(/申請醫師/i).fill('洪主任');

    // 並且 我填寫申請醫師身分證為 "A123456789"
    await page.getByLabel(/醫師身分證/i).fill('A123456789');

    // 那麼 申請醫師資訊應該被記錄
    await expect(page.getByLabel(/申請醫師/i)).toHaveValue('洪主任');
  });

  /**
   * @bdd-generated: features/claim/claim-form.feature#申請醫師自動帶入登入醫師資訊
   * @bdd-hash: 0b1c2d3e
   */
  test('申請醫師自動帶入登入醫師資訊', async ({ page }) => {
    // 當 我在新增申請案頁面
    await navigateToNewClaimForm(page);

    // 那麼 申請醫師欄位應該自動帶入目前登入醫師的姓名
    await expect(page.getByLabel(/申請醫師/i)).not.toHaveValue('');
  });

  // ===========================================================================
  // 病歷說明
  // ===========================================================================

  /**
   * @bdd-generated: features/claim/claim-form.feature#填寫病歷說明
   * @bdd-hash: 1c2d3e4f
   */
  test('填寫病歷說明', async ({ page }) => {
    // 當 我在病歷摘要標籤頁
    await navigateToNewClaimForm(page);

    // 並且 我在病歷說明欄位輸入詳細的病歷摘要
    await page.getByLabel(/病歷說明/i).fill('病人診斷為乳癌...');

    // 那麼 病歷說明應該被記錄
    await expect(page.getByLabel(/病歷說明/i)).toHaveValue('病人診斷為乳癌...');
  });

  /**
   * @bdd-generated: features/claim/claim-form.feature#使用常用字範本
   * @bdd-hash: 2d3e4f5a
   */
  test('使用常用字範本', async ({ page }) => {
    // 當 我在病歷摘要標籤頁
    await navigateToNewClaimForm(page);

    // 並且 我在常用字下拉選單選擇一個範本
    await page.getByLabel(/常用字/i).click();
    await page.getByRole('option').first().click();

    // 那麼 範本內容應該被插入到病歷說明欄位
    await expect(page.getByLabel(/病歷說明/i)).not.toHaveValue('');
  });

  // ===========================================================================
  // 檢驗結果標籤頁
  // ===========================================================================

  /**
   * @bdd-generated: features/claim/claim-form.feature#上傳檢驗結果檔案
   * @bdd-hash: 3e4f5a6b
   */
  test('上傳檢驗結果檔案', async ({ page }) => {
    // 當 我在檢驗結果標籤頁
    await navigateToNewClaimForm(page);
    await page.getByRole('tab', { name: /檢驗結果/ }).click();

    // 並且 我選擇檢驗結果類別為 "電腦斷層"
    await page.getByLabel(/檢驗結果類別/i).selectOption('電腦斷層');

    // 並且 我填寫檢查日期為 "2026-02-02"
    await page.getByLabel(/檢查日期/i).fill('2026-02-02');

    // 並且 我上傳一個檢驗結果檔案
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test-image.png',
      mimeType: 'image/png',
      buffer: Buffer.from('fake-image-content'),
    });

    // 那麼 檔案應該被成功上傳
    await expect(page.getByText(/上傳成功|檔案已上傳/)).toBeVisible();
  });

  /**
   * @bdd-generated: features/claim/claim-form.feature#檢驗結果類別選擇 - 電腦斷層
   * @bdd-hash: 4f5a6b7c
   */
  test('檢驗結果類別選擇 - 電腦斷層', async ({ page }) => {
    await navigateToNewClaimForm(page);
    await page.getByRole('tab', { name: /檢驗結果/ }).click();
    const categorySelect = page.getByLabel(/檢驗結果類別/i);
    await expect(categorySelect.getByText(/電腦斷層/)).toBeVisible();
  });

  /**
   * @bdd-generated: features/claim/claim-form.feature#顯示各類別已上傳檔案數量
   * @bdd-hash: 5a6b7c8d
   */
  test('顯示各類別已上傳檔案數量', async ({ page }) => {
    // 當 我在檢驗結果標籤頁
    await navigateToNewClaimForm(page);
    await page.getByRole('tab', { name: /檢驗結果/ }).click();

    // 那麼 我應該看到各檢驗結果類別的上傳檔案數量統計表
    await expect(page.getByText(/電腦斷層/)).toBeVisible();
    await expect(page.getByText(/超音波檢查/)).toBeVisible();
  });

  // ===========================================================================
  // 附件摘要標籤頁
  // ===========================================================================

  /**
   * @bdd-generated: features/claim/claim-form.feature#上傳病患同意書
   * @bdd-hash: 6b7c8d9e
   */
  test('上傳病患同意書', async ({ page }) => {
    // 當 我在附件摘要標籤頁
    await navigateToNewClaimForm(page);
    await page.getByRole('tab', { name: /附件摘要/ }).click();

    // 並且 我填寫同意書簽署日期為 "2026-02-02"
    await page.getByLabel(/同意書.*日期/i).fill('2026-02-02');

    // 並且 我上傳病患同意書檔案
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles({
      name: 'consent.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('fake-pdf-content'),
    });

    // 那麼 病患同意書應該被成功上傳
    await expect(page.getByText(/上傳成功|consent/i)).toBeVisible();
  });

  // ===========================================================================
  // 給付規定標籤頁
  // ===========================================================================

  /**
   * @bdd-generated: features/claim/claim-form.feature#顯示注意事項
   * @bdd-hash: 7c8d9e0f
   */
  test('顯示注意事項', async ({ page }) => {
    // 當 我在給付規定標籤頁
    await navigateToNewClaimForm(page);
    await page.getByRole('tab', { name: /給付規定/ }).click();

    // 那麼 我應該看到注意事項列表
    await expect(page.getByText(/注意事項/)).toBeVisible();

    // 並且 注意事項應該包含相關內容
    await expect(page.getByText(/本申請書限一人一案/)).toBeVisible();
    await expect(page.getByText(/應事前審查之項目未依規定事前申請核准者/)).toBeVisible();
  });

  /**
   * @bdd-generated: features/claim/claim-form.feature#顯示藥品給付規定
   * @bdd-hash: 8d9e0f1a
   */
  test('顯示藥品給付規定', async ({ page }) => {
    // 當 我在給付規定標籤頁
    await navigateToNewClaimForm(page);
    await page.getByRole('tab', { name: /給付規定/ }).click();

    // 那麼 我應該看到該藥品的健保給付規定內容
    await expect(page.getByText(/給付規定|健保/)).toBeVisible();
  });

  // ===========================================================================
  // 儲存與送出
  // ===========================================================================

  /**
   * @bdd-generated: features/claim/claim-form.feature#暫時儲存為草稿
   * @bdd-hash: 9e0f1a2b
   */
  test('暫時儲存為草稿', async ({ page }) => {
    // 當 我填寫完部分申請資料
    await navigateToNewClaimForm(page);
    await page.getByLabel(/姓名/i).fill(testPatient.name);
    await page.getByLabel(/身分證字號/i).fill(testPatient.idNumber);

    // 並且 我點擊 "暫時儲存 (草稿)" 按鈕
    await page.getByRole('button', { name: /暫時儲存.*草稿/i }).click();

    // 那麼 我應該看到成功訊息
    await expect(page.getByText(/成功|已儲存/)).toBeVisible();

    // 並且 案件狀態應該為 "草稿"
    await expect(page.getByText('草稿')).toBeVisible();
  });

  /**
   * @bdd-generated: features/claim/claim-form.feature#確認送出待審核
   * @bdd-hash: 0f1a2b3c
   */
  test('確認送出待審核', async ({ page }) => {
    // 當 我填寫完整的申請資料
    await navigateToNewClaimForm(page);
    await page.getByLabel(/姓名/i).fill(testPatient.name);
    await page.getByLabel(/身分證字號/i).fill(testPatient.idNumber);
    await page.getByLabel(/病歷號/i).fill(testPatient.mrn);
    await page.getByLabel(/性別/i).fill(testPatient.gender);
    await page.getByLabel(/出生年月日/i).fill(testPatient.birthDate);
    await page.getByLabel(/申請類別/i).selectOption('送核');

    // 並且 我點擊 "確認送出 (待審核)" 按鈕
    await page.getByRole('button', { name: /確認送出.*待審核/i }).click();

    // 那麼 我應該看到成功訊息
    await expect(page.getByText(/成功|已送出/)).toBeVisible();

    // 並且 案件狀態應該為 "待審核"
    await expect(page.getByText('待審核')).toBeVisible();
  });

  /**
   * @bdd-generated: features/claim/claim-form.feature#送出時驗證必填欄位
   * @bdd-hash: 1a2b3c4e
   */
  test('送出時驗證必填欄位', async ({ page }) => {
    // 當 我在病歷摘要標籤頁
    await navigateToNewClaimForm(page);

    // 並且 我未填寫必填欄位
    // 並且 我點擊 "確認送出 (待審核)" 按鈕
    await page.getByRole('button', { name: /確認送出.*待審核/i }).click();

    // 那麼 我應該看到錯誤訊息提示必填欄位
    await expect(page.getByText(/必填|為必填欄位/)).toBeVisible();
  });

  // ===========================================================================
  // 乳癌用藥時間限制
  // ===========================================================================

  /**
   * @bdd-generated: features/claim/claim-form.feature#顯示乳癌用藥申請週期提示
   * @bdd-hash: 2b3c4e5f
   */
  test('顯示乳癌用藥申請週期提示', async ({ page }) => {
    // 當 我在新增申請案頁面
    await navigateToNewClaimForm(page);

    // 那麼 我應該看到用藥申請週期提示
    await expect(page.getByText(/早期乳癌.*24週|24週/)).toBeVisible();
    await expect(page.getByText(/晚期乳癌.*18週|18週/)).toBeVisible();
    await expect(page.getByText(/Kadcyla.*12週|12週/)).toBeVisible();
  });

  // ===========================================================================
  // 編輯現有案件
  // ===========================================================================

  /**
   * @bdd-generated: features/claim/claim-form.feature#編輯草稿案件
   * @bdd-hash: 3c4e5f6a
   */
  test.skip('編輯草稿案件', async ({ page }) => {
    // 假設 存在草稿狀態的案件
    // Note: This test requires pre-existing data

    // 當 我點擊該案件的編輯按鈕
    await page.goto('/claim');
    await page.getByRole('row').first().getByRole('button', { name: /編輯/i }).click();

    // 那麼 我應該看到已填寫的申請表單
    await expect(page.getByLabel(/姓名/i)).not.toHaveValue('');

    // 並且 我可以修改表單內容
    await page.getByLabel(/姓名/i).fill('修改後的姓名');
  });

  /**
   * @bdd-generated: features/claim/claim-form.feature#無法編輯已送審案件
   * @bdd-hash: 4e5f6a7b
   */
  test.skip('無法編輯已送審案件', async ({ page }) => {
    // 假設 存在待審核或更後狀態的案件
    // Note: This test requires pre-existing data

    // 當 我嘗試編輯該案件
    await page.goto('/claim');
    await page.getByRole('tab', { name: /待審核/ }).click();

    // 那麼 編輯功能應該被停用
    const editButton = page.getByRole('row').first().getByRole('button', { name: /編輯/i });
    await expect(editButton).toBeDisabled();
  });

  // ===========================================================================
  // 表單驗證
  // ===========================================================================

  /**
   * @bdd-generated: features/claim/claim-form.feature#身分證字號格式驗證
   * @bdd-hash: 5f6a7b8c
   */
  test('身分證字號格式驗證', async ({ page }) => {
    // 當 我在病歷摘要標籤頁
    await navigateToNewClaimForm(page);

    // 並且 我填寫身分證字號為 "INVALID"
    await page.getByLabel(/身分證字號/i).fill('INVALID');
    await page.getByLabel(/身分證字號/i).blur();

    // 那麼 我應該看到錯誤訊息 "請填身分證字號共十碼(前一碼為大寫英文字母)"
    await expect(page.getByText(/請填身分證字號共十碼|身分證字號格式/)).toBeVisible();
  });

  /**
   * @bdd-generated: features/claim/claim-form.feature#性別格式驗證
   * @bdd-hash: 6a7b8c9d
   */
  test('性別格式驗證', async ({ page }) => {
    // 當 我在病歷摘要標籤頁
    await navigateToNewClaimForm(page);

    // 並且 我填寫性別為 "X"
    await page.getByLabel(/性別/i).fill('X');
    await page.getByLabel(/性別/i).blur();

    // 那麼 我應該看到錯誤訊息 "請輸入 M / F"
    await expect(page.getByText(/請輸入 M \/ F|性別.*M.*F/)).toBeVisible();
  });

  /**
   * @bdd-generated: features/claim/claim-form.feature#日期邏輯驗證
   * @bdd-hash: 7b8c9d0e
   */
  test('日期邏輯驗證', async ({ page }) => {
    // 當 我在申請品項區塊
    await navigateToNewClaimForm(page);

    // 並且 我填寫使用日期起為 "2026-10-04"
    await page.getByLabel(/使用日期.*起/i).fill('2026-10-04');

    // 並且 我填寫使用日期訖為 "2026-02-04"
    await page.getByLabel(/使用日期.*訖/i).fill('2026-02-04');
    await page.getByLabel(/使用日期.*訖/i).blur();

    // 那麼 我應該看到錯誤訊息 "使用日期訖不得早於使用日期起"
    await expect(page.getByText(/使用日期訖不得早於使用日期起|日期.*錯誤/)).toBeVisible();
  });
});

// ============================================================================
// Manual Tests - Add your custom tests below this line
// ============================================================================

// Example:
// test.describe('Custom Claim Form Tests', () => {
//   test('custom test case', async ({ page }) => {
//     // Your custom test implementation
//   });
// });
