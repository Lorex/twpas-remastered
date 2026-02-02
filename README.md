# TWPAS Remastered - 台灣健保癌症用藥事前審查系統

台灣健保署癌症用藥事前審查 (Prior Authorization System) 的現代化實作，遵循 [TWPAS FHIR IG v1.1.0](https://build.fhir.org/ig/TWNHIFHIR/pas/) 規範。

## 技術堆疊

| 層級 | 技術 |
|------|------|
| Frontend | Next.js 14+ (App Router), Tailwind CSS |
| Backend | Nest.js, TypeScript, Prisma |
| Database | PostgreSQL |
| Authentication | Keycloak (OAuth2/OIDC) |
| FHIR Server | HAPI FHIR |
| Testing | Cucumber (BDD), Jest |

## 專案結構

```
twpas-remastered/
├── apps/
│   ├── web/                    # Next.js 前端
│   └── api/                    # Nest.js 後端
├── libs/
│   ├── shared/                 # 共用型別與工具
│   ├── fhir/                   # FHIR 核心庫
│   └── dto/                    # 共用 DTO
├── prisma/                     # 資料庫 Schema
├── features/                   # Cucumber BDD 特性文件
├── docker/                     # Docker 配置
└── docs/                       # 文件
```

## 功能概覽

### 使用者管理
- 使用者註冊與登入
- OAuth2 (Keycloak) 整合
- 角色權限控制 (RBAC)

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
- HAPI FHIR Server 儲存
- JSON 格式匯出

### 值集管理
- 35+ 健保署定義值集支援
- 值集/代碼系統 CRUD
- 代碼搜尋與驗證

### 健保平台整合
- 調閱 FHIR 資料與附件
- 附件打包 (ZIP)
- 上傳至健保傳輸平台

### 規則引擎
- 疾病與藥物申報規則
- 臨床知識架構
- 藥物申請追蹤

## 開發方式

本專案採用 **BDD (行為驅動開發)** 方式，使用 Cucumber 描述系統行為。

### BDD 特性文件

特性文件位於 `features/` 目錄，按功能模組組織：

```
features/
├── auth/                       # 認證相關 (3 個特性)
│   ├── login.feature           # 使用者登入 (含錯誤處理、會話管理)
│   ├── oauth.feature           # Keycloak OAuth2 整合
│   └── registration.feature    # 使用者註冊
├── patient/                    # 病人管理 (1 個特性)
│   └── patient-management.feature  # CRUD、多條件查詢
├── claim/                      # 申報案件 (2 個特性)
│   ├── claim-crud.feature      # 建立、讀取、更新、刪除
│   └── claim-query.feature     # 多條件查詢、排序、分頁
├── disease-info/               # 疾病資訊 (1 個特性)
│   └── disease-info.feature    # 影像報告、癌症分期、檢查報告
├── genetic-info/               # 基因資訊 (1 個特性)
│   └── genetic-info.feature    # 基因檢測、檢測機構、常見突變
├── assessment/                 # 評估資訊 (1 個特性)
│   └── assessment-info.feature # 檢驗檢查、病人狀態評估 (ECOG/Karnofsky)
├── treatment/                  # 治療資訊 (1 個特性)
│   └── treatment-info.feature  # 用藥品項、放射治療
├── outcome/                    # 結果資訊 (1 個特性)
│   └── outcome-info.feature    # 治療後評估 (RECIST/iRECIST)
├── application/                # 申請項目 (1 個特性)
│   └── application-items.feature # 事前審查申請項目管理
├── fhir/                       # FHIR 整合 (2 個特性)
│   ├── fhir-conversion.feature # 資料轉換為 FHIR Bundle
│   └── fhir-validation.feature # Profile 驗證、業務規則
├── valueset/                   # 值集管理 (1 個特性)
│   └── valueset-management.feature # 值集 CRUD、代碼系統
├── nhi-platform/               # 健保平台整合 (1 個特性)
│   └── nhi-upload.feature      # 調閱、打包、上傳
├── dashboard/                  # 儀表板 (1 個特性)
│   └── dashboard.feature       # 統計卡片、圖表、快速操作
└── support/                    # 測試支援
    ├── world.ts                # 自訂 World 類別
    └── hooks.ts                # Before/After Hooks
```

### 特性標籤 (Tags)

| 標籤 | 說明 |
|------|------|
| `@happy-path` | 正常流程場景 |
| `@error-handling` | 錯誤處理場景 |
| `@validation` | 驗證規則場景 |
| `@api` | 僅需 API 測試 (不需瀏覽器) |
| `@login-required` | 需要預先登入 |
| `@database-seed` | 需要種子資料 |
| `@database-cleanup` | 測試後需清理資料 |
| `@wip` | 開發中功能 |
| `@flaky` | 可能不穩定，允許重試 |

### 執行測試

```bash
# 執行所有 BDD 測試
pnpm test:bdd

# 執行特定特性
pnpm test:bdd --tags @claim

# 執行特定情境
pnpm test:bdd --name "建立新的申報案件"
```

## 快速開始

### 先決條件

- Node.js 20+
- pnpm 8+
- Docker & Docker Compose
- PostgreSQL 16+

### 安裝

```bash
# Clone 專案
git clone https://github.com/your-org/twpas-remastered.git
cd twpas-remastered

# 安裝依賴
pnpm install

# 啟動基礎服務
docker-compose up -d

# 執行資料庫遷移
pnpm db:migrate

# 載入種子資料 (值集)
pnpm db:seed

# 啟動開發伺服器
pnpm dev
```

### 環境變數

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/twpas

# Keycloak
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=twpas
KEYCLOAK_CLIENT_ID=twpas-web
KEYCLOAK_CLIENT_SECRET=your-secret

# HAPI FHIR
FHIR_SERVER_URL=http://localhost:8081/fhir

# NHI Platform
NHI_PLATFORM_URL=https://nhi-platform.nhi.gov.tw
```

## 文件

- [系統設計文件](./docs/design.md)
- [API 文件](./docs/api.md)
- [FHIR 轉換指南](./docs/fhir-mapping.md)
- [值集對照表](./docs/valuesets.md)

## 參考規範

- [TWPAS FHIR IG v1.1.0](https://build.fhir.org/ig/TWNHIFHIR/pas/)
- [HL7 FHIR R4](https://hl7.org/fhir/R4/)
- [台灣健保署事前審查作業規範](https://www.nhi.gov.tw/)

## 授權

MIT License
