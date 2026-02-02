/**
 * @file application-service.ts
 * @description 申請項目服務
 */

import type {
  ApplicationItem,
  ApplicationValidationResult,
} from '../lib/types/application';

// ============================================================================
// 申請項目驗證
// ============================================================================

/**
 * 驗證申請項目
 */
export function validateApplicationItem(item: ApplicationItem): ApplicationValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!item.orderCategory) {
    errors.push('醫令類別為必填');
  }

  if (!item.drugCode || item.drugCode.trim() === '') {
    errors.push('藥物代碼為必填');
  }

  if (!item.drugName || item.drugName.trim() === '') {
    errors.push('藥物名稱為必填');
  }

  if (item.quantity === undefined || item.quantity === null) {
    errors.push('申請數量為必填');
  } else {
    const quantityResult = validateQuantity(item.quantity);
    if (!quantityResult.valid && quantityResult.error) {
      errors.push(quantityResult.error);
    }
  }

  if (item.durationDays === undefined || item.durationDays === null) {
    errors.push('申請天數為必填');
  } else {
    const durationResult = validateDurationDays(item.durationDays);
    if (!durationResult.valid && durationResult.error) {
      errors.push(durationResult.error);
    }
    if (durationResult.warning) {
      warnings.push(durationResult.warning);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

// ============================================================================
// 數量驗證
// ============================================================================

/**
 * 驗證申請數量
 */
export function validateQuantity(quantity: number): { valid: boolean; error?: string } {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    return {
      valid: false,
      error: '申請數量須為正整數',
    };
  }

  return { valid: true };
}

// ============================================================================
// 費用計算
// ============================================================================

/**
 * 計算總費用
 */
export function calculateTotalCost(items: ApplicationItem[]): number {
  return items.reduce((total, item) => {
    if (item.unitPrice) {
      return total + item.quantity * item.unitPrice;
    }
    return total;
  }, 0);
}

// ============================================================================
// 重複藥物檢查
// ============================================================================

/**
 * 檢查重複藥物
 */
export function checkDuplicateDrug(
  existingItems: ApplicationItem[],
  newDrugCode: string
): { isDuplicate: boolean; warning?: string } {
  const isDuplicate = existingItems.some(item => item.drugCode === newDrugCode);

  if (isDuplicate) {
    return {
      isDuplicate: true,
      warning: '此藥物已存在於申請項目中',
    };
  }

  return { isDuplicate: false };
}

// ============================================================================
// 申請天數驗證
// ============================================================================

/**
 * 驗證申請天數
 */
export function validateDurationDays(days: number): { valid: boolean; error?: string; warning?: string } {
  if (!Number.isInteger(days) || days <= 0) {
    return {
      valid: false,
      error: '申請天數須為正整數',
    };
  }

  if (days > 30) {
    return {
      valid: true,
      warning: '超過建議申請天數 28-30 天',
    };
  }

  return { valid: true };
}
