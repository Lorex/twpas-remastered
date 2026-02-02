/**
 * @file patient-management.spec.ts
 * @description E2E tests for patient management functionality
 * @bdd-generated: features/patient/patient-management.feature
 *
 * Auto-generated from BDD feature file. Manual tests can be added below the generated section.
 */

import { test, expect, type Page } from '@playwright/test';

// ============================================================================
// Test Data (from feature background)
// ============================================================================
const testPatients = [
  { mrn: 'MRN001', idNumber: 'A123456789', name: '王小明', gender: '男', birthDate: '1980-01-15' },
  { mrn: 'MRN002', idNumber: 'B234567890', name: '李小華', gender: '女', birthDate: '1975-06-20' },
  { mrn: 'MRN003', idNumber: 'C345678901', name: '張大同', gender: '男', birthDate: '1990-12-01' },
];

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

async function navigateToPatientManagement(page: Page) {
  await page.goto('/patients');
}

// ============================================================================
// BDD Generated Tests
// ============================================================================

test.describe('病人管理 @patient', () => {
  test.beforeEach(async ({ page }) => {
    // Background: 我已經登入為 "doctor01"
    await login(page);
    await navigateToPatientManagement(page);
  });

  // ===========================================================================
  // 新增病人
  // ===========================================================================

  /**
   * @bdd-generated: features/patient/patient-management.feature#成功新增病人資料
   * @bdd-hash: l1m2n3o4
   */
  test('成功新增病人資料', async ({ page }) => {
    // 當 我在病人管理頁面
    await expect(page).toHaveURL(/patients/);

    // 並且 我點擊 "新增病人" 按鈕
    await page.getByRole('button', { name: /新增病人/i }).click();

    // 並且 我填寫以下病人資料
    await page.getByLabel(/病歷號/i).fill('MRN004');
    await page.getByLabel(/身分證字號/i).fill('D456789012');
    await page.getByLabel(/姓名/i).fill('陳美玲');
    await page.getByLabel(/性別/i).selectOption('女');
    await page.getByLabel(/出生日期/i).fill('1985-03-25');
    await page.getByLabel(/聯絡電話/i).fill('0912345678');
    await page.getByLabel(/地址/i).fill('台北市信義區');

    // 並且 我點擊儲存按鈕
    await page.getByRole('button', { name: /儲存/i }).click();

    // 那麼 我應該看到成功訊息 "病人資料已新增"
    await expect(page.getByText('病人資料已新增')).toBeVisible();

    // 並且 病人列表應該包含病歷號 "MRN004"
    await expect(page.getByText('MRN004')).toBeVisible();
  });

  /**
   * @bdd-generated: features/patient/patient-management.feature#新增病人時病歷號重複
   * @bdd-hash: m2n3o4p5
   */
  test('新增病人時病歷號重複', async ({ page }) => {
    // 當 我嘗試新增病歷號為 "MRN001" 的病人
    await page.getByRole('button', { name: /新增病人/i }).click();
    await page.getByLabel(/病歷號/i).fill('MRN001');
    await page.getByRole('button', { name: /儲存/i }).click();

    // 那麼 我應該看到錯誤訊息 "此病歷號已存在"
    await expect(page.getByText('此病歷號已存在')).toBeVisible();
  });

  /**
   * @bdd-generated: features/patient/patient-management.feature#新增病人時身分證字號格式錯誤
   * @bdd-hash: n3o4p5q6
   */
  test('新增病人時身分證字號格式錯誤', async ({ page }) => {
    // 當 我嘗試新增身分證字號為 "INVALID123" 的病人
    await page.getByRole('button', { name: /新增病人/i }).click();
    await page.getByLabel(/身分證字號/i).fill('INVALID123');
    await page.getByRole('button', { name: /儲存/i }).click();

    // 那麼 我應該看到錯誤訊息 "身分證字號格式不正確"
    await expect(page.getByText('身分證字號格式不正確')).toBeVisible();
  });

  /**
   * @bdd-generated: features/patient/patient-management.feature#新增病人缺少必填欄位
   * @bdd-hash: o4p5q6r7
   */
  test('新增病人缺少必填欄位', async ({ page }) => {
    // 當 我在新增病人表單
    await page.getByRole('button', { name: /新增病人/i }).click();

    // 並且 我只填寫病歷號 "MRN005"
    await page.getByLabel(/病歷號/i).fill('MRN005');

    // 並且 我點擊儲存按鈕
    await page.getByRole('button', { name: /儲存/i }).click();

    // 那麼 我應該看到錯誤訊息包含必填欄位提示
    await expect(page.getByText(/姓名為必填欄位/)).toBeVisible();
    await expect(page.getByText(/性別為必填欄位/)).toBeVisible();
    await expect(page.getByText(/出生日期為必填欄位/)).toBeVisible();
  });

  // ===========================================================================
  // 查詢病人
  // ===========================================================================

  /**
   * @bdd-generated: features/patient/patient-management.feature#依病歷號查詢病人
   * @bdd-hash: p5q6r7s8
   */
  test('依病歷號查詢病人', async ({ page }) => {
    // 當 我在病人管理頁面
    await expect(page).toHaveURL(/patients/);

    // 並且 我在搜尋欄輸入病歷號 "MRN001"
    await page.getByPlaceholder(/搜尋|search/i).fill('MRN001');

    // 並且 我點擊搜尋按鈕
    await page.getByRole('button', { name: /搜尋/i }).click();

    // 那麼 我應該看到病人 "王小明" 的資料
    await expect(page.getByText('王小明')).toBeVisible();

    // 並且 查詢結果應該只有 1 筆
    await expect(page.locator('table tbody tr')).toHaveCount(1);
  });

  /**
   * @bdd-generated: features/patient/patient-management.feature#依身分證字號查詢病人
   * @bdd-hash: q6r7s8t9
   */
  test('依身分證字號查詢病人', async ({ page }) => {
    // 當 我在病人管理頁面
    // 並且 我選擇搜尋條件為 "身分證字號"
    await page.getByLabel(/搜尋條件/i).selectOption('身分證字號');

    // 並且 我在搜尋欄輸入 "A123456789"
    await page.getByPlaceholder(/搜尋|search/i).fill('A123456789');

    // 並且 我點擊搜尋按鈕
    await page.getByRole('button', { name: /搜尋/i }).click();

    // 那麼 我應該看到病人 "王小明" 的資料
    await expect(page.getByText('王小明')).toBeVisible();
  });

  /**
   * @bdd-generated: features/patient/patient-management.feature#依姓名模糊查詢病人
   * @bdd-hash: r7s8t9u0
   */
  test('依姓名模糊查詢病人', async ({ page }) => {
    // 當 我在病人管理頁面
    // 並且 我選擇搜尋條件為 "姓名"
    await page.getByLabel(/搜尋條件/i).selectOption('姓名');

    // 並且 我在搜尋欄輸入 "王"
    await page.getByPlaceholder(/搜尋|search/i).fill('王');

    // 並且 我點擊搜尋按鈕
    await page.getByRole('button', { name: /搜尋/i }).click();

    // 那麼 查詢結果應該包含病人 "王小明"
    await expect(page.getByText('王小明')).toBeVisible();
  });

  /**
   * @bdd-generated: features/patient/patient-management.feature#查詢結果為空
   * @bdd-hash: s8t9u0v1
   */
  test('查詢結果為空', async ({ page }) => {
    // 當 我在病人管理頁面
    // 並且 我在搜尋欄輸入病歷號 "NOTEXIST"
    await page.getByPlaceholder(/搜尋|search/i).fill('NOTEXIST');

    // 並且 我點擊搜尋按鈕
    await page.getByRole('button', { name: /搜尋/i }).click();

    // 那麼 我應該看到訊息 "查無符合條件的病人"
    await expect(page.getByText('查無符合條件的病人')).toBeVisible();
  });

  // ===========================================================================
  // 修改病人
  // ===========================================================================

  /**
   * @bdd-generated: features/patient/patient-management.feature#成功修改病人資料
   * @bdd-hash: t9u0v1w2
   */
  test('成功修改病人資料', async ({ page }) => {
    // 當 我在病人管理頁面
    // 並且 我點擊病人 "王小明" 的編輯按鈕
    await page.getByRole('row', { name: /王小明/ }).getByRole('button', { name: /編輯/i }).click();

    // 並且 我修改聯絡電話為 "0987654321"
    await page.getByLabel(/聯絡電話/i).fill('0987654321');

    // 並且 我修改地址為 "新北市板橋區"
    await page.getByLabel(/地址/i).fill('新北市板橋區');

    // 並且 我點擊儲存按鈕
    await page.getByRole('button', { name: /儲存/i }).click();

    // 那麼 我應該看到成功訊息 "病人資料已更新"
    await expect(page.getByText('病人資料已更新')).toBeVisible();
  });

  // ===========================================================================
  // 刪除病人
  // ===========================================================================

  /**
   * @bdd-generated: features/patient/patient-management.feature#刪除沒有關聯案件的病人
   * @bdd-hash: u0v1w2x3
   */
  test('刪除沒有關聯案件的病人', async ({ page }) => {
    // 假設 病人 "MRN003" 沒有任何關聯的申報案件

    // 當 我在病人管理頁面
    // 並且 我點擊病人 "張大同" 的刪除按鈕
    await page.getByRole('row', { name: /張大同/ }).getByRole('button', { name: /刪除/i }).click();

    // 並且 我確認刪除操作
    await page.getByRole('button', { name: /確認/i }).click();

    // 那麼 我應該看到成功訊息 "病人資料已刪除"
    await expect(page.getByText('病人資料已刪除')).toBeVisible();

    // 並且 病人列表不應該包含病歷號 "MRN003"
    await expect(page.getByText('MRN003')).not.toBeVisible();
  });

  /**
   * @bdd-generated: features/patient/patient-management.feature#無法刪除有關聯案件的病人
   * @bdd-hash: v1w2x3y4
   */
  test('無法刪除有關聯案件的病人', async ({ page }) => {
    // 假設 病人 "MRN001" 有關聯的申報案件

    // 當 我嘗試刪除病人 "王小明"
    await page.getByRole('row', { name: /王小明/ }).getByRole('button', { name: /刪除/i }).click();
    await page.getByRole('button', { name: /確認/i }).click();

    // 那麼 我應該看到錯誤訊息 "無法刪除，此病人有關聯的申報案件"
    await expect(page.getByText('無法刪除，此病人有關聯的申報案件')).toBeVisible();

    // 並且 病人 "王小明" 應該仍存在於系統中
    await expect(page.getByText('王小明')).toBeVisible();
  });

  /**
   * @bdd-generated: features/patient/patient-management.feature#刪除操作需要確認
   * @bdd-hash: w2x3y4z5
   */
  test('刪除操作需要確認', async ({ page }) => {
    // 當 我點擊病人 "張大同" 的刪除按鈕
    await page.getByRole('row', { name: /張大同/ }).getByRole('button', { name: /刪除/i }).click();

    // 那麼 我應該看到確認對話框
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // 並且 對話框應該顯示 "確定要刪除病人 張大同 的資料嗎？"
    await expect(dialog.getByText(/確定要刪除病人 張大同 的資料嗎/)).toBeVisible();

    // 當 我點擊取消
    await page.getByRole('button', { name: /取消/i }).click();

    // 那麼 病人 "張大同" 應該仍存在於系統中
    await expect(page.getByText('張大同')).toBeVisible();
  });
});

// ============================================================================
// Manual Tests - Add your custom tests below this line
// ============================================================================
