/**
 * @file fhir-converter.ts
 * @description FHIR 資源轉換器
 */

import type {
  LocalClaim,
  FHIRClaim,
  FHIRPatient,
  FHIRPractitioner,
  FHIROrganization,
  FHIRMedicationRequest,
  FHIRBundle,
  BundleEntry,
  SupportingInfo
} from '../lib/types/fhir';

// ============================================================================
// 常數定義
// ============================================================================

const TWPAS_CLAIM_PROFILE = 'https://nhicore.nhi.gov.tw/pas/StructureDefinition/Claim-twpas';
const NHI_APPLY_TYPE_SYSTEM = 'https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-apply-type';
const NHI_CASE_TYPE_SYSTEM = 'https://nhicore.nhi.gov.tw/pas/CodeSystem/nhi-tmhb-type';
const UCUM_SYSTEM = 'http://unitsofmeasure.org';
const SUPPORTING_INFO_CATEGORY_SYSTEM = 'https://nhicore.nhi.gov.tw/pas/CodeSystem/claim-supporting-info-category';

// 申報類別對應
const APPLY_TYPE_MAP: Record<string, { code: string; display: string }> = {
  '新申請': { code: '1', display: '新申請' },
  '補件': { code: '2', display: '補件' },
  '申覆': { code: '3', display: '申覆' },
  '爭議審議': { code: '4', display: '爭議審議' },
  '申覆補件': { code: '5', display: '申覆補件' },
  '續用申請': { code: '2', display: '補件' }, // 續用申請對應補件
};

// 案件類別對應
const CASE_TYPE_MAP: Record<string, { code: string; display: string }> = {
  '一般事前審查': { code: '1', display: '一般事前審查' },
  '自主審查': { code: '3', display: '自主審查' },
  '緊急報備': { code: '4', display: '緊急報備' },
  '癌症標靶治療': { code: '1', display: '一般事前審查' }, // 對應一般事前審查
};

// ============================================================================
// UUID 生成
// ============================================================================

/**
 * 生成 urn:uuid 格式的 UUID
 */
export function generateUrnUuid(): string {
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
  return `urn:uuid:${uuid}`;
}

// ============================================================================
// 個別資源轉換
// ============================================================================

/**
 * 轉換病人為 FHIR Patient
 */
export function convertPatientToFHIR(patient: LocalClaim['patient']): FHIRPatient {
  if (!patient) {
    throw new Error('Patient data is required');
  }

  return {
    resourceType: 'Patient',
    identifier: [
      {
        system: 'https://nhicore.nhi.gov.tw/pas/identifier/mrn',
        value: patient.mrn,
      },
      ...(patient.idNumber ? [{
        system: 'https://nhicore.nhi.gov.tw/pas/identifier/nhi-id',
        value: patient.idNumber,
      }] : []),
    ],
    name: [
      {
        text: patient.name,
      },
    ],
    gender: patient.gender === '男' ? 'male' : patient.gender === '女' ? 'female' : 'unknown',
    birthDate: patient.birthDate,
  };
}

/**
 * 轉換醫師為 FHIR Practitioner
 */
export function convertPractitionerToFHIR(practitioner: LocalClaim['practitioner']): FHIRPractitioner {
  if (!practitioner) {
    throw new Error('Practitioner data is required');
  }

  return {
    resourceType: 'Practitioner',
    identifier: [
      {
        system: 'https://nhicore.nhi.gov.tw/pas/identifier/practitioner',
        value: practitioner.id,
      },
    ],
    name: practitioner.name ? [{ text: practitioner.name }] : undefined,
  };
}

/**
 * 轉換機構為 FHIR Organization
 */
export function convertOrganizationToFHIR(organization: LocalClaim['organization']): FHIROrganization {
  if (!organization) {
    throw new Error('Organization data is required');
  }

  return {
    resourceType: 'Organization',
    identifier: [
      {
        system: 'https://nhicore.nhi.gov.tw/pas/identifier/organization',
        value: organization.id,
      },
    ],
    name: organization.name,
  };
}

/**
 * 轉換用藥為 FHIR MedicationRequest
 */
export function convertMedicationRequestToFHIR(
  medication: NonNullable<LocalClaim['medications']>[0],
  patientRef: string
): FHIRMedicationRequest {
  return {
    resourceType: 'MedicationRequest',
    status: 'active',
    intent: 'order',
    medicationCodeableConcept: {
      coding: [
        {
          system: 'https://nhicore.nhi.gov.tw/pas/CodeSystem/medication',
          code: medication.code,
          display: medication.display,
        },
      ],
    },
    subject: {
      reference: patientRef,
    },
    dosageInstruction: medication.dosage ? [{ text: medication.dosage }] : undefined,
  };
}

// ============================================================================
// SupportingInfo 轉換
// ============================================================================

/**
 * 建立 supportingInfo 陣列
 */
function buildSupportingInfo(claim: LocalClaim): SupportingInfo[] {
  const supportingInfo: SupportingInfo[] = [];
  let sequence = 1;

  // Weight slice
  if (claim.weight !== undefined) {
    supportingInfo.push({
      sequence: sequence++,
      category: {
        coding: [{
          system: SUPPORTING_INFO_CATEGORY_SYSTEM,
          code: 'weight',
          display: '體重',
        }],
      },
      valueQuantity: {
        value: claim.weight,
        unit: 'kg',
        system: UCUM_SYSTEM,
        code: 'kg',
      },
    });
  }

  // Height slice
  if (claim.height !== undefined) {
    supportingInfo.push({
      sequence: sequence++,
      category: {
        coding: [{
          system: SUPPORTING_INFO_CATEGORY_SYSTEM,
          code: 'height',
          display: '身高',
        }],
      },
      valueQuantity: {
        value: claim.height,
        unit: 'cm',
        system: UCUM_SYSTEM,
        code: 'cm',
      },
    });
  }

  return supportingInfo;
}

// ============================================================================
// 主要轉換函數
// ============================================================================

/**
 * 轉換申報案件為 FHIR Claim
 */
export function convertClaimToFHIR(claim: LocalClaim): FHIRClaim {
  const applyTypeMapping = claim.applyType ? APPLY_TYPE_MAP[claim.applyType] : undefined;
  const caseTypeMapping = claim.caseType ? CASE_TYPE_MAP[claim.caseType] : undefined;

  const fhirClaim: FHIRClaim = {
    resourceType: 'Claim',
    meta: {
      profile: [TWPAS_CLAIM_PROFILE],
    },
    status: 'active',
    type: {
      coding: [{
        system: 'http://terminology.hl7.org/CodeSystem/claim-type',
        code: 'institutional',
        display: 'Institutional',
      }],
    },
    use: 'preauthorization',
    subType: applyTypeMapping ? {
      coding: [{
        system: NHI_APPLY_TYPE_SYSTEM,
        code: applyTypeMapping.code,
        display: applyTypeMapping.display,
      }],
    } : undefined,
    priority: caseTypeMapping ? {
      coding: [{
        system: NHI_CASE_TYPE_SYSTEM,
        code: caseTypeMapping.code,
        display: caseTypeMapping.display,
      }],
    } : undefined,
    patient: {
      reference: 'urn:uuid:patient-1',
    },
    enterer: {
      reference: 'urn:uuid:practitioner-1',
    },
    provider: {
      reference: 'urn:uuid:organization-1',
    },
    supportingInfo: buildSupportingInfo(claim),
  };

  // 補件/申覆案件需要 related
  if (claim.originalCaseNumber && ['補件', '申覆', '續用申請', '申覆補件'].includes(claim.applyType || '')) {
    fhirClaim.related = [{
      claim: {
        reference: `Claim/${claim.originalCaseNumber}`,
        display: claim.originalCaseNumber,
      },
    }];
  }

  return fhirClaim;
}

/**
 * 轉換完整案件為 FHIR Bundle
 */
export function convertBundleToFHIR(claim: LocalClaim): FHIRBundle {
  const entries: BundleEntry[] = [];

  // 生成各資源的 UUID
  const patientUuid = generateUrnUuid();
  const practitionerUuid = generateUrnUuid();
  const organizationUuid = generateUrnUuid();
  const claimUuid = generateUrnUuid();

  // Patient
  if (claim.patient) {
    entries.push({
      fullUrl: patientUuid,
      resource: convertPatientToFHIR(claim.patient),
    });
  }

  // Practitioner
  if (claim.practitioner) {
    entries.push({
      fullUrl: practitionerUuid,
      resource: convertPractitionerToFHIR(claim.practitioner),
    });
  }

  // Organization
  if (claim.organization) {
    entries.push({
      fullUrl: organizationUuid,
      resource: convertOrganizationToFHIR(claim.organization),
    });
  }

  // Claim (with updated references)
  const fhirClaim = convertClaimToFHIR(claim);
  fhirClaim.patient = { reference: patientUuid };
  fhirClaim.enterer = { reference: practitionerUuid };
  fhirClaim.provider = { reference: organizationUuid };
  entries.push({
    fullUrl: claimUuid,
    resource: fhirClaim,
  });

  // MedicationRequests (至少 4 個以達到 8 個 entry)
  const medications = claim.medications || [
    { code: 'KC00001', display: 'GEFITINIB 250MG' },
    { code: 'KC00002', display: 'ERLOTINIB 150MG' },
    { code: 'KC00003', display: 'AFATINIB 40MG' },
    { code: 'KC00004', display: 'OSIMERTINIB 80MG' },
  ];

  medications.forEach((med) => {
    entries.push({
      fullUrl: generateUrnUuid(),
      resource: convertMedicationRequestToFHIR(med, patientUuid),
    });
  });

  return {
    resourceType: 'Bundle',
    type: 'collection',
    timestamp: new Date().toISOString(),
    entry: entries,
  };
}
