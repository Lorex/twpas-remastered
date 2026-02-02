/**
 * @file outcome-info.spec.ts
 * @description E2E tests for outcome information management
 * @bdd-generated: features/outcome/outcome-info.feature
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

async function navigateToOutcomeInfo(page: Page, caseId: string = 'CASE-001') {
  await page.goto(`/claims/${caseId}/outcome-info`);
}

// ============================================================================
// BDD Generated Tests
// ============================================================================

test.describe('結果資訊管理 @outcome', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await navigateToOutcomeInfo(page);
  });

  // ===========================================================================
  // 治療後疾病狀態評估
  // ===========================================================================

  /**
   * @bdd-generated: features/outcome/outcome-info.feature#新增治療後疾病狀態評估
   * @bdd-hash: r4s5t6u7
   */
  test('新增治療後疾病狀態評估', async ({ page }) => {
    // 當 我點擊 "新增治療後評估" 按鈕
    await page.getByRole('button', { name: /新增治療後評估/i }).click();

    // 並且 我填寫以下評估資料
    await page.getByLabel(/評估日期/i).fill('2024-03-01');
    await page.getByLabel(/評估標準/i).selectOption('RECIST 1.1');
    await page.getByLabel(/反應類別/i).selectOption('PR (部分反應)');
    await page.getByLabel(/評估說明/i).fill('腫瘤縮小 35%');

    // 並且 我點擊儲存按鈕
    await page.getByRole('button', { name: /儲存/i }).click();

    // 那麼 我應該看到成功訊息 "治療後評估已新增"
    await expect(page.getByText('治療後評估已新增')).toBeVisible();

    // 並且 結果列表應該包含此評估記錄
    await expect(page.getByText('PR (部分反應)')).toBeVisible();
  });

  /**
   * @bdd-generated: features/outcome/outcome-info.feature#RECIST 1.1 反應類別
   * @bdd-hash: s5t6u7v8
   */
  test.describe('RECIST 1.1 反應類別', () => {
    const responseCases = [
      { response: 'CR (完全反應)', description: '所有目標病灶消失' },
      { response: 'PR (部分反應)', description: '目標病灶總和直徑減少至少 30%' },
      { response: 'SD (疾病穩定)', description: '未達 PR 標準且未達 PD 標準' },
      { response: 'PD (疾病惡化)', description: '目標病灶總和直徑增加至少 20%' },
    ];

    for (const { response, description } of responseCases) {
      test(`選擇 ${response}`, async ({ page }) => {
        await page.getByRole('button', { name: /新增治療後評估/i }).click();
        await page.getByLabel(/評估標準/i).selectOption('RECIST 1.1');
        await page.getByLabel(/反應類別/i).selectOption(response);

        // 應該顯示反應說明
        await expect(page.getByText(new RegExp(description.substring(0, 20)))).toBeVisible();
      });
    }
  });

  // ===========================================================================
  // 最佳反應記錄
  // ===========================================================================

  /**
   * @bdd-generated: features/outcome/outcome-info.feature#標記最佳反應
   * @bdd-hash: t6u7v8w9
   */
  test('標記最佳反應', async ({ page }) => {
    // 假設 案件已有多筆評估記錄

    // 當 我在結果資訊頁面
    // 並且 我選擇一筆評估記錄
    await page.locator('.outcome-row').first().click();

    // 並且 我點擊 "標記為最佳反應" 按鈕
    await page.getByRole('button', { name: /標記為最佳反應/i }).click();

    // 那麼 該記錄應該被標記為最佳反應
    await expect(page.locator('.outcome-row').first().getByText(/最佳反應/)).toBeVisible();
  });

  // ===========================================================================
  // 續用申請相關
  // ===========================================================================

  /**
   * @bdd-generated: features/outcome/outcome-info.feature#續用申請需提供治療反應
   * @bdd-hash: u7v8w9x0
   */
  test('續用申請需提供治療反應', async ({ page }) => {
    // 假設 案件的申報類別為 "續用申請"
    await page.goto('/claims/CASE-CONTINUATION/outcome-info');

    // 當 我在結果資訊頁面
    // 那麼 我應該看到提醒訊息 "續用申請需提供治療反應評估"
    await expect(page.getByText('續用申請需提供治療反應評估')).toBeVisible();
  });

  // ===========================================================================
  // 疾病惡化處理
  // ===========================================================================

  /**
   * @bdd-generated: features/outcome/outcome-info.feature#記錄疾病惡化
   * @bdd-hash: v8w9x0y1
   */
  test('記錄疾病惡化', async ({ page }) => {
    // 當 我點擊 "新增治療後評估" 按鈕
    await page.getByRole('button', { name: /新增治療後評估/i }).click();

    // 並且 我選擇反應類別為 "PD (疾病惡化)"
    await page.getByLabel(/評估標準/i).selectOption('RECIST 1.1');
    await page.getByLabel(/反應類別/i).selectOption('PD (疾病惡化)');

    // 並且 我填寫惡化資料
    await page.getByLabel(/惡化類型/i).selectOption('新病灶出現');
    await page.getByLabel(/惡化部位/i).fill('肝臟');
    await page.getByLabel(/惡化說明/i).fill('肝臟發現新轉移病灶');
    await page.getByLabel(/評估日期/i).fill('2024-03-01');

    // 並且 我點擊儲存按鈕
    await page.getByRole('button', { name: /儲存/i }).click();

    // 那麼 我應該看到成功訊息 "治療後評估已新增"
    await expect(page.getByText('治療後評估已新增')).toBeVisible();

    // 並且 應該顯示疾病惡化警示
    await expect(page.getByText(/疾病惡化|PD/)).toBeVisible();
  });

  // ===========================================================================
  // 編輯與刪除
  // ===========================================================================

  /**
   * @bdd-generated: features/outcome/outcome-info.feature#編輯已存在的治療後評估
   * @bdd-hash: w9x0y1z2
   */
  test('編輯已存在的治療後評估', async ({ page }) => {
    // 假設 案件已有一筆治療後評估

    // 當 我點擊該評估的編輯按鈕
    await page.locator('.outcome-row').first().getByRole('button', { name: /編輯/i }).click();

    // 並且 我修改反應類別為 "CR (完全反應)"
    await page.getByLabel(/反應類別/i).selectOption('CR (完全反應)');

    // 並且 我點擊儲存按鈕
    await page.getByRole('button', { name: /儲存/i }).click();

    // 那麼 我應該看到成功訊息 "治療後評估已更新"
    await expect(page.getByText('治療後評估已更新')).toBeVisible();
  });

  /**
   * @bdd-generated: features/outcome/outcome-info.feature#刪除治療後評估
   * @bdd-hash: x0y1z2a3
   */
  test('刪除治療後評估', async ({ page }) => {
    // 假設 案件已有一筆治療後評估

    // 當 我點擊該評估的刪除按鈕
    await page.locator('.outcome-row').first().getByRole('button', { name: /刪除/i }).click();

    // 並且 我確認刪除操作
    await page.getByRole('button', { name: /確認/i }).click();

    // 那麼 我應該看到成功訊息 "治療後評估已刪除"
    await expect(page.getByText('治療後評估已刪除')).toBeVisible();
  });

  // ===========================================================================
  // 驗證規則
  // ===========================================================================

  /**
   * @bdd-generated: features/outcome/outcome-info.feature#治療後評估必填欄位驗證
   * @bdd-hash: y1z2a3b4
   */
  test('治療後評估必填欄位驗證', async ({ page }) => {
    // 當 我在新增治療後評估
    await page.getByRole('button', { name: /新增治療後評估/i }).click();

    // 並且 我只填寫評估日期
    await page.getByLabel(/評估日期/i).fill('2024-03-01');

    // 並且 我點擊儲存按鈕
    await page.getByRole('button', { name: /儲存/i }).click();

    // 那麼 我應該看到錯誤訊息
    await expect(page.getByText(/評估標準為必填/)).toBeVisible();
    await expect(page.getByText(/反應類別為必填/)).toBeVisible();
  });

  /**
   * @bdd-generated: features/outcome/outcome-info.feature#評估日期不得在未來
   * @bdd-hash: z2a3b4c5
   */
  test('評估日期不得在未來', async ({ page }) => {
    // 當 我在新增治療後評估
    await page.getByRole('button', { name: /新增治療後評估/i }).click();

    // 並且 我填寫評估日期為明天的日期
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    await page.getByLabel(/評估日期/i).fill(tomorrowStr);

    // 那麼 我應該看到錯誤訊息 "評估日期不得為未來日期"
    await expect(page.getByText('評估日期不得為未來日期')).toBeVisible();
  });
});

// ============================================================================
// Manual Tests - Add your custom tests below this line
// ============================================================================
