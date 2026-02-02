/**
 * @file claim-form.test.ts
 * @description Unit tests for claim form validation
 * @bdd-generated: features/claim/claim-form.feature
 *
 * Auto-generated from BDD feature file. Manual tests can be added below the generated section.
 */

import { describe, it, expect } from 'vitest';

// ============================================================================
// Type Definitions
// ============================================================================
interface ClaimFormData {
  visitType?: '門診' | '住院';
  patientName?: string;
  idNumber?: string;
  mrn?: string;
  gender?: string;
  birthDate?: string;
  applyType?: '送核' | '補件' | '申復' | '爭議審議' | '資料異動';
  patientCondition?: string;
  otherConditionDesc?: string;
  diseaseCode?: string;
  applicationItems?: ApplicationItem[];
  physician?: string;
  physicianId?: string;
  medicalNote?: string;
}

interface ApplicationItem {
  drugName?: string;
  drugCode?: string;
  weight?: number;
  dosage?: number;
  quantity?: number;
  startDate?: string;
  endDate?: string;
  surgeryDate?: string;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// ============================================================================
// Validation Functions
// ============================================================================
function validateIdNumber(idNumber: string): boolean {
  if (!idNumber || idNumber.length !== 10) {
    return false;
  }

  const firstChar = idNumber[0].toUpperCase();
  if (!/^[A-Z]$/.test(firstChar)) {
    return false;
  }

  const rest = idNumber.slice(1);
  if (!/^\d{9}$/.test(rest)) {
    return false;
  }

  return true;
}

function validateGender(gender: string): boolean {
  return gender === 'M' || gender === 'F';
}

function validateDateRange(startDate: string, endDate: string): boolean {
  if (!startDate || !endDate) return true;
  const start = new Date(startDate);
  const end = new Date(endDate);
  return end >= start;
}

function validateClaimForm(data: ClaimFormData): ValidationResult {
  const errors: string[] = [];

  // Required field validation
  if (!data.patientName) {
    errors.push('姓名為必填');
  }
  if (!data.idNumber) {
    errors.push('身分證字號為必填');
  } else if (!validateIdNumber(data.idNumber)) {
    errors.push('請填身分證字號共十碼(前一碼為大寫英文字母)');
  }
  if (!data.mrn) {
    errors.push('病歷號為必填');
  }
  if (!data.gender) {
    errors.push('性別為必填');
  } else if (!validateGender(data.gender)) {
    errors.push('請輸入 M / F');
  }
  if (!data.birthDate) {
    errors.push('出生年月日為必填');
  }
  if (!data.applyType) {
    errors.push('申請類別為必填');
  }

  // Conditional validation
  if (data.patientCondition === '其他' && !data.otherConditionDesc) {
    errors.push('其他病況描述為必填');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function validateApplicationItem(item: ApplicationItem): ValidationResult {
  const errors: string[] = [];

  if (item.startDate && item.endDate && !validateDateRange(item.startDate, item.endDate)) {
    errors.push('使用日期訖不得早於使用日期起');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// BDD Generated Tests - DO NOT EDIT MANUALLY
// ============================================================================

describe('癌症用藥事前審查申請表單驗證', () => {
  // ===========================================================================
  // 身分證字號驗證
  // ===========================================================================

  /**
   * @bdd-generated: features/claim/claim-form.feature#身分證字號格式驗證
   * @bdd-hash: 5f6a7b8c
   */
  describe('身分證字號格式驗證', () => {
    it('有效的身分證字號應該通過驗證', () => {
      expect(validateIdNumber('A123456789')).toBe(true);
      expect(validateIdNumber('E125123456')).toBe(true);
    });

    it('無效格式的身分證字號應該驗證失敗', () => {
      expect(validateIdNumber('INVALID')).toBe(false);
      expect(validateIdNumber('12345')).toBe(false);
      expect(validateIdNumber('')).toBe(false);
      expect(validateIdNumber('1234567890')).toBe(false);
    });

    it('長度不足的身分證字號應該驗證失敗', () => {
      expect(validateIdNumber('A12345')).toBe(false);
    });
  });

  // ===========================================================================
  // 性別格式驗證
  // ===========================================================================

  /**
   * @bdd-generated: features/claim/claim-form.feature#性別格式驗證
   * @bdd-hash: 6a7b8c9d
   */
  describe('性別格式驗證', () => {
    it('M 或 F 應該通過驗證', () => {
      expect(validateGender('M')).toBe(true);
      expect(validateGender('F')).toBe(true);
    });

    it('其他值應該驗證失敗', () => {
      expect(validateGender('X')).toBe(false);
      expect(validateGender('男')).toBe(false);
      expect(validateGender('')).toBe(false);
    });
  });

  // ===========================================================================
  // 日期邏輯驗證
  // ===========================================================================

  /**
   * @bdd-generated: features/claim/claim-form.feature#日期邏輯驗證
   * @bdd-hash: 7b8c9d0e
   */
  describe('日期邏輯驗證', () => {
    it('結束日期晚於開始日期應該通過驗證', () => {
      expect(validateDateRange('2026-02-04', '2026-10-04')).toBe(true);
    });

    it('結束日期早於開始日期應該驗證失敗', () => {
      expect(validateDateRange('2026-10-04', '2026-02-04')).toBe(false);
    });

    it('相同日期應該通過驗證', () => {
      expect(validateDateRange('2026-02-04', '2026-02-04')).toBe(true);
    });
  });

  // ===========================================================================
  // 必填欄位驗證
  // ===========================================================================

  /**
   * @bdd-generated: features/claim/claim-form.feature#送出時驗證必填欄位
   * @bdd-hash: 1a2b3c4e
   */
  describe('必填欄位驗證', () => {
    it('空表單應該有多個錯誤', () => {
      const result = validateClaimForm({});

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors).toContain('姓名為必填');
      expect(result.errors).toContain('身分證字號為必填');
      expect(result.errors).toContain('病歷號為必填');
      expect(result.errors).toContain('性別為必填');
    });

    it('完整且有效的表單應該通過驗證', () => {
      const result = validateClaimForm({
        patientName: '測試病人',
        idNumber: 'E125123456',
        mrn: '1234567',
        gender: 'M',
        birthDate: '1995-12-09',
        applyType: '送核',
      });

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('無效身分證字號應該產生錯誤訊息', () => {
      const result = validateClaimForm({
        patientName: '測試病人',
        idNumber: 'INVALID',
        mrn: '1234567',
        gender: 'M',
        birthDate: '1995-12-09',
        applyType: '送核',
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('請填身分證字號共十碼(前一碼為大寫英文字母)');
    });

    it('無效性別應該產生錯誤訊息', () => {
      const result = validateClaimForm({
        patientName: '測試病人',
        idNumber: 'E125123456',
        mrn: '1234567',
        gender: 'X',
        birthDate: '1995-12-09',
        applyType: '送核',
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('請輸入 M / F');
    });
  });

  // ===========================================================================
  // 條件必填驗證
  // ===========================================================================

  /**
   * @bdd-generated: features/claim/claim-form.feature#選擇其他病況時需填寫描述
   * @bdd-hash: 0d1e2f3a
   */
  describe('條件必填驗證', () => {
    it('選擇其他病況但未填描述應該驗證失敗', () => {
      const result = validateClaimForm({
        patientName: '測試病人',
        idNumber: 'E125123456',
        mrn: '1234567',
        gender: 'M',
        birthDate: '1995-12-09',
        applyType: '送核',
        patientCondition: '其他',
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('其他病況描述為必填');
    });

    it('選擇其他病況且有描述應該通過驗證', () => {
      const result = validateClaimForm({
        patientName: '測試病人',
        idNumber: 'E125123456',
        mrn: '1234567',
        gender: 'M',
        birthDate: '1995-12-09',
        applyType: '送核',
        patientCondition: '其他',
        otherConditionDesc: '特殊情況說明',
      });

      expect(result.valid).toBe(true);
    });
  });

  // ===========================================================================
  // 申請品項驗證
  // ===========================================================================

  describe('申請品項驗證', () => {
    it('日期範圍正確的品項應該通過驗證', () => {
      const result = validateApplicationItem({
        drugName: 'Trastuzumab',
        startDate: '2026-02-04',
        endDate: '2026-10-04',
      });

      expect(result.valid).toBe(true);
    });

    it('日期範圍錯誤的品項應該驗證失敗', () => {
      const result = validateApplicationItem({
        drugName: 'Trastuzumab',
        startDate: '2026-10-04',
        endDate: '2026-02-04',
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('使用日期訖不得早於使用日期起');
    });
  });
});

// ============================================================================
// Manual Tests - Add your custom tests below this line
// ============================================================================

// Example:
// describe('Custom Claim Form Tests', () => {
//   it('custom test case', () => {
//     // Your custom test implementation
//   });
// });
