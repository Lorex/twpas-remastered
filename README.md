# TWPAS Remastered - 台灣健保癌症用藥事前審查系統

台灣健保署癌症用藥事前審查 (Prior Authorization System) 的現代化實作，遵循 [TWPAS FHIR IG v1.1.0](https://build.fhir.org/ig/TWNHIFHIR/pas/) 規範。

## 快速開始

### 使用 Docker (推薦)

```bash
# 啟動服務
docker compose up -d

# 開啟瀏覽器
open http://localhost:3000
```

### 本地開發

```bash
# 安裝依賴
npm install

# 執行單元測試 (304 tests)
npm test

# 執行 E2E 測試
npm run test:e2e

# 啟動 Mock 伺服器
npm run mock-server
```

## 測試帳號

| 帳號 | 密碼 | 角色 |
|------|------|------|
| `doctor01` | `Pass1234!` | 醫師 |
| `pharmacist01` | `Pass1234!` | 藥師 |
| `admin01` | `Pass1234!` | 管理員 |

## 功能概覽

### 使用者管理
- 使用者註冊與登入
- 密碼強度驗證
- 帳號鎖定機制 (5 次失敗後鎖定 15 分鐘)
- OAuth2 (Keycloak) 整合

### 申報資料管理
- 建立、查詢、修改、刪除申報案件
- 多條件篩選 (案件編號、申報類別、案件類別)
- 申報資料驗證

### 癌症用藥申請
- 疾病資訊 (影像報告、癌症分期、檢查報告)
- 基因資訊 (基因檢測、檢測機構)
- 評估資訊 (檢驗檢查、病人狀態評估)
- 治療資訊 (用藥品項、放射治療)
- 結果資訊 (治療後評估)
- 申請項目 (事前審查細項)

### FHIR 整合
- 申報資料轉換為 FHIR Bundle
- 符合 TWPAS Profile 驗證
- JSON 格式匯出

### 健保平台整合
- 調閱 FHIR 資料與附件
- 上傳至健保傳輸平台

## 專案結構

```
twpas-remastered/
├── src/
│   ├── lib/types/          # TypeScript 型別定義
│   ├── auth/               # 認證模組 (註冊、登入)
│   ├── patient/            # 病患驗證 (身分證驗證)
│   ├── claim/              # 案件驗證 (狀態轉換)
│   ├── valueset/           # 值集服務 (代碼管理)
│   ├── fhir/               # FHIR 轉換與驗證
│   ├── disease-info/       # 疾病資訊 (影像、分期)
│   ├── genetic-info/       # 基因檢測 (突變、VAF)
│   ├── treatment/          # 治療資訊 (用藥、放療)
│   ├── outcome/            # 療效評估 (RECIST)
│   ├── assessment/         # 病患評估 (ECOG、Child-Pugh)
│   ├── application/        # 申請項目 (費用計算)
│   ├── nhi-platform/       # 健保平台整合
│   └── dashboard/          # 儀表板服務
├── e2e/                    # E2E 測試 (Playwright)
├── mock-app/               # Mock Web 應用程式
├── features/               # BDD 功能規格 (Gherkin)
├── Dockerfile              # Docker 映像檔
└── docker-compose.yml      # Docker Compose 配置
```

## 測試覆蓋

| 類型 | 測試數量 | 框架 |
|------|---------|------|
| 單元測試 | 304 | Vitest |
| E2E 測試 | 7+ | Playwright |

### 模組測試分布

| 模組 | 測試數 | 說明 |
|------|--------|------|
| assessment | 33 | ECOG、Karnofsky、Child-Pugh 評分 |
| disease-info | 32 | 影像報告、癌症分期驗證 |
| fhir-validation | 29 | FHIR Profile 驗證 |
| fhir-conversion | 28 | FHIR Bundle 轉換 |
| treatment | 25 | 用藥、放療、BSA 計算 |
| outcome | 25 | RECIST 療效評估 |
| genetic-info | 21 | 基因突變、VAF 驗證 |
| application | 19 | 申請項目、費用計算 |
| auth | 18 | 註冊、密碼驗證 |
| dashboard | 15 | 統計、趨勢數據 |
| nhi-platform | 14 | 上傳、回條解析 |
| valueset | 13 | 代碼管理 |
| claim | 12 | 案件驗證、狀態轉換 |
| login | 12 | 登入驗證 |
| patient | 8 | 身分證驗證 |

## 開發方法論

本專案採用 **TDD (Test-Driven Development)** 開發：

```
1. RED    - 撰寫失敗的測試
2. GREEN  - 寫最少程式碼讓測試通過
3. REFACTOR - 重構改善程式碼品質
```

## Mock Web 應用程式

專案包含完整的 Mock Web UI，可用於展示和 E2E 測試：

| 頁面 | 路徑 | 功能 |
|------|------|------|
| 首頁 | `/` | 系統入口 |
| 登入 | `/login` | 帳號登入 |
| 儀表板 | `/dashboard` | 統計數字、快速操作 |
| 案件列表 | `/claim` | 搜尋、篩選、分頁 |
| 新增申請 | `/claim/new` | 多步驟表單 |
| 案件詳情 | `/claim/:id` | 完整資訊 |
| 病患管理 | `/patient` | CRUD 操作 |
| 值集管理 | `/valueset` | 代碼管理 |
| FHIR 轉換 | `/fhir` | Bundle 轉換工具 |
| 健保上傳 | `/nhi-upload` | 批次上傳 |

## NPM 指令

```bash
npm test           # 執行單元測試
npm run test:watch # 監控模式
npm run test:e2e   # 執行 E2E 測試
npm run mock-server # 啟動 Mock 伺服器
```

## Docker 指令

```bash
docker compose up -d      # 啟動服務
docker compose down       # 停止服務
docker compose logs -f    # 查看即時日誌
docker compose restart    # 重啟服務
```

## 參考規範

- [TWPAS FHIR IG v1.1.0](https://build.fhir.org/ig/TWNHIFHIR/pas/)
- [HL7 FHIR R4](https://hl7.org/fhir/R4/)
- [台灣健保署事前審查作業規範](https://www.nhi.gov.tw/)

## 授權

MIT License
