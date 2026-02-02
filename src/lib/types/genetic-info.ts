/**
 * @file genetic-info.ts
 * @description 基因資訊相關型別定義
 */

/**
 * 基因檢測類型
 */
export type GeneticTestType =
  | '次世代定序面板 (NGS)'
  | 'PCR'
  | 'FISH 螢光原位雜交'
  | '免疫組織化學染色 (IHC)'
  | '液態切片'
  | '全外顯子定序'
  | '腫瘤突變負荷 (TMB)'
  | '微衛星不穩定 (MSI)';

/**
 * 檢體類型
 */
export type SpecimenType =
  | '組織'
  | '血液'
  | '血漿'
  | '骨髓'
  | '腦脊髓液'
  | '腹水'
  | '胸水';

/**
 * 突變類型
 */
export type MutationType =
  | '點突變'
  | '插入'
  | '缺失'
  | '融合'
  | '擴增'
  | '重排'
  | '拷貝數變異';

/**
 * 基因檢測結果
 */
export type GeneticTestResult =
  | '陽性'
  | '陰性'
  | '不確定'
  | '未檢出'
  | '檢出'
  | '待判讀';

/**
 * 常見基因突變
 */
export const COMMON_MUTATIONS: Record<string, string[]> = {
  EGFR: ['L858R', 'T790M', 'exon 19 deletion', 'exon 20 insertion'],
  ALK: ['EML4-ALK', 'KIF5B-ALK', 'TFG-ALK'],
  BRAF: ['V600E', 'V600K'],
  ROS1: ['CD74-ROS1', 'SLC34A2-ROS1'],
  KRAS: ['G12C', 'G12D', 'G12V'],
  HER2: ['amplification', 'exon 20 insertion'],
};

/**
 * 基因檢測資料
 */
export interface GeneticTest {
  id?: string;
  testType: GeneticTestType;
  specimenType: SpecimenType;
  specimenCollectionDate?: string;
  testDate: string;
  reportDate?: string;
  geneSymbol: string;
  mutationType?: MutationType;
  mutationDetail?: string;
  vaf?: number; // Variant Allele Frequency (0-100%)
  result: GeneticTestResult;
  interpretation?: string;
  labId: string;
  labName?: string;
  attachments?: string[];
}

/**
 * 基因檢測驗證結果
 */
export interface GeneticInfoValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}
