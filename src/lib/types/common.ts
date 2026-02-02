/**
 * @file common.ts
 * @description 共用型別定義
 */

/**
 * 通用驗證結果介面
 */
export interface ValidationResult<T = unknown> {
  valid: boolean;
  errors: string[];
  data?: T;
}

/**
 * 服務操作結果
 */
export interface OperationResult<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}

/**
 * 分頁參數
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 分頁結果
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
