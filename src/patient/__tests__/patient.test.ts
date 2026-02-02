/**
 * @file patient.test.ts
 * @description Unit tests for patient validation
 * @bdd-generated: features/patient/patient-management.feature
 *
 * Auto-generated from BDD feature file. Manual tests can be added below the generated section.
 */

import { describe, it, expect } from 'vitest';

import { validatePatient, validateIdNumber } from '../patient-validation';

// ============================================================================
// BDD Generated Tests
// ============================================================================

describe('病人資料驗證', () => {
  /**
   * @bdd-generated: features/patient/patient-management.feature#新增病人時身分證字號格式錯誤
   * @bdd-hash: n3o4p5q6
   */
  describe('身分證字號格式驗證', () => {
    it('有效的身分證字號應該通過驗證', () => {
      expect(validateIdNumber('A123456789')).toBe(true);
      expect(validateIdNumber('F131104093')).toBe(true); // 有效的身分證號
    });

    it('無效格式的身分證字號應該驗證失敗', () => {
      expect(validateIdNumber('INVALID123')).toBe(false);
      expect(validateIdNumber('12345')).toBe(false);
      expect(validateIdNumber('')).toBe(false);
    });

    it('錯誤檢查碼的身分證字號應該驗證失敗', () => {
      expect(validateIdNumber('A123456780')).toBe(false); // 檢查碼錯誤
    });
  });

  /**
   * @bdd-generated: features/patient/patient-management.feature#新增病人缺少必填欄位
   * @bdd-hash: o4p5q6r7
   */
  describe('必填欄位驗證', () => {
    it('缺少姓名應該驗證失敗', () => {
      const result = validatePatient({ mrn: 'MRN001', gender: '男', birthDate: '1980-01-01' });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('姓名為必填欄位');
    });

    it('缺少性別應該驗證失敗', () => {
      const result = validatePatient({ mrn: 'MRN001', name: '王小明', birthDate: '1980-01-01' });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('性別為必填欄位');
    });

    it('缺少出生日期應該驗證失敗', () => {
      const result = validatePatient({ mrn: 'MRN001', name: '王小明', gender: '男' });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('出生日期為必填欄位');
    });

    it('完整資料應該驗證通過', () => {
      const result = validatePatient({
        mrn: 'MRN001',
        name: '王小明',
        gender: '男',
        birthDate: '1980-01-01',
        idNumber: 'A123456789'
      });
      expect(result.valid).toBe(true);
    });
  });

  /**
   * @bdd-generated: features/patient/patient-management.feature#成功新增病人資料
   * @bdd-hash: l1m2n3o4
   */
  describe('病人資料完整性驗證', () => {
    it('有效的病人資料應該通過所有驗證', () => {
      const validPatient = {
        mrn: 'MRN004',
        idNumber: 'A123456789', // 有效的身分證號
        name: '陳美玲',
        gender: '女',
        birthDate: '1985-03-25',
        phone: '0912345678',
        address: '台北市信義區'
      };
      const result = validatePatient(validPatient);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});

// ============================================================================
// Manual Tests - Add your custom tests below this line
// ============================================================================
