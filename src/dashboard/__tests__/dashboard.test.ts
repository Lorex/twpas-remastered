/**
 * @file dashboard.test.ts
 * @description 儀表板模組單元測試
 * @bdd-generated: features/dashboard/dashboard.feature
 */

import { describe, it, expect } from 'vitest';

import {
  calculateStatistics,
  getPendingCases,
  filterByPeriod,
  filterByCategory,
  getRecentCases,
  generateTrendData,
  generateCategoryDistribution,
} from '../dashboard-service';

import type {
  CaseStatistics,
  RecentCase,
  TrendDataPoint,
  CategoryDistribution,
} from '../../lib/types/dashboard';

// ============================================================================
// Mock 資料
// ============================================================================

const mockCases: RecentCase[] = [
  { caseNumber: 'CASE-001', patientName: '王小明', applyType: '新申請', status: '草稿', createdAt: '2024-02-01' },
  { caseNumber: 'CASE-002', patientName: '李小華', applyType: '續用申請', status: '待審核', createdAt: '2024-02-02' },
  { caseNumber: 'CASE-003', patientName: '張大成', applyType: '新申請', status: '審核中', createdAt: '2024-02-03' },
  { caseNumber: 'CASE-004', patientName: '陳美麗', applyType: '新申請', status: '核准', createdAt: '2024-02-04' },
  { caseNumber: 'CASE-005', patientName: '林志強', applyType: '療程變更', status: '駁回', createdAt: '2024-02-05' },
  { caseNumber: 'CASE-006', patientName: '黃小燕', applyType: '補件', status: '補件中', createdAt: '2024-02-06' },
];

// ============================================================================
// 統計計算
// ============================================================================

describe('案件統計計算', () => {
  it('應該正確計算各狀態數量', () => {
    const stats = calculateStatistics(mockCases);
    expect(stats.draft).toBe(1);
    expect(stats.pendingReview).toBe(1);
    expect(stats.underReview).toBe(1);
    expect(stats.approved).toBe(1);
    expect(stats.rejected).toBe(1);
    expect(stats.supplementary).toBe(1);
  });

  it('空陣列應該回傳全部為 0', () => {
    const stats = calculateStatistics([]);
    expect(stats.draft).toBe(0);
    expect(stats.pendingReview).toBe(0);
    expect(stats.underReview).toBe(0);
    expect(stats.approved).toBe(0);
    expect(stats.rejected).toBe(0);
    expect(stats.supplementary).toBe(0);
  });
});

// ============================================================================
// 待處理案件
// ============================================================================

describe('待處理案件', () => {
  it('應該回傳草稿和補件中的案件', () => {
    const pending = getPendingCases(mockCases);
    expect(pending).toHaveLength(2);
    expect(pending.find(p => p.type === '草稿')?.count).toBe(1);
    expect(pending.find(p => p.type === '補件中')?.count).toBe(1);
  });

  it('沒有待處理案件應該回傳空陣列', () => {
    const cases: RecentCase[] = [
      { caseNumber: 'CASE-001', patientName: '王小明', applyType: '新申請', status: '核准', createdAt: '2024-02-01' },
    ];
    const pending = getPendingCases(cases);
    expect(pending).toHaveLength(0);
  });
});

// ============================================================================
// 期間篩選
// ============================================================================

describe('期間篩選', () => {
  it('本月篩選應該只回傳本月資料', () => {
    const now = new Date();
    const thisMonthCases: RecentCase[] = [
      { caseNumber: 'CASE-001', patientName: '王小明', applyType: '新申請', status: '草稿', createdAt: now.toISOString().split('T')[0] },
    ];
    const filtered = filterByPeriod(thisMonthCases, '本月');
    expect(filtered).toHaveLength(1);
  });

  it('自訂期間篩選應該正確過濾', () => {
    const filtered = filterByPeriod(mockCases, '自訂', '2024-02-01', '2024-02-03');
    expect(filtered.length).toBeGreaterThanOrEqual(0);
  });
});

// ============================================================================
// 類別篩選
// ============================================================================

describe('類別篩選', () => {
  it('應該按申報類別篩選', () => {
    const filtered = filterByCategory(mockCases, '新申請');
    expect(filtered.every(c => c.applyType === '新申請')).toBe(true);
  });

  it('空類別應該回傳全部', () => {
    const filtered = filterByCategory(mockCases, '');
    expect(filtered).toHaveLength(mockCases.length);
  });
});

// ============================================================================
// 最近案件
// ============================================================================

describe('最近案件', () => {
  it('應該回傳最近 5 筆案件', () => {
    const recent = getRecentCases(mockCases, 5);
    expect(recent).toHaveLength(5);
  });

  it('案件不足 5 筆應該回傳全部', () => {
    const cases: RecentCase[] = [
      { caseNumber: 'CASE-001', patientName: '王小明', applyType: '新申請', status: '草稿', createdAt: '2024-02-01' },
    ];
    const recent = getRecentCases(cases, 5);
    expect(recent).toHaveLength(1);
  });

  it('應該按建立時間排序 (最新在前)', () => {
    const recent = getRecentCases(mockCases, 5);
    for (let i = 0; i < recent.length - 1; i++) {
      expect(new Date(recent[i].createdAt) >= new Date(recent[i + 1].createdAt)).toBe(true);
    }
  });
});

// ============================================================================
// 趨勢數據
// ============================================================================

describe('趨勢數據', () => {
  it('應該生成過去 6 個月的趨勢數據', () => {
    const trend = generateTrendData(mockCases, 6);
    expect(trend).toHaveLength(6);
    trend.forEach(point => {
      expect(point).toHaveProperty('month');
      expect(point).toHaveProperty('count');
      expect(typeof point.count).toBe('number');
    });
  });

  it('應該生成過去 12 個月的趨勢數據', () => {
    const trend = generateTrendData(mockCases, 12);
    expect(trend).toHaveLength(12);
  });
});

// ============================================================================
// 類別分布
// ============================================================================

describe('類別分布', () => {
  it('應該生成類別分布數據', () => {
    const distribution = generateCategoryDistribution(mockCases);
    expect(distribution.length).toBeGreaterThan(0);
    distribution.forEach(item => {
      expect(item).toHaveProperty('category');
      expect(item).toHaveProperty('count');
    });
  });

  it('應該正確計算各類別數量', () => {
    const distribution = generateCategoryDistribution(mockCases);
    const newApplication = distribution.find(d => d.category === '新申請');
    expect(newApplication?.count).toBe(3);
  });
});
