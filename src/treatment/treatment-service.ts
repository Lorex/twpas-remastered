/**
 * @file treatment-service.ts
 * @description 治療資訊服務
 */

import type {
  MedicationItem,
  Radiotherapy,
  TreatmentValidationResult,
} from '../lib/types/treatment';

import { BSA_CONSTANT } from '../lib/types/treatment';

// ============================================================================
// 用藥品項驗證
// ============================================================================

/**
 * 驗證用藥品項
 */
export function validateMedicationItem(item: MedicationItem): TreatmentValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!item.drugCode || item.drugCode.trim() === '') {
    errors.push('藥物代碼為必填');
  }

  if (!item.drugName || item.drugName.trim() === '') {
    errors.push('藥物名稱為必填');
  }

  if (item.dosage === undefined || item.dosage === null) {
    errors.push('劑量為必填');
  } else if (item.dosage <= 0) {
    errors.push('劑量須為正數');
  }

  if (!item.frequency) {
    errors.push('頻率為必填');
  }

  if (!item.startDate || item.startDate.trim() === '') {
    errors.push('開始日期為必填');
  }

  // 日期範圍驗證
  if (item.startDate && item.endDate) {
    const dateResult = validateDateRange(item.startDate, item.endDate);
    if (!dateResult.valid && dateResult.error) {
      errors.push(dateResult.error);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

// ============================================================================
// 放射治療驗證
// ============================================================================

/**
 * 驗證放射治療
 */
export function validateRadiotherapy(rt: Radiotherapy): TreatmentValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!rt.type) {
    errors.push('治療類型為必填');
  }

  if (!rt.bodyPart || rt.bodyPart.trim() === '') {
    errors.push('治療部位為必填');
  }

  if (rt.totalDose === undefined || rt.totalDose === null) {
    errors.push('總劑量為必填');
  } else if (rt.totalDose > 10000) {
    warnings.push('總劑量異常，請確認');
  }

  if (rt.fractions === undefined || rt.fractions === null) {
    errors.push('分次數為必填');
  }

  if (!rt.startDate || rt.startDate.trim() === '') {
    errors.push('開始日期為必填');
  }

  // 日期範圍驗證
  if (rt.startDate && rt.endDate) {
    const dateResult = validateDateRange(rt.startDate, rt.endDate);
    if (!dateResult.valid && dateResult.error) {
      errors.push(dateResult.error);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

// ============================================================================
// 日期驗證
// ============================================================================

/**
 * 驗證日期範圍
 */
export function validateDateRange(
  startDate: string,
  endDate: string | undefined
): { valid: boolean; error?: string } {
  if (!endDate) {
    return { valid: true };
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end < start) {
    return {
      valid: false,
      error: '結束日期不得早於開始日期',
    };
  }

  return { valid: true };
}

// ============================================================================
// 劑量計算
// ============================================================================

/**
 * 計算每次劑量
 */
export function calculateDosePerFraction(totalDose: number, fractions: number): number {
  if (fractions === 0) {
    return 0;
  }
  return totalDose / fractions;
}

/**
 * 計算 BSA (Du Bois formula)
 * BSA = 0.007184 × Weight^0.425 × Height^0.725
 */
export function calculateBSA(weightKg: number, heightCm: number): number {
  return BSA_CONSTANT * Math.pow(weightKg, 0.425) * Math.pow(heightCm, 0.725);
}

/**
 * 依 BSA 計算劑量
 */
export function calculateDoseByBSA(dosePerM2: number, bsa: number): number {
  return dosePerM2 * bsa;
}

/**
 * 依體重計算劑量
 */
export function calculateDoseByWeight(dosePerKg: number, weightKg: number): number {
  return dosePerKg * weightKg;
}
