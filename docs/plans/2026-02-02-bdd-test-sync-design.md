# BDD-to-Test Sync Hook 設計文件

## 概述

建立 Claude Code Hook，當 BDD feature 檔案變動時，自動透過 subagent 生成或更新對應的測試腳本，以利後續 TDD 開發。

## 架構流程

```
Edit/Write .feature 檔案
       ↓
   Post Hook 觸發
       ↓
   啟動 bdd-test-sync subagent
       ↓
   分析變動的 .feature 內容
       ↓
   智慧判斷：Unit Test / E2E / 兩者
       ↓
   生成或合併測試檔案
       ↓
   回報結果給主對話
```

## 規格

| 項目 | 規格 |
|-----|------|
| **觸發時機** | `Edit` / `Write` 工具編輯 `features/**/*.feature` 後 |
| **執行模式** | 同步執行，等待完成後繼續 |
| **測試框架** | Vitest (unit) + Playwright (E2E) |
| **Unit 測試位置** | `src/{module}/__tests__/{name}.test.ts` |
| **E2E 測試位置** | `e2e/{module}/{name}.spec.ts` |
| **測試類型判斷** | Subagent 依場景內容智慧決定 |
| **合併策略** | 透過 `@bdd-generated` + `@bdd-hash` 標記識別，保留手動測試 |

## Hook 設定

### 檔案位置

`.claude/settings.json`

### 設定內容

```json
{
  "hooks": {
    "Edit": {
      "post": [
        {
          "match": "features/**/*.feature",
          "command": "啟動 bdd-test-sync subagent"
        }
      ]
    },
    "Write": {
      "post": [
        {
          "match": "features/**/*.feature",
          "command": "啟動 bdd-test-sync subagent"
        }
      ]
    }
  }
}
```

### 傳遞給 subagent 的資訊

- 被編輯的 `.feature` 檔案路徑
- 變動前後的 diff（用於判斷新增/修改了哪些場景）

## Subagent 設計

### 檔案位置

`.claude/agents/bdd-test-sync.md`

### 核心職責

1. 解析 Gherkin 語法（支援繁體中文關鍵字）
2. 分析場景內容，判斷適合的測試類型
3. 生成或合併測試檔案

### 測試類型判斷邏輯

| 場景特徵 | 測試類型 |
|---------|---------|
| 包含「頁面」「點擊」「看到」「輸入」「導向」等 UI 互動 | Playwright E2E |
| 包含「回傳」「應該等於」「驗證」「計算」「拋出錯誤」等邏輯 | Vitest Unit |
| 包含「API」「請求」「回應」等 | 可能兩者都需要 |
| 無法明確判斷 | 預設生成 E2E（因為 BDD 通常描述使用者行為）|

### 自動生成標記

```typescript
// @bdd-generated: features/auth/login.feature#使用有效帳號密碼登入
// @bdd-hash: a1b2c3d4
describe('使用有效帳號密碼登入', () => {
  // ...
});
```

- `@bdd-generated` - 標記來源 feature 與場景名稱
- `@bdd-hash` - 場景內容的 hash，用於偵測 BDD 是否有變動

## 測試檔案產出範例

### E2E 測試 (`e2e/auth/login.spec.ts`)

```typescript
// @bdd-generated: features/auth/login.feature
import { test, expect } from '@playwright/test';

// @bdd-generated: features/auth/login.feature#使用有效帳號密碼登入
// @bdd-hash: a1b2c3d4
test('使用有效帳號密碼登入', async ({ page }) => {
  // 當 我在登入頁面
  await page.goto('/login');

  // 並且 我輸入帳號 "doctor01"
  await page.getByLabel('帳號').fill('doctor01');

  // 並且 我輸入密碼 "Pass1234!"
  await page.getByLabel('密碼').fill('Pass1234!');

  // 並且 我點擊登入按鈕
  await page.getByRole('button', { name: '登入' }).click();

  // 那麼 我應該看到儀表板頁面
  await expect(page).toHaveURL(/dashboard/);

  // 並且 我應該看到歡迎訊息包含 "doctor01"
  await expect(page.getByText('doctor01')).toBeVisible();
});

// 手動新增的測試會被保留
test('自訂的額外測試案例', async ({ page }) => {
  // 這個不會被覆蓋
});
```

### Unit 測試 (`src/auth/__tests__/login.test.ts`)

```typescript
// @bdd-generated: features/auth/login.feature
import { describe, it, expect } from 'vitest';

// @bdd-generated: features/auth/login.feature#使用停用帳號登入
// @bdd-hash: e5f6g7h8
describe('使用停用帳號登入', () => {
  it('應該回傳帳號已停用錯誤', async () => {
    // TODO: 實作驗證邏輯
    // 假設 資料庫中存在停用的使用者 inactive_user
    // 當 嘗試登入
    // 那麼 應該拋出 "帳號已停用，請聯繫管理員"
  });
});
```

## 智慧合併邏輯

### 處理流程

```
讀取現有測試檔案
       ↓
解析所有 @bdd-generated 標記
       ↓
比對 BDD 場景變動
       ↓
┌─────────────────────────────────────┐
│ 場景新增 → 在檔案末端新增測試        │
│ 場景修改 → 比對 hash，更新該區塊     │
│ 場景刪除 → 移除對應的測試區塊        │
│ 無標記區塊 → 保留不動（手動測試）     │
└─────────────────────────────────────┘
       ↓
寫入更新後的檔案
```

### 合併規則

| 情境 | 處理方式 |
|-----|---------|
| `@bdd-hash` 相同 | 跳過，無需更新 |
| `@bdd-hash` 不同 | 重新生成該測試區塊 |
| 找不到對應標記 | 視為手動新增，保留 |
| BDD 場景被刪除 | 移除對應測試，但加註警告訊息 |

### 警告機制

當刪除自動生成的測試時，subagent 會回報：

```
⚠️ 已移除測試：「使用有效帳號密碼登入」
   原因：對應的 BDD 場景已從 features/auth/login.feature 中刪除
```

## 產出檔案清單

1. `.claude/settings.json` - Hook 設定（更新）
2. `.claude/agents/bdd-test-sync.md` - Subagent 定義

## 實作步驟

1. 建立 `.claude/agents/bdd-test-sync.md` subagent 定義檔
2. 更新 `.claude/settings.json` 加入 hook 設定
3. 測試 hook 觸發與 subagent 執行
