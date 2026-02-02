/**
 * @file login.spec.ts
 * @description E2E tests for user login functionality
 * @source features/auth/login.feature
 *
 * Auto-generated from BDD feature file. Manual tests can be added below the generated section.
 */

import { test, expect, type Page } from '@playwright/test';

// ============================================================================
// Test Data (from feature background)
// ============================================================================
const testUsers = {
  doctor: { username: 'doctor01', password: 'Pass1234!', role: '醫師', status: '啟用' },
  pharmacist: { username: 'pharmacist01', password: 'Pass1234!', role: '藥師', status: '啟用' },
  admin: { username: 'admin01', password: 'Pass1234!', role: '管理員', status: '啟用' },
  inactive: { username: 'inactive_user', password: 'Pass1234!', role: '醫師', status: '停用' },
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

async function expectToBeOnDashboard(page: Page) {
  await expect(page).toHaveURL(/.*dashboard.*/);
}

// ============================================================================
// BDD Generated Tests - DO NOT EDIT MANUALLY
// ============================================================================

test.describe('使用者登入 @auth @login', () => {
  test.beforeEach(async ({ page }) => {
    // Background: 系統已經啟動
    await navigateToLoginPage(page);
  });

  /**
   * @bdd-generated
   * @bdd-hash 8f3a9c2e1d4b5a6f7e8d9c0b1a2f3e4d
   * @scenario 使用有效帳號密碼登入
   * @tags @happy-path
   */
  test('使用有效帳號密碼登入', async ({ page }) => {
    // 當 我在登入頁面
    await expectToBeOnLoginPage(page);

    // 並且 我輸入帳號 "doctor01"
    // 並且 我輸入密碼 "Pass1234!"
    await fillLoginForm(page, testUsers.doctor.username, testUsers.doctor.password);

    // 並且 我點擊登入按鈕
    await clickLoginButton(page);

    // 那麼 我應該看到儀表板頁面
    await expectToBeOnDashboard(page);

    // 並且 我應該看到歡迎訊息包含 "doctor01"
    await expect(page.getByText(/doctor01/)).toBeVisible();

    // 並且 系統應該記錄登入日誌
    // Note: Login audit logging should be verified via API or database check
  });

  /**
   * @bdd-generated
   * @bdd-hash 7e2b8d1c0a9f3e4d5c6b7a8e9f0d1c2b
   * @scenario 使用錯誤密碼登入
   */
  test('使用錯誤密碼登入', async ({ page }) => {
    // 當 我在登入頁面
    await expectToBeOnLoginPage(page);

    // 並且 我輸入帳號 "doctor01"
    // 並且 我輸入密碼 "WrongPassword"
    await fillLoginForm(page, 'doctor01', 'WrongPassword');

    // 並且 我點擊登入按鈕
    await clickLoginButton(page);

    // 那麼 我應該看到錯誤訊息 "帳號或密碼錯誤"
    await expectErrorMessage(page, '帳號或密碼錯誤');

    // 並且 我應該仍在登入頁面
    await expectToBeOnLoginPage(page);
  });

  /**
   * @bdd-generated
   * @bdd-hash 6d1a7c0b9e8f2d3c4b5a6e7f8d9c0a1b
   * @scenario 使用不存在的帳號登入
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
   * @bdd-generated
   * @bdd-hash 5c0a6b9d8e7f1c2b3a4d5e6f7c8b9a0d
   * @scenario 使用停用帳號登入
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
   * @bdd-generated
   * @bdd-hash 4b9a5c8d7e6f0b1a2c3d4e5f6a7b8c9d
   * @scenario 空白帳號或密碼登入
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
   * @bdd-generated
   * @bdd-hash 3a8b4c7d6e5f9a0b1c2d3e4f5a6b7c8d
   * @scenario 登入後閒置超時
   */
  test('登入後閒置超時', async ({ page, context }) => {
    // 假設 我已經登入為 "doctor01"
    await fillLoginForm(page, testUsers.doctor.username, testUsers.doctor.password);
    await clickLoginButton(page);
    await expectToBeOnDashboard(page);

    // 當 系統閒置超過 30 分鐘
    // Note: In real test, we would manipulate session/token expiry
    // For E2E testing, we simulate by clearing session storage or manipulating cookies
    await context.clearCookies();

    // 並且 我嘗試存取任何頁面
    await page.goto('/dashboard');

    // 那麼 我應該被重導到登入頁面
    await expectToBeOnLoginPage(page);

    // 並且 我應該看到訊息 "您的登入已過期，請重新登入"
    await expect(page.getByText('您的登入已過期，請重新登入')).toBeVisible();
  });

  /**
   * @bdd-generated
   * @bdd-hash 2f7a3b8c9d0e1f2a3b4c5d6e7f8a9b0c
   * @scenario 連續登入失敗後鎖定帳號
   * @tags @security
   */
  test('連續登入失敗後鎖定帳號', async ({ page }) => {
    // 當 我在登入頁面
    await expectToBeOnLoginPage(page);

    // 並且 我使用錯誤密碼嘗試登入 "doctor01" 連續 5 次
    for (let i = 0; i < 5; i++) {
      await fillLoginForm(page, 'doctor01', 'WrongPassword');
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
