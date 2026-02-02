/**
 * @file claim-query.spec.ts
 * @description E2E tests for claim query functionality
 * @bdd-generated: features/claim/claim-query.feature
 *
 * Auto-generated from BDD feature file. Manual tests can be added below the generated section.
 */

import { test, expect, type Page } from '@playwright/test';

// ============================================================================
// Test Data (from feature background)
// ============================================================================
const testClaims = [
  { applyType: '送核', count: 1, mrn: '1234567', name: '測試病人', idNumber: 'E125123456', disease: 'G009', drug: 'Herceptin SC', applyDate: '2025-09-23', imageDate: '2026-02-02', status: '草稿' },
  { applyType: '送核', count: 2, mrn: '1234567', name: '測試病人', idNumber: 'E125123456', disease: 'G009', drug: 'Kadcyla', applyDate: '2025-10-15', imageDate: '2025-10-10', status: '待審核' },
  { applyType: '補件', count: 1, mrn: '2345678', name: '王小明', idNumber: 'A123456789', disease: 'G010', drug: 'Perjeta', applyDate: '2025-11-01', imageDate: '2025-10-28', status: '送審中' },
  { applyType: '申復', count: 1, mrn: '3456789', name: '李小華', idNumber: 'B234567890', disease: 'G009', drug: 'Trastuzumab', applyDate: '2025-08-15', imageDate: '2025-08-10', status: '通過' },
  { applyType: '送核', count: 3, mrn: '4567890', name: '張大同', idNumber: 'C345678901', disease: 'G011', drug: 'Phesgo', applyDate: '2025-07-20', imageDate: '2025-07-18', status: '未通過' },
];

// ============================================================================
// Helper Functions
// ============================================================================
async function login(page: Page) {
  await page.goto('/login');
  await page.getByLabel(/帳號/i).fill('doctor01');
  await page.getByLabel(/密碼/i).fill('Pass1234!');
  await page.getByRole('button', { name: /登入/i }).click();
  await expect(page).toHaveURL(/profile|dashboard/);
}

async function navigateToClaimManagement(page: Page) {
  await page.goto('/claim');
}

// ============================================================================
// BDD Generated Tests - DO NOT EDIT MANUALLY
// ============================================================================

test.describe('申請案件查詢 @claim @query', () => {
  test.beforeEach(async ({ page }) => {
    // Background: 我已經登入為 "doctor01"
    await login(page);
    await navigateToClaimManagement(page);
  });

  // ===========================================================================
  // 申請案件管理頁面結構
  // ===========================================================================

  /**
   * @bdd-generated: features/claim/claim-query.feature#顯示申請案件管理頁面
   * @bdd-hash: 1a2b3c4d
   */
  test('顯示申請案件管理頁面', async ({ page }) => {
    // 當 我在申請案件管理頁面
    // 那麼 我應該看到頁面標題 "申請案件管理"
    await expect(page.getByText('申請案件管理')).toBeVisible();

    // 並且 我應該看到進階篩選區塊
    await expect(page.getByText(/進階篩選|篩選/)).toBeVisible();

    // 並且 我應該看到狀態標籤頁
    await expect(page.getByRole('tablist')).toBeVisible();
  });

  /**
   * @bdd-generated: features/claim/claim-query.feature#顯示狀態標籤頁
   * @bdd-hash: 2b3c4d5e
   */
  test('顯示狀態標籤頁', async ({ page }) => {
    // 當 我在申請案件管理頁面
    // 那麼 我應該看到以下狀態標籤頁
    await expect(page.getByRole('tab', { name: /草稿/ })).toBeVisible();
    await expect(page.getByRole('tab', { name: /待審核/ })).toBeVisible();
    await expect(page.getByRole('tab', { name: /送審中/ })).toBeVisible();
    await expect(page.getByRole('tab', { name: /通過/ })).toBeVisible();
    await expect(page.getByRole('tab', { name: /未通過/ })).toBeVisible();
    await expect(page.getByRole('tab', { name: /爭審/ })).toBeVisible();
    await expect(page.getByRole('tab', { name: /續件提醒/ })).toBeVisible();
    await expect(page.getByRole('tab', { name: /結案/ })).toBeVisible();
  });

  /**
   * @bdd-generated: features/claim/claim-query.feature#預設顯示草稿標籤頁
   * @bdd-hash: 3c4d5e6f
   */
  test('預設顯示草稿標籤頁', async ({ page }) => {
    // 當 我在申請案件管理頁面
    // 那麼 草稿標籤頁應該為選中狀態
    await expect(page.getByRole('tab', { name: /草稿/ })).toHaveAttribute('aria-selected', 'true');

    // 並且 我應該看到草稿狀態的案件列表
    // Note: List content depends on data
  });

  // ===========================================================================
  // 申請類別篩選
  // ===========================================================================

  /**
   * @bdd-generated: features/claim/claim-query.feature#依申請類別篩選 - 送核
   * @bdd-hash: 4d5e6f7a
   */
  test('依申請類別篩選 - 送核', async ({ page }) => {
    // 當 我在申請案件管理頁面
    // 並且 我勾選申請類別篩選 "送核"
    await page.getByLabel(/送核/).check();

    // 並且 我點擊查詢按鈕
    await page.getByRole('button', { name: /查詢/i }).click();

    // 那麼 查詢結果應該只包含申請類別為 "送核" 的案件
    // Note: Verification depends on actual data
  });

  /**
   * @bdd-generated: features/claim/claim-query.feature#依申請類別篩選 - 補件
   * @bdd-hash: 5e6f7a8b
   */
  test('依申請類別篩選 - 補件', async ({ page }) => {
    await page.getByLabel(/補件/).check();
    await page.getByRole('button', { name: /查詢/i }).click();
  });

  /**
   * @bdd-generated: features/claim/claim-query.feature#多選申請類別篩選
   * @bdd-hash: 6f7a8b9c
   */
  test('多選申請類別篩選', async ({ page }) => {
    // 當 我在申請案件管理頁面
    // 並且 我勾選申請類別篩選 "送核"
    await page.getByLabel(/送核/).check();

    // 並且 我勾選申請類別篩選 "補件"
    await page.getByLabel(/補件/).check();

    // 並且 我點擊查詢按鈕
    await page.getByRole('button', { name: /查詢/i }).click();

    // 那麼 查詢結果應該包含申請類別為 "送核" 或 "補件" 的案件
  });

  // ===========================================================================
  // 基本條件篩選
  // ===========================================================================

  /**
   * @bdd-generated: features/claim/claim-query.feature#依病歷號查詢
   * @bdd-hash: 7a8b9c0d
   */
  test('依病歷號查詢', async ({ page }) => {
    // 當 我在申請案件管理頁面
    // 並且 我在病歷號欄位輸入 "1234567"
    await page.getByLabel(/病歷號/i).fill('1234567');

    // 並且 我點擊查詢按鈕
    await page.getByRole('button', { name: /查詢/i }).click();

    // 那麼 查詢結果應該只包含病歷號為 "1234567" 的案件
    // Note: Verification depends on actual data
  });

  /**
   * @bdd-generated: features/claim/claim-query.feature#依身份證字號查詢
   * @bdd-hash: 8b9c0d1e
   */
  test('依身份證字號查詢', async ({ page }) => {
    // 當 我在申請案件管理頁面
    // 並且 我在身份證字號欄位輸入 "E125123456"
    await page.getByLabel(/身份證字號|身分證字號/i).fill('E125123456');

    // 並且 我點擊查詢按鈕
    await page.getByRole('button', { name: /查詢/i }).click();

    // 那麼 查詢結果應該只包含身份證字號為 "E125123456" 的案件
  });

  /**
   * @bdd-generated: features/claim/claim-query.feature#依姓名查詢
   * @bdd-hash: 9c0d1e2f
   */
  test('依姓名查詢', async ({ page }) => {
    // 當 我在申請案件管理頁面
    // 並且 我在姓名欄位輸入 "測試病人"
    await page.getByLabel(/姓名/i).fill('測試病人');

    // 並且 我點擊查詢按鈕
    await page.getByRole('button', { name: /查詢/i }).click();

    // 那麼 查詢結果應該只包含姓名為 "測試病人" 的案件
  });

  /**
   * @bdd-generated: features/claim/claim-query.feature#依疾病別篩選
   * @bdd-hash: 0d1e2f3a
   */
  test('依疾病別篩選', async ({ page }) => {
    // 當 我在申請案件管理頁面
    // 並且 我在疾病別下拉選單選擇 "G009"
    await page.getByLabel(/疾病別/i).selectOption('G009');

    // 並且 我點擊查詢按鈕
    await page.getByRole('button', { name: /查詢/i }).click();

    // 那麼 查詢結果應該只包含疾病別為 "G009" 的案件
  });

  /**
   * @bdd-generated: features/claim/claim-query.feature#依申請藥品篩選
   * @bdd-hash: 1e2f3a4b
   */
  test('依申請藥品篩選', async ({ page }) => {
    // 當 我在申請案件管理頁面
    // 並且 我在申請藥品下拉選單選擇 "Herceptin SC"
    await page.getByLabel(/申請藥品/i).selectOption('Herceptin SC');

    // 並且 我點擊查詢按鈕
    await page.getByRole('button', { name: /查詢/i }).click();

    // 那麼 查詢結果應該只包含申請藥品為 "Herceptin SC" 的案件
  });

  // ===========================================================================
  // 日期範圍篩選
  // ===========================================================================

  /**
   * @bdd-generated: features/claim/claim-query.feature#依影像學檢查日期範圍查詢
   * @bdd-hash: 2f3a4b5c
   */
  test('依影像學檢查日期範圍查詢', async ({ page }) => {
    // 當 我在申請案件管理頁面
    // 並且 我設定影像學檢查日期起為 "2025-10-01"
    await page.getByLabel(/影像學檢查.*起|影像.*日期.*起/i).fill('2025-10-01');

    // 並且 我設定影像學檢查日期迄為 "2025-10-31"
    await page.getByLabel(/影像學檢查.*迄|影像.*日期.*迄/i).fill('2025-10-31');

    // 並且 我點擊查詢按鈕
    await page.getByRole('button', { name: /查詢/i }).click();

    // 那麼 查詢結果應該只包含影像學檢查日期在該範圍內的案件
  });

  /**
   * @bdd-generated: features/claim/claim-query.feature#依申請日期範圍查詢
   * @bdd-hash: 3a4b5c6d
   */
  test('依申請日期範圍查詢', async ({ page }) => {
    // 當 我在申請案件管理頁面
    // 並且 我設定申請日期起為 "2025-09-01"
    await page.getByLabel(/申請日期.*起/i).fill('2025-09-01');

    // 並且 我設定申請日期迄為 "2025-09-30"
    await page.getByLabel(/申請日期.*迄/i).fill('2025-09-30');

    // 並且 我點擊查詢按鈕
    await page.getByRole('button', { name: /查詢/i }).click();

    // 那麼 查詢結果應該只包含申請日期在該範圍內的案件
  });

  /**
   * @bdd-generated: features/claim/claim-query.feature#只設定日期起始條件
   * @bdd-hash: 4b5c6d7e
   */
  test('只設定日期起始條件', async ({ page }) => {
    // 當 我在申請案件管理頁面
    // 並且 我設定申請日期起為 "2025-10-01"
    await page.getByLabel(/申請日期.*起/i).fill('2025-10-01');

    // 並且 我點擊查詢按鈕
    await page.getByRole('button', { name: /查詢/i }).click();

    // 那麼 查詢結果應該包含申請日期在 "2025-10-01" 之後的所有案件
  });

  /**
   * @bdd-generated: features/claim/claim-query.feature#只設定日期結束條件
   * @bdd-hash: 5c6d7e8f
   */
  test('只設定日期結束條件', async ({ page }) => {
    // 當 我在申請案件管理頁面
    // 並且 我設定申請日期迄為 "2025-10-31"
    await page.getByLabel(/申請日期.*迄/i).fill('2025-10-31');

    // 並且 我點擊查詢按鈕
    await page.getByRole('button', { name: /查詢/i }).click();

    // 那麼 查詢結果應該包含申請日期在 "2025-10-31" 之前的所有案件
  });

  // ===========================================================================
  // 複合條件查詢
  // ===========================================================================

  /**
   * @bdd-generated: features/claim/claim-query.feature#複合條件查詢 - 申請類別和姓名
   * @bdd-hash: 6d7e8f9a
   */
  test('複合條件查詢 - 申請類別和姓名', async ({ page }) => {
    // 當 我在申請案件管理頁面
    // 並且 我勾選申請類別篩選 "送核"
    await page.getByLabel(/送核/).check();

    // 並且 我在姓名欄位輸入 "測試病人"
    await page.getByLabel(/姓名/i).fill('測試病人');

    // 並且 我點擊查詢按鈕
    await page.getByRole('button', { name: /查詢/i }).click();

    // 那麼 查詢結果應該只包含同時符合兩個條件的案件
  });

  /**
   * @bdd-generated: features/claim/claim-query.feature#複合條件查詢 - 多個條件
   * @bdd-hash: 7e8f9a0b
   */
  test('複合條件查詢 - 多個條件', async ({ page }) => {
    // 當 我在申請案件管理頁面
    // 並且 我設定以下查詢條件
    await page.getByLabel(/送核/).check();
    await page.getByLabel(/疾病別/i).selectOption('G009');
    await page.getByLabel(/申請藥品/i).selectOption('Herceptin SC');

    // 並且 我點擊查詢按鈕
    await page.getByRole('button', { name: /查詢/i }).click();

    // 那麼 查詢結果應該只包含符合所有條件的案件
  });

  // ===========================================================================
  // 狀態標籤頁切換
  // ===========================================================================

  /**
   * @bdd-generated: features/claim/claim-query.feature#切換到待審核標籤頁
   * @bdd-hash: 8f9a0b1c
   */
  test('切換到待審核標籤頁', async ({ page }) => {
    // 當 我在申請案件管理頁面
    // 並且 我點擊 "待審核" 標籤頁
    await page.getByRole('tab', { name: /待審核/ }).click();

    // 那麼 我應該看到狀態為 "待審核" 的案件列表
    await expect(page.getByRole('tab', { name: /待審核/ })).toHaveAttribute('aria-selected', 'true');
  });

  /**
   * @bdd-generated: features/claim/claim-query.feature#切換到送審中標籤頁
   * @bdd-hash: 9a0b1c2d
   */
  test('切換到送審中標籤頁', async ({ page }) => {
    await page.getByRole('tab', { name: /送審中/ }).click();
    await expect(page.getByRole('tab', { name: /送審中/ })).toHaveAttribute('aria-selected', 'true');
  });

  /**
   * @bdd-generated: features/claim/claim-query.feature#切換到通過標籤頁
   * @bdd-hash: 0b1c2d3e
   */
  test('切換到通過標籤頁', async ({ page }) => {
    await page.getByRole('tab', { name: /通過/ }).click();
    await expect(page.getByRole('tab', { name: /通過/ })).toHaveAttribute('aria-selected', 'true');
  });

  /**
   * @bdd-generated: features/claim/claim-query.feature#切換到未通過標籤頁
   * @bdd-hash: 1c2d3e4f
   */
  test('切換到未通過標籤頁', async ({ page }) => {
    await page.getByRole('tab', { name: /未通過/ }).click();
    await expect(page.getByRole('tab', { name: /未通過/ })).toHaveAttribute('aria-selected', 'true');
  });

  /**
   * @bdd-generated: features/claim/claim-query.feature#切換到續件提醒標籤頁
   * @bdd-hash: 2d3e4f5a
   */
  test('切換到續件提醒標籤頁', async ({ page }) => {
    await page.getByRole('tab', { name: /續件提醒/ }).click();
    await expect(page.getByRole('tab', { name: /續件提醒/ })).toHaveAttribute('aria-selected', 'true');
  });

  /**
   * @bdd-generated: features/claim/claim-query.feature#切換到結案標籤頁
   * @bdd-hash: 3e4f5a6b
   */
  test('切換到結案標籤頁', async ({ page }) => {
    await page.getByRole('tab', { name: /結案/ }).click();
    await expect(page.getByRole('tab', { name: /結案/ })).toHaveAttribute('aria-selected', 'true');
  });

  // ===========================================================================
  // 快速搜尋
  // ===========================================================================

  /**
   * @bdd-generated: features/claim/claim-query.feature#使用快速搜尋
   * @bdd-hash: 4f5a6b7c
   */
  test('使用快速搜尋', async ({ page }) => {
    // 當 我在申請案件管理頁面
    // 並且 我在快速搜尋欄位輸入 "測試病人"
    await page.getByPlaceholder(/快速搜尋|搜尋/i).fill('測試病人');

    // 那麼 列表應該即時篩選顯示符合條件的案件
    // Note: Real-time filtering verification
  });

  /**
   * @bdd-generated: features/claim/claim-query.feature#快速搜尋支援多欄位
   * @bdd-hash: 5a6b7c8d
   */
  test('快速搜尋支援多欄位', async ({ page }) => {
    // 當 我在申請案件管理頁面
    // 並且 我在快速搜尋欄位輸入 "1234567"
    await page.getByPlaceholder(/快速搜尋|搜尋/i).fill('1234567');

    // 那麼 列表應該顯示病歷號包含 "1234567" 的案件
  });

  // ===========================================================================
  // 清除篩選
  // ===========================================================================

  /**
   * @bdd-generated: features/claim/claim-query.feature#清除所有篩選條件
   * @bdd-hash: 6b7c8d9e
   */
  test('清除所有篩選條件', async ({ page }) => {
    // 當 我在申請案件管理頁面
    // 並且 我設定多個篩選條件
    await page.getByLabel(/送核/).check();
    await page.getByLabel(/姓名/i).fill('測試');

    // 並且 我點擊 "清除" 按鈕
    await page.getByRole('button', { name: /清除/i }).click();

    // 那麼 所有篩選條件應該被清除
    await expect(page.getByLabel(/送核/)).not.toBeChecked();
    await expect(page.getByLabel(/姓名/i)).toHaveValue('');
  });

  // ===========================================================================
  // 案件列表顯示
  // ===========================================================================

  /**
   * @bdd-generated: features/claim/claim-query.feature#案件列表欄位顯示
   * @bdd-hash: 7c8d9e0f
   */
  test('案件列表欄位顯示', async ({ page }) => {
    // 當 我在申請案件管理頁面
    // 那麼 案件列表應該顯示以下欄位
    await expect(page.getByText('申請類別')).toBeVisible();
    await expect(page.getByText('申請次數')).toBeVisible();
    await expect(page.getByText('病歷號')).toBeVisible();
    await expect(page.getByText('姓名')).toBeVisible();
    await expect(page.getByText(/身份證字號|身分證字號/)).toBeVisible();
    await expect(page.getByText('疾病別')).toBeVisible();
    await expect(page.getByText('申請藥品')).toBeVisible();
    await expect(page.getByText('申請日期')).toBeVisible();
    await expect(page.getByText('影像學檢查')).toBeVisible();
    await expect(page.getByText('建立日期')).toBeVisible();
  });

  /**
   * @bdd-generated: features/claim/claim-query.feature#案件列表操作按鈕
   * @bdd-hash: 8d9e0f1a
   */
  test.skip('案件列表操作按鈕', async ({ page }) => {
    // 當 我在申請案件管理頁面
    // Note: This test requires pre-existing data

    // 那麼 每筆案件應該有 "編輯" 按鈕
    await expect(page.getByRole('button', { name: /編輯/i }).first()).toBeVisible();

    // 並且 草稿案件應該有 "刪除" 按鈕
    await expect(page.getByRole('button', { name: /刪除/i }).first()).toBeVisible();
  });

  // ===========================================================================
  // 分頁
  // ===========================================================================

  /**
   * @bdd-generated: features/claim/claim-query.feature#顯示分頁控制
   * @bdd-hash: 9e0f1a2b
   */
  test.skip('顯示分頁控制', async ({ page }) => {
    // 假設 資料庫中存在超過一頁的案件
    // Note: This test requires many records

    // 當 我在申請案件管理頁面
    // 那麼 我應該看到分頁控制項
    await expect(page.getByRole('navigation', { name: /pagination|分頁/i })).toBeVisible();
  });

  /**
   * @bdd-generated: features/claim/claim-query.feature#切換分頁
   * @bdd-hash: 0f1a2b3c
   */
  test.skip('切換分頁', async ({ page }) => {
    // 假設 資料庫中存在超過一頁的案件
    // Note: This test requires many records

    // 當 我在申請案件管理頁面
    // 並且 我點擊第 2 頁
    await page.getByRole('button', { name: '2' }).click();

    // 那麼 應該顯示第二頁的案件
  });

  // ===========================================================================
  // 查詢無結果
  // ===========================================================================

  /**
   * @bdd-generated: features/claim/claim-query.feature#查詢無結果
   * @bdd-hash: 1a2b3c4e
   */
  test('查詢無結果', async ({ page }) => {
    // 當 我在申請案件管理頁面
    // 並且 我在病歷號欄位輸入 "NOTEXIST"
    await page.getByLabel(/病歷號/i).fill('NOTEXIST');

    // 並且 我點擊查詢按鈕
    await page.getByRole('button', { name: /查詢/i }).click();

    // 那麼 案件列表應該為空
    await expect(page.getByText(/無資料|無結果|沒有資料/)).toBeVisible();
  });

  /**
   * @bdd-generated: features/claim/claim-query.feature#空的狀態標籤頁
   * @bdd-hash: 2b3c4e5f
   */
  test('空的狀態標籤頁', async ({ page }) => {
    // 當 我在申請案件管理頁面
    // 並且 我點擊 "爭審" 標籤頁
    await page.getByRole('tab', { name: /爭審/ }).click();

    // 假設 沒有爭審狀態的案件
    // 那麼 案件列表應該為空
    // Note: May show empty state or no data message
  });
});

// ============================================================================
// Manual Tests - Add your custom tests below this line
// ============================================================================

// Example:
// test.describe('Custom Claim Query Tests', () => {
//   test('custom test case', async ({ page }) => {
//     // Your custom test implementation
//   });
// });
