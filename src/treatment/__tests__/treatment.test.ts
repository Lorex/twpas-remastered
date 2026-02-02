/**
 * @file treatment.test.ts
 * @description 治療資訊模組單元測試
 * @bdd-generated: features/treatment/treatment-info.feature
 */

import { describe, it, expect } from 'vitest';

import {
  validateMedicationItem,
  validateRadiotherapy,
  calculateDosePerFraction,
  calculateBSA,
  calculateDoseByBSA,
  calculateDoseByWeight,
  validateDateRange,
} from '../treatment-service';

import type { MedicationItem, Radiotherapy } from '../../lib/types/treatment';

// ============================================================================
// 用藥品項驗證
// ============================================================================

describe('用藥品項驗證', () => {
  const validMedication: MedicationItem = {
    drugCode: 'KC00961100',
    drugName: 'IRESSA TAB 250MG',
    dosage: 250,
    dosageUnit: 'mg',
    frequency: 'QD',
    route: '口服 (PO)',
    treatmentLine: '第一線',
    cycleNumber: 1,
    cycleDays: 'D1-28',
    startDate: '2024-02-01',
  };

  it('應該驗證有效的用藥品項', () => {
    const result = validateMedicationItem(validMedication);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('缺少藥物代碼應該回傳錯誤', () => {
    const med = { ...validMedication, drugCode: '' };
    const result = validateMedicationItem(med);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('藥物代碼為必填');
  });

  it('缺少藥物名稱應該回傳錯誤', () => {
    const med = { ...validMedication, drugName: '' };
    const result = validateMedicationItem(med);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('藥物名稱為必填');
  });

  it('缺少劑量應該回傳錯誤', () => {
    const med = { ...validMedication, dosage: undefined as any };
    const result = validateMedicationItem(med);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('劑量為必填');
  });

  it('劑量為負數應該回傳錯誤', () => {
    const med = { ...validMedication, dosage: -100 };
    const result = validateMedicationItem(med);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('劑量須為正數');
  });

  it('缺少頻率應該回傳錯誤', () => {
    const med = { ...validMedication, frequency: undefined as any };
    const result = validateMedicationItem(med);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('頻率為必填');
  });

  it('缺少開始日期應該回傳錯誤', () => {
    const med = { ...validMedication, startDate: '' };
    const result = validateMedicationItem(med);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('開始日期為必填');
  });
});

// ============================================================================
// 放射治療驗證
// ============================================================================

describe('放射治療驗證', () => {
  const validRadiotherapy: Radiotherapy = {
    type: '體外放射治療 (EBRT)',
    bodyPart: '肺部',
    totalDose: 6000,
    doseUnit: 'cGy',
    fractions: 30,
    technique: 'IMRT',
    startDate: '2024-02-15',
    endDate: '2024-03-20',
  };

  it('應該驗證有效的放射治療', () => {
    const result = validateRadiotherapy(validRadiotherapy);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('缺少治療類型應該回傳錯誤', () => {
    const rt = { ...validRadiotherapy, type: undefined as any };
    const result = validateRadiotherapy(rt);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('治療類型為必填');
  });

  it('缺少治療部位應該回傳錯誤', () => {
    const rt = { ...validRadiotherapy, bodyPart: '' };
    const result = validateRadiotherapy(rt);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('治療部位為必填');
  });

  it('缺少總劑量應該回傳錯誤', () => {
    const rt = { ...validRadiotherapy, totalDose: undefined as any };
    const result = validateRadiotherapy(rt);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('總劑量為必填');
  });

  it('總劑量異常應該回傳警告', () => {
    const rt = { ...validRadiotherapy, totalDose: 100000 };
    const result = validateRadiotherapy(rt);
    expect(result.warnings).toContain('總劑量異常，請確認');
  });

  it('缺少分次數應該回傳錯誤', () => {
    const rt = { ...validRadiotherapy, fractions: undefined as any };
    const result = validateRadiotherapy(rt);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('分次數為必填');
  });
});

// ============================================================================
// 日期驗證
// ============================================================================

describe('日期範圍驗證', () => {
  it('結束日期早於開始日期應該回傳錯誤', () => {
    const result = validateDateRange('2024-03-01', '2024-02-01');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('結束日期不得早於開始日期');
  });

  it('結束日期等於開始日期應該有效', () => {
    const result = validateDateRange('2024-03-01', '2024-03-01');
    expect(result.valid).toBe(true);
  });

  it('結束日期晚於開始日期應該有效', () => {
    const result = validateDateRange('2024-02-01', '2024-03-01');
    expect(result.valid).toBe(true);
  });

  it('沒有結束日期應該有效', () => {
    const result = validateDateRange('2024-02-01', undefined);
    expect(result.valid).toBe(true);
  });
});

// ============================================================================
// 劑量計算
// ============================================================================

describe('每次劑量計算', () => {
  it('6000 cGy / 30 次 = 200 cGy', () => {
    const dosePerFraction = calculateDosePerFraction(6000, 30);
    expect(dosePerFraction).toBe(200);
  });

  it('5000 cGy / 25 次 = 200 cGy', () => {
    const dosePerFraction = calculateDosePerFraction(5000, 25);
    expect(dosePerFraction).toBe(200);
  });

  it('分次數為 0 應該回傳 0', () => {
    const dosePerFraction = calculateDosePerFraction(6000, 0);
    expect(dosePerFraction).toBe(0);
  });
});

describe('BSA 計算 (Du Bois formula)', () => {
  it('體重 65.5 kg、身高 170 cm 的 BSA', () => {
    const bsa = calculateBSA(65.5, 170);
    // BSA = 0.007184 × Weight^0.425 × Height^0.725
    // 約 1.76 m²
    expect(bsa).toBeGreaterThan(1.7);
    expect(bsa).toBeLessThan(1.8);
  });

  it('體重 70 kg、身高 175 cm 的 BSA', () => {
    const bsa = calculateBSA(70, 175);
    expect(bsa).toBeGreaterThan(1.8);
    expect(bsa).toBeLessThan(1.9);
  });
});

describe('依 BSA 計算劑量', () => {
  it('175 mg/m² × 1.76 m² ≈ 308 mg', () => {
    const bsa = calculateBSA(65.5, 170);
    const dose = calculateDoseByBSA(175, bsa);
    expect(dose).toBeGreaterThan(300);
    expect(dose).toBeLessThan(320);
  });
});

describe('依體重計算劑量', () => {
  it('3 mg/kg × 65.5 kg = 196.5 mg', () => {
    const dose = calculateDoseByWeight(3, 65.5);
    expect(dose).toBe(196.5);
  });

  it('2 mg/kg × 70 kg = 140 mg', () => {
    const dose = calculateDoseByWeight(2, 70);
    expect(dose).toBe(140);
  });
});
