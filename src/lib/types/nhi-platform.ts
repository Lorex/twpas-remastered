/**
 * @file nhi-platform.ts
 * @description 健保平台相關型別定義
 */

/**
 * 上傳狀態
 */
export type UploadStatus =
  | 'pending'
  | 'uploading'
  | 'success'
  | 'failed';

/**
 * 審查狀態
 */
export type ReviewStatus =
  | '審核中'
  | '核准'
  | '駁回'
  | '補件中';

/**
 * 上傳結果
 */
export interface UploadResult {
  success: boolean;
  receiptNumber?: string;
  errorCode?: string;
  errorMessage?: string;
  uploadedAt?: string;
}

/**
 * 審查結果
 */
export interface ReviewResult {
  status: ReviewStatus;
  approvalDate?: string;
  approvalItems?: ApprovalItem[];
  rejectionReason?: string;
  supplementaryItems?: string[];
  expectedCompletionDate?: string;
}

/**
 * 核准項目
 */
export interface ApprovalItem {
  drugCode: string;
  drugName: string;
  approvedQuantity: number;
  approvalExpiryDate: string;
}

/**
 * 上傳紀錄
 */
export interface UploadRecord {
  id: string;
  uploadedAt: string;
  uploadedBy: string;
  status: UploadStatus;
  responseMessage?: string;
  receiptNumber?: string;
}

/**
 * 健保平台驗證結果
 */
export interface NHIPlatformValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}
