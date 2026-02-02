/**
 * @file outcome.test.ts
 * @description 結果資訊模組單元測試
 * @bdd-generated: features/outcome/outcome-info.feature
 */

import { describe, it, expect } from 'vitest';

import {
  validateTreatmentResponse,
  getResponseDescription,
  calculatePercentChange,
  suggestResponse,
  findBestResponse,
  validateContinuationRequirement,
  validateAssessmentDate,
} from '../outcome-service';

import type { TreatmentResponse, TargetLesion } from '../../lib/types/outcome';

// ============================================================================
// 治療後評估驗證
// ============================================================================

describe('治療後評估驗證', () => {
  const validResponse: TreatmentResponse = {
    assessmentDate: '2024-03-01',
    criteria: 'RECIST 1.1',
    response: 'PR (部分反應)',
    description: '腫瘤縮小 35%',
  };

  it('應該驗證有效的治療後評估', () => {
    const result = validateTreatmentResponse(validResponse);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('缺少評估日期應該回傳錯誤', () => {
    const response = { ...validResponse, assessmentDate: '' };
    const result = validateTreatmentResponse(response);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('評估日期為必填');
  });

  it('缺少評估標準應該回傳錯誤', () => {
    const response = { ...validResponse, criteria: undefined as any };
    const result = validateTreatmentResponse(response);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('評估標準為必填');
  });

  it('缺少反應類別應該回傳錯誤', () => {
    const response = { ...validResponse, response: undefined as any };
    const result = validateTreatmentResponse(response);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('反應類別為必填');
  });
});

// ============================================================================
// RECIST 反應說明
// ============================================================================

describe('RECIST 1.1 反應說明', () => {
  it('CR 應該有正確說明', () => {
    const desc = getResponseDescription('CR (完全反應)');
    expect(desc).toBe('所有目標病灶消失');
  });

  it('PR 應該有正確說明', () => {
    const desc = getResponseDescription('PR (部分反應)');
    expect(desc).toBe('目標病灶總和直徑減少至少 30%');
  });

  it('SD 應該有正確說明', () => {
    const desc = getResponseDescription('SD (疾病穩定)');
    expect(desc).toBe('未達 PR 標準且未達 PD 標準');
  });

  it('PD 應該有正確說明', () => {
    const desc = getResponseDescription('PD (疾病惡化)');
    expect(desc).toBe('目標病灶總和直徑增加至少 20% 或新病灶出現');
  });

  it('NE 應該有正確說明', () => {
    const desc = getResponseDescription('NE (無法評估)');
    expect(desc).toBe('因故無法評估');
  });
});

// ============================================================================
// 病灶變化計算
// ============================================================================

describe('病灶變化百分比計算', () => {
  it('基準值 63mm 到目前值 40mm 應該是 -36.5%', () => {
    const lesions: TargetLesion[] = [
      { lesionNumber: 1, site: '肺右上葉', baselineValue: 35, currentValue: 22 },
      { lesionNumber: 2, site: '肺左下葉', baselineValue: 28, currentValue: 18 },
    ];
    const change = calculatePercentChange(lesions);
    expect(change).toBeCloseTo(-36.5, 0);
  });

  it('完全消失應該是 -100%', () => {
    const lesions: TargetLesion[] = [
      { lesionNumber: 1, site: '肺', baselineValue: 50, currentValue: 0 },
    ];
    const change = calculatePercentChange(lesions);
    expect(change).toBe(-100);
  });

  it('增大 25% 應該正確計算', () => {
    const lesions: TargetLesion[] = [
      { lesionNumber: 1, site: '肺', baselineValue: 40, currentValue: 50 },
    ];
    const change = calculatePercentChange(lesions);
    expect(change).toBe(25);
  });
});

// ============================================================================
// 反應建議
// ============================================================================

describe('反應類別建議', () => {
  it('變化 -100% 應該建議 CR', () => {
    const suggestion = suggestResponse(-100);
    expect(suggestion).toBe('CR (完全反應)');
  });

  it('變化 -36.5% 應該建議 PR', () => {
    const suggestion = suggestResponse(-36.5);
    expect(suggestion).toBe('PR (部分反應)');
  });

  it('變化 -15% 應該建議 SD', () => {
    const suggestion = suggestResponse(-15);
    expect(suggestion).toBe('SD (疾病穩定)');
  });

  it('變化 +25% 應該建議 PD', () => {
    const suggestion = suggestResponse(25);
    expect(suggestion).toBe('PD (疾病惡化)');
  });
});

// ============================================================================
// 最佳反應
// ============================================================================

describe('最佳反應判斷', () => {
  it('應該找出最佳反應', () => {
    const responses: TreatmentResponse[] = [
      { assessmentDate: '2024-02-01', criteria: 'RECIST 1.1', response: 'PR (部分反應)' },
      { assessmentDate: '2024-03-01', criteria: 'RECIST 1.1', response: 'CR (完全反應)' },
      { assessmentDate: '2024-04-01', criteria: 'RECIST 1.1', response: 'PR (部分反應)' },
    ];
    const best = findBestResponse(responses);
    expect(best?.response).toBe('CR (完全反應)');
    expect(best?.assessmentDate).toBe('2024-03-01');
  });

  it('只有 PD 時最佳反應為 PD', () => {
    const responses: TreatmentResponse[] = [
      { assessmentDate: '2024-02-01', criteria: 'RECIST 1.1', response: 'PD (疾病惡化)' },
    ];
    const best = findBestResponse(responses);
    expect(best?.response).toBe('PD (疾病惡化)');
  });

  it('空陣列應該回傳 undefined', () => {
    const best = findBestResponse([]);
    expect(best).toBeUndefined();
  });
});

// ============================================================================
// 續用申請驗證
// ============================================================================

describe('續用申請驗證', () => {
  it('續用申請沒有治療後評估應該回傳錯誤', () => {
    const result = validateContinuationRequirement({
      applyType: '續用申請',
      hasResponse: false,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('續用申請需至少提供一筆治療反應評估');
  });

  it('續用申請有治療後評估應該通過', () => {
    const result = validateContinuationRequirement({
      applyType: '續用申請',
      hasResponse: true,
    });
    expect(result.valid).toBe(true);
  });

  it('新申請不需要治療後評估', () => {
    const result = validateContinuationRequirement({
      applyType: '新申請',
      hasResponse: false,
    });
    expect(result.valid).toBe(true);
  });
});

// ============================================================================
// 評估日期驗證
// ============================================================================

describe('評估日期驗證', () => {
  it('評估日期不得為未來日期', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const result = validateAssessmentDate(futureDate.toISOString().split('T')[0]);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('評估日期不得為未來日期');
  });

  it('評估日期不得早於治療開始日期', () => {
    const result = validateAssessmentDate('2024-01-15', '2024-02-01');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('評估日期不得早於治療開始日期');
  });

  it('有效的評估日期應該通過', () => {
    const result = validateAssessmentDate('2024-03-01', '2024-02-01');
    expect(result.valid).toBe(true);
  });
});
