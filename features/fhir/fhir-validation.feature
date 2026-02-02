# language: zh-TW
@fhir @validation
功能: FHIR 資料驗證
  作為一個系統
  我需要驗證 FHIR 資源符合 TWPAS Profile 規範
  以確保申報資料能被健保署系統正確處理

  背景:
    假設 系統已經啟動
    並且 驗證服務已載入所有 TWPAS Profile

  # =============================================================================
  # Claim 驗證
  # =============================================================================

  @claim-validation
  場景: 驗證完整的 Claim 資源
    假設 存在符合規範的 Claim 資源
    當 我驗證此 Claim
    那麼 驗證結果應該為通過
    並且 不應該有任何錯誤

  場景: Claim 缺少必填的 subType
    假設 存在一個 Claim 資源缺少 subType
    當 我驗證此 Claim
    那麼 驗證結果應該為失敗
    並且 錯誤應該包含 "Claim.subType (申報類別) 為必填欄位"

  場景: Claim 缺少必填的 priority
    假設 存在一個 Claim 資源缺少 priority
    當 我驗證此 Claim
    那麼 驗證結果應該為失敗
    並且 錯誤應該包含 "Claim.priority (案件類別) 為必填欄位"

  場景: Claim 缺少必填的 patient reference
    假設 存在一個 Claim 資源缺少 patient
    當 我驗證此 Claim
    那麼 驗證結果應該為失敗
    並且 錯誤應該包含 "Claim.patient 為必填欄位"

  場景: Claim 缺少必填的 enterer reference
    假設 存在一個 Claim 資源缺少 enterer
    當 我驗證此 Claim
    那麼 驗證結果應該為失敗
    並且 錯誤應該包含 "Claim.enterer (申請醫師) 為必填欄位"

  場景: Claim 缺少必填的 encounter extension
    假設 存在一個 Claim 資源缺少 encounter extension
    當 我驗證此 Claim
    那麼 驗證結果應該為失敗
    並且 錯誤應該包含 "Claim.extension:encounter (就醫科別) 為必填欄位"

  # =============================================================================
  # SupportingInfo 驗證
  # =============================================================================

  @supporting-info-validation
  場景: 驗證缺少體重 supportingInfo
    假設 存在一個 Claim 資源缺少 weight supportingInfo
    當 我驗證此 Claim
    那麼 驗證結果應該為失敗
    並且 錯誤應該包含 "supportingInfo:weight (體重) 為必填"

  場景: 驗證缺少身高 supportingInfo
    假設 存在一個 Claim 資源缺少 height supportingInfo
    當 我驗證此 Claim
    那麼 驗證結果應該為失敗
    並且 錯誤應該包含 "supportingInfo:height (身高) 為必填"

  場景: 驗證體重格式 - HTWT constraint
    假設 存在一個 Claim 資源的體重為 "1234.567"
    當 我驗證此 Claim
    那麼 驗證結果應該為失敗
    並且 錯誤應該包含 "體重整數部分不得超過3位數"
    並且 錯誤應該包含 "體重小數部分不得超過2位數"

  場景: 驗證身高格式 - HTWT constraint
    假設 存在一個 Claim 資源的身高為 "1234.567"
    當 我驗證此 Claim
    那麼 驗證結果應該為失敗
    並且 錯誤應該包含 "身高整數部分不得超過3位數"
    並且 錯誤應該包含 "身高小數部分不得超過2位數"

  場景: 驗證 supportingInfo sequence 唯一性
    假設 存在一個 Claim 資源有重複的 supportingInfo sequence
    當 我驗證此 Claim
    那麼 驗證結果應該為失敗
    並且 錯誤應該包含 "supportingInfo.sequence 必須唯一"

  # =============================================================================
  # 業務規則驗證
  # =============================================================================

  @business-rule-validation
  場景: supportingInfo-2 規則 - 一般事前審查需提供影像/檢查/基因
    假設 存在一個一般事前審查 Claim
    並且 診斷代碼不是 C90 或 C92 開頭
    並且 沒有提供 imagingReport、examinationReport 或 geneInfo
    當 我驗證此 Claim
    那麼 驗證結果應該為失敗
    並且 錯誤應該包含 "需提供影像報告、檢查報告、基因資訊中至少一項"

  場景: supportingInfo-2 規則 - 有影像報告則通過
    假設 存在一個一般事前審查 Claim
    並且 診斷代碼不是 C90 或 C92 開頭
    並且 有提供 imagingReport
    當 我驗證此 Claim
    那麼 supportingInfo-2 規則應該通過

  場景: supportingInfo-2 規則 - C90 診斷排除
    假設 存在一個一般事前審查 Claim
    並且 診斷代碼為 "C90.0"
    並且 沒有提供 imagingReport、examinationReport 或 geneInfo
    當 我驗證此 Claim
    那麼 supportingInfo-2 規則應該通過

  場景: supportingInfo-tests-2 規則 - C90 診斷需提供檢驗
    假設 存在一個 Claim
    並且 診斷代碼為 "C90.0"
    並且 沒有提供 tests supportingInfo
    當 我驗證此 Claim
    那麼 驗證結果應該為失敗
    並且 錯誤應該包含 "C90或C92診斷需提供檢驗(查)資訊"

  場景: supportingInfo-tests-2 規則 - C92 診斷需提供檢驗
    假設 存在一個 Claim
    並且 診斷代碼為 "C92.1"
    並且 沒有提供 tests supportingInfo
    當 我驗證此 Claim
    那麼 驗證結果應該為失敗
    並且 錯誤應該包含 "C90或C92診斷需提供檢驗(查)資訊"

  # =============================================================================
  # 值集代碼驗證
  # =============================================================================

  @valueset-validation
  場景: 驗證 subType 使用有效的申報類別代碼
    假設 存在一個 Claim 資源
    並且 subType.coding.code 為 "1"
    當 我驗證此 Claim 的值集代碼
    那麼 subType 驗證應該通過

  場景: 驗證 subType 使用無效的申報類別代碼
    假設 存在一個 Claim 資源
    並且 subType.coding.code 為 "99"
    當 我驗證此 Claim 的值集代碼
    那麼 驗證結果應該為失敗
    並且 錯誤應該包含 "無效的申報類別代碼: 99"

  場景: 驗證 priority 使用有效的案件類別代碼
    假設 存在一個 Claim 資源
    並且 priority.coding.code 為 "1"
    當 我驗證此 Claim 的值集代碼
    那麼 priority 驗證應該通過

  場景: 驗證 priority 使用無效的案件類別代碼
    假設 存在一個 Claim 資源
    並且 priority.coding.code 為 "5"
    當 我驗證此 Claim 的值集代碼
    那麼 驗證結果應該為失敗
    並且 錯誤應該包含 "無效的案件類別代碼: 5"

  # =============================================================================
  # Bundle 驗證
  # =============================================================================

  @bundle-validation
  場景: 驗證完整的 Bundle
    假設 存在符合規範的 Bundle
    當 我驗證此 Bundle
    那麼 驗證結果應該為通過
    並且 不應該有任何錯誤

  場景: Bundle 類型必須為 collection
    假設 存在一個 Bundle 類型為 "document"
    當 我驗證此 Bundle
    那麼 驗證結果應該為失敗
    並且 錯誤應該包含 "Bundle.type 必須為 collection"

  場景: Bundle 必須包含至少 8 個 entry
    假設 存在一個 Bundle 只有 5 個 entry
    當 我驗證此 Bundle
    那麼 驗證結果應該為失敗
    並且 錯誤應該包含 "Bundle 必須包含至少 8 個 entry"

  場景: Bundle 必須包含 Claim
    假設 存在一個 Bundle 缺少 Claim 資源
    當 我驗證此 Bundle
    那麼 驗證結果應該為失敗
    並且 錯誤應該包含 "Bundle 必須包含至少 1 個 Claim 資源"

  場景: Bundle 必須包含 MedicationRequest
    假設 存在一個 Bundle 缺少 MedicationRequest 資源
    當 我驗證此 Bundle
    那麼 驗證結果應該為失敗
    並且 錯誤應該包含 "Bundle 必須包含至少 1 個 MedicationRequest 資源"

  # =============================================================================
  # 補件/申復案件驗證
  # =============================================================================

  @resubmission-validation
  場景: 補件案件需要原受理編號
    假設 存在一個申報類別為 "補件" 的 Claim
    並且 沒有提供原受理編號 (identifier)
    當 我驗證此 Claim
    那麼 驗證結果應該為失敗
    並且 錯誤應該包含 "補件/申復/爭議審議案件需填寫原受理編號"

  場景: 申復案件需要原受理編號
    假設 存在一個申報類別為 "申覆" 的 Claim
    並且 沒有提供原受理編號 (identifier)
    當 我驗證此 Claim
    那麼 驗證結果應該為失敗
    並且 錯誤應該包含 "補件/申復/爭議審議案件需填寫原受理編號"

  場景: 補件案件有原受理編號則通過
    假設 存在一個申報類別為 "補件" 的 Claim
    並且 有提供原受理編號 (identifier)
    當 我驗證此 Claim
    那麼 原受理編號驗證應該通過

  # =============================================================================
  # 驗證報告
  # =============================================================================

  @validation-report
  場景: 產生驗證報告
    當 我驗證案件 "CASE-001" 的 FHIR Bundle
    那麼 系統應該產生驗證報告
    並且 報告應該包含:
      | 項目         |
      | 驗證結果     |
      | 錯誤數量     |
      | 警告數量     |
      | 錯誤詳情     |
      | 警告詳情     |

  場景: 驗證報告顯示錯誤位置
    假設 存在一個有驗證錯誤的 Claim
    當 我驗證此 Claim
    那麼 驗證報告的錯誤應該包含:
      | 欄位       | 說明                   |
      | path       | FHIR 資源路徑          |
      | field      | 業務欄位名稱           |
      | message    | 錯誤訊息               |
      | severity   | 嚴重程度 (error/warning) |

  場景: 區分錯誤與警告
    當 我驗證有問題的 FHIR Bundle
    那麼 驗證報告應該區分:
      | 類型   | 說明                         |
      | error  | 必須修正才能送審             |
      | warning| 建議修正但不影響送審         |
      | info   | 提示資訊                     |
