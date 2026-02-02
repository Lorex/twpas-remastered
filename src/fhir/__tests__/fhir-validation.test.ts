/**
 * @file fhir-validation.test.ts
 * @description Unit tests for FHIR validation functionality
 * @bdd-generated: features/fhir/fhir-validation.feature
 *
 * Auto-generated from BDD feature file. Manual tests can be added below the generated section.
 */

import { describe, it, expect, beforeEach } from 'vitest';

import { validateClaim, validateBundle, validateSupportingInfo, validateBusinessRules, validateValueSet } from '../fhir-validator';
import { resetValueSets } from '../../valueset/valueset-service';

// ============================================================================
// Mock Data
// ============================================================================
const mockValidClaim = {
  resourceType: 'Claim' as const,
  status: 'active',
  type: { coding: [{ code: 'institutional' }] },
  use: 'preauthorization',
  subType: { coding: [{ system: 'https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-apply-type', code: '1', display: '新申請' }] },
  priority: { coding: [{ system: 'https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-tmhb-type', code: '1', display: '一般事前審查' }] },
  patient: { reference: 'urn:uuid:patient-1' },
  enterer: { reference: 'urn:uuid:practitioner-1' },
  provider: { reference: 'urn:uuid:organization-1' },
  supportingInfo: [
    { sequence: 1, category: { coding: [{ code: 'weight' }] }, valueQuantity: { value: 65.5, unit: 'kg' } },
    { sequence: 2, category: { coding: [{ code: 'height' }] }, valueQuantity: { value: 170.0, unit: 'cm' } },
  ],
};

// ============================================================================
// BDD Generated Tests
// ============================================================================

describe('FHIR 資料驗證', () => {
  beforeEach(() => {
    resetValueSets();
  });

  // ===========================================================================
  // Claim 驗證
  // ===========================================================================

  /**
   * @bdd-generated: features/fhir/fhir-validation.feature#驗證完整的 Claim 資源
   * @bdd-hash: c7d8e9f0
   */
  describe('驗證完整的 Claim 資源', () => {
    it('符合規範的 Claim 應該通過驗證', () => {
      const result = validateClaim(mockValidClaim);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  /**
   * @bdd-generated: features/fhir/fhir-validation.feature#Claim 缺少必填的 subType
   * @bdd-hash: d8e9f0g1
   */
  describe('Claim 缺少必填的 subType', () => {
    it('缺少 subType 應該驗證失敗', () => {
      const invalidClaim = { ...mockValidClaim, subType: undefined };
      const result = validateClaim(invalidClaim);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.message.includes('subType'))).toBe(true);
    });
  });

  /**
   * @bdd-generated: features/fhir/fhir-validation.feature#Claim 缺少必填的 priority
   * @bdd-hash: e9f0g1h2
   */
  describe('Claim 缺少必填的 priority', () => {
    it('缺少 priority 應該驗證失敗', () => {
      const invalidClaim = { ...mockValidClaim, priority: undefined };
      const result = validateClaim(invalidClaim);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.message.includes('priority'))).toBe(true);
    });
  });

  /**
   * @bdd-generated: features/fhir/fhir-validation.feature#Claim 缺少必填的 patient reference
   * @bdd-hash: f0g1h2i3
   */
  describe('Claim 缺少必填的 patient reference', () => {
    it('缺少 patient 應該驗證失敗', () => {
      const invalidClaim = { ...mockValidClaim, patient: undefined };
      const result = validateClaim(invalidClaim);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.message.includes('patient'))).toBe(true);
    });
  });

  /**
   * @bdd-generated: features/fhir/fhir-validation.feature#Claim 缺少必填的 enterer reference
   * @bdd-hash: g1h2i3j4
   */
  describe('Claim 缺少必填的 enterer reference', () => {
    it('缺少 enterer 應該驗證失敗', () => {
      const invalidClaim = { ...mockValidClaim, enterer: undefined };
      const result = validateClaim(invalidClaim);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.message.includes('enterer'))).toBe(true);
    });
  });

  // ===========================================================================
  // SupportingInfo 驗證
  // ===========================================================================

  /**
   * @bdd-generated: features/fhir/fhir-validation.feature#驗證缺少體重 supportingInfo
   * @bdd-hash: h2i3j4k5
   */
  describe('驗證缺少體重 supportingInfo', () => {
    it('缺少體重應該驗證失敗', () => {
      const claimWithoutWeight = {
        ...mockValidClaim,
        supportingInfo: mockValidClaim.supportingInfo.filter(si => si.category?.coding?.[0]?.code !== 'weight')
      };
      const result = validateClaim(claimWithoutWeight);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.message.includes('體重'))).toBe(true);
    });
  });

  /**
   * @bdd-generated: features/fhir/fhir-validation.feature#驗證缺少身高 supportingInfo
   * @bdd-hash: i3j4k5l6
   */
  describe('驗證缺少身高 supportingInfo', () => {
    it('缺少身高應該驗證失敗', () => {
      const claimWithoutHeight = {
        ...mockValidClaim,
        supportingInfo: mockValidClaim.supportingInfo.filter(si => si.category?.coding?.[0]?.code !== 'height')
      };
      const result = validateClaim(claimWithoutHeight);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.message.includes('身高'))).toBe(true);
    });
  });

  /**
   * @bdd-generated: features/fhir/fhir-validation.feature#驗證體重格式 - HTWT constraint
   * @bdd-hash: j4k5l6m7
   */
  describe('驗證體重格式 - HTWT constraint', () => {
    it('體重整數部分不得超過3位數', () => {
      const invalidClaim = {
        ...mockValidClaim,
        supportingInfo: mockValidClaim.supportingInfo.map(si =>
          si.category?.coding?.[0]?.code === 'weight'
            ? { ...si, valueQuantity: { ...si.valueQuantity, value: 1234.5 } }
            : si
        )
      };
      const result = validateClaim(invalidClaim);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.message.includes('整數部分'))).toBe(true);
    });

    it('體重小數部分不得超過2位數', () => {
      const invalidClaim = {
        ...mockValidClaim,
        supportingInfo: mockValidClaim.supportingInfo.map(si =>
          si.category?.coding?.[0]?.code === 'weight'
            ? { ...si, valueQuantity: { ...si.valueQuantity, value: 65.555 } }
            : si
        )
      };
      const result = validateClaim(invalidClaim);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.message.includes('小數部分'))).toBe(true);
    });
  });

  /**
   * @bdd-generated: features/fhir/fhir-validation.feature#驗證 supportingInfo sequence 唯一性
   * @bdd-hash: k5l6m7n8
   */
  describe('驗證 supportingInfo sequence 唯一性', () => {
    it('重複的 sequence 應該驗證失敗', () => {
      const invalidClaim = {
        ...mockValidClaim,
        supportingInfo: mockValidClaim.supportingInfo.map(si => ({ ...si, sequence: 1 }))
      };
      const result = validateClaim(invalidClaim);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.message.includes('sequence'))).toBe(true);
    });
  });

  // ===========================================================================
  // 業務規則驗證
  // ===========================================================================

  /**
   * @bdd-generated: features/fhir/fhir-validation.feature#supportingInfo-2 規則 - 一般事前審查需提供影像/檢查/基因
   * @bdd-hash: l6m7n8o9
   */
  describe('supportingInfo-2 規則 - 一般事前審查需提供影像/檢查/基因', () => {
    it('缺少影像報告、檢查報告、基因資訊應該驗證失敗', () => {
      const result = validateBusinessRules(mockValidClaim, { diagnosisCode: 'C34.1' });
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.message.includes('影像報告'))).toBe(true);
    });

    it('有影像報告則應該通過', () => {
      const claimWithImaging = {
        ...mockValidClaim,
        supportingInfo: [
          ...mockValidClaim.supportingInfo,
          { sequence: 3, category: { coding: [{ code: 'imagingReport' }] }, valueReference: { reference: 'urn:uuid:report-1' } }
        ]
      };
      const result = validateBusinessRules(claimWithImaging, { diagnosisCode: 'C34.1' });
      expect(result.valid).toBe(true);
    });
  });

  /**
   * @bdd-generated: features/fhir/fhir-validation.feature#supportingInfo-2 規則 - C90 診斷排除
   * @bdd-hash: m7n8o9p0
   */
  describe('supportingInfo-2 規則 - C90 診斷排除', () => {
    it('C90 診斷即使缺少影像報告也應該通過此規則', () => {
      const result = validateBusinessRules(mockValidClaim, { diagnosisCode: 'C90.0' });
      expect(result.errors.filter(e => e.rule === 'supportingInfo-2')).toHaveLength(0);
    });
  });

  /**
   * @bdd-generated: features/fhir/fhir-validation.feature#supportingInfo-tests-2 規則 - C90 診斷需提供檢驗
   * @bdd-hash: n8o9p0q1
   */
  describe('supportingInfo-tests-2 規則 - C90 診斷需提供檢驗', () => {
    it('C90 診斷缺少檢驗資訊應該驗證失敗', () => {
      const result = validateBusinessRules(mockValidClaim, { diagnosisCode: 'C90.0' });
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.message.includes('檢驗'))).toBe(true);
    });

    it('C92 診斷缺少檢驗資訊應該驗證失敗', () => {
      const result = validateBusinessRules(mockValidClaim, { diagnosisCode: 'C92.0' });
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.message.includes('檢驗'))).toBe(true);
    });
  });

  // ===========================================================================
  // 值集代碼驗證
  // ===========================================================================

  /**
   * @bdd-generated: features/fhir/fhir-validation.feature#驗證 subType 使用有效的申報類別代碼
   * @bdd-hash: o9p0q1r2
   */
  describe('驗證 subType 使用有效的申報類別代碼', () => {
    it('有效的代碼應該通過驗證', () => {
      const result = validateValueSet('apply-type', '1');
      expect(result.valid).toBe(true);
    });

    it('無效的代碼應該驗證失敗', () => {
      const result = validateValueSet('apply-type', '99');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('無效的申報類別代碼');
    });
  });

  /**
   * @bdd-generated: features/fhir/fhir-validation.feature#驗證 priority 使用有效的案件類別代碼
   * @bdd-hash: p0q1r2s3
   */
  describe('驗證 priority 使用有效的案件類別代碼', () => {
    it('有效的代碼應該通過驗證', () => {
      const result = validateValueSet('case-type', '1');
      expect(result.valid).toBe(true);
    });

    it('無效的代碼應該驗證失敗', () => {
      const result = validateValueSet('case-type', '99');
      expect(result.valid).toBe(false);
    });
  });

  // ===========================================================================
  // Bundle 驗證
  // ===========================================================================

  /**
   * @bdd-generated: features/fhir/fhir-validation.feature#驗證完整的 Bundle
   * @bdd-hash: q1r2s3t4
   */
  describe('驗證完整的 Bundle', () => {
    it('符合規範的 Bundle 應該通過驗證', () => {
      const validBundle = {
        resourceType: 'Bundle' as const,
        type: 'collection',
        entry: [
          { fullUrl: 'urn:uuid:1', resource: { resourceType: 'Claim' as const, status: 'active', use: 'preauthorization' } },
          { fullUrl: 'urn:uuid:2', resource: { resourceType: 'Patient' as const } },
          { fullUrl: 'urn:uuid:3', resource: { resourceType: 'Practitioner' as const } },
          { fullUrl: 'urn:uuid:4', resource: { resourceType: 'Organization' as const } },
          { fullUrl: 'urn:uuid:5', resource: { resourceType: 'MedicationRequest' as const, status: 'active', intent: 'order' } },
          { fullUrl: 'urn:uuid:6', resource: { resourceType: 'MedicationRequest' as const, status: 'active', intent: 'order' } },
          { fullUrl: 'urn:uuid:7', resource: { resourceType: 'MedicationRequest' as const, status: 'active', intent: 'order' } },
          { fullUrl: 'urn:uuid:8', resource: { resourceType: 'MedicationRequest' as const, status: 'active', intent: 'order' } },
        ]
      };
      const result = validateBundle(validBundle);
      expect(result.valid).toBe(true);
    });
  });

  /**
   * @bdd-generated: features/fhir/fhir-validation.feature#Bundle 類型必須為 collection
   * @bdd-hash: r2s3t4u5
   */
  describe('Bundle 類型必須為 collection', () => {
    it('類型不是 collection 應該驗證失敗', () => {
      const invalidBundle = { resourceType: 'Bundle' as const, type: 'document', entry: [] };
      const result = validateBundle(invalidBundle);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.message.includes('collection'))).toBe(true);
    });
  });

  /**
   * @bdd-generated: features/fhir/fhir-validation.feature#Bundle 必須包含至少 8 個 entry
   * @bdd-hash: s3t4u5v6
   */
  describe('Bundle 必須包含至少 8 個 entry', () => {
    it('entry 數量不足應該驗證失敗', () => {
      const invalidBundle = { resourceType: 'Bundle' as const, type: 'collection', entry: [] };
      const result = validateBundle(invalidBundle);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.message.includes('8 個 entry'))).toBe(true);
    });
  });

  /**
   * @bdd-generated: features/fhir/fhir-validation.feature#Bundle 必須包含 Claim
   * @bdd-hash: t4u5v6w7
   */
  describe('Bundle 必須包含 Claim', () => {
    it('缺少 Claim 應該驗證失敗', () => {
      const bundleWithoutClaim = {
        resourceType: 'Bundle' as const,
        type: 'collection',
        entry: Array(8).fill(null).map((_, i) => ({
          fullUrl: `urn:uuid:${i}`,
          resource: { resourceType: 'Patient' as const }
        }))
      };
      const result = validateBundle(bundleWithoutClaim);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.message.includes('Claim'))).toBe(true);
    });
  });

  /**
   * @bdd-generated: features/fhir/fhir-validation.feature#Bundle 必須包含 MedicationRequest
   * @bdd-hash: u5v6w7x8
   */
  describe('Bundle 必須包含 MedicationRequest', () => {
    it('缺少 MedicationRequest 應該驗證失敗', () => {
      const bundleWithoutMed = {
        resourceType: 'Bundle' as const,
        type: 'collection',
        entry: Array(8).fill(null).map((_, i) => ({
          fullUrl: `urn:uuid:${i}`,
          resource: { resourceType: i === 0 ? 'Claim' as const : 'Patient' as const, status: 'active', use: 'preauthorization' }
        }))
      };
      const result = validateBundle(bundleWithoutMed);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.message.includes('MedicationRequest'))).toBe(true);
    });
  });

  // ===========================================================================
  // 補件/申復案件驗證
  // ===========================================================================

  /**
   * @bdd-generated: features/fhir/fhir-validation.feature#補件案件需要原受理編號
   * @bdd-hash: v6w7x8y9
   */
  describe('補件案件需要原受理編號', () => {
    it('補件案件缺少原受理編號應該驗證失敗', () => {
      const supplementClaim = {
        ...mockValidClaim,
        subType: { coding: [{ code: '2' }] }
      };
      const result = validateClaim(supplementClaim);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.message.includes('原受理編號') || e.message.includes('補件'))).toBe(true);
    });

    it('補件案件有原受理編號應該通過', () => {
      const supplementClaim = {
        ...mockValidClaim,
        subType: { coding: [{ code: '2' }] },
        related: [{ claim: { reference: 'Claim/CASE-001' } }]
      };
      const result = validateClaim(supplementClaim);
      expect(result.errors.filter(e => e.message.includes('原受理編號'))).toHaveLength(0);
    });
  });

  /**
   * @bdd-generated: features/fhir/fhir-validation.feature#申復案件需要原受理編號
   * @bdd-hash: w7x8y9z0
   */
  describe('申復案件需要原受理編號', () => {
    it('申復案件缺少原受理編號應該驗證失敗', () => {
      const appealClaim = {
        ...mockValidClaim,
        subType: { coding: [{ code: '3' }] }
      };
      const result = validateClaim(appealClaim);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.message.includes('原受理編號') || e.message.includes('補件') || e.message.includes('申覆'))).toBe(true);
    });
  });

  // ===========================================================================
  // 驗證報告
  // ===========================================================================

  /**
   * @bdd-generated: features/fhir/fhir-validation.feature#產生驗證報告
   * @bdd-hash: x8y9z0a1
   */
  describe('產生驗證報告', () => {
    it('驗證報告應該包含必要資訊', () => {
      const result = validateClaim(mockValidClaim);
      expect(result).toHaveProperty('valid');
      expect(result).toHaveProperty('errors');
      expect(result).toHaveProperty('warnings');
    });
  });

  /**
   * @bdd-generated: features/fhir/fhir-validation.feature#區分錯誤與警告
   * @bdd-hash: y9z0a1b2
   */
  describe('區分錯誤與警告', () => {
    it('驗證報告應該區分 error、warning 和 info', () => {
      const invalidClaim = { ...mockValidClaim, subType: undefined };
      const result = validateClaim(invalidClaim);
      result.errors.forEach(e => expect(['error', 'warning', 'info']).toContain(e.severity));
    });
  });
});

// ============================================================================
// Manual Tests - Add your custom tests below this line
// ============================================================================
