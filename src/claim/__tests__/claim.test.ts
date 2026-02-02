/**
 * @file claim.test.ts
 * @description Unit tests for claim validation
 * @bdd-generated: features/claim/claim-crud.feature
 *
 * Auto-generated from BDD feature file. Manual tests can be added below the generated section.
 */

import { describe, it, expect } from 'vitest';

import { validateClaim, validateClaimStatus } from '../claim-validation';

// ============================================================================
// BDD Generated Tests
// ============================================================================

describe('申報案件驗證', () => {
  /**
   * @bdd-generated: features/claim/claim-crud.feature#建立案件缺少必填欄位
   * @bdd-hash: d4e5f6g7
   */
  describe('必填欄位驗證', () => {
    it('缺少申報類別應該驗證失敗', () => {
      const result = validateClaim({ patient: { mrn: 'MRN001' } });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('申報類別為必填');
    });

    it('缺少案件類別應該驗證失敗', () => {
      const result = validateClaim({ patient: { mrn: 'MRN001' }, applyType: '新申請' });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('案件類別為必填');
    });

    it('缺少申請醫師應該驗證失敗', () => {
      const result = validateClaim({
        patient: { mrn: 'MRN001' },
        applyType: '新申請',
        caseType: '癌症標靶治療'
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('申請醫師為必填');
    });

    it('缺少體重應該驗證失敗', () => {
      const result = validateClaim({
        patient: { mrn: 'MRN001' },
        applyType: '新申請',
        caseType: '癌症標靶治療',
        practitioner: { id: 'DOC001' }
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('體重為必填');
    });

    it('缺少身高應該驗證失敗', () => {
      const result = validateClaim({
        patient: { mrn: 'MRN001' },
        applyType: '新申請',
        caseType: '癌症標靶治療',
        practitioner: { id: 'DOC001' },
        weight: 65.5
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('身高為必填');
    });
  });

  /**
   * @bdd-generated: features/claim/claim-crud.feature#建立續用案件需填寫原案件編號
   * @bdd-hash: c3d4e5f6
   */
  describe('續用案件驗證', () => {
    it('續用申請缺少原案件編號應該驗證失敗', () => {
      const result = validateClaim({
        applyType: '續用申請',
        caseType: '癌症標靶治療',
        practitioner: { id: 'DOC001' },
        weight: 65.5,
        height: 170.0
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('原案件編號為必填');
    });

    it('續用申請有原案件編號應該通過此驗證', () => {
      const result = validateClaim({
        applyType: '續用申請',
        caseType: '癌症標靶治療',
        practitioner: { id: 'DOC001' },
        weight: 65.5,
        height: 170.0,
        originalCaseNumber: 'CASE-001'
      });
      expect(result.errors.filter(e => e.includes('原案件編號'))).toHaveLength(0);
    });
  });

  /**
   * @bdd-generated: features/claim/claim-crud.feature#成功建立新的申報案件
   * @bdd-hash: a1b2c3d4
   */
  describe('完整案件驗證', () => {
    it('完整且有效的案件資料應該驗證通過', () => {
      const validClaim = {
        patient: { mrn: 'MRN001', name: '王小明' },
        applyType: '新申請',
        caseType: '癌症標靶治療',
        practitioner: { id: 'DOC001', name: '張醫師' },
        weight: 65.5,
        height: 170.0
      };
      const result = validateClaim(validClaim);
      expect(result.valid).toBe(true);
    });
  });

  /**
   * @bdd-generated: features/claim/claim-crud.feature#無法修改已送審的案件基本資料
   * @bdd-hash: g7h8i9j0
   */
  describe('案件狀態驗證', () => {
    it('草稿狀態的案件應該可以修改', () => {
      const result = validateClaimStatus('草稿', 'edit');
      expect(result.allowed).toBe(true);
    });

    it('待審核狀態的案件應該不能修改', () => {
      const result = validateClaimStatus('待審核', 'edit');
      expect(result.allowed).toBe(false);
    });

    it('草稿狀態的案件應該可以刪除', () => {
      const result = validateClaimStatus('草稿', 'delete');
      expect(result.allowed).toBe(true);
    });

    it('待審核狀態的案件應該不能刪除', () => {
      const result = validateClaimStatus('待審核', 'delete');
      expect(result.allowed).toBe(false);
    });
  });
});

// ============================================================================
// Manual Tests - Add your custom tests below this line
// ============================================================================
