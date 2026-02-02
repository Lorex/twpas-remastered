/**
 * @file fhir-validator.ts
 * @description FHIR 資源驗證器
 */

import type {
  FHIRClaim,
  FHIRBundle,
  FHIRValidationResult,
  FHIRValidationError,
  FHIRValidationOptions,
  SupportingInfo
} from '../lib/types/fhir';
import { validateCode as validateValueSetCode } from '../valueset/valueset-service';

// ============================================================================
// 輔助函數
// ============================================================================

function createError(message: string, path?: string, rule?: string): FHIRValidationError {
  return { severity: 'error', message, path, rule };
}

function createWarning(message: string, path?: string, rule?: string): FHIRValidationError {
  return { severity: 'warning', message, path, rule };
}

// ============================================================================
// SupportingInfo 驗證
// ============================================================================

/**
 * 驗證 supportingInfo
 */
export function validateSupportingInfo(supportingInfo?: SupportingInfo[]): FHIRValidationResult {
  const errors: FHIRValidationError[] = [];
  const warnings: FHIRValidationError[] = [];

  if (!supportingInfo || supportingInfo.length === 0) {
    errors.push(createError('supportingInfo 為必填', 'Claim.supportingInfo'));
    return { valid: false, errors, warnings };
  }

  // 檢查是否有體重
  const hasWeight = supportingInfo.some(
    si => si.category?.coding?.[0]?.code === 'weight'
  );
  if (!hasWeight) {
    errors.push(createError('缺少體重 supportingInfo', 'Claim.supportingInfo'));
  }

  // 檢查是否有身高
  const hasHeight = supportingInfo.some(
    si => si.category?.coding?.[0]?.code === 'height'
  );
  if (!hasHeight) {
    errors.push(createError('缺少身高 supportingInfo', 'Claim.supportingInfo'));
  }

  // 檢查 sequence 唯一性
  const sequences = supportingInfo.map(si => si.sequence);
  const uniqueSequences = [...new Set(sequences)];
  if (sequences.length !== uniqueSequences.length) {
    errors.push(createError('supportingInfo sequence 必須唯一', 'Claim.supportingInfo.sequence'));
  }

  // 驗證體重格式 (HTWT constraint)
  const weightSlice = supportingInfo.find(
    si => si.category?.coding?.[0]?.code === 'weight'
  );
  if (weightSlice?.valueQuantity?.value !== undefined) {
    const weightValue = weightSlice.valueQuantity.value;
    const integerPart = Math.floor(Math.abs(weightValue));
    const decimalPart = weightValue.toString().split('.')[1] || '';

    if (integerPart >= 1000) {
      errors.push(createError('體重整數部分不得超過3位數', 'Claim.supportingInfo.valueQuantity.value'));
    }
    if (decimalPart.length > 2) {
      errors.push(createError('體重小數部分不得超過2位數', 'Claim.supportingInfo.valueQuantity.value'));
    }
  }

  // 驗證身高格式
  const heightSlice = supportingInfo.find(
    si => si.category?.coding?.[0]?.code === 'height'
  );
  if (heightSlice?.valueQuantity?.value !== undefined) {
    const heightValue = heightSlice.valueQuantity.value;
    const integerPart = Math.floor(Math.abs(heightValue));
    const decimalPart = heightValue.toString().split('.')[1] || '';

    if (integerPart >= 1000) {
      errors.push(createError('身高整數部分不得超過3位數', 'Claim.supportingInfo.valueQuantity.value'));
    }
    if (decimalPart.length > 1) {
      errors.push(createError('身高小數部分不得超過1位數', 'Claim.supportingInfo.valueQuantity.value'));
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// Claim 驗證
// ============================================================================

/**
 * 驗證 FHIR Claim
 */
export function validateClaim(claim: Partial<FHIRClaim>, options?: FHIRValidationOptions): FHIRValidationResult {
  const errors: FHIRValidationError[] = [];
  const warnings: FHIRValidationError[] = [];

  // 必填欄位驗證
  if (!claim.subType) {
    errors.push(createError('subType 為必填欄位', 'Claim.subType'));
  }

  if (!claim.priority) {
    errors.push(createError('priority 為必填欄位', 'Claim.priority'));
  }

  if (!claim.patient?.reference) {
    errors.push(createError('patient 為必填欄位', 'Claim.patient'));
  }

  if (!claim.enterer?.reference) {
    errors.push(createError('enterer 為必填欄位', 'Claim.enterer'));
  }

  if (!claim.provider?.reference) {
    errors.push(createError('provider 為必填欄位', 'Claim.provider'));
  }

  // SupportingInfo 驗證
  const supportingInfoResult = validateSupportingInfo(claim.supportingInfo);
  errors.push(...supportingInfoResult.errors);
  warnings.push(...supportingInfoResult.warnings);

  // 補件/申覆案件需要 related (原受理編號)
  const subTypeCode = claim.subType?.coding?.[0]?.code;
  if (subTypeCode === '2' || subTypeCode === '3' || subTypeCode === '5') {
    if (!claim.related || claim.related.length === 0) {
      errors.push(createError('補件/申覆案件需要原受理編號', 'Claim.related'));
    }
  }

  // 值集代碼驗證
  if (claim.subType?.coding?.[0]?.code) {
    const result = validateValueSetCode('apply-type', claim.subType.coding[0].code);
    if (!result.valid) {
      errors.push(createError('無效的申報類別代碼', 'Claim.subType.coding[0].code'));
    }
  }

  if (claim.priority?.coding?.[0]?.code) {
    const result = validateValueSetCode('case-type', claim.priority.coding[0].code);
    if (!result.valid) {
      errors.push(createError('無效的案件類別代碼', 'Claim.priority.coding[0].code'));
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// 業務規則驗證
// ============================================================================

/**
 * 驗證業務規則
 */
export function validateBusinessRules(
  claim: Partial<FHIRClaim>,
  options: FHIRValidationOptions
): FHIRValidationResult {
  const errors: FHIRValidationError[] = [];
  const warnings: FHIRValidationError[] = [];

  const diagnosisCode = options.diagnosisCode || '';
  const caseTypeCode = claim.priority?.coding?.[0]?.code;

  // supportingInfo-2 規則: 一般事前審查需提供影像報告/檢查報告/基因資訊 (三選一)
  // 例外: C90.x 診斷不需要
  if (caseTypeCode === '1' && !diagnosisCode.startsWith('C90')) {
    const hasImagingReport = claim.supportingInfo?.some(
      si => si.category?.coding?.[0]?.code === 'imagingReport'
    );
    const hasLabReport = claim.supportingInfo?.some(
      si => si.category?.coding?.[0]?.code === 'labReport'
    );
    const hasGeneticInfo = claim.supportingInfo?.some(
      si => si.category?.coding?.[0]?.code === 'geneticInfo'
    );

    if (!hasImagingReport && !hasLabReport && !hasGeneticInfo) {
      errors.push(createError(
        '一般事前審查需提供影像報告、檢查報告或基因資訊 (三選一)',
        'Claim.supportingInfo',
        'supportingInfo-2'
      ));
    }
  }

  // supportingInfo-tests-2 規則: C90, C91, C92 診斷需提供檢驗資訊
  if (diagnosisCode.startsWith('C90') || diagnosisCode.startsWith('C91') || diagnosisCode.startsWith('C92')) {
    const hasLabTests = claim.supportingInfo?.some(
      si => si.category?.coding?.[0]?.code === 'labTests'
    );

    if (!hasLabTests) {
      errors.push(createError(
        `${diagnosisCode.substring(0, 3)} 診斷需提供檢驗資訊`,
        'Claim.supportingInfo',
        'supportingInfo-tests-2'
      ));
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// Bundle 驗證
// ============================================================================

/**
 * 驗證 FHIR Bundle
 */
export function validateBundle(bundle: Partial<FHIRBundle>): FHIRValidationResult {
  const errors: FHIRValidationError[] = [];
  const warnings: FHIRValidationError[] = [];

  // 類型必須為 collection
  if (bundle.type !== 'collection') {
    errors.push(createError('Bundle.type 必須為 collection', 'Bundle.type'));
  }

  // 必須包含至少 8 個 entry
  if (!bundle.entry || bundle.entry.length < 8) {
    errors.push(createError('Bundle 必須包含至少 8 個 entry', 'Bundle.entry'));
  }

  if (bundle.entry) {
    // 檢查是否包含 Claim
    const hasClaim = bundle.entry.some(e => e.resource?.resourceType === 'Claim');
    if (!hasClaim) {
      errors.push(createError('Bundle 必須包含 Claim 資源', 'Bundle.entry'));
    }

    // 檢查是否包含 Patient
    const hasPatient = bundle.entry.some(e => e.resource?.resourceType === 'Patient');
    if (!hasPatient) {
      errors.push(createError('Bundle 必須包含 Patient 資源', 'Bundle.entry'));
    }

    // 檢查是否包含 MedicationRequest
    const hasMedicationRequest = bundle.entry.some(e => e.resource?.resourceType === 'MedicationRequest');
    if (!hasMedicationRequest) {
      errors.push(createError('Bundle 必須包含 MedicationRequest 資源', 'Bundle.entry'));
    }

    // 檢查 fullUrl 唯一性
    const fullUrls = bundle.entry.map(e => e.fullUrl).filter(Boolean);
    const uniqueUrls = [...new Set(fullUrls)];
    if (fullUrls.length !== uniqueUrls.length) {
      errors.push(createError('Bundle entry 的 fullUrl 必須唯一', 'Bundle.entry.fullUrl'));
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// 值集驗證 (re-export)
// ============================================================================

/**
 * 驗證值集代碼
 */
export function validateValueSet(valueSetId: string, code: string) {
  const result = validateValueSetCode(valueSetId, code);
  if (!result.valid) {
    return {
      valid: false,
      error: `無效的${valueSetId === 'apply-type' ? '申報類別' : '案件類別'}代碼`,
    };
  }
  return { valid: true };
}
