/**
 * @file application.test.ts
 * @description 申請項目模組單元測試
 * @bdd-generated: features/application/application-items.feature
 */

import { describe, it, expect } from 'vitest';

import {
  validateApplicationItem,
  validateQuantity,
  calculateTotalCost,
  checkDuplicateDrug,
  validateDurationDays,
} from '../application-service';

import type { ApplicationItem } from '../../lib/types/application';

// ============================================================================
// 申請項目驗證
// ============================================================================

describe('申請項目驗證', () => {
  const validItem: ApplicationItem = {
    orderCategory: '標靶治療',
    drugCode: 'KC00961100',
    drugName: 'IRESSA TAB 250MG',
    quantity: 30,
    unit: 'TAB',
    durationDays: 30,
    indication: 'EGFR 突變陽性非小細胞肺癌',
    atcCode: 'L01EB01',
    unitPrice: 3000,
  };

  it('應該驗證有效的申請項目', () => {
    const result = validateApplicationItem(validItem);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('缺少醫令類別應該回傳錯誤', () => {
    const item = { ...validItem, orderCategory: undefined as any };
    const result = validateApplicationItem(item);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('醫令類別為必填');
  });

  it('缺少藥物代碼應該回傳錯誤', () => {
    const item = { ...validItem, drugCode: '' };
    const result = validateApplicationItem(item);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('藥物代碼為必填');
  });

  it('缺少藥物名稱應該回傳錯誤', () => {
    const item = { ...validItem, drugName: '' };
    const result = validateApplicationItem(item);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('藥物名稱為必填');
  });

  it('缺少申請數量應該回傳錯誤', () => {
    const item = { ...validItem, quantity: undefined as any };
    const result = validateApplicationItem(item);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('申請數量為必填');
  });

  it('缺少申請天數應該回傳錯誤', () => {
    const item = { ...validItem, durationDays: undefined as any };
    const result = validateApplicationItem(item);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('申請天數為必填');
  });
});

// ============================================================================
// 數量驗證
// ============================================================================

describe('申請數量驗證', () => {
  it('正整數應該有效', () => {
    const result = validateQuantity(30);
    expect(result.valid).toBe(true);
  });

  it('負數應該無效', () => {
    const result = validateQuantity(-5);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('申請數量須為正整數');
  });

  it('零應該無效', () => {
    const result = validateQuantity(0);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('申請數量須為正整數');
  });

  it('小數應該無效', () => {
    const result = validateQuantity(1.5);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('申請數量須為正整數');
  });
});

// ============================================================================
// 費用計算
// ============================================================================

describe('申請項目費用計算', () => {
  it('應該正確計算總費用', () => {
    const items: ApplicationItem[] = [
      {
        orderCategory: '標靶治療',
        drugCode: 'KC00961100',
        drugName: 'IRESSA TAB 250MG',
        quantity: 30,
        unit: 'TAB',
        durationDays: 30,
        unitPrice: 3000,
      },
      {
        orderCategory: '免疫治療',
        drugCode: 'KC01234100',
        drugName: 'KEYTRUDA INJ 100MG',
        quantity: 2,
        unit: 'VIAL',
        durationDays: 21,
        unitPrice: 150000,
      },
    ];
    const total = calculateTotalCost(items);
    expect(total).toBe(390000); // 30*3000 + 2*150000
  });

  it('沒有單價的項目應該跳過', () => {
    const items: ApplicationItem[] = [
      {
        orderCategory: '標靶治療',
        drugCode: 'KC00961100',
        drugName: 'IRESSA TAB 250MG',
        quantity: 30,
        unit: 'TAB',
        durationDays: 30,
      },
    ];
    const total = calculateTotalCost(items);
    expect(total).toBe(0);
  });

  it('空陣列應該回傳 0', () => {
    const total = calculateTotalCost([]);
    expect(total).toBe(0);
  });
});

// ============================================================================
// 重複藥物檢查
// ============================================================================

describe('重複藥物檢查', () => {
  it('新增相同藥物應該警告', () => {
    const existingItems: ApplicationItem[] = [
      {
        orderCategory: '標靶治療',
        drugCode: 'KC00961100',
        drugName: 'IRESSA TAB 250MG',
        quantity: 30,
        unit: 'TAB',
        durationDays: 30,
      },
    ];
    const newDrugCode = 'KC00961100';
    const result = checkDuplicateDrug(existingItems, newDrugCode);
    expect(result.isDuplicate).toBe(true);
    expect(result.warning).toBe('此藥物已存在於申請項目中');
  });

  it('新增不同藥物應該通過', () => {
    const existingItems: ApplicationItem[] = [
      {
        orderCategory: '標靶治療',
        drugCode: 'KC00961100',
        drugName: 'IRESSA TAB 250MG',
        quantity: 30,
        unit: 'TAB',
        durationDays: 30,
      },
    ];
    const newDrugCode = 'KC01234100';
    const result = checkDuplicateDrug(existingItems, newDrugCode);
    expect(result.isDuplicate).toBe(false);
  });

  it('空列表新增藥物應該通過', () => {
    const result = checkDuplicateDrug([], 'KC00961100');
    expect(result.isDuplicate).toBe(false);
  });
});

// ============================================================================
// 申請天數驗證
// ============================================================================

describe('申請天數驗證', () => {
  it('28-30 天應該不產生警告', () => {
    const result = validateDurationDays(30);
    expect(result.valid).toBe(true);
    expect(result.warning).toBeUndefined();
  });

  it('超過 30 天應該產生警告', () => {
    const result = validateDurationDays(90);
    expect(result.valid).toBe(true);
    expect(result.warning).toBe('超過建議申請天數 28-30 天');
  });

  it('小於 1 天應該無效', () => {
    const result = validateDurationDays(0);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('申請天數須為正整數');
  });
});
