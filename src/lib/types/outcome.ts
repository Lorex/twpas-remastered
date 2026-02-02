/**
 * @file outcome.ts
 * @description 結果資訊相關型別定義
 */

/**
 * 評估標準
 */
export type AssessmentCriteria =
  | 'RECIST 1.1'
  | 'iRECIST'
  | 'mRECIST (肝細胞癌)'
  | 'Choi 標準 (GIST)'
  | 'Cheson 標準 (淋巴瘤)'
  | 'IMWG 標準 (多發性骨髓瘤)'
  | 'WHO 標準';

/**
 * RECIST 1.1 反應類別
 */
export type RECISTResponse =
  | 'CR (完全反應)'
  | 'PR (部分反應)'
  | 'SD (疾病穩定)'
  | 'PD (疾病惡化)'
  | 'NE (無法評估)';

/**
 * iRECIST 反應類別
 */
export type iRECISTResponse =
  | 'iCR (免疫完全反應)'
  | 'iPR (免疫部分反應)'
  | 'iSD (免疫疾病穩定)'
  | 'iUPD (免疫未確認惡化)'
  | 'iCPD (免疫確認惡化)';

/**
 * 惡化類型
 */
export type ProgressionType =
  | '目標病灶增大'
  | '新病灶出現'
  | '非目標病灶惡化';

/**
 * RECIST 反應說明
 */
export const RECIST_RESPONSE_DESCRIPTIONS: Record<RECISTResponse, string> = {
  'CR (完全反應)': '所有目標病灶消失',
  'PR (部分反應)': '目標病灶總和直徑減少至少 30%',
  'SD (疾病穩定)': '未達 PR 標準且未達 PD 標準',
  'PD (疾病惡化)': '目標病灶總和直徑增加至少 20% 或新病灶出現',
  'NE (無法評估)': '因故無法評估',
};

/**
 * 反應優先順序 (用於判斷最佳反應)
 */
export const RESPONSE_PRIORITY: Record<RECISTResponse, number> = {
  'CR (完全反應)': 1,
  'PR (部分反應)': 2,
  'SD (疾病穩定)': 3,
  'NE (無法評估)': 4,
  'PD (疾病惡化)': 5,
};

/**
 * 治療後評估
 */
export interface TreatmentResponse {
  id?: string;
  assessmentDate: string;
  criteria: AssessmentCriteria;
  response: RECISTResponse | iRECISTResponse;
  description?: string;
  isBestResponse?: boolean;
  progressionType?: ProgressionType;
  progressionSite?: string;
  progressionDescription?: string;
}

/**
 * 目標病灶測量
 */
export interface TargetLesion {
  lesionNumber: number;
  site: string;
  baselineValue: number; // mm
  currentValue: number;  // mm
}

/**
 * 結果資訊驗證結果
 */
export interface OutcomeValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}
