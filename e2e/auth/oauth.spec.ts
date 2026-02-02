/**
 * @file oauth.spec.ts
 * @description E2E tests for OAuth2 login functionality
 * @bdd-generated: features/auth/oauth.feature
 *
 * Auto-generated from BDD feature file. Manual tests can be added below the generated section.
 */

import { test, expect, type Page } from '@playwright/test';

// ============================================================================
// Test Data (from feature background)
// ============================================================================
const keycloakUsers = {
  doctor: { username: 'kc_user01', role: '醫師' },
  pharmacist: { username: 'kc_user02', role: '藥師' },
};

// ============================================================================
// Helper Functions
// ============================================================================
async function navigateToLoginPage(page: Page) {
  await page.goto('/login');
}

async function clickKeycloakLoginButton(page: Page) {
  await page.getByRole('button', { name: /使用 Keycloak 登入|Keycloak/i }).click();
}

async function fillKeycloakCredentials(page: Page, username: string, password: string) {
  await page.getByLabel(/username|帳號/i).fill(username);
  await page.getByLabel(/password|密碼/i).fill(password);
}

async function clickKeycloakLogin(page: Page) {
  await page.getByRole('button', { name: /登入|Sign In|Log In/i }).click();
}

// ============================================================================
// BDD Generated Tests
// ============================================================================

test.describe('OAuth2 登入 @auth @oauth', () => {
  test.beforeEach(async ({ page }) => {
    // Background: 系統已經啟動, Keycloak 服務已配置完成
    await navigateToLoginPage(page);
  });

  /**
   * @bdd-generated: features/auth/oauth.feature#透過 Keycloak OAuth2 登入
   * @bdd-hash: a1b2c3d4
   */
  test('透過 Keycloak OAuth2 登入', async ({ page }) => {
    // 當 我在登入頁面
    await expect(page).toHaveURL(/login/);

    // 並且 我點擊 "使用 Keycloak 登入" 按鈕
    await clickKeycloakLoginButton(page);

    // 那麼 我應該被重導到 Keycloak 登入頁面
    await expect(page).toHaveURL(/keycloak|auth/i);

    // 當 我在 Keycloak 輸入帳號 "kc_user01"
    // 並且 我在 Keycloak 輸入密碼 "Pass1234!"
    await fillKeycloakCredentials(page, 'kc_user01', 'Pass1234!');

    // 並且 我在 Keycloak 點擊登入
    await clickKeycloakLogin(page);

    // 那麼 我應該被重導回系統
    await expect(page).not.toHaveURL(/keycloak|auth/i);

    // 並且 我應該看到儀表板頁面
    await expect(page).toHaveURL(/dashboard/);

    // 並且 系統應該建立本地使用者記錄
    // Note: Verify via API or database check
  });

  /**
   * @bdd-generated: features/auth/oauth.feature#OAuth2 登入後自動建立本地帳號
   * @bdd-hash: b2c3d4e5
   */
  test('OAuth2 登入後自動建立本地帳號', async ({ page }) => {
    // 假設 本地資料庫中不存在使用者 "kc_user02"
    // Note: This would be set up via API/database fixture

    // 當 我透過 Keycloak 以 "kc_user02" 登入成功
    await clickKeycloakLoginButton(page);
    await fillKeycloakCredentials(page, 'kc_user02', 'Pass1234!');
    await clickKeycloakLogin(page);

    // 那麼 系統應該自動建立本地使用者
    // 並且 本地使用者應該關聯 Keycloak ID
    // 並且 使用者角色應該為 "藥師"
    await expect(page).toHaveURL(/dashboard/);
    // Note: Verify user creation and role via API
  });

  /**
   * @bdd-generated: features/auth/oauth.feature#OAuth2 登入失敗 - Keycloak 驗證失敗
   * @bdd-hash: c3d4e5f6
   */
  test('OAuth2 登入失敗 - Keycloak 驗證失敗', async ({ page }) => {
    // 當 我在登入頁面
    await expect(page).toHaveURL(/login/);

    // 並且 我點擊 "使用 Keycloak 登入" 按鈕
    await clickKeycloakLoginButton(page);

    // 並且 我在 Keycloak 輸入錯誤的帳號密碼
    await fillKeycloakCredentials(page, 'wrong_user', 'wrong_password');
    await clickKeycloakLogin(page);

    // 那麼 我應該看到 Keycloak 的錯誤訊息
    await expect(page.getByText(/Invalid|錯誤|失敗/i)).toBeVisible();

    // 並且 我應該仍在 Keycloak 登入頁面
    await expect(page).toHaveURL(/keycloak|auth/i);
  });

  /**
   * @bdd-generated: features/auth/oauth.feature#OAuth2 登入 - Keycloak 服務不可用
   * @bdd-hash: d4e5f6g7
   */
  test('OAuth2 登入 - Keycloak 服務不可用', async ({ page }) => {
    // 假設 Keycloak 服務暫時不可用
    // Note: This would require mocking or blocking Keycloak service

    // 當 我在登入頁面
    await expect(page).toHaveURL(/login/);

    // 並且 我點擊 "使用 Keycloak 登入" 按鈕
    // Note: With Keycloak unavailable, this should show error
    await clickKeycloakLoginButton(page);

    // 那麼 我應該看到錯誤訊息 "認證服務暫時不可用，請稍後再試"
    // await expect(page.getByText('認證服務暫時不可用，請稍後再試')).toBeVisible();

    // 並且 系統應該記錄錯誤日誌
    // Note: Verify via logging system
    test.skip(); // Skip until Keycloak mock is available
  });

  /**
   * @bdd-generated: features/auth/oauth.feature#OAuth2 Token 刷新
   * @bdd-hash: e5f6g7h8
   */
  test('OAuth2 Token 刷新', async ({ page }) => {
    // 假設 我已經透過 OAuth2 登入
    await clickKeycloakLoginButton(page);
    await fillKeycloakCredentials(page, 'kc_user01', 'Pass1234!');
    await clickKeycloakLogin(page);
    await expect(page).toHaveURL(/dashboard/);

    // 並且 我的 Access Token 即將過期
    // Note: Would need to manipulate token expiry

    // 當 我發送任何 API 請求
    // 那麼 系統應該自動刷新 Token
    // 並且 我的請求應該正常完成
    // 並且 我不需要重新登入

    // Note: This test requires token manipulation capabilities
    test.skip(); // Skip until token refresh testing is implemented
  });
});

// ============================================================================
// Manual Tests - Add your custom tests below this line
// ============================================================================
