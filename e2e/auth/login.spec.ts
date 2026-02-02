/**
 * @file login.spec.ts
 * @description E2E tests for user login functionality
 * @bdd-generated: features/auth/login.feature
 *
 * Auto-generated from BDD feature file. Manual tests can be added below the generated section.
 */

import { test, expect, type Page } from '@playwright/test';

// ============================================================================
// Test Data (from feature background)
// ============================================================================
const testUsers = {
  twpas: { username: 'TWPASTWPAS', password: 'TWPASTWPAS', name: '洪主任', department: '乳癌', status: '啟用' },
  doctor: { username: 'doctor01', password: 'Pass1234!', name: '張醫師', department: '腫瘤科', status: '啟用' },
  inactive: { username: 'inactive_user', password: 'Pass1234!', name: '王護理師', department: '護理部', status: '停用' },
};

// ============================================================================
// Helper Functions
// ============================================================================
async function navigateToLoginPage(page: Page) {
  await page.goto('/login');
}

async function fillLoginForm(page: Page, username: string, password: string) {
  await page.getByLabel(/帳號|username/i).fill(username);
  await page.getByLabel(/密碼|password/i).fill(password);
}

async function clickLoginButton(page: Page) {
  await page.getByRole('button', { name: /登入|login/i }).click();
}

async function expectErrorMessage(page: Page, message: string) {
  await expect(page.getByText(message)).toBeVisible();
}

async function expectToBeOnLoginPage(page: Page) {
  await expect(page).toHaveURL(/.*login.*/);
}

async function expectToBeOnProfilePage(page: Page) {
  await expect(page).toHaveURL(/.*profile.*/);
}

// ============================================================================
// BDD Generated Tests - DO NOT EDIT MANUALLY
// ============================================================================

test.describe('使用者登入 @auth @login', () => {
  test.beforeEach(async ({ page }) => {
    // Background: 系統已經啟動
    await navigateToLoginPage(page);
  });

  // ===========================================================================
  // 登入頁面結構
  // ===========================================================================

  /**
   * @bdd-generated: features/auth/login.feature#顯示登入頁面
   * @bdd-hash: 4a8b2c1d
   */
  test('顯示登入頁面', async ({ page }) => {
    // 當 我在登入頁面
    await expectToBeOnLoginPage(page);

    // 那麼 我應該看到頁面標題包含 "TWPAS"
    await expect(page.getByText(/TWPAS/)).toBeVisible();

    // 並且 我應該看到帳號輸入欄位
    await expect(page.getByLabel(/帳號/i)).toBeVisible();

    // 並且 我應該看到密碼輸入欄位
    await expect(page.getByLabel(/密碼/i)).toBeVisible();

    // 並且 我應該看到登入按鈕
    await expect(page.getByRole('button', { name: /登入/i })).toBeVisible();
  });

  /**
   * @bdd-generated: features/auth/login.feature#登入表單欄位標籤
   * @bdd-hash: 5b9c3d2e
   */
  test('登入表單欄位標籤', async ({ page }) => {
    // 當 我在登入頁面
    await expectToBeOnLoginPage(page);

    // 那麼 帳號欄位應該有標籤 "* 帳號:"
    await expect(page.getByText(/\*\s*帳號/)).toBeVisible();

    // 並且 密碼欄位應該有標籤 "* 密碼:"
    await expect(page.getByText(/\*\s*密碼/)).toBeVisible();
  });

  // ===========================================================================
  // 成功登入
  // ===========================================================================

  /**
   * @bdd-generated: features/auth/login.feature#使用有效帳號密碼登入
   * @bdd-hash: 6c0d4e3f
   */
  test('使用有效帳號密碼登入', async ({ page }) => {
    // 當 我在登入頁面
    await expectToBeOnLoginPage(page);

    // 並且 我輸入帳號 "TWPASTWPAS"
    // 並且 我輸入密碼 "TWPASTWPAS"
    await fillLoginForm(page, testUsers.twpas.username, testUsers.twpas.password);

    // 並且 我點擊登入按鈕
    await clickLoginButton(page);

    // 那麼 我應該看到個人資料頁面
    await expectToBeOnProfilePage(page);

    // 並且 我應該看到歡迎訊息包含 "洪主任"
    await expect(page.getByText(/洪主任/).first()).toBeVisible();

    // 並且 系統應該記錄登入日誌
    // Note: Login audit logging should be verified via API or database check
  });

  /**
   * @bdd-generated: features/auth/login.feature#登入後顯示側邊選單
   * @bdd-hash: 7d1e5f4a
   */
  test('登入後顯示側邊選單', async ({ page }) => {
    // 假設 我已經登入為 "TWPASTWPAS"
    await fillLoginForm(page, testUsers.twpas.username, testUsers.twpas.password);
    await clickLoginButton(page);
    await expectToBeOnProfilePage(page);

    // 那麼 我應該看到以下側邊選單項目
    await expect(page.getByText('病人資料管理')).toBeVisible();
    await expect(page.getByText('個人資料')).toBeVisible();
    await expect(page.getByText('新增申請案')).toBeVisible();
    await expect(page.getByText('申請案件管理')).toBeVisible();
    await expect(page.getByText('Logout')).toBeVisible();
  });

  // ===========================================================================
  // 登入失敗
  // ===========================================================================

  /**
   * @bdd-generated: features/auth/login.feature#使用錯誤密碼登入
   * @bdd-hash: 8e2f6a5b
   */
  test('使用錯誤密碼登入', async ({ page }) => {
    // 當 我在登入頁面
    await expectToBeOnLoginPage(page);

    // 並且 我輸入帳號 "TWPASTWPAS"
    // 並且 我輸入密碼 "WrongPassword"
    await fillLoginForm(page, 'TWPASTWPAS', 'WrongPassword');

    // 並且 我點擊登入按鈕
    await clickLoginButton(page);

    // 那麼 我應該看到錯誤訊息 "帳號或密碼錯誤"
    await expectErrorMessage(page, '帳號或密碼錯誤');

    // 並且 我應該仍在登入頁面
    await expectToBeOnLoginPage(page);
  });

  /**
   * @bdd-generated: features/auth/login.feature#使用不存在的帳號登入
   * @bdd-hash: 9f3a7b6c
   */
  test('使用不存在的帳號登入', async ({ page }) => {
    // 當 我在登入頁面
    await expectToBeOnLoginPage(page);

    // 並且 我輸入帳號 "nonexistent_user"
    // 並且 我輸入密碼 "Pass1234!"
    await fillLoginForm(page, 'nonexistent_user', 'Pass1234!');

    // 並且 我點擊登入按鈕
    await clickLoginButton(page);

    // 那麼 我應該看到錯誤訊息 "帳號或密碼錯誤"
    await expectErrorMessage(page, '帳號或密碼錯誤');

    // 並且 我應該仍在登入頁面
    await expectToBeOnLoginPage(page);
  });

  /**
   * @bdd-generated: features/auth/login.feature#使用停用帳號登入
   * @bdd-hash: a048c87d
   */
  test('使用停用帳號登入', async ({ page }) => {
    // 當 我在登入頁面
    await expectToBeOnLoginPage(page);

    // 並且 我輸入帳號 "inactive_user"
    // 並且 我輸入密碼 "Pass1234!"
    await fillLoginForm(page, testUsers.inactive.username, testUsers.inactive.password);

    // 並且 我點擊登入按鈕
    await clickLoginButton(page);

    // 那麼 我應該看到錯誤訊息 "帳號已停用，請聯繫管理員"
    await expectErrorMessage(page, '帳號已停用，請聯繫管理員');

    // 並且 我應該仍在登入頁面
    await expectToBeOnLoginPage(page);
  });

  /**
   * @bdd-generated: features/auth/login.feature#空白帳號或密碼登入
   * @bdd-hash: b159d98e
   */
  test('空白帳號或密碼登入', async ({ page }) => {
    // 當 我在登入頁面
    await expectToBeOnLoginPage(page);

    // 並且 我輸入帳號 ""
    // 並且 我輸入密碼 ""
    await fillLoginForm(page, '', '');

    // 並且 我點擊登入按鈕
    await clickLoginButton(page);

    // 那麼 我應該看到錯誤訊息 "請輸入帳號和密碼"
    await expectErrorMessage(page, '請輸入帳號和密碼');
  });

  /**
   * @bdd-generated: features/auth/login.feature#只輸入帳號不輸入密碼
   * @bdd-hash: c26ae09f
   */
  test('只輸入帳號不輸入密碼', async ({ page }) => {
    // 當 我在登入頁面
    await expectToBeOnLoginPage(page);

    // 並且 我輸入帳號 "TWPASTWPAS"
    // 並且 我輸入密碼 ""
    await fillLoginForm(page, 'TWPASTWPAS', '');

    // 並且 我點擊登入按鈕
    await clickLoginButton(page);

    // 那麼 我應該看到錯誤訊息提示密碼為必填
    await expect(page.getByText(/密碼.*必填|請輸入.*密碼/)).toBeVisible();
  });

  /**
   * @bdd-generated: features/auth/login.feature#只輸入密碼不輸入帳號
   * @bdd-hash: d37bf1a0
   */
  test('只輸入密碼不輸入帳號', async ({ page }) => {
    // 當 我在登入頁面
    await expectToBeOnLoginPage(page);

    // 並且 我輸入帳號 ""
    // 並且 我輸入密碼 "TWPASTWPAS"
    await fillLoginForm(page, '', 'TWPASTWPAS');

    // 並且 我點擊登入按鈕
    await clickLoginButton(page);

    // 那麼 我應該看到錯誤訊息提示帳號為必填
    await expect(page.getByText(/帳號.*必填|請輸入.*帳號/)).toBeVisible();
  });

  // ===========================================================================
  // 登出
  // ===========================================================================

  /**
   * @bdd-generated: features/auth/login.feature#成功登出
   * @bdd-hash: e48c02b1
   */
  test('成功登出', async ({ page }) => {
    // 假設 我已經登入為 "TWPASTWPAS"
    await fillLoginForm(page, testUsers.twpas.username, testUsers.twpas.password);
    await clickLoginButton(page);
    await expectToBeOnProfilePage(page);

    // 當 我點擊 "Logout" 連結
    await page.getByText('Logout').click();

    // 那麼 我應該被導向登入頁面
    await expectToBeOnLoginPage(page);

    // 並且 系統應該記錄登出日誌
    // Note: Logout audit logging should be verified via API or database check
  });

  // ===========================================================================
  // 安全性
  // ===========================================================================

  /**
   * @bdd-generated: features/auth/login.feature#連續登入失敗後鎖定帳號
   * @bdd-hash: f59d13c2
   */
  test('連續登入失敗後鎖定帳號', async ({ page }) => {
    // 當 我在登入頁面
    await expectToBeOnLoginPage(page);

    // 並且 我使用錯誤密碼嘗試登入 "TWPASTWPAS" 連續 5 次
    for (let i = 0; i < 5; i++) {
      await fillLoginForm(page, 'TWPASTWPAS', 'WrongPassword');
      await clickLoginButton(page);
      if (i < 4) {
        // 前 4 次會看到一般錯誤訊息，等待後重試
        await expect(page.getByText('帳號或密碼錯誤')).toBeVisible();
        await page.reload();
      }
    }

    // 那麼 我應該看到錯誤訊息 "帳號已被鎖定，請在 15 分鐘後重試"
    await expectErrorMessage(page, '帳號已被鎖定，請在 15 分鐘後重試');

    // 並且 該帳號應該被暫時鎖定 15 分鐘
    // Note: Account lockout status should be verified via API or database check
  });

  /**
   * @bdd-generated: features/auth/login.feature#登入後閒置超時
   * @bdd-hash: a6ae24d3
   */
  test('登入後閒置超時', async ({ page, context }) => {
    // 假設 我已經登入為 "TWPASTWPAS"
    await fillLoginForm(page, testUsers.twpas.username, testUsers.twpas.password);
    await clickLoginButton(page);
    await expectToBeOnProfilePage(page);

    // 當 系統閒置超過 30 分鐘
    // Note: In real test, we would manipulate session/token expiry
    // For E2E testing, we simulate by clearing session storage or manipulating cookies
    await context.clearCookies();

    // 並且 我嘗試存取任何頁面
    await page.goto('/profile');

    // 那麼 我應該被重導到登入頁面
    await expectToBeOnLoginPage(page);

    // 並且 我應該看到訊息 "您的登入已過期，請重新登入"
    await expect(page.getByText('您的登入已過期，請重新登入')).toBeVisible();
  });

  /**
   * @bdd-generated: features/auth/login.feature#密碼欄位顯示/隱藏切換
   * @bdd-hash: b7bf35e4
   */
  test('密碼欄位顯示/隱藏切換', async ({ page }) => {
    // 當 我在登入頁面
    await expectToBeOnLoginPage(page);

    // 並且 我輸入密碼 "TestPassword"
    const passwordInput = page.getByLabel(/密碼/i);
    await passwordInput.fill('TestPassword');

    // 那麼 密碼應該以遮罩方式顯示
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // 當 我點擊密碼顯示/隱藏切換按鈕
    await page.getByRole('button', { name: /顯示密碼|show password|toggle/i }).click();

    // 那麼 密碼應該以明文方式顯示
    await expect(passwordInput).toHaveAttribute('type', 'text');
  });

  // ===========================================================================
  // 未授權存取
  // ===========================================================================

  /**
   * @bdd-generated: features/auth/login.feature#未登入存取受保護頁面
   * @bdd-hash: c8c046f5
   */
  test('未登入存取受保護頁面', async ({ page }) => {
    // 當 我未登入
    // 並且 我嘗試存取病人資料管理頁面
    await page.goto('/patient');

    // 那麼 我應該被重導到登入頁面
    await expectToBeOnLoginPage(page);
  });

  /**
   * @bdd-generated: features/auth/login.feature#未登入存取申請案件管理頁面
   * @bdd-hash: d9d157a6
   */
  test('未登入存取申請案件管理頁面', async ({ page }) => {
    // 當 我未登入
    // 並且 我嘗試存取申請案件管理頁面
    await page.goto('/claim');

    // 那麼 我應該被重導到登入頁面
    await expectToBeOnLoginPage(page);
  });
});

// ============================================================================
// Manual Tests - Add your custom tests below this line
// ============================================================================

// Example:
// test.describe('Custom Login Tests', () => {
//   test('custom test case', async ({ page }) => {
//     // Your custom test implementation
//   });
// });
