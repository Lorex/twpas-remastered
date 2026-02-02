/**
 * @file patient-validation.ts
 * @description 病患資料驗證邏輯
 */

import type { PatientValidationData } from '../lib/types/patient';
import type { ValidationResult } from '../lib/types/common';

// ============================================================================
// 常數定義
// ============================================================================

// 身分證字號首字母對應數值
const LETTER_MAP: Record<string, number> = {
  A: 10, B: 11, C: 12, D: 13, E: 14, F: 15, G: 16, H: 17, I: 34, J: 18,
  K: 19, L: 20, M: 21, N: 22, O: 35, P: 23, Q: 24, R: 25, S: 26, T: 27,
  U: 28, V: 29, W: 32, X: 30, Y: 31, Z: 33
};

// 錯誤訊息
const ERROR_MESSAGES = {
  NAME_REQUIRED: '姓名為必填欄位',
  GENDER_REQUIRED: '性別為必填欄位',
  BIRTHDATE_REQUIRED: '出生日期為必填欄位',
  INVALID_ID_NUMBER: '身分證字號格式錯誤',
};

// ============================================================================
// 核心函數
// ============================================================================

/**
 * 驗證台灣身分證字號
 *
 * 演算法:
 * 1. 格式: 1 字母 + 9 數字
 * 2. 首字母轉數字 (對照 LETTER_MAP)
 * 3. 檢查碼計算:
 *    - 首字母十位數 × 1 + 個位數 × 9
 *    - 第 2-9 位數分別乘以 8, 7, 6, 5, 4, 3, 2, 1
 *    - 總和 + 檢查碼 (第 10 位) 能被 10 整除
 *
 * @param idNumber - 身分證字號
 * @returns 是否有效
 */
export function validateIdNumber(idNumber: string): boolean {
  // 空值檢查
  if (!idNumber || idNumber.trim() === '') {
    return false;
  }

  // 格式檢查: 1 字母 + 9 數字 (第二位可以是 1 或 2，也可以是其他數字用於外籍居民)
  const idRegex = /^[A-Z]\d{9}$/;
  if (!idRegex.test(idNumber.toUpperCase())) {
    return false;
  }

  const upperIdNumber = idNumber.toUpperCase();
  const firstLetter = upperIdNumber[0];
  const letterValue = LETTER_MAP[firstLetter];

  if (letterValue === undefined) {
    return false;
  }

  // 計算檢查碼
  // 首字母轉為兩位數
  const letterTens = Math.floor(letterValue / 10);
  const letterOnes = letterValue % 10;

  // 權重計算
  let sum = letterTens * 1 + letterOnes * 9;

  // 第 2-9 位數字的權重分別為 8, 7, 6, 5, 4, 3, 2, 1
  const weights = [8, 7, 6, 5, 4, 3, 2, 1];
  for (let i = 0; i < 8; i++) {
    sum += parseInt(upperIdNumber[i + 1], 10) * weights[i];
  }

  // 加上檢查碼 (第 10 位)
  const checkDigit = parseInt(upperIdNumber[9], 10);
  sum += checkDigit;

  // 總和能被 10 整除則有效
  return sum % 10 === 0;
}

/**
 * 驗證病患資料
 *
 * 必填欄位:
 * - name: 姓名
 * - gender: 性別
 * - birthDate: 出生日期
 *
 * 可選欄位:
 * - mrn: 病歷號
 * - idNumber: 身分證字號 (若提供需驗證格式)
 * - phone: 電話
 * - address: 地址
 *
 * @param data - 病患資料
 * @returns 驗證結果
 */
export function validatePatient(data: PatientValidationData): ValidationResult {
  const errors: string[] = [];

  // 驗證姓名
  if (!data.name || data.name.trim() === '') {
    errors.push(ERROR_MESSAGES.NAME_REQUIRED);
  }

  // 驗證性別
  if (!data.gender || data.gender.trim() === '') {
    errors.push(ERROR_MESSAGES.GENDER_REQUIRED);
  }

  // 驗證出生日期
  if (!data.birthDate || data.birthDate.trim() === '') {
    errors.push(ERROR_MESSAGES.BIRTHDATE_REQUIRED);
  }

  // 驗證身分證字號 (若有提供)
  if (data.idNumber && data.idNumber.trim() !== '') {
    if (!validateIdNumber(data.idNumber)) {
      errors.push(ERROR_MESSAGES.INVALID_ID_NUMBER);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
