/**
 * @file assessment-service.ts
 * @description 評估資訊服務
 */

import type {
  LabTest,
  PatientAssessment,
  AssessmentValidationResult,
  LabResultInterpretation,
  ChildPughClass,
} from '../lib/types/assessment';

import {
  TUMOR_MARKER_LOINC,
  ECOG_DESCRIPTIONS,
  KARNOFSKY_DESCRIPTIONS,
} from '../lib/types/assessment';

// ============================================================================
// 檢驗檢查驗證
// ============================================================================

/**
 * 驗證檢驗檢查
 */
export function validateLabTest(test: LabTest): AssessmentValidationResult {
  const errors: string[] = [];

  if (!test.testName || test.testName.trim() === '') {
    errors.push('檢驗項目為必填');
  }

  if (test.value === undefined || test.value === null) {
    errors.push('數值為必填');
  }

  if (!test.testDate || test.testDate.trim() === '') {
    errors.push('檢驗日期為必填');
  } else {
    // 檢查日期是否為未來日期
    const testDate = new Date(test.testDate);
    testDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (testDate > today) {
      errors.push('檢驗日期不得為未來日期');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// 檢驗結果判讀
// ============================================================================

/**
 * 取得檢驗結果判讀
 */
export function getLabResultInterpretation(
  value: number,
  referenceLow: number,
  referenceHigh: number
): LabResultInterpretation {
  if (value < referenceLow) {
    return '異常 (低)';
  }
  if (value > referenceHigh) {
    return '異常 (高)';
  }
  return '正常';
}

// ============================================================================
// LOINC 代碼
// ============================================================================

/**
 * 取得 LOINC 代碼
 */
export function getLoincCode(testName: string): string | undefined {
  return TUMOR_MARKER_LOINC[testName];
}

// ============================================================================
// 病人狀態評估驗證
// ============================================================================

/**
 * 驗證病人狀態評估
 */
export function validatePatientAssessment(assessment: PatientAssessment): AssessmentValidationResult {
  const errors: string[] = [];

  if (!assessment.assessmentType) {
    errors.push('評估項目為必填');
  }

  if (!assessment.assessmentDate || assessment.assessmentDate.trim() === '') {
    errors.push('評估日期為必填');
  } else {
    // 檢查日期是否為未來日期
    const assessmentDate = new Date(assessment.assessmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (assessmentDate > today) {
      errors.push('評估日期不得為未來日期');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// ECOG 體能狀態
// ============================================================================

/**
 * 取得 ECOG 體能狀態說明
 */
export function getECOGDescription(score: number): string | undefined {
  return ECOG_DESCRIPTIONS[score];
}

// ============================================================================
// Karnofsky 體能狀態
// ============================================================================

/**
 * 取得 Karnofsky 體能狀態說明
 */
export function getKarnofskyDescription(score: number): string | undefined {
  return KARNOFSKY_DESCRIPTIONS[score];
}

// ============================================================================
// Child-Pugh 分級
// ============================================================================

/**
 * 計算 Child-Pugh 分級
 * 總分 5-6: A, 7-9: B, 10-15: C
 */
export function calculateChildPughClass(totalScore: number): ChildPughClass {
  if (totalScore <= 6) {
    return 'A';
  }
  if (totalScore <= 9) {
    return 'B';
  }
  return 'C';
}

// ============================================================================
// C90/C92 診斷需求
// ============================================================================

interface C90C92LabRequirementOptions {
  diagnosisCode: string;
  hasLabTests: boolean;
}

/**
 * 驗證 C90/C92 診斷的檢驗需求
 */
export function validateC90C92LabRequirement(
  options: C90C92LabRequirementOptions
): AssessmentValidationResult {
  const errors: string[] = [];

  const isC90OrC92 =
    options.diagnosisCode.startsWith('C90') ||
    options.diagnosisCode.startsWith('C92');

  if (isC90OrC92 && !options.hasLabTests) {
    errors.push('C90/C92 診斷需提供檢驗檢查資料');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
