/**
 * @file outcome-service.ts
 * @description 結果資訊服務
 */

import type {
  TreatmentResponse,
  TargetLesion,
  OutcomeValidationResult,
  RECISTResponse,
} from '../lib/types/outcome';

import {
  RECIST_RESPONSE_DESCRIPTIONS,
  RESPONSE_PRIORITY,
} from '../lib/types/outcome';

// ============================================================================
// 治療後評估驗證
// ============================================================================

/**
 * 驗證治療後評估
 */
export function validateTreatmentResponse(response: TreatmentResponse): OutcomeValidationResult {
  const errors: string[] = [];

  if (!response.assessmentDate || response.assessmentDate.trim() === '') {
    errors.push('評估日期為必填');
  }

  if (!response.criteria) {
    errors.push('評估標準為必填');
  }

  if (!response.response) {
    errors.push('反應類別為必填');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// RECIST 反應說明
// ============================================================================

/**
 * 取得反應說明
 */
export function getResponseDescription(response: RECISTResponse): string {
  return RECIST_RESPONSE_DESCRIPTIONS[response] || '';
}

// ============================================================================
// 病灶變化計算
// ============================================================================

/**
 * 計算病灶變化百分比
 */
export function calculatePercentChange(lesions: TargetLesion[]): number {
  if (lesions.length === 0) {
    return 0;
  }

  const baselineSum = lesions.reduce((sum, l) => sum + l.baselineValue, 0);
  const currentSum = lesions.reduce((sum, l) => sum + l.currentValue, 0);

  if (baselineSum === 0) {
    return 0;
  }

  return ((currentSum - baselineSum) / baselineSum) * 100;
}

// ============================================================================
// 反應建議
// ============================================================================

/**
 * 根據變化百分比建議反應類別
 */
export function suggestResponse(percentChange: number): RECISTResponse {
  if (percentChange === -100) {
    return 'CR (完全反應)';
  }
  if (percentChange <= -30) {
    return 'PR (部分反應)';
  }
  if (percentChange >= 20) {
    return 'PD (疾病惡化)';
  }
  return 'SD (疾病穩定)';
}

// ============================================================================
// 最佳反應
// ============================================================================

/**
 * 找出最佳反應
 */
export function findBestResponse(responses: TreatmentResponse[]): TreatmentResponse | undefined {
  if (responses.length === 0) {
    return undefined;
  }

  // 只處理 RECIST 反應
  const recistResponses = responses.filter(r =>
    Object.keys(RESPONSE_PRIORITY).includes(r.response as RECISTResponse)
  );

  if (recistResponses.length === 0) {
    return responses[0];
  }

  // 依優先順序排序 (數字越小越好)
  recistResponses.sort((a, b) => {
    const priorityA = RESPONSE_PRIORITY[a.response as RECISTResponse] || 999;
    const priorityB = RESPONSE_PRIORITY[b.response as RECISTResponse] || 999;
    return priorityA - priorityB;
  });

  return recistResponses[0];
}

// ============================================================================
// 續用申請驗證
// ============================================================================

interface ContinuationRequirementOptions {
  applyType: string;
  hasResponse: boolean;
}

/**
 * 驗證續用申請需求
 */
export function validateContinuationRequirement(
  options: ContinuationRequirementOptions
): OutcomeValidationResult {
  const errors: string[] = [];

  if (options.applyType === '續用申請' && !options.hasResponse) {
    errors.push('續用申請需至少提供一筆治療反應評估');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// 評估日期驗證
// ============================================================================

/**
 * 驗證評估日期
 */
export function validateAssessmentDate(
  assessmentDate: string,
  treatmentStartDate?: string
): { valid: boolean; error?: string } {
  const assessment = new Date(assessmentDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 不得為未來日期
  if (assessment > today) {
    return {
      valid: false,
      error: '評估日期不得為未來日期',
    };
  }

  // 不得早於治療開始日期
  if (treatmentStartDate) {
    const treatmentStart = new Date(treatmentStartDate);
    if (assessment < treatmentStart) {
      return {
        valid: false,
        error: '評估日期不得早於治療開始日期',
      };
    }
  }

  return { valid: true };
}
