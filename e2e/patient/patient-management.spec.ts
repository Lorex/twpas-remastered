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
  { mrn: '1234567', name: '測試病人', gender: 'M', birthDate: '民國84年12月9日', age: 30, idNumber: 'E125123456', doctor: '', returnDate: '', expiryDate: '' },
  { mrn: '2345678', name: '王小明', gender: 'M', birthDate: '民國70年5月15日', age: 44, idNumber: 'A123456789', doctor: '洪主任', returnDate: '2026-03-01', expiryDate: '2026-06-01' },
  { mrn: '3456789', name: '李小華', gender: 'F', birthDate: '民國65年10月20日', age: 49, idNumber: 'B234567890', doctor: '洪主任', returnDate: '2026-02-15', expiryDate: '2026-05-15' },
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

async function navigateToPatientManagement(page: Page) {
  await page.goto('/patient');
}

// ============================================================================
// BDD Generated Tests - DO NOT EDIT MANUALLY
// ============================================================================

test.describe('病人資料管理 @patient', () => {
  test.beforeEach(async ({ page }) => {
    // Background: 我已經登入為 "doctor01"
    await login(page);
    await navigateToPatientManagement(page);
  });

  // ===========================================================================
  // 病人資料管理頁面結構
  // ===========================================================================

  /**
   * @bdd-generated: features/patient/patient-management.feature#顯示病人資料管理頁面
   * @bdd-hash: 1a2b3c4d
   */
  test('顯示病人資料管理頁面', async ({ page }) => {
    // 當 我在病人資料管理頁面
    // 那麼 我應該看到頁面標題 "病人資料管理"
    await expect(page.getByText('病人資料管理')).toBeVisible();

    // 並且 我應該看到進階搜尋區塊
    await expect(page.getByText(/進階搜尋|搜尋/)).toBeVisible();

    // 並且 我應該看到快速搜尋欄位
    await expect(page.getByPlaceholder(/快速搜尋|搜尋/i)).toBeVisible();

    // 並且 我應該看到病人列表
    await expect(page.locator('table')).toBeVisible();
  });

  /**
   * @bdd-generated: features/patient/patient-management.feature#顯示進階搜尋欄位
   * @bdd-hash: 2b3c4d5e
   */
  test('顯示進階搜尋欄位', async ({ page }) => {
    // 當 我在病人資料管理頁面
    // 那麼 進階搜尋區塊應該包含以下欄位
    await expect(page.getByLabel(/病歷號/i)).toBeVisible();
    await expect(page.getByLabel(/身份證字號|身分證字號/i)).toBeVisible();
    await expect(page.getByLabel(/姓名/i)).toBeVisible();
    await expect(page.getByLabel(/回診時間.*起/i)).toBeVisible();
    await expect(page.getByLabel(/回診時間.*迄/i)).toBeVisible();
    await expect(page.getByLabel(/到期日.*起/i)).toBeVisible();
    await expect(page.getByLabel(/到期日.*迄/i)).toBeVisible();
  });

  /**
   * @bdd-generated: features/patient/patient-management.feature#顯示病人列表欄位
   * @bdd-hash: 3c4d5e6f
   */
  test('顯示病人列表欄位', async ({ page }) => {
    // 當 我在病人資料管理頁面
    // 那麼 病人列表應該顯示以下欄位
    await expect(page.getByText('病歷號')).toBeVisible();
    await expect(page.getByText('姓名')).toBeVisible();
    await expect(page.getByText('性別')).toBeVisible();
    await expect(page.getByText('生日')).toBeVisible();
    await expect(page.getByText('年齡')).toBeVisible();
    await expect(page.getByText('身分證字號')).toBeVisible();
    await expect(page.getByText('醫師')).toBeVisible();
    await expect(page.getByText('回診時間')).toBeVisible();
    await expect(page.getByText('到期日')).toBeVisible();
  });

  // ===========================================================================
  // 進階搜尋
  // ===========================================================================

  /**
   * @bdd-generated: features/patient/patient-management.feature#依病歷號搜尋病人
   * @bdd-hash: 4d5e6f7a
   */
  test('依病歷號搜尋病人', async ({ page }) => {
    // 當 我在病人資料管理頁面
    // 並且 我在進階搜尋的病歷號欄位輸入 "1234567"
    await page.getByLabel(/病歷號/i).fill('1234567');

    // 並且 我點擊查詢按鈕
    await page.getByRole('button', { name: /查詢/i }).click();

    // 那麼 我應該看到病人 "測試病人" 的資料
    await expect(page.getByText('測試病人')).toBeVisible();

    // 並且 查詢結果應該只有 1 筆
    await expect(page.locator('table tbody tr')).toHaveCount(1);
  });

  /**
   * @bdd-generated: features/patient/patient-management.feature#依身份證字號搜尋病人
   * @bdd-hash: 5e6f7a8b
   */
  test('依身份證字號搜尋病人', async ({ page }) => {
    // 當 我在病人資料管理頁面
    // 並且 我在進階搜尋的身份證字號欄位輸入 "E125123456"
    await page.getByLabel(/身份證字號|身分證字號/i).fill('E125123456');

    // 並且 我點擊查詢按鈕
    await page.getByRole('button', { name: /查詢/i }).click();

    // 那麼 我應該看到病人 "測試病人" 的資料
    await expect(page.getByText('測試病人')).toBeVisible();
  });

  /**
   * @bdd-generated: features/patient/patient-management.feature#依姓名搜尋病人
   * @bdd-hash: 6f7a8b9c
   */
  test('依姓名搜尋病人', async ({ page }) => {
    // 當 我在病人資料管理頁面
    // 並且 我在進階搜尋的姓名欄位輸入 "王"
    await page.getByLabel(/姓名/i).fill('王');

    // 並且 我點擊查詢按鈕
    await page.getByRole('button', { name: /查詢/i }).click();

    // 那麼 查詢結果應該包含病人 "王小明"
    await expect(page.getByText('王小明')).toBeVisible();
  });

  /**
   * @bdd-generated: features/patient/patient-management.feature#依回診時間範圍搜尋病人
   * @bdd-hash: 7a8b9c0d
   */
  test('依回診時間範圍搜尋病人', async ({ page }) => {
    // 當 我在病人資料管理頁面
    // 並且 我設定回診時間起為 "2026-02-01"
    await page.getByLabel(/回診時間.*起/i).fill('2026-02-01');

    // 並且 我設定回診時間迄為 "2026-02-28"
    await page.getByLabel(/回診時間.*迄/i).fill('2026-02-28');

    // 並且 我點擊查詢按鈕
    await page.getByRole('button', { name: /查詢/i }).click();

    // 那麼 查詢結果應該包含回診時間在該範圍內的病人
    // 並且 查詢結果應該包含病人 "李小華"
    await expect(page.getByText('李小華')).toBeVisible();
  });

  /**
   * @bdd-generated: features/patient/patient-management.feature#依到期日範圍搜尋病人
   * @bdd-hash: 8b9c0d1e
   */
  test('依到期日範圍搜尋病人', async ({ page }) => {
    // 當 我在病人資料管理頁面
    // 並且 我設定到期日起為 "2026-05-01"
    await page.getByLabel(/到期日.*起/i).fill('2026-05-01');

    // 並且 我設定到期日迄為 "2026-05-31"
    await page.getByLabel(/到期日.*迄/i).fill('2026-05-31');

    // 並且 我點擊查詢按鈕
    await page.getByRole('button', { name: /查詢/i }).click();

    // 那麼 查詢結果應該包含到期日在該範圍內的病人
    // 並且 查詢結果應該包含病人 "李小華"
    await expect(page.getByText('李小華')).toBeVisible();
  });

  /**
   * @bdd-generated: features/patient/patient-management.feature#複合條件搜尋病人
   * @bdd-hash: 9c0d1e2f
   */
  test('複合條件搜尋病人', async ({ page }) => {
    // 當 我在病人資料管理頁面
    // 並且 我設定以下搜尋條件
    await page.getByLabel(/姓名/i).fill('王');
    await page.getByLabel(/回診時間.*起/i).fill('2026-02-01');

    // 並且 我點擊查詢按鈕
    await page.getByRole('button', { name: /查詢/i }).click();

    // 那麼 查詢結果應該只包含符合所有條件的病人
  });

  /**
   * @bdd-generated: features/patient/patient-management.feature#清除搜尋條件
   * @bdd-hash: 0d1e2f3a
   */
  test('清除搜尋條件', async ({ page }) => {
    // 當 我在病人資料管理頁面
    // 並且 我已設定多個搜尋條件
    await page.getByLabel(/姓名/i).fill('測試');
    await page.getByLabel(/病歷號/i).fill('1234567');

    // 並且 我點擊 "清除" 按鈕
    await page.getByRole('button', { name: /清除/i }).click();

    // 那麼 所有搜尋條件應該被清除
    await expect(page.getByLabel(/姓名/i)).toHaveValue('');
    await expect(page.getByLabel(/病歷號/i)).toHaveValue('');
  });

  // ===========================================================================
  // 快速搜尋
  // ===========================================================================

  /**
   * @bdd-generated: features/patient/patient-management.feature#使用快速搜尋
   * @bdd-hash: 1e2f3a4b
   */
  test('使用快速搜尋', async ({ page }) => {
    // 當 我在病人資料管理頁面
    // 並且 我在快速搜尋欄位輸入 "測試病人"
    await page.getByPlaceholder(/快速搜尋|搜尋/i).fill('測試病人');

    // 那麼 病人列表應該即時篩選顯示符合條件的病人
    // Note: Real-time filtering verification
  });

  /**
   * @bdd-generated: features/patient/patient-management.feature#快速搜尋支援多欄位
   * @bdd-hash: 2f3a4b5c
   */
  test('快速搜尋支援多欄位', async ({ page }) => {
    // 當 我在病人資料管理頁面
    // 並且 我在快速搜尋欄位輸入 "1234567"
    await page.getByPlaceholder(/快速搜尋|搜尋/i).fill('1234567');

    // 那麼 病人列表應該顯示病歷號包含 "1234567" 的病人
  });

  // ===========================================================================
  // 查看與編輯病人
  // ===========================================================================

  /**
   * @bdd-generated: features/patient/patient-management.feature#編輯病人資料
   * @bdd-hash: 3a4b5c6d
   */
  test.skip('編輯病人資料', async ({ page }) => {
    // 當 我在病人資料管理頁面
    // 並且 我點擊病人 "測試病人" 的 "編輯" 按鈕
    await page.getByRole('row', { name: /測試病人/ }).getByRole('button', { name: /編輯/i }).click();

    // 那麼 我應該看到病人資料編輯表單
    await expect(page.getByLabel(/姓名/i)).toBeVisible();
  });

  /**
   * @bdd-generated: features/patient/patient-management.feature#修改病人聯絡資訊
   * @bdd-hash: 4b5c6d7e
   */
  test.skip('修改病人聯絡資訊', async ({ page }) => {
    // 當 我在病人 "測試病人" 的編輯表單
    await page.getByRole('row', { name: /測試病人/ }).getByRole('button', { name: /編輯/i }).click();

    // 並且 我修改聯絡電話(日)為 "02-12345678"
    await page.getByLabel(/聯絡電話.*日/i).fill('02-12345678');

    // 並且 我修改手機號碼為 "0912345678"
    await page.getByLabel(/手機號碼/i).fill('0912345678');

    // 並且 我點擊儲存按鈕
    await page.getByRole('button', { name: /儲存/i }).click();

    // 那麼 我應該看到成功訊息 "病人資料已更新"
    await expect(page.getByText('病人資料已更新')).toBeVisible();
  });

  /**
   * @bdd-generated: features/patient/patient-management.feature#修改病人回診時間
   * @bdd-hash: 5c6d7e8f
   */
  test.skip('修改病人回診時間', async ({ page }) => {
    // 當 我在病人 "測試病人" 的編輯表單
    await page.getByRole('row', { name: /測試病人/ }).getByRole('button', { name: /編輯/i }).click();

    // 並且 我修改回診時間為 "2026-04-01"
    await page.getByLabel(/回診時間/i).fill('2026-04-01');

    // 並且 我點擊儲存按鈕
    await page.getByRole('button', { name: /儲存/i }).click();

    // 那麼 病人的回診時間應該更新為 "2026-04-01"
    await expect(page.getByText('病人資料已更新')).toBeVisible();
  });

  /**
   * @bdd-generated: features/patient/patient-management.feature#身分證字號欄位為唯讀
   * @bdd-hash: 6d7e8f9a
   */
  test.skip('身分證字號欄位為唯讀', async ({ page }) => {
    // 當 我在病人 "測試病人" 的編輯表單
    await page.getByRole('row', { name: /測試病人/ }).getByRole('button', { name: /編輯/i }).click();

    // 那麼 身分證字號欄位應該為唯讀
    const idField = page.getByLabel(/身分證字號/i);
    await expect(idField).toBeDisabled();
  });

  // ===========================================================================
  // 查看病人申請案件歷史
  // ===========================================================================

  /**
   * @bdd-generated: features/patient/patient-management.feature#查看病人的申請案件歷史
   * @bdd-hash: 7e8f9a0b
   */
  test('查看病人的申請案件歷史', async ({ page }) => {
    // 當 我在病人資料管理頁面
    // 並且 我點擊病人 "測試病人" 的 "更多" 按鈕
    await page.getByRole('row', { name: /測試病人/ }).getByRole('button', { name: /更多/i }).click();

    // 那麼 我應該被導向申請表歷史記錄頁面
    await expect(page).toHaveURL(/claim-detail|history/);

    // 並且 頁面應該顯示病人基本資訊
    await expect(page.getByText('1234567')).toBeVisible();
    await expect(page.getByText('測試病人')).toBeVisible();
    await expect(page.getByText('E125123456')).toBeVisible();
  });

  /**
   * @bdd-generated: features/patient/patient-management.feature#申請案件歷史列表欄位
   * @bdd-hash: 8f9a0b1c
   */
  test('申請案件歷史列表欄位', async ({ page }) => {
    // 當 我在病人 "測試病人" 的申請表歷史記錄頁面
    await page.getByRole('row', { name: /測試病人/ }).getByRole('button', { name: /更多/i }).click();

    // 那麼 案件列表應該顯示以下欄位
    await expect(page.getByText('申請類別')).toBeVisible();
    await expect(page.getByText('申請次數')).toBeVisible();
    await expect(page.getByText('疾病別')).toBeVisible();
    await expect(page.getByText('申請藥品')).toBeVisible();
    await expect(page.getByText('申請日期')).toBeVisible();
    await expect(page.getByText('狀態')).toBeVisible();
  });

  /**
   * @bdd-generated: features/patient/patient-management.feature#從歷史記錄編輯草稿案件
   * @bdd-hash: 9a0b1c2d
   */
  test.skip('從歷史記錄編輯草稿案件', async ({ page }) => {
    // 假設 病人 "測試病人" 有一個草稿狀態的案件
    // Note: This test requires pre-existing data

    // 當 我在該病人的申請表歷史記錄頁面
    await page.getByRole('row', { name: /測試病人/ }).getByRole('button', { name: /更多/i }).click();

    // 並且 我點擊該草稿案件的 "編輯" 按鈕
    await page.getByRole('row').filter({ hasText: /草稿/ }).getByRole('button', { name: /編輯/i }).click();

    // 那麼 我應該被導向該案件的編輯頁面
    await expect(page).toHaveURL(/claim-form/);
  });

  /**
   * @bdd-generated: features/patient/patient-management.feature#從歷史記錄返回病人列表
   * @bdd-hash: 0b1c2d3e
   */
  test('從歷史記錄返回病人列表', async ({ page }) => {
    // 當 我在病人 "測試病人" 的申請表歷史記錄頁面
    await page.getByRole('row', { name: /測試病人/ }).getByRole('button', { name: /更多/i }).click();

    // 並且 我點擊 "返回" 按鈕
    await page.getByRole('button', { name: /返回/i }).click();

    // 那麼 我應該被導向病人資料管理頁面
    await expect(page).toHaveURL(/patient/);
  });

  // ===========================================================================
  // 身分證字號驗證
  // ===========================================================================

  /**
   * @bdd-generated: features/patient/patient-management.feature#身分證字號格式驗證
   * @bdd-hash: 1c2d3e4f
   */
  test('身分證字號格式驗證', async ({ page }) => {
    // 當 我在病人資料管理頁面
    // 並且 我在身份證字號欄位輸入 "INVALID"
    await page.getByLabel(/身份證字號|身分證字號/i).fill('INVALID');
    await page.getByLabel(/身份證字號|身分證字號/i).blur();

    // 那麼 我應該看到提示訊息 "請填身分證字號共十碼(前一碼為大寫英文字母)"
    await expect(page.getByText(/請填身分證字號共十碼|身分證字號格式/)).toBeVisible();
  });

  /**
   * @bdd-generated: features/patient/patient-management.feature#身分證字號長度驗證
   * @bdd-hash: 2d3e4f5a
   */
  test('身分證字號長度驗證', async ({ page }) => {
    // 當 我在病人資料管理頁面
    // 並且 我在身份證字號欄位輸入 "A12345"
    await page.getByLabel(/身份證字號|身分證字號/i).fill('A12345');
    await page.getByLabel(/身份證字號|身分證字號/i).blur();

    // 那麼 我應該看到驗證錯誤訊息
    await expect(page.getByText(/長度|格式/)).toBeVisible();
  });

  // ===========================================================================
  // 查詢無結果
  // ===========================================================================

  /**
   * @bdd-generated: features/patient/patient-management.feature#查詢結果為空
   * @bdd-hash: 3e4f5a6b
   */
  test('查詢結果為空', async ({ page }) => {
    // 當 我在病人資料管理頁面
    // 並且 我在病歷號欄位輸入 "NOTEXIST"
    await page.getByLabel(/病歷號/i).fill('NOTEXIST');

    // 並且 我點擊查詢按鈕
    await page.getByRole('button', { name: /查詢/i }).click();

    // 那麼 病人列表應該為空
    await expect(page.getByText(/無資料|無結果|沒有資料/)).toBeVisible();
  });

  // ===========================================================================
  // 分頁
  // ===========================================================================

  /**
   * @bdd-generated: features/patient/patient-management.feature#顯示分頁控制
   * @bdd-hash: 4f5a6b7c
   */
  test.skip('顯示分頁控制', async ({ page }) => {
    // 假設 資料庫中存在超過一頁的病人資料
    // Note: This test requires many records

    // 當 我在病人資料管理頁面
    // 那麼 我應該看到分頁控制項
    await expect(page.getByRole('navigation', { name: /pagination|分頁/i })).toBeVisible();
  });

  /**
   * @bdd-generated: features/patient/patient-management.feature#切換分頁
   * @bdd-hash: 5a6b7c8d
   */
  test.skip('切換分頁', async ({ page }) => {
    // 假設 資料庫中存在超過一頁的病人資料
    // Note: This test requires many records

    // 當 我在病人資料管理頁面
    // 並且 我點擊第 2 頁
    await page.getByRole('button', { name: '2' }).click();

    // 那麼 應該顯示第二頁的病人資料
  });

  // ===========================================================================
  // 最近一筆申請案件
  // ===========================================================================

  /**
   * @bdd-generated: features/patient/patient-management.feature#顯示最近一筆申請案件
   * @bdd-hash: 6b7c8d9e
   */
  test.skip('顯示最近一筆申請案件', async ({ page }) => {
    // 假設 病人 "測試病人" 有申請案件
    // Note: This test requires pre-existing data

    // 當 我在病人資料管理頁面
    // 那麼 病人列表中 "測試病人" 的 "最近一筆申請案件" 欄位應該顯示案件資訊
    await expect(page.getByRole('row', { name: /測試病人/ }).getByText(/最近.*申請/)).toBeVisible();
  });

  /**
   * @bdd-generated: features/patient/patient-management.feature#點擊最近一筆申請案件
   * @bdd-hash: 7c8d9e0f
   */
  test.skip('點擊最近一筆申請案件', async ({ page }) => {
    // 假設 病人 "測試病人" 有申請案件
    // Note: This test requires pre-existing data

    // 當 我在病人資料管理頁面
    // 並且 我點擊病人 "測試病人" 的最近一筆申請案件連結
    await page.getByRole('row', { name: /測試病人/ }).getByRole('link', { name: /申請案件/ }).click();

    // 那麼 我應該被導向該案件的詳情頁面
    await expect(page).toHaveURL(/claim-form|claim-detail/);
  });
});

// ============================================================================
// Manual Tests - Add your custom tests below this line
// ============================================================================

// Example:
// test.describe('Custom Patient Management Tests', () => {
//   test('custom test case', async ({ page }) => {
//     // Your custom test implementation
//   });
// });
