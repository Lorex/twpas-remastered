/**
 * @file disease-info.ts
 * @description 疾病資訊相關型別定義
 */

/**
 * 影像類型
 */
export type ImagingType =
  | '電腦斷層 (CT)'
  | '磁振造影 (MRI)'
  | '正子造影 (PET-CT)'
  | 'X光'
  | '超音波';

/**
 * 影像類型對應 ICD-10-PCS 代碼
 */
export const IMAGING_TYPE_CODES: Record<ImagingType, string> = {
  '電腦斷層 (CT)': 'BW230ZZ',
  '磁振造影 (MRI)': 'BW33ZZZ',
  '正子造影 (PET-CT)': 'CW30ZZZ',
  'X光': 'BW00ZZZ',
  '超音波': 'BW40ZZZ',
};

/**
 * 癌症分期系統
 */
export type StagingSystem =
  | 'AJCC 第 8 版'
  | 'AJCC 第 7 版'
  | 'FIGO'
  | 'Ann Arbor'
  | 'ISS';

/**
 * 檢查類型
 */
export type ExaminationType =
  | '病理報告'
  | '切片報告'
  | '細胞學報告'
  | '內視鏡報告'
  | '支氣管鏡報告'
  | '大腸鏡報告';

/**
 * 影像報告資料
 */
export interface ImagingReport {
  id?: string;
  imagingType: ImagingType;
  bodyPart: string;
  reportDate: string;
  findings: string;
  conclusion: string;
  signingPhysicianId: string;
  signingPhysicianName?: string;
  attachments?: string[];
}

/**
 * 癌症分期資料
 */
export interface CancerStaging {
  id?: string;
  stagingSystem: StagingSystem;
  clinicalStage: string;
  tStage?: string;
  nStage?: string;
  mStage?: string;
  assessmentDate: string;
  signingPhysicianId: string;
  signingPhysicianName?: string;
}

/**
 * 檢查報告資料
 */
export interface ExaminationReport {
  id?: string;
  examinationType: ExaminationType;
  reportDate: string;
  specimen?: string;
  findings: string;
  conclusion: string;
  signingPhysicianId: string;
  signingPhysicianName?: string;
  attachments?: string[];
}

/**
 * 支援的附件格式
 */
export const SUPPORTED_ATTACHMENT_FORMATS = ['png', 'jpeg', 'jpg', 'pdf'];

/**
 * 疾病資訊驗證結果
 */
export interface DiseaseInfoValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}
