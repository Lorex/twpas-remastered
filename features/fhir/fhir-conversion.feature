# language: zh-TW
@fhir @conversion
功能: FHIR 資料轉換
  作為一個系統
  我需要將申報資料轉換為 FHIR 標準格式
  以便符合健保署的癌症用藥事前審查 FHIR IG 定義

  背景:
    假設 系統已經啟動
    並且 HAPI FHIR Server 已連線
    並且 存在完整的申報案件 "CASE-001" 包含:
      | 項目         | 內容                       |
      | 病人         | 王小明 (MRN001)            |
      | 申請醫師     | 張醫師 (DOC001)            |
      | 醫療機構     | 台大醫院 (ORG001)          |
      | 申報類別     | 新申請                     |
      | 案件類別     | 癌症標靶治療               |
      | 體重         | 65.5 kg                    |
      | 身高         | 170.0 cm                   |
      | 影像報告     | CT 肺部檢查                |
      | 癌症分期     | AJCC Stage IIIA            |
      | 基因檢測     | EGFR L858R 陽性            |
      | 用藥品項     | Gefitinib 250mg QD         |

  # =============================================================================
  # Claim 轉換
  # =============================================================================

  @claim-conversion
  場景: 轉換申報案件為 FHIR Claim
    當 我轉換案件 "CASE-001" 為 FHIR Claim
    那麼 產生的 Claim 應該符合 "Claim-twpas" Profile
    並且 Claim.meta.profile 應該包含 "https://nhicore.nhi.gov.tw/pas/StructureDefinition/Claim-twpas"
    並且 Claim.status 應該為 "active"
    並且 Claim.type 應該為 "institutional"
    並且 Claim.use 應該為 "preauthorization"

  場景: Claim 的 subType 對應申報類別
    當 我轉換案件 "CASE-001" 為 FHIR Claim
    那麼 Claim.subType 應該包含以下 coding:
      | system                                                         | code | display |
      | https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-apply-type      | 1    | 新申請  |

  場景: Claim 的 priority 對應案件類別
    當 我轉換案件 "CASE-001" 為 FHIR Claim
    那麼 Claim.priority 應該包含以下 coding:
      | system                                                         | code | display      |
      | https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-tmhb-type       | 1    | 一般事前審查 |

  場景: Claim 包含正確的 References
    當 我轉換案件 "CASE-001" 為 FHIR Claim
    那麼 Claim.patient 應該 reference 到 Patient 資源
    並且 Claim.enterer 應該 reference 到 Practitioner 資源
    並且 Claim.provider 應該 reference 到 Organization 資源

  # =============================================================================
  # SupportingInfo 轉換
  # =============================================================================

  @supporting-info
  場景: 轉換體重為 supportingInfo
    當 我轉換案件 "CASE-001" 為 FHIR Claim
    那麼 Claim.supportingInfo 應該包含 weight slice
    並且 weight slice 的 valueQuantity 應該為:
      | value | unit | system                        | code |
      | 65.5  | kg   | http://unitsofmeasure.org     | kg   |

  場景: 轉換身高為 supportingInfo
    當 我轉換案件 "CASE-001" 為 FHIR Claim
    那麼 Claim.supportingInfo 應該包含 height slice
    並且 height slice 的 valueQuantity 應該為:
      | value  | unit | system                        | code |
      | 170.0  | cm   | http://unitsofmeasure.org     | cm   |

  場景: 轉換影像報告為 supportingInfo
    當 我轉換案件 "CASE-001" 為 FHIR Claim
    那麼 Claim.supportingInfo 應該包含 imagingReport slice
    並且 imagingReport slice 應該 valueReference 到 DiagnosticReport 資源

  場景: 轉換癌症分期為 supportingInfo
    當 我轉換案件 "CASE-001" 為 FHIR Claim
    那麼 Claim.supportingInfo 應該包含 cancerStage slice
    並且 cancerStage slice 應該 valueReference 到 Observation 資源

  場景: 轉換基因資訊為 supportingInfo
    當 我轉換案件 "CASE-001" 為 FHIR Claim
    那麼 Claim.supportingInfo 應該包含 geneInfo slice
    並且 geneInfo slice 應該 valueReference 到 Observation 資源

  場景: supportingInfo sequence 應該唯一且連續
    當 我轉換案件 "CASE-001" 為 FHIR Claim
    那麼 所有 supportingInfo.sequence 應該唯一
    並且 sequence 應該從 1 開始連續編號

  # =============================================================================
  # Bundle 轉換
  # =============================================================================

  @bundle-conversion
  場景: 轉換完整案件為 FHIR Bundle
    當 我轉換案件 "CASE-001" 為 FHIR Bundle
    那麼 產生的 Bundle 應該符合 "Bundle-twpas" Profile
    並且 Bundle.type 應該為 "collection"
    並且 Bundle.timestamp 應該為轉換時間

  場景: Bundle 應該包含所有必要的 entry
    當 我轉換案件 "CASE-001" 為 FHIR Bundle
    那麼 Bundle.entry 應該至少包含 8 個資源
    並且 Bundle 應該包含以下資源類型:
      | resourceType      | 數量  |
      | Claim             | 1     |
      | Encounter         | 1     |
      | Patient           | 1     |
      | Practitioner      | >= 1  |
      | Organization      | >= 2  |
      | Coverage          | 1     |
      | MedicationRequest | >= 1  |

  場景: Bundle entry 的 fullUrl 格式
    當 我轉換案件 "CASE-001" 為 FHIR Bundle
    那麼 每個 entry.fullUrl 應該使用 "urn:uuid:" 格式
    並且 所有 fullUrl 應該唯一

  場景: Bundle 內的 Reference 應該使用 fullUrl
    當 我轉換案件 "CASE-001" 為 FHIR Bundle
    那麼 Claim.patient.reference 應該對應到 Patient 的 fullUrl
    並且 所有資源間的 reference 都應該使用 fullUrl

  # =============================================================================
  # 個別資源轉換
  # =============================================================================

  @patient-conversion
  場景: 轉換病人為 FHIR Patient
    當 我轉換病人 "王小明" 為 FHIR Patient
    那麼 產生的 Patient 應該符合 "Patient-twpas" Profile
    並且 Patient.identifier 應該包含病歷號
    並且 Patient.name.text 應該為 "王小明"

  @practitioner-conversion
  場景: 轉換醫師為 FHIR Practitioner
    當 我轉換醫師 "張醫師" 為 FHIR Practitioner
    那麼 產生的 Practitioner 應該符合 "Practitioner-twpas" Profile
    並且 Practitioner.identifier 應該包含醫師證書字號

  @organization-conversion
  場景: 轉換醫療機構為 FHIR Organization
    當 我轉換醫療機構 "台大醫院" 為 FHIR Organization
    那麼 產生的 Organization 應該符合 "Organization-twpas" Profile
    並且 Organization.identifier 應該包含醫事機構代碼

  @medication-request-conversion
  場景: 轉換用藥品項為 FHIR MedicationRequest
    當 我轉換用藥品項為 FHIR MedicationRequest
    那麼 產生的 MedicationRequest 應該符合 "MedicationRequest-apply-twpas" Profile
    並且 MedicationRequest.medicationCodeableConcept 應該包含健保藥品代碼
    並且 MedicationRequest.dosageInstruction 應該包含劑量資訊

  @observation-conversion
  場景: 轉換癌症分期為 FHIR Observation
    當 我轉換癌症分期為 FHIR Observation
    那麼 產生的 Observation 應該符合 "Observation-cancer-stage-twpas" Profile
    並且 Observation.code 應該標示為癌症分期
    並且 Observation.valueCodeableConcept 應該包含分期結果

  @diagnostic-report-conversion
  場景: 轉換影像報告為 FHIR DiagnosticReport
    當 我轉換影像報告為 FHIR DiagnosticReport
    那麼 產生的 DiagnosticReport 應該符合 "DiagnosticReport-image-twpas" Profile
    並且 DiagnosticReport.category 應該標示為影像類型

  # =============================================================================
  # JSON 輸出
  # =============================================================================

  @json-output
  場景: 輸出 FHIR Bundle 為 JSON 格式
    當 我將案件 "CASE-001" 轉換並輸出為 JSON
    那麼 輸出應該為有效的 JSON 格式
    並且 JSON 應該符合 FHIR R4 規範

  場景: 輸出個別資源為 JSON 格式
    當 我將案件 "CASE-001" 的 Claim 輸出為 JSON
    那麼 輸出應該為有效的 JSON 格式
    並且 JSON 中的 resourceType 應該為 "Claim"

  場景: 下載 FHIR Bundle JSON 檔案
    當 我在案件詳情頁面點擊 "匯出 FHIR"
    那麼 系統應該下載一個 JSON 檔案
    並且 檔案名稱應該包含案件編號
    並且 檔案內容應該為完整的 Bundle

  # =============================================================================
  # 儲存至 FHIR Server
  # =============================================================================

  @fhir-server
  場景: 儲存 Bundle 至 HAPI FHIR Server
    當 我將案件 "CASE-001" 的 Bundle 儲存至 FHIR Server
    那麼 FHIR Server 應該回傳成功狀態
    並且 系統應該記錄 Bundle 的 FHIR ID
    並且 所有資源都應該成功建立

  場景: 更新已存在的 FHIR 資源
    假設 案件 "CASE-001" 已有儲存在 FHIR Server 的資源
    當 我修改案件資料並重新儲存
    那麼 FHIR Server 的資源應該被更新
    並且 資源的 versionId 應該增加

  場景: FHIR Server 連線失敗處理
    假設 HAPI FHIR Server 暫時不可用
    當 我嘗試儲存 Bundle 至 FHIR Server
    那麼 系統應該顯示錯誤訊息 "FHIR Server 連線失敗"
    並且 系統應該記錄錯誤日誌
    並且 系統應該提供重試選項
