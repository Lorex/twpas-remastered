/**
 * @file dashboard.ts
 * @description 儀表板相關型別定義
 */

/**
 * 案件狀態
 */
export type CaseStatus =
  | '草稿'
  | '待審核'
  | '審核中'
  | '核准'
  | '駁回'
  | '補件中';

/**
 * 統計期間
 */
export type StatisticsPeriod =
  | '本月'
  | '本季'
  | '本年'
  | '自訂';

/**
 * 統計卡片
 */
export interface StatisticsCard {
  title: string;
  value: number;
  status?: CaseStatus;
}

/**
 * 案件統計
 */
export interface CaseStatistics {
  draft: number;
  pendingReview: number;
  underReview: number;
  approved: number;
  rejected: number;
  supplementary: number;
  totalThisMonth: number;
}

/**
 * 待處理案件
 */
export interface PendingCase {
  type: '草稿' | '補件中';
  count: number;
}

/**
 * 最近案件
 */
export interface RecentCase {
  caseNumber: string;
  patientName: string;
  applyType: string;
  status: CaseStatus;
  createdAt: string;
}

/**
 * 趨勢數據點
 */
export interface TrendDataPoint {
  month: string;
  count: number;
}

/**
 * 類別分布
 */
export interface CategoryDistribution {
  category: string;
  count: number;
}
