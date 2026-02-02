/**
 * @file claim.ts
 * @description 申報案件相關型別定義
 */

/**
 * 申報類別
 */
export type ApplyType = '新申請' | '補件' | '申覆' | '爭議審議' | '申覆補件' | '續用申請';

/**
 * 案件類別
 */
export type CaseType = '一般事前審查' | '自主審查' | '緊急報備' | '癌症標靶治療';

/**
 * 案件狀態
 */
export type ClaimStatus = '草稿' | '待審核' | '審核中' | '通過' | '不通過' | '退件';

/**
 * 案件操作
 */
export type ClaimAction = 'edit' | 'delete' | 'submit' | 'approve' | 'reject';

/**
 * 醫療人員參考
 */
export interface PractitionerReference {
  id: string;
  name?: string;
}

/**
 * 病患參考
 */
export interface PatientReference {
  mrn: string;
  name?: string;
}

/**
 * 申報案件驗證資料
 */
export interface ClaimValidationData {
  patient?: PatientReference;
  applyType?: string;
  caseType?: string;
  practitioner?: PractitionerReference;
  originalCaseNumber?: string;
  weight?: number;
  height?: number;
}

/**
 * 案件狀態驗證結果
 */
export interface ClaimStatusValidationResult {
  allowed: boolean;
  error?: string;
}
