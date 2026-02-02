/**
 * @file valueset.ts
 * @description 值集相關型別定義
 */

/**
 * 代碼
 */
export interface Code {
  code: string;
  display: string;
  definition?: string;
}

/**
 * 值集
 */
export interface ValueSet {
  id: string;
  name: string;
  version?: string;
  description?: string;
  codes: Code[];
  system?: boolean;  // 是否為系統值集
}

/**
 * 代碼驗證結果
 */
export interface CodeValidationResult {
  valid: boolean;
  display?: string;
  error?: string;
}

/**
 * 搜尋欄位
 */
export type SearchField = 'code' | 'display' | 'all';

/**
 * 值集操作結果
 */
export interface ValueSetOperationResult {
  success: boolean;
  error?: string;
}
