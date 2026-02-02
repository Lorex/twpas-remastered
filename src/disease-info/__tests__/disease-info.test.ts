/**
 * @file disease-info.test.ts
 * @description 疾病資訊模組單元測試
 * @bdd-generated: features/disease-info/disease-info.feature
 */

import { describe, it, expect } from 'vitest';

import {
  validateImagingReport,
  validateCancerStaging,
  validateExaminationReport,
  validateAttachmentFormat,
  getImagingTypeCode,
  validateDiseaseInfoRequirement,
} from '../disease-info-service';

import type {
  ImagingReport,
  CancerStaging,
  ExaminationReport,
} from '../../lib/types/disease-info';

// ============================================================================
// 影像報告驗證
// ============================================================================

describe('影像報告驗證', () => {
  const validImagingReport: ImagingReport = {
    imagingType: '電腦斷層 (CT)',
    bodyPart: '肺部',
    reportDate: '2024-01-15',
    findings: '右上葉可見 2.5cm 腫塊',
    conclusion: '高度懷疑為原發性肺癌',
    signingPhysicianId: 'DOC001',
  };

  it('應該驗證有效的影像報告', () => {
    const result = validateImagingReport(validImagingReport);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('缺少影像類型應該回傳錯誤', () => {
    const report = { ...validImagingReport, imagingType: undefined as any };
    const result = validateImagingReport(report);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('影像類型為必填');
  });

  it('缺少檢查部位應該回傳錯誤', () => {
    const report = { ...validImagingReport, bodyPart: '' };
    const result = validateImagingReport(report);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('檢查部位為必填');
  });

  it('缺少報告日期應該回傳錯誤', () => {
    const report = { ...validImagingReport, reportDate: '' };
    const result = validateImagingReport(report);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('報告日期為必填');
  });

  it('缺少簽發醫師應該回傳錯誤', () => {
    const report = { ...validImagingReport, signingPhysicianId: '' };
    const result = validateImagingReport(report);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('簽發醫師為必填');
  });

  it('報告日期不得為未來日期', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const report = { ...validImagingReport, reportDate: futureDate.toISOString().split('T')[0] };
    const result = validateImagingReport(report);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('報告日期不得為未來日期');
  });
});

// ============================================================================
// 影像類型代碼
// ============================================================================

describe('影像類型 ICD-10-PCS 代碼對應', () => {
  it('電腦斷層 (CT) 應該對應 BW230ZZ', () => {
    expect(getImagingTypeCode('電腦斷層 (CT)')).toBe('BW230ZZ');
  });

  it('磁振造影 (MRI) 應該對應 BW33ZZZ', () => {
    expect(getImagingTypeCode('磁振造影 (MRI)')).toBe('BW33ZZZ');
  });

  it('正子造影 (PET-CT) 應該對應 CW30ZZZ', () => {
    expect(getImagingTypeCode('正子造影 (PET-CT)')).toBe('CW30ZZZ');
  });

  it('X光 應該對應 BW00ZZZ', () => {
    expect(getImagingTypeCode('X光')).toBe('BW00ZZZ');
  });

  it('超音波 應該對應 BW40ZZZ', () => {
    expect(getImagingTypeCode('超音波')).toBe('BW40ZZZ');
  });
});

// ============================================================================
// 附件格式驗證
// ============================================================================

describe('附件格式驗證', () => {
  it('PNG 格式應該被允許', () => {
    const result = validateAttachmentFormat('scan.png');
    expect(result.valid).toBe(true);
  });

  it('JPEG 格式應該被允許', () => {
    const result = validateAttachmentFormat('scan.jpeg');
    expect(result.valid).toBe(true);
  });

  it('PDF 格式應該被允許', () => {
    const result = validateAttachmentFormat('report.pdf');
    expect(result.valid).toBe(true);
  });

  it('DOC 格式不應該被允許', () => {
    const result = validateAttachmentFormat('document.doc');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('不支援的檔案格式，請上傳 PNG、JPEG 或 PDF 檔案');
  });

  it('XLSX 格式不應該被允許', () => {
    const result = validateAttachmentFormat('data.xlsx');
    expect(result.valid).toBe(false);
  });
});

// ============================================================================
// 癌症分期驗證
// ============================================================================

describe('癌症分期驗證', () => {
  const validStaging: CancerStaging = {
    stagingSystem: 'AJCC 第 8 版',
    clinicalStage: 'Stage IIIA',
    tStage: 'T2',
    nStage: 'N2',
    mStage: 'M0',
    assessmentDate: '2024-01-20',
    signingPhysicianId: 'DOC003',
  };

  it('應該驗證有效的癌症分期', () => {
    const result = validateCancerStaging(validStaging);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('缺少分期系統應該回傳錯誤', () => {
    const staging = { ...validStaging, stagingSystem: undefined as any };
    const result = validateCancerStaging(staging);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('分期系統為必填');
  });

  it('缺少臨床分期應該回傳錯誤', () => {
    const staging = { ...validStaging, clinicalStage: '' };
    const result = validateCancerStaging(staging);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('臨床分期為必填');
  });

  it('缺少評估日期應該回傳錯誤', () => {
    const staging = { ...validStaging, assessmentDate: '' };
    const result = validateCancerStaging(staging);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('評估日期為必填');
  });

  it('FIGO 分期系統不需要 T/N/M 分期', () => {
    const staging: CancerStaging = {
      stagingSystem: 'FIGO',
      clinicalStage: 'Stage II',
      assessmentDate: '2024-01-20',
      signingPhysicianId: 'DOC003',
    };
    const result = validateCancerStaging(staging);
    expect(result.valid).toBe(true);
  });

  it('AJCC 分期系統需要 T/N/M 分期', () => {
    const staging: CancerStaging = {
      stagingSystem: 'AJCC 第 8 版',
      clinicalStage: 'Stage IIIA',
      assessmentDate: '2024-01-20',
      signingPhysicianId: 'DOC003',
    };
    const result = validateCancerStaging(staging);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('AJCC 分期需要 T/N/M 分期');
  });
});

// ============================================================================
// 檢查報告驗證
// ============================================================================

describe('檢查報告驗證', () => {
  const validExamReport: ExaminationReport = {
    examinationType: '病理報告',
    reportDate: '2024-01-18',
    specimen: '肺部切片',
    findings: '非小細胞肺癌',
    conclusion: '腺癌, EGFR 突變陽性',
    signingPhysicianId: 'DOC002',
  };

  it('應該驗證有效的檢查報告', () => {
    const result = validateExaminationReport(validExamReport);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('缺少檢查類型應該回傳錯誤', () => {
    const report = { ...validExamReport, examinationType: undefined as any };
    const result = validateExaminationReport(report);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('檢查類型為必填');
  });

  it('缺少報告日期應該回傳錯誤', () => {
    const report = { ...validExamReport, reportDate: '' };
    const result = validateExaminationReport(report);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('報告日期為必填');
  });

  it('缺少發現應該回傳錯誤', () => {
    const report = { ...validExamReport, findings: '' };
    const result = validateExaminationReport(report);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('發現為必填');
  });
});

// ============================================================================
// 疾病資訊必填規則
// ============================================================================

describe('疾病資訊必填規則', () => {
  it('一般事前審查需提供疾病資訊 (非 C90/C92)', () => {
    const result = validateDiseaseInfoRequirement({
      caseType: '一般事前審查',
      diagnosisCode: 'C34.1',
      hasImagingReport: false,
      hasExaminationReport: false,
      hasGeneticInfo: false,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('需提供影像報告、檢查報告、基因資訊中至少一項');
  });

  it('有影像報告應該通過驗證', () => {
    const result = validateDiseaseInfoRequirement({
      caseType: '一般事前審查',
      diagnosisCode: 'C34.1',
      hasImagingReport: true,
      hasExaminationReport: false,
      hasGeneticInfo: false,
    });
    expect(result.valid).toBe(true);
  });

  it('有檢查報告應該通過驗證', () => {
    const result = validateDiseaseInfoRequirement({
      caseType: '一般事前審查',
      diagnosisCode: 'C34.1',
      hasImagingReport: false,
      hasExaminationReport: true,
      hasGeneticInfo: false,
    });
    expect(result.valid).toBe(true);
  });

  it('有基因資訊應該通過驗證', () => {
    const result = validateDiseaseInfoRequirement({
      caseType: '一般事前審查',
      diagnosisCode: 'C34.1',
      hasImagingReport: false,
      hasExaminationReport: false,
      hasGeneticInfo: true,
    });
    expect(result.valid).toBe(true);
  });

  it('C90 診斷排除疾病資訊必填規則', () => {
    const result = validateDiseaseInfoRequirement({
      caseType: '一般事前審查',
      diagnosisCode: 'C90.0',
      hasImagingReport: false,
      hasExaminationReport: false,
      hasGeneticInfo: false,
    });
    expect(result.valid).toBe(true);
  });

  it('C92 診斷排除疾病資訊必填規則', () => {
    const result = validateDiseaseInfoRequirement({
      caseType: '一般事前審查',
      diagnosisCode: 'C92.0',
      hasImagingReport: false,
      hasExaminationReport: false,
      hasGeneticInfo: false,
    });
    expect(result.valid).toBe(true);
  });
});
