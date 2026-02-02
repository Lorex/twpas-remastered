/**
 * @file application-items.spec.ts
 * @description E2E tests for application items management
 * @bdd-generated: features/application/application-items.feature
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

async function navigateToApplicationItems(page: Page, caseId: string = 'CASE-001') {
  await page.goto(`/claims/${caseId}/application-items`);
}

// ============================================================================
// BDD Generated Tests
// ============================================================================

test.describe('申請項目管理 @application-items', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await navigateToApplicationItems(page);
  });

  // ===========================================================================
  // 新增申請項目
  // ===========================================================================

  /**
   * @bdd-generated: features/application/application-items.feature#新增標靶藥物申請項目
   * @bdd-hash: a3b4c5d6
   */
  test('新增標靶藥物申請項目', async ({ page }) => {
    // 當 我點擊 "新增申請項目" 按鈕
    await page.getByRole('button', { name: /新增申請項目/i }).click();

    // 並且 我填寫以下申請項目資料
    await page.getByLabel(/醫令類別/i).selectOption('標靶治療');

    await page.getByLabel(/藥物/i).click();
    await page.getByPlaceholder(/搜尋藥物/i).fill('IRESSA');
    await page.getByText('IRESSA TAB 250MG').click();

    await page.getByLabel(/申請數量/i).fill('30');
    await page.getByLabel(/單位/i).selectOption('TAB');
    await page.getByLabel(/申請天數/i).fill('30');
    await page.getByLabel(/適應症說明/i).fill('EGFR 突變陽性非小細胞肺癌');

    // 並且 我點擊儲存按鈕
    await page.getByRole('button', { name: /儲存/i }).click();

    // 那麼 我應該看到成功訊息 "申請項目已新增"
    await expect(page.getByText('申請項目已新增')).toBeVisible();

    // 並且 申請項目列表應該包含 "IRESSA TAB 250MG"
    await expect(page.getByText('IRESSA TAB 250MG')).toBeVisible();
  });

  /**
   * @bdd-generated: features/application/application-items.feature#新增免疫治療申請項目
   * @bdd-hash: b4c5d6e7
   */
  test('新增免疫治療申請項目', async ({ page }) => {
    // 當 我點擊 "新增申請項目" 按鈕
    await page.getByRole('button', { name: /新增申請項目/i }).click();

    // 並且 我填寫以下申請項目資料
    await page.getByLabel(/醫令類別/i).selectOption('免疫治療');

    await page.getByLabel(/藥物/i).click();
    await page.getByPlaceholder(/搜尋藥物/i).fill('KEYTRUDA');
    await page.getByText('KEYTRUDA INJ 100MG').click();

    await page.getByLabel(/申請數量/i).fill('2');
    await page.getByLabel(/單位/i).selectOption('VIAL');
    await page.getByLabel(/申請天數/i).fill('21');
    await page.getByLabel(/適應症說明/i).fill('PD-L1 >=50% 非小細胞肺癌');

    // 並且 我點擊儲存按鈕
    await page.getByRole('button', { name: /儲存/i }).click();

    // 那麼 我應該看到成功訊息 "申請項目已新增"
    await expect(page.getByText('申請項目已新增')).toBeVisible();
  });

  // ===========================================================================
  // 藥物搜尋與選擇
  // ===========================================================================

  /**
   * @bdd-generated: features/application/application-items.feature#依健保碼搜尋藥物
   * @bdd-hash: c5d6e7f8
   */
  test('依健保碼搜尋藥物', async ({ page }) => {
    // 當 我在新增申請項目
    await page.getByRole('button', { name: /新增申請項目/i }).click();

    // 並且 我在藥物欄位輸入健保碼 "KC00961100"
    await page.getByLabel(/藥物/i).click();
    await page.getByPlaceholder(/搜尋藥物/i).fill('KC00961100');

    // 那麼 我應該看到搜尋結果包含 "IRESSA TAB 250MG"
    await expect(page.getByText('IRESSA TAB 250MG')).toBeVisible();

    // 當 我選擇該藥物
    await page.getByText('IRESSA TAB 250MG').click();

    // 那麼 健保碼欄位應該自動填入 "KC00961100"
    await expect(page.getByLabel(/健保碼/i)).toHaveValue('KC00961100');

    // 並且 ATC 代碼應該顯示 "L01EB01"
    await expect(page.getByText('L01EB01')).toBeVisible();
  });

  /**
   * @bdd-generated: features/application/application-items.feature#顯示藥物詳細資訊
   * @bdd-hash: d6e7f8g9
   */
  test('顯示藥物詳細資訊', async ({ page }) => {
    // 當 我在新增申請項目
    await page.getByRole('button', { name: /新增申請項目/i }).click();

    // 並且 我選擇藥物 "IRESSA TAB 250MG"
    await page.getByLabel(/藥物/i).click();
    await page.getByPlaceholder(/搜尋藥物/i).fill('IRESSA');
    await page.getByText('IRESSA TAB 250MG').click();

    // 那麼 我應該看到藥物詳細資訊
    await expect(page.getByText('KC00961100')).toBeVisible();
    await expect(page.getByText(/GEFITINIB/i)).toBeVisible();
    await expect(page.getByText('L01EB01')).toBeVisible();
  });

  // ===========================================================================
  // 適應症驗證
  // ===========================================================================

  /**
   * @bdd-generated: features/application/application-items.feature#藥物適應症提示
   * @bdd-hash: e7f8g9h0
   */
  test('藥物適應症提示', async ({ page }) => {
    // 當 我在新增申請項目
    await page.getByRole('button', { name: /新增申請項目/i }).click();

    // 並且 我選擇藥物 "IRESSA TAB 250MG"
    await page.getByLabel(/藥物/i).click();
    await page.getByPlaceholder(/搜尋藥物/i).fill('IRESSA');
    await page.getByText('IRESSA TAB 250MG').click();

    // 那麼 系統應該顯示該藥物的核准適應症
    await expect(page.getByText(/EGFR.*突變/)).toBeVisible();
  });

  // ===========================================================================
  // 數量與天數
  // ===========================================================================

  /**
   * @bdd-generated: features/application/application-items.feature#申請天數限制提醒
   * @bdd-hash: f8g9h0i1
   */
  test('申請天數限制提醒', async ({ page }) => {
    // 當 我在新增申請項目
    await page.getByRole('button', { name: /新增申請項目/i }).click();

    // 並且 我選擇藥物 "IRESSA TAB 250MG"
    await page.getByLabel(/藥物/i).click();
    await page.getByText('IRESSA TAB 250MG').click();

    // 並且 我填寫申請天數為 "90"
    await page.getByLabel(/申請天數/i).fill('90');

    // 那麼 系統應該顯示提醒
    await expect(page.getByText(/超過建議申請天數/)).toBeVisible();
  });

  // ===========================================================================
  // 多筆申請項目
  // ===========================================================================

  /**
   * @bdd-generated: features/application/application-items.feature#計算申請項目總費用預估
   * @bdd-hash: g9h0i1j2
   */
  test('計算申請項目總費用預估', async ({ page }) => {
    // 假設 案件已有多筆申請項目

    // 當 我在申請項目頁面
    // 那麼 應該顯示預估總費用
    await expect(page.getByText(/預估.*費用|總費用/)).toBeVisible();
  });

  // ===========================================================================
  // 編輯與刪除
  // ===========================================================================

  /**
   * @bdd-generated: features/application/application-items.feature#編輯已存在的申請項目
   * @bdd-hash: h0i1j2k3
   */
  test('編輯已存在的申請項目', async ({ page }) => {
    // 假設 案件已有一筆申請項目 "IRESSA TAB 250MG"

    // 當 我點擊該申請項目的編輯按鈕
    await page.locator('.application-item-row').first().getByRole('button', { name: /編輯/i }).click();

    // 並且 我修改申請數量為 "60"
    await page.getByLabel(/申請數量/i).fill('60');

    // 並且 我點擊儲存按鈕
    await page.getByRole('button', { name: /儲存/i }).click();

    // 那麼 我應該看到成功訊息 "申請項目已更新"
    await expect(page.getByText('申請項目已更新')).toBeVisible();

    // 並且 申請項目的數量應該顯示為 "60"
    await expect(page.getByText('60')).toBeVisible();
  });

  /**
   * @bdd-generated: features/application/application-items.feature#刪除申請項目
   * @bdd-hash: i1j2k3l4
   */
  test('刪除申請項目', async ({ page }) => {
    // 假設 案件已有一筆申請項目

    // 當 我點擊該申請項目的刪除按鈕
    await page.locator('.application-item-row').first().getByRole('button', { name: /刪除/i }).click();

    // 並且 我確認刪除操作
    await page.getByRole('button', { name: /確認/i }).click();

    // 那麼 我應該看到成功訊息 "申請項目已刪除"
    await expect(page.getByText('申請項目已刪除')).toBeVisible();
  });

  // ===========================================================================
  // 驗證規則
  // ===========================================================================

  /**
   * @bdd-generated: features/application/application-items.feature#申請項目必填欄位驗證
   * @bdd-hash: j2k3l4m5
   */
  test('申請項目必填欄位驗證', async ({ page }) => {
    // 當 我在新增申請項目
    await page.getByRole('button', { name: /新增申請項目/i }).click();

    // 並且 我只填寫藥物名稱
    await page.getByLabel(/藥物/i).click();
    await page.getByText('IRESSA TAB 250MG').click();

    // 並且 我點擊儲存按鈕
    await page.getByRole('button', { name: /儲存/i }).click();

    // 那麼 我應該看到錯誤訊息
    await expect(page.getByText(/申請數量為必填/)).toBeVisible();
    await expect(page.getByText(/申請天數為必填/)).toBeVisible();
  });

  /**
   * @bdd-generated: features/application/application-items.feature#申請數量須為正整數
   * @bdd-hash: k3l4m5n6
   */
  test('申請數量須為正整數', async ({ page }) => {
    // 當 我在新增申請項目
    await page.getByRole('button', { name: /新增申請項目/i }).click();

    // 並且 我填寫申請數量為 "-5"
    await page.getByLabel(/申請數量/i).fill('-5');

    // 那麼 我應該看到錯誤訊息 "申請數量須為正整數"
    await expect(page.getByText('申請數量須為正整數')).toBeVisible();
  });

  /**
   * @bdd-generated: features/application/application-items.feature#重複藥物警告
   * @bdd-hash: l4m5n6o7
   */
  test('重複藥物警告', async ({ page }) => {
    // 假設 案件已有申請項目 "IRESSA TAB 250MG"

    // 當 我在新增申請項目
    await page.getByRole('button', { name: /新增申請項目/i }).click();

    // 並且 我選擇藥物 "IRESSA TAB 250MG"
    await page.getByLabel(/藥物/i).click();
    await page.getByText('IRESSA TAB 250MG').click();

    // 那麼 系統應該顯示警告 "此藥物已存在於申請項目中"
    await expect(page.getByText('此藥物已存在於申請項目中')).toBeVisible();
  });

  // ===========================================================================
  // 從治療資訊帶入
  // ===========================================================================

  /**
   * @bdd-generated: features/application/application-items.feature#從用藥品項自動帶入申請項目
   * @bdd-hash: m5n6o7p8
   */
  test('從用藥品項自動帶入申請項目', async ({ page }) => {
    // 假設 案件已設定用藥品項

    // 當 我在申請項目頁面
    // 並且 我點擊 "從治療資訊帶入" 按鈕
    await page.getByRole('button', { name: /從治療資訊帶入/i }).click();

    // 那麼 系統應該詢問是否帶入用藥品項作為申請項目
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText(/帶入.*用藥/)).toBeVisible();

    // 當 我確認帶入
    await page.getByRole('button', { name: /確認/i }).click();

    // 那麼 申請項目列表應該包含帶入的項目
    await expect(page.getByText('申請項目已新增')).toBeVisible();
  });
});

// ============================================================================
// Manual Tests - Add your custom tests below this line
// ============================================================================
