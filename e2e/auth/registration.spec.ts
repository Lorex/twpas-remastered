/**
 * @file registration.spec.ts
 * @description E2E tests for user registration functionality
 * @bdd-generated: features/auth/registration.feature
 *
 * Auto-generated from BDD feature file. Manual tests can be added below the generated section.
 */

import { test, expect, type Page } from '@playwright/test';

// ============================================================================
// Helper Functions
// ============================================================================
async function navigateToRegistrationPage(page: Page) {
  await page.goto('/register');
}

async function fillRegistrationForm(page: Page, data: {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  role?: string;
}) {
  if (data.username) await page.getByLabel(/帳號|username/i).fill(data.username);
  if (data.email) await page.getByLabel(/電子郵件|email/i).fill(data.email);
  if (data.password) await page.getByLabel(/^密碼|^password/i).fill(data.password);
  if (data.confirmPassword) await page.getByLabel(/確認密碼|confirm/i).fill(data.confirmPassword);
  if (data.name) await page.getByLabel(/姓名|name/i).fill(data.name);
  if (data.role) await page.getByLabel(/角色|role/i).selectOption(data.role);
}

async function clickRegisterButton(page: Page) {
  await page.getByRole('button', { name: /註冊|register/i }).click();
}

// ============================================================================
// BDD Generated Tests
// ============================================================================

test.describe('使用者註冊 @auth @registration', () => {
  test.beforeEach(async ({ page }) => {
    // Background: 系統已經啟動
    await navigateToRegistrationPage(page);
  });

  /**
   * @bdd-generated: features/auth/registration.feature#成功註冊新帳號
   * @bdd-hash: f1a2b3c4
   */
  test('成功註冊新帳號', async ({ page }) => {
    // 當 我在註冊頁面
    await expect(page).toHaveURL(/register/);

    // 並且 我填寫以下註冊資訊
    await fillRegistrationForm(page, {
      username: 'new_doctor',
      email: 'doctor@hospital.tw',
      password: 'SecurePass123!',
      confirmPassword: 'SecurePass123!',
      name: '王大明',
      role: '醫師',
    });

    // 並且 我點擊註冊按鈕
    await clickRegisterButton(page);

    // 那麼 我應該看到訊息 "註冊成功，請等待管理員審核"
    await expect(page.getByText('註冊成功，請等待管理員審核')).toBeVisible();

    // 並且 系統應該建立一個待審核的使用者帳號
    // 並且 系統應該發送通知給管理員
    // Note: Verify via API/database
  });

  /**
   * @bdd-generated: features/auth/registration.feature#註冊時帳號已存在
   * @bdd-hash: g2b3c4d5
   */
  test('註冊時帳號已存在', async ({ page }) => {
    // 假設 資料庫中已存在帳號 "existing_user"
    // Note: Set up via API fixture

    // 當 我在註冊頁面
    await expect(page).toHaveURL(/register/);

    // 並且 我填寫帳號 "existing_user"
    await page.getByLabel(/帳號|username/i).fill('existing_user');

    // 並且 我點擊註冊按鈕
    await clickRegisterButton(page);

    // 那麼 我應該看到錯誤訊息 "此帳號已被使用"
    await expect(page.getByText('此帳號已被使用')).toBeVisible();
  });

  /**
   * @bdd-generated: features/auth/registration.feature#註冊時電子郵件已存在
   * @bdd-hash: h3c4d5e6
   */
  test('註冊時電子郵件已存在', async ({ page }) => {
    // 假設 資料庫中已存在電子郵件 "used@hospital.tw"

    // 當 我在註冊頁面
    await expect(page).toHaveURL(/register/);

    // 並且 我填寫電子郵件 "used@hospital.tw"
    await page.getByLabel(/電子郵件|email/i).fill('used@hospital.tw');

    // 並且 我點擊註冊按鈕
    await clickRegisterButton(page);

    // 那麼 我應該看到錯誤訊息 "此電子郵件已被使用"
    await expect(page.getByText('此電子郵件已被使用')).toBeVisible();
  });

  /**
   * @bdd-generated: features/auth/registration.feature#註冊時密碼不符合規則
   * @bdd-hash: i4d5e6f7
   */
  test('註冊時密碼不符合規則', async ({ page }) => {
    // 當 我在註冊頁面
    await expect(page).toHaveURL(/register/);

    // 並且 我填寫密碼 "weak"
    await page.getByLabel(/^密碼|^password/i).fill('weak');

    // 並且 我點擊註冊按鈕
    await clickRegisterButton(page);

    // 那麼 我應該看到錯誤訊息包含 "密碼必須至少8個字元"
    await expect(page.getByText(/密碼必須至少8個字元/)).toBeVisible();
  });

  /**
   * @bdd-generated: features/auth/registration.feature#註冊時確認密碼不一致
   * @bdd-hash: j5e6f7g8
   */
  test('註冊時確認密碼不一致', async ({ page }) => {
    // 當 我在註冊頁面
    await expect(page).toHaveURL(/register/);

    // 並且 我填寫密碼 "SecurePass123!"
    await page.getByLabel(/^密碼|^password/i).fill('SecurePass123!');

    // 並且 我填寫確認密碼 "DifferentPass123!"
    await page.getByLabel(/確認密碼|confirm/i).fill('DifferentPass123!');

    // 並且 我點擊註冊按鈕
    await clickRegisterButton(page);

    // 那麼 我應該看到錯誤訊息 "確認密碼不一致"
    await expect(page.getByText('確認密碼不一致')).toBeVisible();
  });

  /**
   * @bdd-generated: features/auth/registration.feature#密碼強度驗證
   * @bdd-hash: k6f7g8h9
   */
  test.describe('密碼強度驗證', () => {
    const passwordCases = [
      { password: '123456', strength: '弱', valid: false },
      { password: 'password', strength: '弱', valid: false },
      { password: 'Password1', strength: '中', valid: false },
      { password: 'Password1!', strength: '強', valid: true },
      { password: 'SecurePass123!', strength: '強', valid: true },
    ];

    for (const { password, strength, valid } of passwordCases) {
      test(`密碼 "${password}" 強度應為 "${strength}"`, async ({ page }) => {
        // 當 我在註冊頁面
        await expect(page).toHaveURL(/register/);

        // 並且 我填寫密碼
        await page.getByLabel(/^密碼|^password/i).fill(password);

        // 那麼 密碼強度應該顯示為對應強度
        await expect(page.getByText(new RegExp(strength))).toBeVisible();

        // 並且 驗證結果應該符合預期
        if (valid) {
          await expect(page.getByText(/通過|valid/i)).toBeVisible();
        } else {
          await expect(page.getByText(/不通過|invalid/i)).toBeVisible();
        }
      });
    }
  });
});

// ============================================================================
// Manual Tests - Add your custom tests below this line
// ============================================================================
