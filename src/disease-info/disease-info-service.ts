/**
 * @file disease-info-service.ts
 * @description 疾病資訊服務
 */

import type {
  ImagingReport,
  CancerStaging,
  ExaminationReport,
  ImagingType,
  DiseaseInfoValidationResult,
} from '../lib/types/disease-info';

import {
  IMAGING_TYPE_CODES,
  SUPPORTED_ATTACHMENT_FORMATS,
} from '../lib/types/disease-info';

// ============================================================================
// 影像報告驗證
// ============================================================================

/**
 * 驗證影像報告
 */
export function validateImagingReport(report: ImagingReport): DiseaseInfoValidationResult {
  const errors: string[] = [];

  if (!report.imagingType) {
    errors.push('影像類型為必填');
  }

  if (!report.bodyPart || report.bodyPart.trim() === '') {
    errors.push('檢查部位為必填');
  }

  if (!report.reportDate || report.reportDate.trim() === '') {
    errors.push('報告日期為必填');
  } else {
    // 檢查日期是否為未來日期
    const reportDate = new Date(report.reportDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (reportDate > today) {
      errors.push('報告日期不得為未來日期');
    }
  }

  if (!report.signingPhysicianId || report.signingPhysicianId.trim() === '') {
    errors.push('簽發醫師為必填');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// 影像類型代碼
// ============================================================================

/**
 * 取得影像類型對應的 ICD-10-PCS 代碼
 */
export function getImagingTypeCode(imagingType: ImagingType): string {
  return IMAGING_TYPE_CODES[imagingType] || '';
}

// ============================================================================
// 附件格式驗證
// ============================================================================

/**
 * 驗證附件格式
 */
export function validateAttachmentFormat(filename: string): { valid: boolean; error?: string } {
  const extension = filename.split('.').pop()?.toLowerCase() || '';

  if (SUPPORTED_ATTACHMENT_FORMATS.includes(extension)) {
    return { valid: true };
  }

  return {
    valid: false,
    error: '不支援的檔案格式，請上傳 PNG、JPEG 或 PDF 檔案',
  };
}

// ============================================================================
// 癌症分期驗證
// ============================================================================

/**
 * 驗證癌症分期
 */
export function validateCancerStaging(staging: CancerStaging): DiseaseInfoValidationResult {
  const errors: string[] = [];

  if (!staging.stagingSystem) {
    errors.push('分期系統為必填');
  }

  if (!staging.clinicalStage || staging.clinicalStage.trim() === '') {
    errors.push('臨床分期為必填');
  }

  if (!staging.assessmentDate || staging.assessmentDate.trim() === '') {
    errors.push('評估日期為必填');
  }

  if (!staging.signingPhysicianId || staging.signingPhysicianId.trim() === '') {
    errors.push('簽發醫師為必填');
  }

  // AJCC 分期需要 T/N/M 分期
  if (staging.stagingSystem && staging.stagingSystem.startsWith('AJCC')) {
    if (!staging.tStage || !staging.nStage || !staging.mStage) {
      errors.push('AJCC 分期需要 T/N/M 分期');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// 檢查報告驗證
// ============================================================================

/**
 * 驗證檢查報告
 */
export function validateExaminationReport(report: ExaminationReport): DiseaseInfoValidationResult {
  const errors: string[] = [];

  if (!report.examinationType) {
    errors.push('檢查類型為必填');
  }

  if (!report.reportDate || report.reportDate.trim() === '') {
    errors.push('報告日期為必填');
  }

  if (!report.findings || report.findings.trim() === '') {
    errors.push('發現為必填');
  }

  if (!report.signingPhysicianId || report.signingPhysicianId.trim() === '') {
    errors.push('簽發醫師為必填');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// 疾病資訊必填規則
// ============================================================================

interface DiseaseInfoRequirementOptions {
  caseType: string;
  diagnosisCode: string;
  hasImagingReport: boolean;
  hasExaminationReport: boolean;
  hasGeneticInfo: boolean;
}

/**
 * 驗證疾病資訊必填規則
 */
export function validateDiseaseInfoRequirement(
  options: DiseaseInfoRequirementOptions
): DiseaseInfoValidationResult {
  const errors: string[] = [];

  // C90/C92 診斷排除疾病資訊必填規則
  if (options.diagnosisCode.startsWith('C90') || options.diagnosisCode.startsWith('C92')) {
    return { valid: true, errors: [] };
  }

  // 一般事前審查需提供疾病資訊 (影像報告、檢查報告、基因資訊三選一)
  if (options.caseType === '一般事前審查') {
    const hasAnyDiseaseInfo =
      options.hasImagingReport ||
      options.hasExaminationReport ||
      options.hasGeneticInfo;

    if (!hasAnyDiseaseInfo) {
      errors.push('需提供影像報告、檢查報告、基因資訊中至少一項');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
