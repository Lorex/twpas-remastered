/**
 * @file fhir.ts
 * @description FHIR 相關型別定義
 */

/**
 * FHIR 驗證錯誤
 */
export interface FHIRValidationError {
  severity: 'error' | 'warning' | 'info';
  message: string;
  path?: string;
  rule?: string;
}

/**
 * FHIR 驗證結果
 */
export interface FHIRValidationResult {
  valid: boolean;
  errors: FHIRValidationError[];
  warnings: FHIRValidationError[];
}

/**
 * FHIR 驗證選項
 */
export interface FHIRValidationOptions {
  strictMode?: boolean;
  validateBusinessRules?: boolean;
  diagnosisCode?: string;
}

/**
 * FHIR 轉換選項
 */
export interface FHIRConversionOptions {
  generateUUIDs?: boolean;
  includeMetadata?: boolean;
  validateOutput?: boolean;
}

// ============================================================================
// 簡化的 FHIR R4 型別 (避免依賴外部套件)
// ============================================================================

export interface Coding {
  system?: string;
  code?: string;
  display?: string;
}

export interface CodeableConcept {
  coding?: Coding[];
  text?: string;
}

export interface Reference {
  reference?: string;
  display?: string;
}

export interface Quantity {
  value?: number;
  unit?: string;
  system?: string;
  code?: string;
}

export interface Identifier {
  system?: string;
  value?: string;
}

export interface HumanName {
  text?: string;
  family?: string;
  given?: string[];
}

export interface SupportingInfo {
  sequence: number;
  category?: CodeableConcept;
  valueQuantity?: Quantity;
  valueReference?: Reference;
}

export interface FHIRClaim {
  resourceType: 'Claim';
  id?: string;
  meta?: {
    profile?: string[];
  };
  status: string;
  type?: CodeableConcept;
  use: string;
  subType?: CodeableConcept;
  priority?: CodeableConcept;
  patient?: Reference;
  enterer?: Reference;
  provider?: Reference;
  supportingInfo?: SupportingInfo[];
  related?: Array<{
    claim?: Reference;
  }>;
}

export interface FHIRPatient {
  resourceType: 'Patient';
  id?: string;
  identifier?: Identifier[];
  name?: HumanName[];
  gender?: string;
  birthDate?: string;
}

export interface FHIRPractitioner {
  resourceType: 'Practitioner';
  id?: string;
  identifier?: Identifier[];
  name?: HumanName[];
}

export interface FHIROrganization {
  resourceType: 'Organization';
  id?: string;
  identifier?: Identifier[];
  name?: string;
}

export interface FHIRMedicationRequest {
  resourceType: 'MedicationRequest';
  id?: string;
  status: string;
  intent: string;
  medicationCodeableConcept?: CodeableConcept;
  subject?: Reference;
  dosageInstruction?: Array<{
    text?: string;
  }>;
}

export interface BundleEntry {
  fullUrl?: string;
  resource?: FHIRClaim | FHIRPatient | FHIRPractitioner | FHIROrganization | FHIRMedicationRequest;
}

export interface FHIRBundle {
  resourceType: 'Bundle';
  type: string;
  timestamp?: string;
  entry?: BundleEntry[];
}

// ============================================================================
// 本地資料型別 (用於轉換)
// ============================================================================

export interface LocalClaim {
  caseNumber?: string;
  patient?: {
    mrn: string;
    name?: string;
    idNumber?: string;
    gender?: string;
    birthDate?: string;
  };
  practitioner?: {
    id: string;
    name?: string;
  };
  organization?: {
    id: string;
    name?: string;
  };
  applyType?: string;
  caseType?: string;
  weight?: number;
  height?: number;
  originalCaseNumber?: string;
  medications?: Array<{
    code: string;
    display: string;
    dosage?: string;
  }>;
}
