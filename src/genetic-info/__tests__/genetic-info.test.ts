/**
 * @file genetic-info.test.ts
 * @description 基因資訊模組單元測試
 * @bdd-generated: features/genetic-info/genetic-info.feature
 */

import { describe, it, expect } from 'vitest';

import {
  validateGeneticTest,
  validateVAF,
  getCommonMutations,
  validateAttachmentFormat,
} from '../genetic-info-service';

import type { GeneticTest } from '../../lib/types/genetic-info';

// ============================================================================
// 基因檢測驗證
// ============================================================================

describe('基因檢測驗證', () => {
  const validGeneticTest: GeneticTest = {
    testType: '次世代定序面板 (NGS)',
    specimenType: '組織',
    specimenCollectionDate: '2024-01-10',
    testDate: '2024-01-15',
    reportDate: '2024-01-18',
    geneSymbol: 'EGFR',
    mutationType: '點突變',
    mutationDetail: 'L858R',
    vaf: 35.5,
    result: '陽性',
    interpretation: '建議使用 EGFR-TKI',
    labId: 'LAB001',
  };

  it('應該驗證有效的基因檢測', () => {
    const result = validateGeneticTest(validGeneticTest);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('缺少檢測類型應該回傳錯誤', () => {
    const test = { ...validGeneticTest, testType: undefined as any };
    const result = validateGeneticTest(test);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('檢測類型為必填');
  });

  it('缺少檢體類型應該回傳錯誤', () => {
    const test = { ...validGeneticTest, specimenType: undefined as any };
    const result = validateGeneticTest(test);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('檢體類型為必填');
  });

  it('缺少檢測日期應該回傳錯誤', () => {
    const test = { ...validGeneticTest, testDate: '' };
    const result = validateGeneticTest(test);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('檢測日期為必填');
  });

  it('缺少基因符號應該回傳錯誤', () => {
    const test = { ...validGeneticTest, geneSymbol: '' };
    const result = validateGeneticTest(test);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('基因符號為必填');
  });

  it('缺少結果應該回傳錯誤', () => {
    const test = { ...validGeneticTest, result: undefined as any };
    const result = validateGeneticTest(test);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('結果為必填');
  });

  it('缺少檢測機構應該回傳錯誤', () => {
    const test = { ...validGeneticTest, labId: '' };
    const result = validateGeneticTest(test);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('檢測機構為必填');
  });
});

// ============================================================================
// VAF 驗證
// ============================================================================

describe('VAF 驗證', () => {
  it('VAF 為 0 應該有效', () => {
    const result = validateVAF(0);
    expect(result.valid).toBe(true);
  });

  it('VAF 為 50 應該有效', () => {
    const result = validateVAF(50);
    expect(result.valid).toBe(true);
  });

  it('VAF 為 100 應該有效', () => {
    const result = validateVAF(100);
    expect(result.valid).toBe(true);
  });

  it('VAF 超過 100 應該無效', () => {
    const result = validateVAF(150);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('VAF 必須介於 0 到 100 之間');
  });

  it('VAF 為負數應該無效', () => {
    const result = validateVAF(-10);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('VAF 必須介於 0 到 100 之間');
  });

  it('VAF 為 undefined 應該有效 (非必填)', () => {
    const result = validateVAF(undefined);
    expect(result.valid).toBe(true);
  });
});

// ============================================================================
// 常見基因突變
// ============================================================================

describe('常見基因突變提示', () => {
  it('EGFR 基因應該有常見突變列表', () => {
    const mutations = getCommonMutations('EGFR');
    expect(mutations).toContain('L858R');
    expect(mutations).toContain('T790M');
    expect(mutations).toContain('exon 19 deletion');
    expect(mutations).toContain('exon 20 insertion');
  });

  it('ALK 基因應該有常見融合夥伴', () => {
    const mutations = getCommonMutations('ALK');
    expect(mutations).toContain('EML4-ALK');
    expect(mutations).toContain('KIF5B-ALK');
    expect(mutations).toContain('TFG-ALK');
  });

  it('BRAF 基因應該有常見突變列表', () => {
    const mutations = getCommonMutations('BRAF');
    expect(mutations).toContain('V600E');
    expect(mutations).toContain('V600K');
  });

  it('未知基因應該回傳空陣列', () => {
    const mutations = getCommonMutations('UNKNOWN_GENE');
    expect(mutations).toHaveLength(0);
  });
});

// ============================================================================
// 附件格式驗證
// ============================================================================

describe('基因報告附件格式驗證', () => {
  it('PDF 格式應該被允許', () => {
    const result = validateAttachmentFormat('report.pdf');
    expect(result.valid).toBe(true);
  });

  it('XLSX 格式不應該被允許', () => {
    const result = validateAttachmentFormat('data.xlsx');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('不支援的檔案格式，請上傳 PDF 檔案');
  });

  it('DOC 格式不應該被允許', () => {
    const result = validateAttachmentFormat('document.doc');
    expect(result.valid).toBe(false);
  });
});

// ============================================================================
// 多筆基因檢測
// ============================================================================

describe('多筆基因檢測', () => {
  it('應該能記錄多筆不同基因的檢測', () => {
    const tests: GeneticTest[] = [
      {
        testType: '次世代定序面板 (NGS)',
        specimenType: '組織',
        testDate: '2024-01-15',
        geneSymbol: 'EGFR',
        result: '陽性',
        labId: 'LAB001',
      },
      {
        testType: 'FISH 螢光原位雜交',
        specimenType: '組織',
        testDate: '2024-01-15',
        geneSymbol: 'ALK',
        result: '陰性',
        labId: 'LAB001',
      },
      {
        testType: 'FISH 螢光原位雜交',
        specimenType: '組織',
        testDate: '2024-01-15',
        geneSymbol: 'ROS1',
        result: '陰性',
        labId: 'LAB001',
      },
    ];

    tests.forEach(test => {
      const result = validateGeneticTest(test);
      expect(result.valid).toBe(true);
    });
    expect(tests).toHaveLength(3);
  });
});
