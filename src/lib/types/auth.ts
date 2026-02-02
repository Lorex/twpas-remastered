/**
 * @file auth.ts
 * @description 認證相關型別定義
 */

/**
 * 使用者狀態
 */
export type UserStatus = '啟用' | '停用';

/**
 * 使用者角色
 */
export type UserRole = '醫師' | '護理師' | '藥師' | '行政人員' | '管理員';

/**
 * 使用者
 */
export interface User {
  username: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  email?: string;
  name?: string;
}

/**
 * 登入結果
 */
export interface LoginResult {
  success: boolean;
  error?: string;
  user?: {
    username: string;
    role: UserRole;
  };
}

/**
 * 註冊資料
 */
export interface RegistrationData {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  role?: string;
}

/**
 * 密碼強度
 */
export type PasswordStrength = 'weak' | 'medium' | 'strong';

/**
 * 密碼強度結果
 */
export interface PasswordStrengthResult {
  strength: PasswordStrength;
}

/**
 * 密碼驗證結果
 */
export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
}
