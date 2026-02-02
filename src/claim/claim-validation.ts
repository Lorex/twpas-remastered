/**
 * @file claim-validation.ts
 * @description 申報案件驗證邏輯
 */

import type { ClaimValidationData, ClaimStatusValidationResult } from '../lib/types/claim';
import type { ValidationResult } from '../lib/types/common';

// ============================================================================
// 常數定義
// ============================================================================

// 錯誤訊息
const ERROR_MESSAGES = {
  APPLY_TYPE_REQUIRED: '申報類別為必填',
  CASE_TYPE_REQUIRED: '案件類別為必填',
  PRACTITIONER_REQUIRED: '申請醫師為必填',
  WEIGHT_REQUIRED: '體重為必填',
  WEIGHT_INVALID: '體重必須為正數',
  HEIGHT_REQUIRED: '身高為必填',
  HEIGHT_INVALID: '身高必須為正數',
  ORIGINAL_CASE_NUMBER_REQUIRED: '原案件編號為必填',
};

// 需要原案件編號的申報類別
const CONTINUATION_APPLY_TYPES = ['續用申請', '補件', '申覆', '申覆補件'];

// 允許修改/刪除的狀態
const EDITABLE_STATUSES = ['草稿'];

// ============================================================================
// 核心函數
// ============================================================================

/**
 * 驗證申報案件資料
 *
 * 必填欄位:
 * - applyType: 申報類別
 * - caseType: 案件類別
 * - practitioner: 申請醫師
 * - weight: 體重
 * - height: 身高
 *
 * 條件必填:
 * - originalCaseNumber: 續用申請、補件、申覆時必填
 *
 * @param data - 申報案件資料
 * @returns 驗證結果
 */
export function validateClaim(data: ClaimValidationData): ValidationResult {
  const errors: string[] = [];

  // 驗證申報類別
  if (!data.applyType || data.applyType.trim() === '') {
    errors.push(ERROR_MESSAGES.APPLY_TYPE_REQUIRED);
  }

  // 驗證案件類別
  if (!data.caseType || data.caseType.trim() === '') {
    errors.push(ERROR_MESSAGES.CASE_TYPE_REQUIRED);
  }

  // 驗證申請醫師
  if (!data.practitioner || !data.practitioner.id) {
    errors.push(ERROR_MESSAGES.PRACTITIONER_REQUIRED);
  }

  // 驗證體重
  if (data.weight === undefined || data.weight === null) {
    errors.push(ERROR_MESSAGES.WEIGHT_REQUIRED);
  } else if (data.weight <= 0) {
    errors.push(ERROR_MESSAGES.WEIGHT_INVALID);
  }

  // 驗證身高
  if (data.height === undefined || data.height === null) {
    errors.push(ERROR_MESSAGES.HEIGHT_REQUIRED);
  } else if (data.height <= 0) {
    errors.push(ERROR_MESSAGES.HEIGHT_INVALID);
  }

  // 驗證續用案件的原案件編號
  if (data.applyType && CONTINUATION_APPLY_TYPES.includes(data.applyType)) {
    if (!data.originalCaseNumber || data.originalCaseNumber.trim() === '') {
      errors.push(ERROR_MESSAGES.ORIGINAL_CASE_NUMBER_REQUIRED);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 驗證案件狀態是否允許執行操作
 *
 * 規則:
 * - 草稿狀態: 可編輯、可刪除
 * - 待審核狀態: 不可編輯、不可刪除
 * - 其他狀態: 依規則限制
 *
 * @param status - 當前案件狀態
 * @param action - 要執行的操作
 * @returns 狀態驗證結果
 */
export function validateClaimStatus(
  status: string,
  action: string
): ClaimStatusValidationResult {
  const isEditable = EDITABLE_STATUSES.includes(status);

  if (action === 'edit') {
    return {
      allowed: isEditable,
      error: isEditable ? undefined : `${status}狀態的案件不可修改`,
    };
  }

  if (action === 'delete') {
    return {
      allowed: isEditable,
      error: isEditable ? undefined : `${status}狀態的案件不可刪除`,
    };
  }

  // 其他操作預設允許
  return { allowed: true };
}
