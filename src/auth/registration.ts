/**
 * @file registration.ts
 * @description 使用者註冊驗證邏輯
 */

import type { RegistrationData, PasswordStrengthResult, PasswordValidationResult } from '../lib/types/auth';

// ============================================================================
// 常數定義
// ============================================================================

const MIN_PASSWORD_LENGTH = 8;

// 正則表達式
const REGEX_UPPERCASE = /[A-Z]/;
const REGEX_LOWERCASE = /[a-z]/;
const REGEX_DIGIT = /\d/;
const REGEX_SPECIAL = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
const REGEX_ONLY_DIGITS = /^\d+$/;
const REGEX_ONLY_LETTERS = /^[a-zA-Z]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 錯誤訊息 (必須使用測試要求的確切字串)
const ERROR_MESSAGES = {
  PASSWORD_LENGTH: '密碼必須至少8個字元',
  PASSWORD_UPPERCASE: '密碼必須包含大寫字母',
  PASSWORD_LOWERCASE: '密碼必須包含小寫字母',
  PASSWORD_DIGIT: '密碼必須包含數字',
  PASSWORD_SPECIAL: '密碼必須包含特殊字元',
  PASSWORD_MISMATCH: '確認密碼不一致',
  USERNAME_REQUIRED: 'username 為必填欄位',
  EMAIL_REQUIRED: 'email 為必填欄位',
  EMAIL_INVALID: 'email 格式不正確',
  PASSWORD_REQUIRED: 'password 為必填欄位',
  CONFIRM_PASSWORD_REQUIRED: 'confirmPassword 為必填欄位',
  NAME_REQUIRED: 'name 為必填欄位',
  ROLE_REQUIRED: 'role 為必填欄位',
};

// ============================================================================
// 輔助函數
// ============================================================================

interface PasswordChecks {
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasDigit: boolean;
  hasSpecial: boolean;
  length: number;
}

/**
 * 分析密碼包含的字元類型
 */
function analyzePassword(password: string): PasswordChecks {
  return {
    hasUppercase: REGEX_UPPERCASE.test(password),
    hasLowercase: REGEX_LOWERCASE.test(password),
    hasDigit: REGEX_DIGIT.test(password),
    hasSpecial: REGEX_SPECIAL.test(password),
    length: password.length,
  };
}

// ============================================================================
// 核心函數
// ============================================================================

/**
 * 驗證密碼強度
 *
 * 規則:
 * - weak: 短於8字元 或 純數字 或 純字母
 * - medium: 8+字元 + 數字，但缺少大寫或特殊字元
 * - strong: 8+字元 + 大寫 + 小寫 + 數字 + 特殊字元
 *
 * @param password - 密碼
 * @returns 密碼強度結果
 */
export function validatePasswordStrength(password: string): PasswordStrengthResult {
  const checks = analyzePassword(password);

  // Weak: 長度不足 或 純數字 或 純字母
  if (checks.length < MIN_PASSWORD_LENGTH) {
    return { strength: 'weak' };
  }

  if (REGEX_ONLY_DIGITS.test(password) || REGEX_ONLY_LETTERS.test(password)) {
    return { strength: 'weak' };
  }

  // Strong: 包含所有必要元素
  if (checks.hasUppercase && checks.hasLowercase && checks.hasDigit && checks.hasSpecial) {
    return { strength: 'strong' };
  }

  // Medium: 其他情況 (有數字但缺大寫或特殊字元)
  return { strength: 'medium' };
}

/**
 * 驗證密碼規則
 *
 * 規則:
 * - 至少8個字元
 * - 必須包含大寫字母
 * - 必須包含小寫字母
 * - 必須包含數字
 * - 必須包含特殊字元
 *
 * @param password - 密碼
 * @returns 密碼驗證結果
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  const checks = analyzePassword(password);

  // 檢查長度
  if (checks.length < MIN_PASSWORD_LENGTH) {
    errors.push(ERROR_MESSAGES.PASSWORD_LENGTH);
  }

  // 檢查大寫字母
  if (!checks.hasUppercase) {
    errors.push(ERROR_MESSAGES.PASSWORD_UPPERCASE);
  }

  // 檢查小寫字母
  if (!checks.hasLowercase) {
    errors.push(ERROR_MESSAGES.PASSWORD_LOWERCASE);
  }

  // 檢查數字
  if (!checks.hasDigit) {
    errors.push(ERROR_MESSAGES.PASSWORD_DIGIT);
  }

  // 檢查特殊字元
  if (!checks.hasSpecial) {
    errors.push(ERROR_MESSAGES.PASSWORD_SPECIAL);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 驗證註冊資料
 *
 * 規則:
 * - username: 必填
 * - email: 必填，格式驗證
 * - password: 必填，符合密碼規則
 * - confirmPassword: 必填，與 password 一致
 * - name: 必填
 * - role: 必填
 *
 * @param data - 註冊資料
 * @returns 驗證結果
 */
export function validateRegistration(data: RegistrationData): PasswordValidationResult {
  const errors: string[] = [];

  // 驗證 username
  if (!data.username || data.username.trim() === '') {
    errors.push(ERROR_MESSAGES.USERNAME_REQUIRED);
  }

  // 驗證 email
  if (!data.email || data.email.trim() === '') {
    errors.push(ERROR_MESSAGES.EMAIL_REQUIRED);
  } else if (!EMAIL_REGEX.test(data.email)) {
    errors.push(ERROR_MESSAGES.EMAIL_INVALID);
  }

  // 驗證 password
  if (!data.password) {
    errors.push(ERROR_MESSAGES.PASSWORD_REQUIRED);
  } else {
    // 執行密碼規則驗證
    const passwordValidation = validatePassword(data.password);
    errors.push(...passwordValidation.errors);
  }

  // 驗證 confirmPassword
  if (!data.confirmPassword) {
    errors.push(ERROR_MESSAGES.CONFIRM_PASSWORD_REQUIRED);
  } else if (data.password && data.password !== data.confirmPassword) {
    errors.push(ERROR_MESSAGES.PASSWORD_MISMATCH);
  }

  // 驗證 name
  if (!data.name || data.name.trim() === '') {
    errors.push(ERROR_MESSAGES.NAME_REQUIRED);
  }

  // 驗證 role
  if (!data.role || data.role.trim() === '') {
    errors.push(ERROR_MESSAGES.ROLE_REQUIRED);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
