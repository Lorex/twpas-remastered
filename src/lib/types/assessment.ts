/**
 * @file assessment.ts
 * @description 評估資訊相關型別定義
 */

/**
 * 常見腫瘤標記 LOINC 代碼
 */
export const TUMOR_MARKER_LOINC: Record<string, string> = {
  'CEA (癌胚抗原)': '2039-6',
  'AFP (甲型胎兒蛋白)': '1834-1',
  'CA-125': '10334-1',
  'CA 19-9': '24108-3',
  'PSA (攝護腺特異抗原)': '2857-1',
};

/**
 * 檢驗結果判讀
 */
export type LabResultInterpretation =
  | '正常'
  | '異常 (高)'
  | '異常 (低)'
  | '臨界';

/**
 * 檢驗檢查
 */
export interface LabTest {
  id?: string;
  testName: string;
  loincCode?: string;
  value: number;
  unit: string;
  referenceRangeHigh?: number;
  referenceRangeLow?: number;
  testDate: string;
  interpretation?: LabResultInterpretation;
}

/**
 * ECOG 體能狀態說明
 */
export const ECOG_DESCRIPTIONS: Record<number, string> = {
  0: '完全正常活動，無任何症狀',
  1: '可行走，能進行輕度活動',
  2: '可行走，能自理，但無法工作，醒著時間臥床<50%',
  3: '僅能有限自理，醒著時間臥床>50%',
  4: '完全失能，無法自理，全天臥床',
  5: '死亡',
};

/**
 * Karnofsky 體能狀態說明
 */
export const KARNOFSKY_DESCRIPTIONS: Record<number, string> = {
  100: '正常，無症狀',
  90: '能進行正常活動，輕微症狀',
  80: '正常活動但有些吃力，有一些疾病徵兆',
  70: '能自理，但無法工作或正常活動',
  60: '偶爾需要協助，但能照顧大部分需求',
  50: '需要相當多的協助和頻繁的醫療照護',
  40: '失能，需要特殊照護和協助',
  30: '嚴重失能，需住院但無立即死亡危險',
  20: '非常虛弱，需要積極的支持性治療',
  10: '瀕死',
  0: '死亡',
};

/**
 * 病人狀態評估類型
 */
export type PatientAssessmentType =
  | 'ECOG 體能狀態'
  | 'Karnofsky 體能狀態'
  | 'Child-Pugh 分級'
  | 'MELD 分數';

/**
 * Child-Pugh 分級
 */
export type ChildPughClass = 'A' | 'B' | 'C';

/**
 * 病人狀態評估
 */
export interface PatientAssessment {
  id?: string;
  assessmentType: PatientAssessmentType;
  assessmentDate: string;
  score: number;
  description?: string;
  childPughClass?: ChildPughClass;
}

/**
 * 評估資訊驗證結果
 */
export interface AssessmentValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}
