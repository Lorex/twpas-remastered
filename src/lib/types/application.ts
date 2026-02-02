/**
 * @file application.ts
 * @description 申請項目相關型別定義
 */

/**
 * 醫令類別
 */
export type OrderCategory =
  | '標靶治療'
  | '免疫治療'
  | '化學治療'
  | '荷爾蒙治療'
  | '其他';

/**
 * 變更原因
 */
export type ChangeReason =
  | '療效不佳'
  | '產生抗藥性'
  | '無法耐受副作用'
  | '疾病惡化'
  | '其他';

/**
 * 申請項目
 */
export interface ApplicationItem {
  id?: string;
  orderCategory: OrderCategory;
  drugCode: string;
  drugName: string;
  quantity: number;
  unit: string;
  durationDays: number;
  indication?: string;
  atcCode?: string;
  unitPrice?: number;
}

/**
 * 申請項目驗證結果
 */
export interface ApplicationValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}
