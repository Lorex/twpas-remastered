/**
 * @file patient.ts
 * @description 病患相關型別定義
 */

/**
 * 性別
 */
export type Gender = '男' | '女' | '其他' | '未知';

/**
 * 病患基本資料
 */
export interface Patient {
  mrn: string;              // 病歷號
  idNumber?: string;        // 身分證字號
  name: string;             // 姓名
  gender: Gender;           // 性別
  birthDate: string;        // 出生日期 (ISO 8601)
  phone?: string;           // 電話
  address?: string;         // 地址
}

/**
 * 病患驗證資料 (用於驗證)
 */
export interface PatientValidationData {
  mrn?: string;
  idNumber?: string;
  name?: string;
  gender?: string;
  birthDate?: string;
  phone?: string;
  address?: string;
}
