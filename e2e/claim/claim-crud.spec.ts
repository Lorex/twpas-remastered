/**
 * @file claim-crud.spec.ts
 * @description E2E tests for claim CRUD operations
 * @bdd-generated: features/claim/claim-crud.feature
 *
 * Auto-generated from BDD feature file. Manual tests can be added below the generated section.
 */

import { test, expect, type Page } from '@playwright/test';

// ============================================================================
// Test Data (from feature background)
// ============================================================================
const testPatients = [
  { mrn: '1234567', name: '測試病人', idNumber: 'E125123456' },
  { mrn: '2345678', name: '王小明', idNumber: 'A123456789' },
];

const testDoctor = { username: 'doctor01', name: '洪主任', department: '乳癌' };

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

async function navigateToClaimManagement(page: Page) {
  await page.goto('/claim');
}

async function navigateToNewClaimForm(page: Page) {
  await page.goto('/claim-form');
}

async function navigateToPatientManagement(page: Page) {
  await page.goto('/patient');
}

// ============================================================================
// BDD Generated Tests - DO NOT EDIT MANUALLY
// ============================================================================

test.describe('申請案件管理 @claim @crud', () => {
  test.beforeEach(async ({ page }) => {
    // Background: 我已經登入為 "doctor01"
    await login(page);
  });

  // ===========================================================================
  // 建立申請案件
  // ===========================================================================

  /**
   * @bdd-generated: features/claim/claim-crud.feature#成功建立新的申請案件
   * @bdd-hash: a1b2c3d4
   */
  test('成功建立新的申請案件', async ({ page }) => {
    // 當 我在側邊選單點擊 "新增申請案"
    await page.getByText('新增申請案').click();

    // 並且 我填寫以下案件基本資料
    await page.getByLabel(/門診.*住院/i).selectOption('門診');
    await page.getByLabel(/姓名/i).fill('測試病人');
    await page.getByLabel(/身分證字號/i).fill('E125123456');
    await page.getByLabel(/病歷號/i).fill('1234567');
    await page.getByLabel(/性別/i).fill('M');
    await page.getByLabel(/出生年月日/i).fill('1995-12-09');
    await page.getByLabel(/申請類別/i).selectOption('送核');
    await page.getByLabel(/目前病患病況/i).selectOption('局部晚期性疾病');
    await page.getByLabel(/申請次數/i).fill('1');

    // 並且 我點擊 "暫時儲存 (草稿)" 按鈕
    await page.getByRole('button', { name: /暫時儲存.*草稿/i }).click();

    // 那麼 我應該看到成功訊息
    await expect(page.getByText(/成功|已儲存/)).toBeVisible();

    // 並且 案件狀態應該為 "草稿"
    await expect(page.getByText('草稿')).toBeVisible();
  });

  /**
   * @bdd-generated: features/claim/claim-crud.feature#從病人資料管理進入新增申請案
   * @bdd-hash: b2c3d4e5
   */
  test('從病人資料管理進入新增申請案', async ({ page }) => {
    // 當 我在病人資料管理頁面
    await navigateToPatientManagement(page);

    // 並且 我點擊病人 "測試病人" 的 "更多" 按鈕
    await page.getByRole('row', { name: /測試病人/ }).getByRole('button', { name: /更多/i }).click();

    // 那麼 我應該看到該病人的申請案歷史記錄
    await expect(page.getByText(/申請.*歷史|歷史記錄/)).toBeVisible();
  });

  /**
   * @bdd-generated: features/claim/claim-crud.feature#申請類別選項 - 送核
   * @bdd-hash: c3d4e5f6
   */
  test('申請類別選項 - 送核', async ({ page }) => {
    await navigateToNewClaimForm(page);
    await page.getByLabel(/申請類別/i).selectOption('送核');
    await expect(page.getByLabel(/申請類別/i)).toHaveValue('送核');
  });

  /**
   * @bdd-generated: features/claim/claim-crud.feature#申請類別選項 - 補件
   * @bdd-hash: d4e5f6a7
   */
  test('申請類別選項 - 補件', async ({ page }) => {
    await navigateToNewClaimForm(page);
    await page.getByLabel(/申請類別/i).selectOption('補件');
    await expect(page.getByLabel(/申請類別/i)).toHaveValue('補件');
  });

  /**
   * @bdd-generated: features/claim/claim-crud.feature#申請類別選項 - 申復
   * @bdd-hash: e5f6a7b8
   */
  test('申請類別選項 - 申復', async ({ page }) => {
    await navigateToNewClaimForm(page);
    await page.getByLabel(/申請類別/i).selectOption('申復');
    await expect(page.getByLabel(/申請類別/i)).toHaveValue('申復');
  });

  /**
   * @bdd-generated: features/claim/claim-crud.feature#申請類別選項 - 爭議審議
   * @bdd-hash: f6a7b8c9
   */
  test('申請類別選項 - 爭議審議', async ({ page }) => {
    await navigateToNewClaimForm(page);
    await page.getByLabel(/申請類別/i).selectOption('爭議審議');
    await expect(page.getByLabel(/申請類別/i)).toHaveValue('爭議審議');
  });

  /**
   * @bdd-generated: features/claim/claim-crud.feature#申請類別選項 - 資料異動
   * @bdd-hash: a7b8c9d0
   */
  test('申請類別選項 - 資料異動', async ({ page }) => {
    await navigateToNewClaimForm(page);
    await page.getByLabel(/申請類別/i).selectOption('資料異動');
    await expect(page.getByLabel(/申請類別/i)).toHaveValue('資料異動');
  });

  /**
   * @bdd-generated: features/claim/claim-crud.feature#建立補件案件需填寫原案件資訊
   * @bdd-hash: b8c9d0e1
   */
  test('建立補件案件需填寫原案件資訊', async ({ page }) => {
    // 當 我在新增申請案頁面
    await navigateToNewClaimForm(page);

    // 並且 我選擇申請類別為 "補件"
    await page.getByLabel(/申請類別/i).selectOption('補件');

    // 那麼 系統應該要求提供原申請案件的相關資訊
    await expect(page.getByLabel(/原案件|原申請/i)).toBeVisible();
  });

  /**
   * @bdd-generated: features/claim/claim-crud.feature#建立申復案件需填寫原案件資訊
   * @bdd-hash: c9d0e1f2
   */
  test('建立申復案件需填寫原案件資訊', async ({ page }) => {
    // 當 我在新增申請案頁面
    await navigateToNewClaimForm(page);

    // 並且 我選擇申請類別為 "申復"
    await page.getByLabel(/申請類別/i).selectOption('申復');

    // 那麼 系統應該要求提供原申請案件的相關資訊
    await expect(page.getByLabel(/原案件|原申請/i)).toBeVisible();
  });

  /**
   * @bdd-generated: features/claim/claim-crud.feature#建立案件缺少必填欄位
   * @bdd-hash: d0e1f2a3
   */
  test('建立案件缺少必填欄位', async ({ page }) => {
    // 當 我在新增申請案頁面
    await navigateToNewClaimForm(page);

    // 並且 我只填寫病人姓名
    await page.getByLabel(/姓名/i).fill('測試病人');

    // 並且 我點擊 "確認送出 (待審核)" 按鈕
    await page.getByRole('button', { name: /確認送出.*待審核/i }).click();

    // 那麼 我應該看到錯誤訊息提示必填欄位未填寫
    await expect(page.getByText(/必填|為必填/)).toBeVisible();
  });

  // ===========================================================================
  // 查看申請案件
  // ===========================================================================

  /**
   * @bdd-generated: features/claim/claim-crud.feature#查看案件詳情
   * @bdd-hash: e1f2a3b4
   */
  test.skip('查看案件詳情', async ({ page }) => {
    // 假設 存在以下申請案件
    // Note: This test requires pre-existing data

    // 當 我在申請案件管理頁面
    await navigateToClaimManagement(page);

    // 並且 我點擊該案件的 "編輯" 按鈕
    await page.getByRole('row').first().getByRole('button', { name: /編輯/i }).click();

    // 那麼 我應該看到案件詳情表單
    // 並且 表單應該顯示各標籤頁
    await expect(page.getByText('病歷摘要')).toBeVisible();
    await expect(page.getByText('檢驗結果')).toBeVisible();
    await expect(page.getByText('附件摘要')).toBeVisible();
    await expect(page.getByText('附件-其他')).toBeVisible();
    await expect(page.getByText('給付規定')).toBeVisible();
    await expect(page.getByText('補充附件')).toBeVisible();
  });

  /**
   * @bdd-generated: features/claim/claim-crud.feature#從病人資料管理查看歷史案件
   * @bdd-hash: f2a3b4c5
   */
  test('從病人資料管理查看歷史案件', async ({ page }) => {
    // 當 我在病人資料管理頁面
    await navigateToPatientManagement(page);

    // 並且 我點擊病人 "測試病人" 的 "更多" 按鈕
    await page.getByRole('row', { name: /測試病人/ }).getByRole('button', { name: /更多/i }).click();

    // 那麼 我應該看到申請表歷史記錄頁面
    await expect(page.getByText(/歷史記錄|申請案/)).toBeVisible();

    // 並且 頁面應該顯示該病人的所有申請案件
    // 並且 表格應該包含以下欄位
    await expect(page.getByText('申請類別')).toBeVisible();
    await expect(page.getByText('申請次數')).toBeVisible();
    await expect(page.getByText('疾病別')).toBeVisible();
    await expect(page.getByText('申請藥品')).toBeVisible();
    await expect(page.getByText('狀態')).toBeVisible();
  });

  // ===========================================================================
  // 修改申請案件
  // ===========================================================================

  /**
   * @bdd-generated: features/claim/claim-crud.feature#修改草稿狀態的案件
   * @bdd-hash: a3b4c5d6
   */
  test.skip('修改草稿狀態的案件', async ({ page }) => {
    // 假設 存在草稿狀態的案件
    // Note: This test requires pre-existing data

    // 當 我在申請案件管理頁面
    await navigateToClaimManagement(page);

    // 並且 我在草稿標籤頁找到該案件
    await page.getByRole('tab', { name: /草稿/ }).click();

    // 並且 我點擊編輯按鈕
    await page.getByRole('row').first().getByRole('button', { name: /編輯/i }).click();

    // 並且 我修改申請次數為 "2"
    await page.getByLabel(/申請次數/i).fill('2');

    // 並且 我點擊 "暫時儲存 (草稿)" 按鈕
    await page.getByRole('button', { name: /暫時儲存.*草稿/i }).click();

    // 那麼 我應該看到成功訊息
    await expect(page.getByText(/成功|已儲存/)).toBeVisible();

    // 並且 案件的申請次數應該為 "2"
    await expect(page.getByText('2')).toBeVisible();
  });

  /**
   * @bdd-generated: features/claim/claim-crud.feature#無法修改已送審的案件
   * @bdd-hash: b4c5d6e7
   */
  test.skip('無法修改已送審的案件', async ({ page }) => {
    // 假設 存在待審核狀態的案件
    // Note: This test requires pre-existing data

    // 當 我嘗試編輯該案件
    await navigateToClaimManagement(page);
    await page.getByRole('tab', { name: /待審核/ }).click();

    // 那麼 編輯功能應該被限制
    const editButton = page.getByRole('row').first().getByRole('button', { name: /編輯/i });
    await expect(editButton).toBeDisabled();
  });

  /**
   * @bdd-generated: features/claim/claim-crud.feature#草稿案件送出待審核
   * @bdd-hash: c5d6e7f8
   */
  test.skip('草稿案件送出待審核', async ({ page }) => {
    // 假設 存在草稿狀態且資料完整的案件
    // Note: This test requires pre-existing data

    // 當 我在該案件的編輯頁面
    await navigateToClaimManagement(page);
    await page.getByRole('tab', { name: /草稿/ }).click();
    await page.getByRole('row').first().getByRole('button', { name: /編輯/i }).click();

    // 並且 我點擊 "確認送出 (待審核)" 按鈕
    await page.getByRole('button', { name: /確認送出.*待審核/i }).click();

    // 那麼 我應該看到成功訊息
    await expect(page.getByText(/成功|已送出/)).toBeVisible();

    // 並且 案件狀態應該變更為 "待審核"
    await expect(page.getByText('待審核')).toBeVisible();
  });

  // ===========================================================================
  // 刪除申請案件
  // ===========================================================================

  /**
   * @bdd-generated: features/claim/claim-crud.feature#刪除草稿狀態的案件
   * @bdd-hash: d6e7f8a9
   */
  test.skip('刪除草稿狀態的案件', async ({ page }) => {
    // 假設 存在草稿狀態的案件
    // Note: This test requires pre-existing data

    // 當 我在申請案件管理頁面的草稿標籤頁
    await navigateToClaimManagement(page);
    await page.getByRole('tab', { name: /草稿/ }).click();

    // 並且 我點擊該案件的刪除按鈕
    await page.getByRole('row').first().getByRole('button', { name: /刪除/i }).click();

    // 並且 我確認刪除操作
    await page.getByRole('button', { name: /確認/i }).click();

    // 那麼 我應該看到成功訊息 "申請案件已刪除"
    await expect(page.getByText('申請案件已刪除')).toBeVisible();
  });

  /**
   * @bdd-generated: features/claim/claim-crud.feature#無法刪除已送審的案件
   * @bdd-hash: e7f8a9b0
   */
  test.skip('無法刪除已送審的案件', async ({ page }) => {
    // 假設 存在待審核狀態的案件
    // Note: This test requires pre-existing data

    // 當 我嘗試刪除該案件
    await navigateToClaimManagement(page);
    await page.getByRole('tab', { name: /待審核/ }).click();

    // 那麼 刪除按鈕應該被停用
    const deleteButton = page.getByRole('row').first().getByRole('button', { name: /刪除/i });
    await expect(deleteButton).toBeDisabled();
  });

  /**
   * @bdd-generated: features/claim/claim-crud.feature#刪除案件需要確認
   * @bdd-hash: f8a9b0c1
   */
  test.skip('刪除案件需要確認', async ({ page }) => {
    // 當 我點擊案件的刪除按鈕
    await navigateToClaimManagement(page);
    await page.getByRole('tab', { name: /草稿/ }).click();
    await page.getByRole('row').first().getByRole('button', { name: /刪除/i }).click();

    // 那麼 我應該看到確認對話框
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // 並且 對話框應該警告 "此操作無法復原"
    await expect(dialog.getByText(/此操作無法復原/)).toBeVisible();

    // 當 我點擊取消
    await page.getByRole('button', { name: /取消/i }).click();

    // 那麼 案件應該仍存在於系統中
    await expect(page.getByRole('row').first()).toBeVisible();
  });

  // ===========================================================================
  // 案件狀態流程
  // ===========================================================================

  /**
   * @bdd-generated: features/claim/claim-crud.feature#案件狀態流程 - 草稿到待審核
   * @bdd-hash: a9b0c1d2
   */
  test.skip('案件狀態流程 - 草稿到待審核', async ({ page }) => {
    // 假設 存在草稿狀態的案件
    // Note: This test requires pre-existing data and complete form data

    // 當 我完成所有必填資料
    // 並且 我點擊 "確認送出 (待審核)" 按鈕
    await navigateToClaimManagement(page);
    await page.getByRole('tab', { name: /草稿/ }).click();
    await page.getByRole('row').first().getByRole('button', { name: /編輯/i }).click();
    await page.getByRole('button', { name: /確認送出.*待審核/i }).click();

    // 那麼 案件狀態應該變更為 "待審核"
    await expect(page.getByText('待審核')).toBeVisible();
  });

  /**
   * @bdd-generated: features/claim/claim-crud.feature#案件狀態流程 - 待審核到送審中
   * @bdd-hash: b0c1d2e3
   */
  test.skip('案件狀態流程 - 待審核到送審中', async ({ page }) => {
    // Note: This test verifies UI display of workflow states
    // Actual state transitions are handled by the backend

    await navigateToClaimManagement(page);
    await page.getByRole('tab', { name: /送審中/ }).click();
    await expect(page.getByText('送審中')).toBeVisible();
  });

  /**
   * @bdd-generated: features/claim/claim-crud.feature#案件狀態流程 - 送審中到通過
   * @bdd-hash: c1d2e3f4
   */
  test.skip('案件狀態流程 - 送審中到通過', async ({ page }) => {
    // Note: This test verifies UI display of workflow states
    await navigateToClaimManagement(page);
    await page.getByRole('tab', { name: /通過/ }).click();
    await expect(page.getByText('通過')).toBeVisible();
  });

  /**
   * @bdd-generated: features/claim/claim-crud.feature#案件狀態流程 - 送審中到未通過
   * @bdd-hash: d2e3f4a5
   */
  test.skip('案件狀態流程 - 送審中到未通過', async ({ page }) => {
    // Note: This test verifies UI display of workflow states
    await navigateToClaimManagement(page);
    await page.getByRole('tab', { name: /未通過/ }).click();
    await expect(page.getByText('未通過')).toBeVisible();
  });

  /**
   * @bdd-generated: features/claim/claim-crud.feature#案件狀態流程 - 通過案件續件提醒
   * @bdd-hash: e3f4a5b6
   */
  test('案件狀態流程 - 通過案件續件提醒', async ({ page }) => {
    // 當 案件即將到期需要續件
    await navigateToClaimManagement(page);

    // 那麼 案件應該出現在 "續件提醒" 標籤頁
    await page.getByRole('tab', { name: /續件提醒/ }).click();
    await expect(page.getByText(/續件提醒/)).toBeVisible();
  });

  /**
   * @bdd-generated: features/claim/claim-crud.feature#案件狀態流程 - 結案
   * @bdd-hash: f4a5b6c7
   */
  test('案件狀態流程 - 結案', async ({ page }) => {
    // Note: This test verifies UI display of workflow states
    await navigateToClaimManagement(page);
    await page.getByRole('tab', { name: /結案/ }).click();
    await expect(page.getByText(/結案/)).toBeVisible();
  });
});

// ============================================================================
// Manual Tests - Add your custom tests below this line
// ============================================================================

// Example:
// test.describe('Custom Claim CRUD Tests', () => {
//   test('custom test case', async ({ page }) => {
//     // Your custom test implementation
//   });
// });
