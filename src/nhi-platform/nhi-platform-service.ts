/**
 * @file nhi-platform-service.ts
 * @description 健保平台服務
 */

import type {
  UploadResult,
  ReviewResult,
  NHIPlatformValidationResult,
} from '../lib/types/nhi-platform';

// ============================================================================
// 上傳準備驗證
// ============================================================================

interface UploadReadinessOptions {
  hasValidationErrors: boolean;
  hasFhirBundle: boolean;
  status: string;
}

/**
 * 驗證上傳準備狀態
 */
export function validateUploadReadiness(
  options: UploadReadinessOptions
): NHIPlatformValidationResult {
  const errors: string[] = [];

  if (options.hasValidationErrors) {
    errors.push('案件有驗證錯誤，請先修正');
  }

  if (!options.hasFhirBundle) {
    errors.push('FHIR Bundle 尚未產生');
  }

  if (options.status !== '待送審') {
    errors.push('案件狀態須為「待送審」');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// 檔案名稱生成
// ============================================================================

/**
 * 生成上傳檔案名稱
 */
export function generateUploadFilename(
  caseNumber: string,
  type: 'bundle' | 'attachments'
): string {
  if (type === 'bundle') {
    const timestamp = Date.now();
    return `TWPAS-${caseNumber}-${timestamp}.json`;
  }

  return `TWPAS-${caseNumber}-attachments.zip`;
}

// ============================================================================
// 上傳回應解析
// ============================================================================

interface UploadResponseData {
  success: boolean;
  receiptNumber?: string;
  errorCode?: string;
  errorMessage?: string;
}

/**
 * 解析上傳回應
 */
export function parseUploadResponse(response: UploadResponseData): UploadResult {
  if (response.success) {
    return {
      success: true,
      receiptNumber: response.receiptNumber,
      uploadedAt: new Date().toISOString(),
    };
  }

  return {
    success: false,
    errorCode: response.errorCode,
    errorMessage: response.errorMessage,
  };
}

// ============================================================================
// 審查結果解析
// ============================================================================

/**
 * 解析審查結果
 */
export function parseReviewResult(response: ReviewResult): ReviewResult {
  return {
    status: response.status,
    approvalDate: response.approvalDate,
    approvalItems: response.approvalItems,
    rejectionReason: response.rejectionReason,
    supplementaryItems: response.supplementaryItems,
    expectedCompletionDate: response.expectedCompletionDate,
  };
}

// ============================================================================
// 受理編號格式
// ============================================================================

/**
 * 格式化受理編號
 */
export function formatReceiptNumber(receiptNumber: string): string {
  if (!receiptNumber) {
    return '';
  }

  return receiptNumber;
}
