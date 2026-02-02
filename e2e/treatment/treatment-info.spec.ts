/**
 * @file treatment-info.spec.ts
 * @description E2E tests for treatment information management
 * @bdd-generated: features/treatment/treatment-info.feature
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

async function navigateToTreatmentInfo(page: Page, caseId: string = 'CASE-001') {
  await page.goto(`/claims/${caseId}/treatment-info`);
}

// ============================================================================
// BDD Generated Tests
// ============================================================================

test.describe('治療資訊管理 @treatment', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await navigateToTreatmentInfo(page);
  });

  // ===========================================================================
  // 用藥品項
  // ===========================================================================

  /**
   * @bdd-generated: features/treatment/treatment-info.feature#新增用藥品項
   * @bdd-hash: i5j6k7l8
   */
  test('新增用藥品項', async ({ page }) => {
    // 當 我點擊 "新增用藥品項" 按鈕
    await page.getByRole('button', { name: /新增用藥品項/i }).click();

    // 並且 我填寫以下用藥資料
    await page.getByLabel(/藥物/i).click();
    await page.getByPlaceholder(/搜尋藥物/i).fill('IRESSA');
    await page.getByText('IRESSA TAB 250MG').click();

    await page.getByLabel(/劑量$/i).fill('250');
    await page.getByLabel(/劑量單位/i).selectOption('mg');
    await page.getByLabel(/頻率/i).selectOption('QD');
    await page.getByLabel(/給藥途徑/i).selectOption('口服 (PO)');
    await page.getByLabel(/用藥線別/i).selectOption('第一線');
    await page.getByLabel(/療程次數/i).fill('1');
    await page.getByLabel(/療程天數/i).fill('D1-28');
    await page.getByLabel(/開始日期/i).fill('2024-02-01');

    // 並且 我點擊儲存按鈕
    await page.getByRole('button', { name: /儲存/i }).click();

    // 那麼 我應該看到成功訊息 "用藥品項已新增"
    await expect(page.getByText('用藥品項已新增')).toBeVisible();

    // 並且 用藥列表應該包含 "IRESSA TAB 250MG"
    await expect(page.getByText('IRESSA TAB 250MG')).toBeVisible();
  });

  /**
   * @bdd-generated: features/treatment/treatment-info.feature#搜尋並選擇藥物
   * @bdd-hash: j6k7l8m9
   */
  test('搜尋並選擇藥物', async ({ page }) => {
    // 當 我在新增用藥品項
    await page.getByRole('button', { name: /新增用藥品項/i }).click();

    // 並且 我在藥物欄位輸入 "IRESSA"
    await page.getByLabel(/藥物/i).click();
    await page.getByPlaceholder(/搜尋藥物/i).fill('IRESSA');

    // 那麼 我應該看到藥物搜尋結果
    await expect(page.getByText('IRESSA TAB 250MG')).toBeVisible();

    // 並且 結果應該包含 "IRESSA TAB 250MG (KC00961100)"
    await expect(page.getByText(/KC00961100/)).toBeVisible();

    // 當 我選擇 "IRESSA TAB 250MG"
    await page.getByText('IRESSA TAB 250MG').click();

    // 那麼 藥物欄位應該顯示 "IRESSA TAB 250MG"
    // 並且 健保碼應該自動填入 "KC00961100"
    await expect(page.getByLabel(/健保碼/i)).toHaveValue('KC00961100');
  });

  // ===========================================================================
  // 放射治療
  // ===========================================================================

  /**
   * @bdd-generated: features/treatment/treatment-info.feature#新增放射治療
   * @bdd-hash: k7l8m9n0
   */
  test('新增放射治療', async ({ page }) => {
    // 當 我點擊 "新增放射治療" 按鈕
    await page.getByRole('button', { name: /新增放射治療/i }).click();

    // 並且 我填寫以下放射治療資料
    await page.getByLabel(/治療類型/i).selectOption('體外放射治療 (EBRT)');
    await page.getByLabel(/治療部位/i).fill('肺部');
    await page.getByLabel(/總劑量/i).fill('6000');
    await page.getByLabel(/劑量單位/i).selectOption('cGy');
    await page.getByLabel(/分次數/i).fill('30');
    await page.getByLabel(/每次劑量/i).fill('200');
    await page.getByLabel(/技術/i).selectOption('IMRT');
    await page.getByLabel(/開始日期/i).fill('2024-02-15');
    await page.getByLabel(/結束日期/i).fill('2024-03-20');

    // 並且 我點擊儲存按鈕
    await page.getByRole('button', { name: /儲存/i }).click();

    // 那麼 我應該看到成功訊息 "放射治療已新增"
    await expect(page.getByText('放射治療已新增')).toBeVisible();
  });

  /**
   * @bdd-generated: features/treatment/treatment-info.feature#自動計算每次劑量
   * @bdd-hash: l8m9n0o1
   */
  test('自動計算每次劑量', async ({ page }) => {
    // 當 我在新增放射治療
    await page.getByRole('button', { name: /新增放射治療/i }).click();

    // 並且 我填寫總劑量為 "6000" cGy
    await page.getByLabel(/總劑量/i).fill('6000');

    // 並且 我填寫分次數為 "30"
    await page.getByLabel(/分次數/i).fill('30');

    // 那麼 每次劑量應該自動計算為 "200" cGy
    await expect(page.getByLabel(/每次劑量/i)).toHaveValue('200');
  });

  // ===========================================================================
  // 劑量計算輔助
  // ===========================================================================

  /**
   * @bdd-generated: features/treatment/treatment-info.feature#依體重計算劑量
   * @bdd-hash: m9n0o1p2
   */
  test('依體重計算劑量', async ({ page }) => {
    // 假設 病人體重為 65.5 kg
    // 當 我在新增用藥品項
    await page.getByRole('button', { name: /新增用藥品項/i }).click();

    // 並且 我選擇劑量計算方式為 "依體重"
    await page.getByLabel(/劑量計算方式/i).selectOption('依體重');

    // 並且 我填寫劑量為 "3 mg/kg"
    await page.getByLabel(/劑量.*mg\/kg/i).fill('3');

    // 那麼 系統應該計算並顯示實際劑量
    await expect(page.getByText(/實際劑量.*196\.5.*mg/)).toBeVisible();
  });

  // ===========================================================================
  // 編輯與刪除
  // ===========================================================================

  /**
   * @bdd-generated: features/treatment/treatment-info.feature#編輯已存在的用藥品項
   * @bdd-hash: n0o1p2q3
   */
  test('編輯已存在的用藥品項', async ({ page }) => {
    // 假設 案件已有一筆用藥品項

    // 當 我點擊該用藥品項的編輯按鈕
    await page.locator('.medication-row').first().getByRole('button', { name: /編輯/i }).click();

    // 並且 我修改劑量為 "300"
    await page.getByLabel(/劑量$/i).fill('300');

    // 並且 我點擊儲存按鈕
    await page.getByRole('button', { name: /儲存/i }).click();

    // 那麼 我應該看到成功訊息 "用藥品項已更新"
    await expect(page.getByText('用藥品項已更新')).toBeVisible();
  });

  /**
   * @bdd-generated: features/treatment/treatment-info.feature#刪除用藥品項
   * @bdd-hash: o1p2q3r4
   */
  test('刪除用藥品項', async ({ page }) => {
    // 假設 案件已有一筆用藥品項

    // 當 我點擊該用藥品項的刪除按鈕
    await page.locator('.medication-row').first().getByRole('button', { name: /刪除/i }).click();

    // 並且 我確認刪除操作
    await page.getByRole('button', { name: /確認/i }).click();

    // 那麼 我應該看到成功訊息 "用藥品項已刪除"
    await expect(page.getByText('用藥品項已刪除')).toBeVisible();
  });

  // ===========================================================================
  // 驗證規則
  // ===========================================================================

  /**
   * @bdd-generated: features/treatment/treatment-info.feature#用藥品項必填欄位驗證
   * @bdd-hash: p2q3r4s5
   */
  test('用藥品項必填欄位驗證', async ({ page }) => {
    // 當 我在新增用藥品項
    await page.getByRole('button', { name: /新增用藥品項/i }).click();

    // 並且 我只填寫藥物名稱
    await page.getByLabel(/藥物/i).click();
    await page.getByText('IRESSA TAB 250MG').click();

    // 並且 我點擊儲存按鈕
    await page.getByRole('button', { name: /儲存/i }).click();

    // 那麼 我應該看到錯誤訊息
    await expect(page.getByText(/劑量為必填/)).toBeVisible();
    await expect(page.getByText(/頻率為必填/)).toBeVisible();
  });

  /**
   * @bdd-generated: features/treatment/treatment-info.feature#日期邏輯驗證
   * @bdd-hash: q3r4s5t6
   */
  test('日期邏輯驗證', async ({ page }) => {
    // 當 我在新增放射治療
    await page.getByRole('button', { name: /新增放射治療/i }).click();

    // 並且 我填寫開始日期為 "2024-03-01"
    await page.getByLabel(/開始日期/i).fill('2024-03-01');

    // 並且 我填寫結束日期為 "2024-02-01"
    await page.getByLabel(/結束日期/i).fill('2024-02-01');

    // 那麼 我應該看到錯誤訊息 "結束日期不得早於開始日期"
    await expect(page.getByText('結束日期不得早於開始日期')).toBeVisible();
  });
});

// ============================================================================
// Manual Tests - Add your custom tests below this line
// ============================================================================
