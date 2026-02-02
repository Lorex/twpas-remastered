/**
 * @file treatment.ts
 * @description 治療資訊相關型別定義
 */

/**
 * 用藥頻率
 */
export type MedicationFrequency =
  | 'QD'
  | 'BID'
  | 'TID'
  | 'QID'
  | 'Q12H'
  | 'Q8H'
  | 'Q3W'
  | 'Q4W'
  | '每週一次';

/**
 * 用藥線別
 */
export type TreatmentLine =
  | '第一線'
  | '第二線'
  | '第三線'
  | '第四線以上';

/**
 * 給藥途徑
 */
export type RouteOfAdministration =
  | '口服 (PO)'
  | '靜脈注射 (IV)'
  | '皮下注射 (SC)'
  | '肌肉注射 (IM)';

/**
 * 放射治療類型
 */
export type RadiotherapyType =
  | '體外放射治療 (EBRT)'
  | '近接治療 (Brachytherapy)'
  | '立體定位放射手術 (SRS)'
  | '立體定位體部放射治療 (SBRT)'
  | '質子治療';

/**
 * 用藥品項
 */
export interface MedicationItem {
  id?: string;
  drugCode: string;
  drugName: string;
  dosage: number;
  dosageUnit: string;
  frequency: MedicationFrequency;
  route: RouteOfAdministration;
  treatmentLine: TreatmentLine;
  cycleNumber?: number;
  cycleDays?: string;
  startDate: string;
  endDate?: string;
}

/**
 * 放射治療
 */
export interface Radiotherapy {
  id?: string;
  type: RadiotherapyType;
  bodyPart: string;
  totalDose: number;
  doseUnit: string;
  fractions: number;
  dosePerFraction?: number;
  technique?: string;
  startDate: string;
  endDate?: string;
}

/**
 * 治療資訊驗證結果
 */
export interface TreatmentValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}

/**
 * BSA 計算常數 (Du Bois formula)
 */
export const BSA_CONSTANT = 0.007184;
