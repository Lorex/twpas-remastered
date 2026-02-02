/**
 * @file nhi-platform.test.ts
 * @description 健保平台模組單元測試
 * @bdd-generated: features/nhi-platform/nhi-upload.feature
 */

import { describe, it, expect } from 'vitest';

import {
  validateUploadReadiness,
  generateUploadFilename,
  parseUploadResponse,
  parseReviewResult,
  formatReceiptNumber,
} from '../nhi-platform-service';

import type { UploadResult, ReviewResult } from '../../lib/types/nhi-platform';

// ============================================================================
// 上傳準備驗證
// ============================================================================

describe('上傳準備驗證', () => {
  it('案件驗證通過且有 FHIR Bundle 應該可以上傳', () => {
    const result = validateUploadReadiness({
      hasValidationErrors: false,
      hasFhirBundle: true,
      status: '待送審',
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('案件有驗證錯誤不應該可以上傳', () => {
    const result = validateUploadReadiness({
      hasValidationErrors: true,
      hasFhirBundle: true,
      status: '待送審',
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('案件有驗證錯誤，請先修正');
  });

  it('案件沒有 FHIR Bundle 不應該可以上傳', () => {
    const result = validateUploadReadiness({
      hasValidationErrors: false,
      hasFhirBundle: false,
      status: '待送審',
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('FHIR Bundle 尚未產生');
  });

  it('案件狀態不是待送審不應該可以上傳', () => {
    const result = validateUploadReadiness({
      hasValidationErrors: false,
      hasFhirBundle: true,
      status: '草稿',
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('案件狀態須為「待送審」');
  });
});

// ============================================================================
// 檔案名稱生成
// ============================================================================

describe('上傳檔案名稱生成', () => {
  it('FHIR Bundle 檔案名稱應該正確', () => {
    const filename = generateUploadFilename('CASE-001', 'bundle');
    expect(filename).toMatch(/^TWPAS-CASE-001-\d+\.json$/);
  });

  it('附件 ZIP 檔案名稱應該正確', () => {
    const filename = generateUploadFilename('CASE-001', 'attachments');
    expect(filename).toBe('TWPAS-CASE-001-attachments.zip');
  });
});

// ============================================================================
// 上傳回應解析
// ============================================================================

describe('上傳回應解析', () => {
  it('成功回應應該有受理編號', () => {
    const response = {
      success: true,
      receiptNumber: 'R2024020100001',
    };
    const result = parseUploadResponse(response);
    expect(result.success).toBe(true);
    expect(result.receiptNumber).toBe('R2024020100001');
  });

  it('失敗回應應該有錯誤資訊', () => {
    const response = {
      success: false,
      errorCode: 'E001',
      errorMessage: '資料格式錯誤',
    };
    const result = parseUploadResponse(response);
    expect(result.success).toBe(false);
    expect(result.errorCode).toBe('E001');
    expect(result.errorMessage).toBe('資料格式錯誤');
  });
});

// ============================================================================
// 審查結果解析
// ============================================================================

describe('審查結果解析', () => {
  it('核准結果應該有核准項目', () => {
    const response = {
      status: '核准' as const,
      approvalDate: '2024-02-15',
      approvalItems: [
        {
          drugCode: 'KC00961100',
          drugName: 'IRESSA TAB 250MG',
          approvedQuantity: 30,
          approvalExpiryDate: '2024-05-15',
        },
      ],
    };
    const result = parseReviewResult(response);
    expect(result.status).toBe('核准');
    expect(result.approvalItems).toHaveLength(1);
    expect(result.approvalItems![0].drugCode).toBe('KC00961100');
  });

  it('駁回結果應該有駁回原因', () => {
    const response = {
      status: '駁回' as const,
      rejectionReason: '不符合適應症',
    };
    const result = parseReviewResult(response);
    expect(result.status).toBe('駁回');
    expect(result.rejectionReason).toBe('不符合適應症');
  });

  it('補件結果應該有需補件項目', () => {
    const response = {
      status: '補件中' as const,
      supplementaryItems: ['基因檢測報告', '病理報告'],
    };
    const result = parseReviewResult(response);
    expect(result.status).toBe('補件中');
    expect(result.supplementaryItems).toContain('基因檢測報告');
    expect(result.supplementaryItems).toContain('病理報告');
  });

  it('審核中結果應該有預計完成時間', () => {
    const response = {
      status: '審核中' as const,
      expectedCompletionDate: '2024-02-20',
    };
    const result = parseReviewResult(response);
    expect(result.status).toBe('審核中');
    expect(result.expectedCompletionDate).toBe('2024-02-20');
  });
});

// ============================================================================
// 受理編號格式
// ============================================================================

describe('受理編號格式', () => {
  it('受理編號應該正確格式化', () => {
    const formatted = formatReceiptNumber('R2024020100001');
    expect(formatted).toBe('R2024020100001');
  });

  it('無效受理編號應該回傳空字串', () => {
    const formatted = formatReceiptNumber('');
    expect(formatted).toBe('');
  });
});
