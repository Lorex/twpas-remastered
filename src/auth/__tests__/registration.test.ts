/**
 * @file registration.test.ts
 * @description Unit tests for user registration validation
 * @bdd-generated: features/auth/registration.feature
 *
 * Auto-generated from BDD feature file. Manual tests can be added below the generated section.
 */

import { describe, it, expect } from 'vitest';

import { validatePassword, validatePasswordStrength, validateRegistration } from '../registration';

// ============================================================================
// BDD Generated Tests
// ============================================================================

describe('使用者註冊驗證', () => {
  /**
   * @bdd-generated: features/auth/registration.feature#密碼強度驗證
   * @bdd-hash: k6f7g8h9
   */
  describe('密碼強度驗證', () => {
    const passwordCases = [
      { password: '123456', expectedStrength: 'weak', shouldPass: false },
      { password: 'password', expectedStrength: 'weak', shouldPass: false },
      { password: 'Password1', expectedStrength: 'medium', shouldPass: false },
      { password: 'Password1!', expectedStrength: 'strong', shouldPass: true },
      { password: 'SecurePass123!', expectedStrength: 'strong', shouldPass: true },
    ];

    passwordCases.forEach(({ password, expectedStrength, shouldPass }) => {
      it(`密碼 "${password}" 強度應為 "${expectedStrength}"`, () => {
        const result = validatePasswordStrength(password);
        expect(result.strength).toBe(expectedStrength);
      });

      it(`密碼 "${password}" 驗證結果應為 ${shouldPass ? '通過' : '不通過'}`, () => {
        const result = validatePassword(password);
        expect(result.valid).toBe(shouldPass);
      });
    });
  });

  /**
   * @bdd-generated: features/auth/registration.feature#註冊時密碼不符合規則
   * @bdd-hash: i4d5e6f7
   */
  describe('密碼規則驗證', () => {
    it('密碼長度不足應該驗證失敗', () => {
      const result = validatePassword('weak');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('密碼必須至少8個字元');
    });

    it('密碼必須包含大小寫字母', () => {
      const result = validatePassword('password123');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('密碼必須包含大寫字母');
    });

    it('密碼必須包含數字', () => {
      const result = validatePassword('Password!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('密碼必須包含數字');
    });

    it('密碼必須包含特殊字元', () => {
      const result = validatePassword('Password123');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('密碼必須包含特殊字元');
    });
  });

  /**
   * @bdd-generated: features/auth/registration.feature#註冊時確認密碼不一致
   * @bdd-hash: j5e6f7g8
   */
  describe('確認密碼驗證', () => {
    it('確認密碼不一致應該驗證失敗', () => {
      const result = validateRegistration({
        password: 'SecurePass123!',
        confirmPassword: 'DifferentPass123!'
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('確認密碼不一致');
    });

    it('確認密碼一致應該驗證通過', () => {
      const result = validateRegistration({
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!'
      });
      expect(result.errors.filter(e => e.includes('確認密碼'))).toHaveLength(0);
    });
  });

  /**
   * @bdd-generated: features/auth/registration.feature#成功註冊新帳號
   * @bdd-hash: f1a2b3c4
   */
  describe('完整註冊資料驗證', () => {
    it('完整且有效的註冊資料應該驗證通過', () => {
      const result = validateRegistration({
        username: 'new_doctor',
        email: 'doctor@hospital.tw',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
        name: '王大明',
        role: '醫師'
      });
      expect(result.valid).toBe(true);
    });

    it('缺少必填欄位應該驗證失敗', () => {
      const result = validateRegistration({
        username: 'new_doctor'
      });
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});

// ============================================================================
// Manual Tests - Add your custom tests below this line
// ============================================================================
