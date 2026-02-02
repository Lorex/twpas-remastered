/**
 * @file dashboard-service.ts
 * @description 儀表板服務
 */

import type {
  CaseStatistics,
  PendingCase,
  RecentCase,
  TrendDataPoint,
  CategoryDistribution,
  StatisticsPeriod,
} from '../lib/types/dashboard';

// ============================================================================
// 統計計算
// ============================================================================

/**
 * 計算案件統計
 */
export function calculateStatistics(cases: RecentCase[]): CaseStatistics {
  const stats: CaseStatistics = {
    draft: 0,
    pendingReview: 0,
    underReview: 0,
    approved: 0,
    rejected: 0,
    supplementary: 0,
    totalThisMonth: 0,
  };

  cases.forEach(c => {
    switch (c.status) {
      case '草稿':
        stats.draft++;
        break;
      case '待審核':
        stats.pendingReview++;
        break;
      case '審核中':
        stats.underReview++;
        break;
      case '核准':
        stats.approved++;
        break;
      case '駁回':
        stats.rejected++;
        break;
      case '補件中':
        stats.supplementary++;
        break;
    }
  });

  // 計算本月新增
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  stats.totalThisMonth = cases.filter(c => {
    const created = new Date(c.createdAt);
    return created.getMonth() === thisMonth && created.getFullYear() === thisYear;
  }).length;

  return stats;
}

// ============================================================================
// 待處理案件
// ============================================================================

/**
 * 取得待處理案件
 */
export function getPendingCases(cases: RecentCase[]): PendingCase[] {
  const pending: PendingCase[] = [];

  const drafts = cases.filter(c => c.status === '草稿').length;
  const supplementary = cases.filter(c => c.status === '補件中').length;

  if (drafts > 0) {
    pending.push({ type: '草稿', count: drafts });
  }

  if (supplementary > 0) {
    pending.push({ type: '補件中', count: supplementary });
  }

  return pending;
}

// ============================================================================
// 期間篩選
// ============================================================================

/**
 * 依期間篩選案件
 */
export function filterByPeriod(
  cases: RecentCase[],
  period: StatisticsPeriod,
  startDate?: string,
  endDate?: string
): RecentCase[] {
  const now = new Date();

  switch (period) {
    case '本月': {
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();
      return cases.filter(c => {
        const created = new Date(c.createdAt);
        return created.getMonth() === thisMonth && created.getFullYear() === thisYear;
      });
    }

    case '本季': {
      const thisQuarter = Math.floor(now.getMonth() / 3);
      const thisYear = now.getFullYear();
      return cases.filter(c => {
        const created = new Date(c.createdAt);
        const quarter = Math.floor(created.getMonth() / 3);
        return quarter === thisQuarter && created.getFullYear() === thisYear;
      });
    }

    case '本年': {
      const thisYear = now.getFullYear();
      return cases.filter(c => {
        const created = new Date(c.createdAt);
        return created.getFullYear() === thisYear;
      });
    }

    case '自訂': {
      if (!startDate || !endDate) {
        return cases;
      }
      const start = new Date(startDate);
      const end = new Date(endDate);
      return cases.filter(c => {
        const created = new Date(c.createdAt);
        return created >= start && created <= end;
      });
    }

    default:
      return cases;
  }
}

// ============================================================================
// 類別篩選
// ============================================================================

/**
 * 依類別篩選案件
 */
export function filterByCategory(cases: RecentCase[], category: string): RecentCase[] {
  if (!category || category.trim() === '') {
    return cases;
  }

  return cases.filter(c => c.applyType === category);
}

// ============================================================================
// 最近案件
// ============================================================================

/**
 * 取得最近案件
 */
export function getRecentCases(cases: RecentCase[], limit: number): RecentCase[] {
  // 按建立時間排序 (最新在前)
  const sorted = [...cases].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return sorted.slice(0, limit);
}

// ============================================================================
// 趨勢數據
// ============================================================================

/**
 * 生成趨勢數據
 */
export function generateTrendData(cases: RecentCase[], months: number): TrendDataPoint[] {
  const trend: TrendDataPoint[] = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    const count = cases.filter(c => {
      const created = new Date(c.createdAt);
      return (
        created.getMonth() === date.getMonth() &&
        created.getFullYear() === date.getFullYear()
      );
    }).length;

    trend.push({ month: monthStr, count });
  }

  return trend;
}

// ============================================================================
// 類別分布
// ============================================================================

/**
 * 生成類別分布
 */
export function generateCategoryDistribution(cases: RecentCase[]): CategoryDistribution[] {
  const categoryMap = new Map<string, number>();

  cases.forEach(c => {
    const current = categoryMap.get(c.applyType) || 0;
    categoryMap.set(c.applyType, current + 1);
  });

  const distribution: CategoryDistribution[] = [];
  categoryMap.forEach((count, category) => {
    distribution.push({ category, count });
  });

  return distribution;
}
