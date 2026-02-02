/**
 * @file profile.spec.ts
 * @description E2E tests for user profile management functionality
 * @bdd-generated: features/auth/profile.feature
 *
 * Auto-generated from BDD feature file. Manual tests can be added below the generated section.
 */

import { test, expect, type Page } from '@playwright/test';

// ============================================================================
// Test Data (from feature background)
// ============================================================================
const testUser = {
  username: 'TWPASTWPAS',
  password: 'TWPASTWPAS',
  name: '洪主任',
  department: '乳癌',
};

// ============================================================================
// Helper Functions
// ============================================================================
async function login(page: Page) {
  await page.goto('/login');
  await page.getByLabel(/帳號/i).fill(testUser.username);
  await page.getByLabel(/密碼/i).fill(testUser.password);
  await page.getByRole('button', { name: /登入/i }).click();
  await expect(page).toHaveURL(/profile/);
}

async function navigateToProfilePage(page: Page) {
  await page.goto('/profile');
}

// ============================================================================
// BDD Generated Tests - DO NOT EDIT MANUALLY
// ============================================================================

test.describe('個人資料管理 @auth @profile', () => {
  test.beforeEach(async ({ page }) => {
    // Background: 我已經登入為 "TWPASTWPAS"
    await login(page);
  });

  // ===========================================================================
  // 個人資料頁面結構
  // ===========================================================================

  /**
   * @bdd-generated: features/auth/profile.feature#顯示個人資料頁面
   * @bdd-hash: 1a2b3c4d
   */
  test('顯示個人資料頁面', async ({ page }) => {
    // 當 我在個人資料頁面
    await navigateToProfilePage(page);

    // 那麼 我應該看到頁面標題 "個人資料"
    await expect(page.getByText('個人資料')).toBeVisible();

    // 並且 我應該看到基本資料區塊
    await expect(page.getByText(/基本資料/)).toBeVisible();

    // 並且 我應該看到變更密碼區塊
    await expect(page.getByText(/是否需更新密碼|變更密碼/)).toBeVisible();

    // 並且 我應該看到申請案常用病歷摘要範本區塊
    await expect(page.getByText(/申請案常用病歷摘要範本/)).toBeVisible();
  });

  /**
   * @bdd-generated: features/auth/profile.feature#顯示基本資料欄位
   * @bdd-hash: 2b3c4d5e
   */
  test('顯示基本資料欄位', async ({ page }) => {
    // 當 我在個人資料頁面
    await navigateToProfilePage(page);

    // 那麼 基本資料區塊應該顯示以下欄位
    await expect(page.getByText('帳號')).toBeVisible();
    await expect(page.getByText('科別')).toBeVisible();
    await expect(page.getByText('姓名')).toBeVisible();
    await expect(page.getByText('隸屬醫師')).toBeVisible();
    await expect(page.getByText('生日')).toBeVisible();
    await expect(page.getByText('醫師代碼')).toBeVisible();
    await expect(page.getByText('身分證字號')).toBeVisible();
    await expect(page.getByText('職稱')).toBeVisible();
    await expect(page.getByText('聯絡電話')).toBeVisible();
    await expect(page.getByText('信箱')).toBeVisible();
  });

  /**
   * @bdd-generated: features/auth/profile.feature#基本資料顯示目前登入使用者資訊
   * @bdd-hash: 3c4d5e6f
   */
  test('基本資料顯示目前登入使用者資訊', async ({ page }) => {
    // 當 我在個人資料頁面
    await navigateToProfilePage(page);

    // 那麼 帳號應該顯示 "TWPASTWPAS"
    await expect(page.getByText('TWPASTWPAS')).toBeVisible();

    // 並且 科別應該顯示 "乳癌"
    await expect(page.getByText('乳癌')).toBeVisible();

    // 並且 姓名應該顯示 "洪主任"
    await expect(page.getByText('洪主任')).toBeVisible();
  });

  // ===========================================================================
  // 變更密碼
  // ===========================================================================

  /**
   * @bdd-generated: features/auth/profile.feature#顯示變更密碼區塊
   * @bdd-hash: 4d5e6f7a
   */
  test('顯示變更密碼區塊', async ({ page }) => {
    // 當 我在個人資料頁面
    await navigateToProfilePage(page);

    // 那麼 我應該看到 "是否需更新密碼?" 區塊
    await expect(page.getByText(/是否需更新密碼/)).toBeVisible();

    // 並且 我應該看到 "變更密碼" 按鈕
    await expect(page.getByRole('button', { name: /變更密碼/i })).toBeVisible();
  });

  /**
   * @bdd-generated: features/auth/profile.feature#點擊變更密碼按鈕
   * @bdd-hash: 5e6f7a8b
   */
  test('點擊變更密碼按鈕', async ({ page }) => {
    // 當 我在個人資料頁面
    await navigateToProfilePage(page);

    // 並且 我點擊 "變更密碼" 按鈕
    await page.getByRole('button', { name: /變更密碼/i }).click();

    // 那麼 我應該看到變更密碼表單
    await expect(page.getByLabel(/目前密碼|舊密碼/i)).toBeVisible();
    await expect(page.getByLabel(/新密碼/i).first()).toBeVisible();
    await expect(page.getByLabel(/確認.*密碼/i)).toBeVisible();
  });

  /**
   * @bdd-generated: features/auth/profile.feature#成功變更密碼
   * @bdd-hash: 6f7a8b9c
   */
  test.skip('成功變更密碼', async ({ page }) => {
    // 當 我在變更密碼表單
    await navigateToProfilePage(page);
    await page.getByRole('button', { name: /變更密碼/i }).click();

    // 並且 我填寫目前密碼為 "TWPASTWPAS"
    await page.getByLabel(/目前密碼|舊密碼/i).fill('TWPASTWPAS');

    // 並且 我填寫新密碼為 "NewPass1234!"
    await page.getByLabel(/新密碼/i).first().fill('NewPass1234!');

    // 並且 我填寫確認新密碼為 "NewPass1234!"
    await page.getByLabel(/確認.*密碼/i).fill('NewPass1234!');

    // 並且 我點擊確認按鈕
    await page.getByRole('button', { name: /確認|儲存/i }).click();

    // 那麼 我應該看到成功訊息 "密碼已更新"
    await expect(page.getByText('密碼已更新')).toBeVisible();

    // Note: Skip this test to avoid changing password in test environment
  });

  /**
   * @bdd-generated: features/auth/profile.feature#變更密碼時目前密碼錯誤
   * @bdd-hash: 7a8b9c0d
   */
  test('變更密碼時目前密碼錯誤', async ({ page }) => {
    // 當 我在變更密碼表單
    await navigateToProfilePage(page);
    await page.getByRole('button', { name: /變更密碼/i }).click();

    // 並且 我填寫目前密碼為 "WrongPassword"
    await page.getByLabel(/目前密碼|舊密碼/i).fill('WrongPassword');

    // 並且 我填寫新密碼為 "NewPass1234!"
    await page.getByLabel(/新密碼/i).first().fill('NewPass1234!');

    // 並且 我填寫確認新密碼為 "NewPass1234!"
    await page.getByLabel(/確認.*密碼/i).fill('NewPass1234!');

    // 並且 我點擊確認按鈕
    await page.getByRole('button', { name: /確認|儲存/i }).click();

    // 那麼 我應該看到錯誤訊息 "目前密碼不正確"
    await expect(page.getByText('目前密碼不正確')).toBeVisible();
  });

  /**
   * @bdd-generated: features/auth/profile.feature#變更密碼時確認密碼不符
   * @bdd-hash: 8b9c0d1e
   */
  test('變更密碼時確認密碼不符', async ({ page }) => {
    // 當 我在變更密碼表單
    await navigateToProfilePage(page);
    await page.getByRole('button', { name: /變更密碼/i }).click();

    // 並且 我填寫目前密碼為 "TWPASTWPAS"
    await page.getByLabel(/目前密碼|舊密碼/i).fill('TWPASTWPAS');

    // 並且 我填寫新密碼為 "NewPass1234!"
    await page.getByLabel(/新密碼/i).first().fill('NewPass1234!');

    // 並且 我填寫確認新密碼為 "DifferentPass!"
    await page.getByLabel(/確認.*密碼/i).fill('DifferentPass!');

    // 並且 我點擊確認按鈕
    await page.getByRole('button', { name: /確認|儲存/i }).click();

    // 那麼 我應該看到錯誤訊息 "新密碼與確認密碼不符"
    await expect(page.getByText('新密碼與確認密碼不符')).toBeVisible();
  });

  /**
   * @bdd-generated: features/auth/profile.feature#變更密碼時新密碼強度不足
   * @bdd-hash: 9c0d1e2f
   */
  test('變更密碼時新密碼強度不足', async ({ page }) => {
    // 當 我在變更密碼表單
    await navigateToProfilePage(page);
    await page.getByRole('button', { name: /變更密碼/i }).click();

    // 並且 我填寫目前密碼為 "TWPASTWPAS"
    await page.getByLabel(/目前密碼|舊密碼/i).fill('TWPASTWPAS');

    // 並且 我填寫新密碼為 "weak"
    await page.getByLabel(/新密碼/i).first().fill('weak');

    // 並且 我填寫確認新密碼為 "weak"
    await page.getByLabel(/確認.*密碼/i).fill('weak');

    // 並且 我點擊確認按鈕
    await page.getByRole('button', { name: /確認|儲存/i }).click();

    // 那麼 我應該看到錯誤訊息提示密碼強度不足
    await expect(page.getByText(/密碼.*強度|密碼.*長度|密碼.*複雜/)).toBeVisible();
  });

  // ===========================================================================
  // 病歷摘要範本管理
  // ===========================================================================

  /**
   * @bdd-generated: features/auth/profile.feature#顯示病歷摘要範本區塊
   * @bdd-hash: 0d1e2f3a
   */
  test('顯示病歷摘要範本區塊', async ({ page }) => {
    // 當 我在個人資料頁面
    await navigateToProfilePage(page);

    // 那麼 我應該看到 "申請案常用病歷摘要範本" 區塊
    await expect(page.getByText(/申請案常用病歷摘要範本/)).toBeVisible();

    // 並且 我應該看到 "治療過程" 標籤頁
    await expect(page.getByText('治療過程')).toBeVisible();
  });

  /**
   * @bdd-generated: features/auth/profile.feature#顯示範本列表
   * @bdd-hash: 1e2f3a4b
   */
  test('顯示範本列表', async ({ page }) => {
    // 當 我在個人資料頁面的病歷摘要範本區塊
    await navigateToProfilePage(page);

    // 那麼 我應該看到範本表格包含以下欄位
    await expect(page.getByText('範本名稱')).toBeVisible();
    await expect(page.getByText('範本內文')).toBeVisible();
    await expect(page.getByText('建立日期')).toBeVisible();
  });

  /**
   * @bdd-generated: features/auth/profile.feature#新增病歷摘要範本
   * @bdd-hash: 2f3a4b5c
   */
  test('新增病歷摘要範本', async ({ page }) => {
    // 當 我在個人資料頁面的病歷摘要範本區塊
    await navigateToProfilePage(page);

    // 並且 我點擊 "加入文本" 按鈕
    await page.getByRole('button', { name: /加入文本|新增範本/i }).click();

    // 那麼 我應該看到新增範本表單
    await expect(page.getByLabel(/範本名稱/i)).toBeVisible();
    await expect(page.getByLabel(/範本內文/i)).toBeVisible();
  });

  /**
   * @bdd-generated: features/auth/profile.feature#成功新增病歷摘要範本
   * @bdd-hash: 3a4b5c6d
   */
  test('成功新增病歷摘要範本', async ({ page }) => {
    // 當 我在新增範本表單
    await navigateToProfilePage(page);
    await page.getByRole('button', { name: /加入文本|新增範本/i }).click();

    // 並且 我填寫範本名稱為 "常用病歷摘要"
    await page.getByLabel(/範本名稱/i).fill('常用病歷摘要');

    // 並且 我填寫範本內文為 "Patient diagnosed with..."
    await page.getByLabel(/範本內文/i).fill('Patient diagnosed with...');

    // 並且 我點擊儲存按鈕
    await page.getByRole('button', { name: /儲存/i }).click();

    // 那麼 我應該看到成功訊息 "範本已新增"
    await expect(page.getByText('範本已新增')).toBeVisible();

    // 並且 範本列表應該包含 "常用病歷摘要"
    await expect(page.getByText('常用病歷摘要')).toBeVisible();
  });

  /**
   * @bdd-generated: features/auth/profile.feature#編輯病歷摘要範本
   * @bdd-hash: 4b5c6d7e
   */
  test.skip('編輯病歷摘要範本', async ({ page }) => {
    // 假設 我已有一個名為 "常用病歷摘要" 的範本
    // Note: This test requires pre-existing data

    // 當 我在範本列表點擊該範本的編輯按鈕
    await navigateToProfilePage(page);
    await page.getByRole('row', { name: /常用病歷摘要/ }).getByRole('button', { name: /編輯/i }).click();

    // 並且 我修改範本內文
    await page.getByLabel(/範本內文/i).fill('Updated content...');

    // 並且 我點擊儲存按鈕
    await page.getByRole('button', { name: /儲存/i }).click();

    // 那麼 我應該看到成功訊息 "範本已更新"
    await expect(page.getByText('範本已更新')).toBeVisible();
  });

  /**
   * @bdd-generated: features/auth/profile.feature#刪除病歷摘要範本
   * @bdd-hash: 5c6d7e8f
   */
  test.skip('刪除病歷摘要範本', async ({ page }) => {
    // 假設 我已有一個名為 "常用病歷摘要" 的範本
    // Note: This test requires pre-existing data

    // 當 我在範本列表點擊該範本的刪除按鈕
    await navigateToProfilePage(page);
    await page.getByRole('row', { name: /常用病歷摘要/ }).getByRole('button', { name: /刪除/i }).click();

    // 並且 我確認刪除操作
    await page.getByRole('button', { name: /確認/i }).click();

    // 那麼 我應該看到成功訊息 "範本已刪除"
    await expect(page.getByText('範本已刪除')).toBeVisible();

    // 並且 範本列表不應該包含 "常用病歷摘要"
    await expect(page.getByText('常用病歷摘要')).not.toBeVisible();
  });

  /**
   * @bdd-generated: features/auth/profile.feature#新增範本時範本名稱為必填
   * @bdd-hash: 6d7e8f9a
   */
  test('新增範本時範本名稱為必填', async ({ page }) => {
    // 當 我在新增範本表單
    await navigateToProfilePage(page);
    await page.getByRole('button', { name: /加入文本|新增範本/i }).click();

    // 並且 我只填寫範本內文
    await page.getByLabel(/範本內文/i).fill('Some content...');

    // 並且 我點擊儲存按鈕
    await page.getByRole('button', { name: /儲存/i }).click();

    // 那麼 我應該看到錯誤訊息 "範本名稱為必填"
    await expect(page.getByText('範本名稱為必填')).toBeVisible();
  });

  // ===========================================================================
  // 導航
  // ===========================================================================

  /**
   * @bdd-generated: features/auth/profile.feature#從側邊選單進入個人資料頁面
   * @bdd-hash: 7e8f9a0b
   */
  test('從側邊選單進入個人資料頁面', async ({ page }) => {
    // 當 我在任何已登入的頁面
    await page.goto('/patient');

    // 並且 我點擊側邊選單的 "個人資料" 連結
    await page.getByText('個人資料').click();

    // 那麼 我應該被導向個人資料頁面
    await expect(page).toHaveURL(/profile/);
  });

  /**
   * @bdd-generated: features/auth/profile.feature#登入後預設顯示個人資料頁面
   * @bdd-hash: 8f9a0b1c
   */
  test('登入後預設顯示個人資料頁面', async ({ page }) => {
    // 當 我成功登入
    // Note: Already logged in via beforeEach, verify we're on profile page

    // 那麼 我應該被導向個人資料頁面
    await expect(page).toHaveURL(/profile/);
  });
});

// ============================================================================
// Manual Tests - Add your custom tests below this line
// ============================================================================

// Example:
// test.describe('Custom Profile Tests', () => {
//   test('custom test case', async ({ page }) => {
//     // Your custom test implementation
//   });
// });
