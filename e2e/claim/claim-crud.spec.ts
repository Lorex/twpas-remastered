/**
 * @file claim-crud.spec.ts
 * @description E2E tests for claim CRUD operations
 * @bdd-generated: features/claim/claim-crud.feature
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

async function navigateToClaimList(page: Page) {
  await page.goto('/claims');
}

// ============================================================================
// BDD Generated Tests
// ============================================================================

test.describe('申報案件管理 @claim @crud', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await navigateToClaimList(page);
  });

  // ===========================================================================
  // 建立申報案件
  // ===========================================================================

  /**
   * @bdd-generated: features/claim/claim-crud.feature#成功建立新的申報案件
   * @bdd-hash: a1b2c3d4
   */
  test('成功建立新的申報案件', async ({ page }) => {
    // 當 我在申報案件列表頁面
    await expect(page).toHaveURL(/claims/);

    // 並且 我點擊 "新增案件" 按鈕
    await page.getByRole('button', { name: /新增案件/i }).click();

    // 並且 我填寫以下案件基本資料
    await page.getByLabel(/病人/i).click();
    await page.getByText('王小明 (MRN001)').click();

    await page.getByLabel(/申報類別/i).selectOption('新申請');
    await page.getByLabel(/案件類別/i).selectOption('癌症標靶治療');

    await page.getByLabel(/申請醫師/i).click();
    await page.getByText('張醫師 (DOC001)').click();

    await page.getByLabel(/體重/i).fill('65.5');
    await page.getByLabel(/身高/i).fill('170.0');

    // 並且 我點擊儲存按鈕
    await page.getByRole('button', { name: /儲存/i }).click();

    // 那麼 我應該看到成功訊息 "申報案件已建立"
    await expect(page.getByText('申報案件已建立')).toBeVisible();

    // 並且 系統應該產生唯一的案件編號
    await expect(page.getByText(/CASE-\d+/)).toBeVisible();

    // 並且 案件狀態應該為 "草稿"
    await expect(page.getByText('草稿')).toBeVisible();

    // 並且 我應該被導向案件詳情頁面
    await expect(page).toHaveURL(/claims\/CASE-\d+/);
  });

  /**
   * @bdd-generated: features/claim/claim-crud.feature#建立案件時選擇病人
   * @bdd-hash: b2c3d4e5
   */
  test('建立案件時選擇病人', async ({ page }) => {
    // 當 我在新增案件頁面
    await page.getByRole('button', { name: /新增案件/i }).click();

    // 並且 我點擊病人選擇欄位
    await page.getByLabel(/病人/i).click();

    // 那麼 我應該看到病人搜尋對話框
    await expect(page.getByRole('dialog')).toBeVisible();

    // 當 我輸入 "王" 進行搜尋
    await page.getByPlaceholder(/搜尋病人/i).fill('王');

    // 那麼 我應該看到符合條件的病人列表
    await expect(page.getByText('王小明')).toBeVisible();

    // 當 我選擇病人 "王小明"
    await page.getByText('王小明 (MRN001)').click();

    // 那麼 病人欄位應該顯示 "王小明 (MRN001)"
    await expect(page.getByLabel(/病人/i)).toHaveValue(/王小明.*MRN001/);
  });

  /**
   * @bdd-generated: features/claim/claim-crud.feature#建立續用案件需填寫原案件編號
   * @bdd-hash: c3d4e5f6
   */
  test('建立續用案件需填寫原案件編號', async ({ page }) => {
    // 當 我在新增案件頁面
    await page.getByRole('button', { name: /新增案件/i }).click();

    // 並且 我選擇申報類別為 "續用申請"
    await page.getByLabel(/申報類別/i).selectOption('續用申請');

    // 那麼 我應該看到 "原案件編號" 欄位
    await expect(page.getByLabel(/原案件編號/i)).toBeVisible();

    // 並且 原案件編號應該為必填
    await page.getByRole('button', { name: /儲存/i }).click();
    await expect(page.getByText(/原案件編號為必填/)).toBeVisible();
  });

  /**
   * @bdd-generated: features/claim/claim-crud.feature#建立案件缺少必填欄位
   * @bdd-hash: d4e5f6g7
   */
  test('建立案件缺少必填欄位', async ({ page }) => {
    // 當 我在新增案件頁面
    await page.getByRole('button', { name: /新增案件/i }).click();

    // 並且 我只填寫病人資訊
    await page.getByLabel(/病人/i).click();
    await page.getByText('王小明 (MRN001)').click();

    // 並且 我點擊儲存按鈕
    await page.getByRole('button', { name: /儲存/i }).click();

    // 那麼 我應該看到錯誤訊息
    await expect(page.getByText(/申報類別為必填/)).toBeVisible();
    await expect(page.getByText(/案件類別為必填/)).toBeVisible();
    await expect(page.getByText(/申請醫師為必填/)).toBeVisible();
    await expect(page.getByText(/體重為必填/)).toBeVisible();
    await expect(page.getByText(/身高為必填/)).toBeVisible();
  });

  // ===========================================================================
  // 查看申報案件
  // ===========================================================================

  /**
   * @bdd-generated: features/claim/claim-crud.feature#查看案件詳情
   * @bdd-hash: e5f6g7h8
   */
  test('查看案件詳情', async ({ page }) => {
    // 假設 存在申報案件 "CASE-001"

    // 當 我點擊案件 "CASE-001"
    await page.getByText('CASE-001').click();

    // 那麼 我應該看到案件詳情頁面
    await expect(page).toHaveURL(/claims\/CASE-001/);

    // 並且 頁面應該顯示案件基本資料
    await expect(page.getByText(/案件編號/)).toBeVisible();

    // 並且 頁面應該顯示各類資訊填寫入口
    await expect(page.getByText('疾病資訊')).toBeVisible();
    await expect(page.getByText('基因資訊')).toBeVisible();
    await expect(page.getByText('評估資訊')).toBeVisible();
    await expect(page.getByText('治療資訊')).toBeVisible();
    await expect(page.getByText('結果資訊')).toBeVisible();
    await expect(page.getByText('申請項目')).toBeVisible();
  });

  // ===========================================================================
  // 修改申報案件
  // ===========================================================================

  /**
   * @bdd-generated: features/claim/claim-crud.feature#修改草稿狀態的案件
   * @bdd-hash: f6g7h8i9
   */
  test('修改草稿狀態的案件', async ({ page }) => {
    // 假設 存在草稿狀態的案件 "CASE-001"
    await page.getByText('CASE-001').click();

    // 當 我在案件詳情頁面
    // 並且 我點擊編輯按鈕
    await page.getByRole('button', { name: /編輯/i }).click();

    // 並且 我修改體重為 "68.0"
    await page.getByLabel(/體重/i).fill('68.0');

    // 並且 我點擊儲存按鈕
    await page.getByRole('button', { name: /儲存/i }).click();

    // 那麼 我應該看到成功訊息 "案件資料已更新"
    await expect(page.getByText('案件資料已更新')).toBeVisible();

    // 並且 案件的體重應該為 "68.0"
    await expect(page.getByText('68.0')).toBeVisible();
  });

  /**
   * @bdd-generated: features/claim/claim-crud.feature#無法修改已送審的案件基本資料
   * @bdd-hash: g7h8i9j0
   */
  test('無法修改已送審的案件基本資料', async ({ page }) => {
    // 假設 存在待審核狀態的案件 "CASE-002"
    await page.getByText('CASE-002').click();

    // 當 我嘗試編輯案件 "CASE-002" 的基本資料
    // 那麼 編輯按鈕應該被停用
    const editButton = page.getByRole('button', { name: /編輯/i });
    await expect(editButton).toBeDisabled();

    // 或者 我應該看到訊息 "已送審的案件無法修改基本資料"
    // await expect(page.getByText('已送審的案件無法修改基本資料')).toBeVisible();
  });

  // ===========================================================================
  // 刪除申報案件
  // ===========================================================================

  /**
   * @bdd-generated: features/claim/claim-crud.feature#刪除草稿狀態的案件
   * @bdd-hash: h8i9j0k1
   */
  test('刪除草稿狀態的案件', async ({ page }) => {
    // 假設 存在草稿狀態的案件 "CASE-001"
    await page.getByText('CASE-001').click();

    // 當 我在案件詳情頁面
    // 並且 我點擊刪除按鈕
    await page.getByRole('button', { name: /刪除/i }).click();

    // 並且 我確認刪除操作
    await page.getByRole('button', { name: /確認/i }).click();

    // 那麼 我應該看到成功訊息 "申報案件已刪除"
    await expect(page.getByText('申報案件已刪除')).toBeVisible();

    // 並且 我應該被導向案件列表頁面
    await expect(page).toHaveURL(/claims$/);

    // 並且 案件列表不應該包含 "CASE-001"
    await expect(page.getByText('CASE-001')).not.toBeVisible();
  });

  /**
   * @bdd-generated: features/claim/claim-crud.feature#無法刪除已送審的案件
   * @bdd-hash: i9j0k1l2
   */
  test('無法刪除已送審的案件', async ({ page }) => {
    // 假設 存在待審核狀態的案件 "CASE-002"
    await page.getByText('CASE-002').click();

    // 當 我嘗試刪除案件 "CASE-002"
    // 那麼 刪除按鈕應該被停用
    const deleteButton = page.getByRole('button', { name: /刪除/i });
    await expect(deleteButton).toBeDisabled();
  });

  /**
   * @bdd-generated: features/claim/claim-crud.feature#刪除案件需要確認
   * @bdd-hash: j0k1l2m3
   */
  test('刪除案件需要確認', async ({ page }) => {
    // 假設 存在草稿狀態的案件
    await page.getByText('CASE-001').click();

    // 當 我點擊案件的刪除按鈕
    await page.getByRole('button', { name: /刪除/i }).click();

    // 那麼 我應該看到確認對話框
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // 並且 對話框應該警告 "此操作無法復原"
    await expect(dialog.getByText(/此操作無法復原/)).toBeVisible();

    // 當 我點擊取消
    await page.getByRole('button', { name: /取消/i }).click();

    // 那麼 案件應該仍存在於系統中
    await expect(page).toHaveURL(/claims\/CASE-001/);
  });
});

// ============================================================================
// Manual Tests - Add your custom tests below this line
// ============================================================================
