/**
 * @file genetic-info-service.ts
 * @description 基因資訊服務
 */

import type {
  GeneticTest,
  GeneticInfoValidationResult,
} from '../lib/types/genetic-info';

import { COMMON_MUTATIONS } from '../lib/types/genetic-info';

// ============================================================================
// 基因檢測驗證
// ============================================================================

/**
 * 驗證基因檢測資料
 */
export function validateGeneticTest(test: GeneticTest): GeneticInfoValidationResult {
  const errors: string[] = [];

  if (!test.testType) {
    errors.push('檢測類型為必填');
  }

  if (!test.specimenType) {
    errors.push('檢體類型為必填');
  }

  if (!test.testDate || test.testDate.trim() === '') {
    errors.push('檢測日期為必填');
  }

  if (!test.geneSymbol || test.geneSymbol.trim() === '') {
    errors.push('基因符號為必填');
  }

  if (!test.result) {
    errors.push('結果為必填');
  }

  if (!test.labId || test.labId.trim() === '') {
    errors.push('檢測機構為必填');
  }

  // VAF 驗證
  if (test.vaf !== undefined) {
    const vafResult = validateVAF(test.vaf);
    if (!vafResult.valid && vafResult.error) {
      errors.push(vafResult.error);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// VAF 驗證
// ============================================================================

/**
 * 驗證 VAF (Variant Allele Frequency)
 */
export function validateVAF(vaf: number | undefined): { valid: boolean; error?: string } {
  if (vaf === undefined) {
    return { valid: true };
  }

  if (vaf < 0 || vaf > 100) {
    return {
      valid: false,
      error: 'VAF 必須介於 0 到 100 之間',
    };
  }

  return { valid: true };
}

// ============================================================================
// 常見基因突變
// ============================================================================

/**
 * 取得常見基因突變列表
 */
export function getCommonMutations(geneSymbol: string): string[] {
  return COMMON_MUTATIONS[geneSymbol] || [];
}

// ============================================================================
// 附件格式驗證
// ============================================================================

/**
 * 驗證附件格式 (基因報告只接受 PDF)
 */
export function validateAttachmentFormat(filename: string): { valid: boolean; error?: string } {
  const extension = filename.split('.').pop()?.toLowerCase() || '';

  if (extension === 'pdf') {
    return { valid: true };
  }

  return {
    valid: false,
    error: '不支援的檔案格式，請上傳 PDF 檔案',
  };
}
