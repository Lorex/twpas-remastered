/**
 * @file assessment.test.ts
 * @description 評估資訊模組單元測試
 * @bdd-generated: features/assessment/assessment-info.feature
 */

import { describe, it, expect } from 'vitest';

import {
  validateLabTest,
  validatePatientAssessment,
  getLabResultInterpretation,
  getLoincCode,
  getECOGDescription,
  getKarnofskyDescription,
  calculateChildPughClass,
  validateC90C92LabRequirement,
} from '../assessment-service';

import type { LabTest, PatientAssessment } from '../../lib/types/assessment';

// ============================================================================
// 檢驗檢查驗證
// ============================================================================

describe('檢驗檢查驗證', () => {
  const validLabTest: LabTest = {
    testName: 'CEA (癌胚抗原)',
    loincCode: '2039-6',
    value: 15.5,
    unit: 'ng/mL',
    referenceRangeHigh: 5.0,
    referenceRangeLow: 0.0,
    testDate: '2024-02-01',
    interpretation: '異常 (高)',
  };

  it('應該驗證有效的檢驗檢查', () => {
    const result = validateLabTest(validLabTest);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('缺少檢驗項目名稱應該回傳錯誤', () => {
    const test = { ...validLabTest, testName: '' };
    const result = validateLabTest(test);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('檢驗項目為必填');
  });

  it('缺少數值應該回傳錯誤', () => {
    const test = { ...validLabTest, value: undefined as any };
    const result = validateLabTest(test);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('數值為必填');
  });

  it('缺少檢驗日期應該回傳錯誤', () => {
    const test = { ...validLabTest, testDate: '' };
    const result = validateLabTest(test);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('檢驗日期為必填');
  });

  it('檢驗日期不得為未來日期', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const test = { ...validLabTest, testDate: futureDate.toISOString().split('T')[0] };
    const result = validateLabTest(test);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('檢驗日期不得為未來日期');
  });
});

// ============================================================================
// 檢驗結果判讀
// ============================================================================

describe('檢驗結果判讀', () => {
  it('數值高於上限應該判讀為異常 (高)', () => {
    const interpretation = getLabResultInterpretation(15.5, 0.0, 5.0);
    expect(interpretation).toBe('異常 (高)');
  });

  it('數值低於下限應該判讀為異常 (低)', () => {
    const interpretation = getLabResultInterpretation(0.5, 1.0, 5.0);
    expect(interpretation).toBe('異常 (低)');
  });

  it('數值在正常範圍應該判讀為正常', () => {
    const interpretation = getLabResultInterpretation(3.0, 0.0, 5.0);
    expect(interpretation).toBe('正常');
  });

  it('數值等於上限應該判讀為正常', () => {
    const interpretation = getLabResultInterpretation(5.0, 0.0, 5.0);
    expect(interpretation).toBe('正常');
  });
});

// ============================================================================
// LOINC 代碼
// ============================================================================

describe('腫瘤標記 LOINC 代碼', () => {
  it('CEA 應該對應 2039-6', () => {
    expect(getLoincCode('CEA (癌胚抗原)')).toBe('2039-6');
  });

  it('AFP 應該對應 1834-1', () => {
    expect(getLoincCode('AFP (甲型胎兒蛋白)')).toBe('1834-1');
  });

  it('CA-125 應該對應 10334-1', () => {
    expect(getLoincCode('CA-125')).toBe('10334-1');
  });

  it('CA 19-9 應該對應 24108-3', () => {
    expect(getLoincCode('CA 19-9')).toBe('24108-3');
  });

  it('PSA 應該對應 2857-1', () => {
    expect(getLoincCode('PSA (攝護腺特異抗原)')).toBe('2857-1');
  });
});

// ============================================================================
// 病人狀態評估驗證
// ============================================================================

describe('病人狀態評估驗證', () => {
  const validAssessment: PatientAssessment = {
    assessmentType: 'ECOG 體能狀態',
    assessmentDate: '2024-02-01',
    score: 1,
    description: '可行走，能進行輕度活動',
  };

  it('應該驗證有效的病人狀態評估', () => {
    const result = validatePatientAssessment(validAssessment);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('缺少評估類型應該回傳錯誤', () => {
    const assessment = { ...validAssessment, assessmentType: undefined as any };
    const result = validatePatientAssessment(assessment);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('評估項目為必填');
  });

  it('缺少評估日期應該回傳錯誤', () => {
    const assessment = { ...validAssessment, assessmentDate: '' };
    const result = validatePatientAssessment(assessment);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('評估日期為必填');
  });

  it('評估日期不得為未來日期', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const assessment = { ...validAssessment, assessmentDate: futureDate.toISOString().split('T')[0] };
    const result = validatePatientAssessment(assessment);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('評估日期不得為未來日期');
  });
});

// ============================================================================
// ECOG 體能狀態
// ============================================================================

describe('ECOG 體能狀態說明', () => {
  it('ECOG 0 應該有正確說明', () => {
    expect(getECOGDescription(0)).toBe('完全正常活動，無任何症狀');
  });

  it('ECOG 1 應該有正確說明', () => {
    expect(getECOGDescription(1)).toBe('可行走，能進行輕度活動');
  });

  it('ECOG 2 應該有正確說明', () => {
    expect(getECOGDescription(2)).toBe('可行走，能自理，但無法工作，醒著時間臥床<50%');
  });

  it('ECOG 3 應該有正確說明', () => {
    expect(getECOGDescription(3)).toBe('僅能有限自理，醒著時間臥床>50%');
  });

  it('ECOG 4 應該有正確說明', () => {
    expect(getECOGDescription(4)).toBe('完全失能，無法自理，全天臥床');
  });
});

// ============================================================================
// Karnofsky 體能狀態
// ============================================================================

describe('Karnofsky 體能狀態說明', () => {
  it('Karnofsky 100 應該有正確說明', () => {
    expect(getKarnofskyDescription(100)).toBe('正常，無症狀');
  });

  it('Karnofsky 80 應該有正確說明', () => {
    expect(getKarnofskyDescription(80)).toBe('正常活動但有些吃力，有一些疾病徵兆');
  });

  it('Karnofsky 60 應該有正確說明', () => {
    expect(getKarnofskyDescription(60)).toBe('偶爾需要協助，但能照顧大部分需求');
  });
});

// ============================================================================
// Child-Pugh 分級
// ============================================================================

describe('Child-Pugh 分級計算', () => {
  it('總分 5-6 應該為 Child-Pugh A', () => {
    expect(calculateChildPughClass(5)).toBe('A');
    expect(calculateChildPughClass(6)).toBe('A');
  });

  it('總分 7-9 應該為 Child-Pugh B', () => {
    expect(calculateChildPughClass(7)).toBe('B');
    expect(calculateChildPughClass(9)).toBe('B');
  });

  it('總分 10-15 應該為 Child-Pugh C', () => {
    expect(calculateChildPughClass(10)).toBe('C');
    expect(calculateChildPughClass(15)).toBe('C');
  });
});

// ============================================================================
// C90/C92 診斷需求
// ============================================================================

describe('C90/C92 診斷需提供檢驗資訊', () => {
  it('C90 診斷沒有檢驗應該回傳錯誤', () => {
    const result = validateC90C92LabRequirement({
      diagnosisCode: 'C90.0',
      hasLabTests: false,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('C90/C92 診斷需提供檢驗檢查資料');
  });

  it('C92 診斷沒有檢驗應該回傳錯誤', () => {
    const result = validateC90C92LabRequirement({
      diagnosisCode: 'C92.0',
      hasLabTests: false,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('C90/C92 診斷需提供檢驗檢查資料');
  });

  it('C90 診斷有檢驗應該通過', () => {
    const result = validateC90C92LabRequirement({
      diagnosisCode: 'C90.0',
      hasLabTests: true,
    });
    expect(result.valid).toBe(true);
  });

  it('非 C90/C92 診斷不需要檢驗', () => {
    const result = validateC90C92LabRequirement({
      diagnosisCode: 'C34.1',
      hasLabTests: false,
    });
    expect(result.valid).toBe(true);
  });
});
