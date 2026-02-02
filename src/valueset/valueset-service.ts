/**
 * @file valueset-service.ts
 * @description 值集服務 - 代碼查詢、驗證與管理
 */

import type {
  Code,
  ValueSet,
  CodeValidationResult,
  SearchField,
  ValueSetOperationResult
} from '../lib/types/valueset';

// ============================================================================
// 系統值集資料
// ============================================================================

const SYSTEM_VALUESETS: ValueSet[] = [
  {
    id: 'apply-type',
    name: 'NHI-申報類別',
    version: '1.0.0',
    system: true,
    codes: [
      { code: '1', display: '新申請' },
      { code: '2', display: '補件' },
      { code: '3', display: '申覆' },
      { code: '4', display: '爭議審議' },
      { code: '5', display: '申覆補件' },
    ],
  },
  {
    id: 'case-type',
    name: 'NHI-案件類別',
    version: '1.0.0',
    system: true,
    codes: [
      { code: '1', display: '一般事前審查' },
      { code: '3', display: '自主審查' },
      { code: '4', display: '緊急報備' },
    ],
  },
  {
    id: 'medication',
    name: 'NHI-藥品代碼',
    version: '1.0.0',
    system: true,
    codes: [
      { code: 'KC00001', display: 'GEFITINIB 250MG' },
      { code: 'KC00002', display: 'ERLOTINIB 150MG' },
      { code: 'KC00003', display: 'AFATINIB 40MG' },
      { code: 'KC00004', display: 'OSIMERTINIB 80MG' },
      { code: 'KC00005', display: 'ALECTINIB 150MG' },
      { code: 'KC00006', display: 'CRIZOTINIB 250MG' },
      { code: 'KC00007', display: 'PEMBROLIZUMAB 100MG' },
      { code: 'KC00008', display: 'NIVOLUMAB 40MG' },
      { code: 'KC00009', display: 'ATEZOLIZUMAB 1200MG' },
      { code: 'KC00010', display: 'DURVALUMAB 500MG' },
    ],
  },
];

// ============================================================================
// 值集儲存 (記憶體)
// ============================================================================

let valueSets = new Map<string, ValueSet>();

// 初始化系統值集
function initializeSystemValueSets() {
  SYSTEM_VALUESETS.forEach(vs => {
    valueSets.set(vs.id, { ...vs });
  });
}

// 初始化
initializeSystemValueSets();

// ============================================================================
// 核心函數
// ============================================================================

/**
 * 重設值集狀態 (測試用)
 */
export function resetValueSets(): void {
  valueSets = new Map<string, ValueSet>();
  initializeSystemValueSets();
}

/**
 * 取得值集的代碼列表
 *
 * @param valueSetId - 值集 ID
 * @returns 代碼列表
 */
export function getValueSet(valueSetId: string): Code[] {
  const valueSet = valueSets.get(valueSetId);
  if (!valueSet) {
    return [];
  }
  return valueSet.codes;
}

/**
 * 驗證代碼是否有效
 *
 * @param valueSetId - 值集 ID
 * @param code - 代碼
 * @returns 驗證結果
 */
export function validateCode(valueSetId: string, code: string): CodeValidationResult {
  const valueSet = valueSets.get(valueSetId);
  if (!valueSet) {
    return { valid: false, error: '值集不存在' };
  }

  const found = valueSet.codes.find(c => c.code === code);
  if (found) {
    return { valid: true, display: found.display };
  }

  return { valid: false, error: '無效的代碼' };
}

/**
 * 搜尋代碼
 *
 * @param valueSetId - 值集 ID
 * @param keyword - 搜尋關鍵字
 * @param limit - 結果數量限制
 * @param searchField - 搜尋欄位 (code, display, all)
 * @returns 符合條件的代碼列表
 */
export function searchCodes(
  valueSetId: string,
  keyword: string,
  limit?: number,
  searchField: SearchField = 'all'
): Code[] {
  const valueSet = valueSets.get(valueSetId);
  if (!valueSet) {
    return [];
  }

  const upperKeyword = keyword.toUpperCase();

  const results = valueSet.codes.filter(code => {
    const codeMatch = code.code.toUpperCase().startsWith(upperKeyword);
    const displayMatch = code.display.toUpperCase().includes(upperKeyword);

    if (searchField === 'code') {
      return codeMatch;
    } else if (searchField === 'display') {
      return displayMatch;
    } else {
      return codeMatch || displayMatch;
    }
  });

  if (limit !== undefined && limit > 0) {
    return results.slice(0, limit);
  }

  return results;
}

/**
 * 建立自訂值集
 *
 * @param valueSetData - 值集定義 (不含 codes)
 * @returns 操作結果
 */
export function createValueSet(
  valueSetData: Omit<ValueSet, 'codes' | 'system'>
): ValueSetOperationResult {
  if (valueSets.has(valueSetData.id)) {
    return { success: false, error: '值集 ID 已存在' };
  }

  valueSets.set(valueSetData.id, {
    ...valueSetData,
    codes: [],
    system: false,
  });

  return { success: true };
}

/**
 * 新增代碼到值集
 *
 * @param valueSetId - 值集 ID
 * @param code - 代碼
 * @returns 操作結果
 */
export function addCodeToValueSet(
  valueSetId: string,
  code: Code
): ValueSetOperationResult {
  const valueSet = valueSets.get(valueSetId);
  if (!valueSet) {
    return { success: false, error: '值集不存在' };
  }

  if (valueSet.system) {
    return { success: false, error: '系統值集無法新增代碼' };
  }

  if (valueSet.codes.some(c => c.code === code.code)) {
    return { success: false, error: '代碼已存在' };
  }

  valueSet.codes.push(code);
  return { success: true };
}

/**
 * 更新代碼
 *
 * @param valueSetId - 值集 ID
 * @param codeValue - 代碼值
 * @param updates - 更新資料
 * @returns 操作結果
 */
export function updateCode(
  valueSetId: string,
  codeValue: string,
  updates: Partial<Code>
): ValueSetOperationResult {
  const valueSet = valueSets.get(valueSetId);
  if (!valueSet) {
    return { success: false, error: '值集不存在' };
  }

  if (valueSet.system) {
    return { success: false, error: '系統值集的代碼為唯讀' };
  }

  const codeIndex = valueSet.codes.findIndex(c => c.code === codeValue);
  if (codeIndex === -1) {
    return { success: false, error: '代碼不存在' };
  }

  valueSet.codes[codeIndex] = {
    ...valueSet.codes[codeIndex],
    ...updates,
  };

  return { success: true };
}

/**
 * 刪除值集
 *
 * @param valueSetId - 值集 ID
 * @returns 操作結果
 */
export function deleteValueSet(valueSetId: string): ValueSetOperationResult {
  const valueSet = valueSets.get(valueSetId);
  if (!valueSet) {
    return { success: false, error: '值集不存在' };
  }

  if (valueSet.system) {
    return { success: false, error: '系統值集無法刪除' };
  }

  valueSets.delete(valueSetId);
  return { success: true };
}
