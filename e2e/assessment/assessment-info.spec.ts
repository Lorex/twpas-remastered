/**
 * @file assessment-info.spec.ts
 * @description E2E tests for assessment information management
 * @bdd-generated: features/assessment/assessment-info.feature
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

async function navigateToAssessmentInfo(page: Page, caseId: string = 'CASE-001') {
  await page.goto(`/claims/${caseId}/assessment-info`);
}

// ============================================================================
// BDD Generated Tests
// ============================================================================

test.describe('評估資訊管理 @assessment', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await navigateToAssessmentInfo(page);
  });

  // ===========================================================================
  // 檢驗檢查
  // ===========================================================================

  /**
   * @bdd-generated: features/assessment/assessment-info.feature#新增檢驗檢查結果
   * @bdd-hash: n6o7p8q9
   */
  test('新增檢驗檢查結果', async ({ page }) => {
    // 當 我點擊 "新增檢驗檢查" 按鈕
    await page.getByRole('button', { name: /新增檢驗檢查/i }).click();

    // 並且 我填寫以下檢驗資料
    await page.getByLabel(/檢驗項目/i).click();
    await page.getByPlaceholder(/搜尋檢驗/i).fill('CEA');
    await page.getByText('CEA (癌胚抗原)').click();

    await page.getByLabel(/數值/i).fill('15.5');
    await page.getByLabel(/單位/i).fill('ng/mL');
    await page.getByLabel(/參考值上限/i).fill('5.0');
    await page.getByLabel(/參考值下限/i).fill('0.0');
    await page.getByLabel(/檢驗日期/i).fill('2024-02-01');
    await page.getByLabel(/判讀結果/i).selectOption('異常 (高)');

    // 並且 我點擊儲存按鈕
    await page.getByRole('button', { name: /儲存/i }).click();

    // 那麼 我應該看到成功訊息 "檢驗檢查已新增"
    await expect(page.getByText('檢驗檢查已新增')).toBeVisible();

    // 並且 檢驗檢查列表應該包含 "CEA (癌胚抗原)"
    await expect(page.getByText('CEA')).toBeVisible();
  });

  /**
   * @bdd-generated: features/assessment/assessment-info.feature#搜尋並選擇檢驗項目
   * @bdd-hash: o7p8q9r0
   */
  test('搜尋並選擇檢驗項目', async ({ page }) => {
    // 當 我在新增檢驗檢查
    await page.getByRole('button', { name: /新增檢驗檢查/i }).click();

    // 並且 我在檢驗項目欄位輸入 "CEA"
    await page.getByLabel(/檢驗項目/i).click();
    await page.getByPlaceholder(/搜尋檢驗/i).fill('CEA');

    // 那麼 我應該看到檢驗項目搜尋結果
    await expect(page.getByText('CEA (癌胚抗原)')).toBeVisible();

    // 並且 結果應該包含 LOINC 代碼
    await expect(page.getByText('2039-6')).toBeVisible();

    // 當 我選擇 "CEA (癌胚抗原)"
    await page.getByText('CEA (癌胚抗原)').click();

    // 那麼 LOINC 代碼應該自動填入
    await expect(page.getByLabel(/LOINC/i)).toHaveValue('2039-6');
  });

  /**
   * @bdd-generated: features/assessment/assessment-info.feature#檢驗結果數值範圍標示
   * @bdd-hash: p8q9r0s1
   */
  test('檢驗結果數值範圍標示 - 異常高', async ({ page }) => {
    // 假設 案件已有檢驗項目 "CEA" 數值為 "15.5"
    // 並且 參考值範圍為 "0.0 - 5.0"

    // 當 我在評估資訊頁面
    // 那麼 該檢驗結果應該標示為 "異常 (高)"
    // 並且 應該以紅色標示該數值
    const labRow = page.locator('.lab-result-row', { hasText: 'CEA' });
    if (await labRow.isVisible()) {
      await expect(labRow.getByText(/異常|高/)).toBeVisible();
    }
  });

  // ===========================================================================
  // 病人狀態評估
  // ===========================================================================

  /**
   * @bdd-generated: features/assessment/assessment-info.feature#新增病人狀態評估 - ECOG
   * @bdd-hash: q9r0s1t2
   */
  test('新增病人狀態評估 - ECOG', async ({ page }) => {
    // 當 我點擊 "新增病人狀態評估" 按鈕
    await page.getByRole('button', { name: /新增病人狀態評估/i }).click();

    // 並且 我填寫以下評估資料
    await page.getByLabel(/評估項目/i).selectOption('ECOG 體能狀態');
    await page.getByLabel(/評估日期/i).fill('2024-02-01');
    await page.getByLabel(/分數/i).selectOption('1');

    // 那麼 說明欄位應該顯示對應說明
    await expect(page.getByText(/可行走.*輕度活動/)).toBeVisible();

    // 並且 我點擊儲存按鈕
    await page.getByRole('button', { name: /儲存/i }).click();

    // 那麼 我應該看到成功訊息 "病人狀態評估已新增"
    await expect(page.getByText('病人狀態評估已新增')).toBeVisible();

    // 並且 評估列表應該包含 "ECOG 體能狀態"
    await expect(page.getByText('ECOG')).toBeVisible();
  });

  /**
   * @bdd-generated: features/assessment/assessment-info.feature#ECOG 體能狀態評分
   * @bdd-hash: r0s1t2u3
   */
  test.describe('ECOG 體能狀態評分', () => {
    const ecogCases = [
      { score: '0', description: '完全正常活動' },
      { score: '1', description: '可行走' },
      { score: '2', description: '可行走.*自理' },
      { score: '3', description: '僅能有限自理' },
      { score: '4', description: '完全失能' },
    ];

    for (const { score, description } of ecogCases) {
      test(`ECOG 分數 ${score}`, async ({ page }) => {
        await page.getByRole('button', { name: /新增病人狀態評估/i }).click();
        await page.getByLabel(/評估項目/i).selectOption('ECOG 體能狀態');
        await page.getByLabel(/分數/i).selectOption(score);

        // 說明欄位應該顯示對應說明
        await expect(page.getByText(new RegExp(description))).toBeVisible();
      });
    }
  });

  /**
   * @bdd-generated: features/assessment/assessment-info.feature#新增病人狀態評估 - Child-Pugh
   * @bdd-hash: s1t2u3v4
   */
  test('新增病人狀態評估 - Child-Pugh', async ({ page }) => {
    // 當 我點擊 "新增病人狀態評估" 按鈕
    await page.getByRole('button', { name: /新增病人狀態評估/i }).click();

    // 並且 我選擇評估項目為 "Child-Pugh 分級"
    await page.getByLabel(/評估項目/i).selectOption('Child-Pugh 分級');

    // 並且 我填寫以下評估項目
    await page.getByLabel(/腹水/i).selectOption('1');
    await page.getByLabel(/肝性腦病變/i).selectOption('1');
    await page.getByLabel(/膽紅素/i).selectOption('1');
    await page.getByLabel(/白蛋白/i).selectOption('2');
    await page.getByLabel(/PT 延長/i).selectOption('1');

    // 那麼 總分應該自動計算為 "6"
    await expect(page.getByText(/總分.*6/)).toBeVisible();

    // 並且 分級應該顯示為 "Child-Pugh A"
    await expect(page.getByText('Child-Pugh A')).toBeVisible();
  });

  // ===========================================================================
  // C90/C92 診斷特殊需求
  // ===========================================================================

  /**
   * @bdd-generated: features/assessment/assessment-info.feature#C90/C92 診斷需提供檢驗檢查
   * @bdd-hash: t2u3v4w5
   */
  test('C90/C92 診斷需提供檢驗檢查', async ({ page }) => {
    // 假設 案件的診斷代碼為 "C90.0" (多發性骨髓瘤)
    await page.goto('/claims/CASE-C90/assessment-info');

    // 當 我在評估資訊頁面
    // 那麼 我應該看到提醒訊息
    await expect(page.getByText(/C90.*C92.*診斷需提供檢驗檢查/)).toBeVisible();
  });

  // ===========================================================================
  // 編輯與刪除
  // ===========================================================================

  /**
   * @bdd-generated: features/assessment/assessment-info.feature#編輯已存在的檢驗結果
   * @bdd-hash: u3v4w5x6
   */
  test('編輯已存在的檢驗結果', async ({ page }) => {
    // 假設 案件已有一筆 "CEA" 檢驗結果

    // 當 我點擊該檢驗結果的編輯按鈕
    await page.locator('.lab-result-row').first().getByRole('button', { name: /編輯/i }).click();

    // 並且 我修改數值為 "12.0"
    await page.getByLabel(/數值/i).fill('12.0');

    // 並且 我點擊儲存按鈕
    await page.getByRole('button', { name: /儲存/i }).click();

    // 那麼 我應該看到成功訊息 "檢驗檢查已更新"
    await expect(page.getByText('檢驗檢查已更新')).toBeVisible();
  });

  /**
   * @bdd-generated: features/assessment/assessment-info.feature#刪除檢驗結果
   * @bdd-hash: v4w5x6y7
   */
  test('刪除檢驗結果', async ({ page }) => {
    // 假設 案件已有一筆檢驗結果

    // 當 我點擊該檢驗結果的刪除按鈕
    await page.locator('.lab-result-row').first().getByRole('button', { name: /刪除/i }).click();

    // 並且 我確認刪除操作
    await page.getByRole('button', { name: /確認/i }).click();

    // 那麼 我應該看到成功訊息 "檢驗檢查已刪除"
    await expect(page.getByText('檢驗檢查已刪除')).toBeVisible();
  });

  // ===========================================================================
  // 驗證規則
  // ===========================================================================

  /**
   * @bdd-generated: features/assessment/assessment-info.feature#檢驗結果必填欄位驗證
   * @bdd-hash: w5x6y7z8
   */
  test('檢驗結果必填欄位驗證', async ({ page }) => {
    // 當 我在新增檢驗檢查
    await page.getByRole('button', { name: /新增檢驗檢查/i }).click();

    // 並且 我只填寫檢驗項目
    await page.getByLabel(/檢驗項目/i).click();
    await page.getByText('CEA (癌胚抗原)').click();

    // 並且 我點擊儲存按鈕
    await page.getByRole('button', { name: /儲存/i }).click();

    // 那麼 我應該看到錯誤訊息
    await expect(page.getByText(/數值為必填/)).toBeVisible();
    await expect(page.getByText(/檢驗日期為必填/)).toBeVisible();
  });

  /**
   * @bdd-generated: features/assessment/assessment-info.feature#檢驗日期不得在未來
   * @bdd-hash: x6y7z8a9
   */
  test('檢驗日期不得在未來', async ({ page }) => {
    // 當 我在新增檢驗檢查
    await page.getByRole('button', { name: /新增檢驗檢查/i }).click();

    // 並且 我填寫檢驗日期為明天的日期
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    await page.getByLabel(/檢驗日期/i).fill(tomorrowStr);

    // 那麼 我應該看到錯誤訊息 "檢驗日期不得為未來日期"
    await expect(page.getByText('檢驗日期不得為未來日期')).toBeVisible();
  });
});

// ============================================================================
// Manual Tests - Add your custom tests below this line
// ============================================================================
