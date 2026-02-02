# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TWPAS Remastered (台灣健保癌症用藥事前審查系統) is Taiwan's National Health Insurance cancer drug prior authorization system, implementing the [TWPAS FHIR IG v1.1.0](https://build.fhir.org/ig/TWNHIFHIR/pas/) standard.

**Tech Stack:** Next.js 14+ (App Router), Nest.js, TypeScript, Prisma, PostgreSQL, Keycloak, HAPI FHIR

## Commands

```bash
# Install dependencies
pnpm install

# Run unit tests (Vitest)
pnpm test                        # Run all unit tests
pnpm test:watch                  # Watch mode
npx vitest run src/auth          # Run tests in specific module

# Run E2E tests (Playwright)
pnpm test:e2e                    # Run all E2E tests
pnpm test:e2e:ui                 # Interactive UI mode
npx playwright test e2e/auth     # Run specific E2E test directory

# Run mock server for E2E tests
pnpm mock-server                 # Starts on http://localhost:3000

# Type checking
npx tsc --noEmit
```

## Architecture

### BDD → TDD → Code Review Pipeline

This project uses a three-phase automated development workflow:

1. **BDD Test Sync** (`.claude/agents/bdd-test-sync.md`)
   - Converts `.feature` files (Gherkin, zh-TW) to test scripts
   - Generates Playwright E2E tests → `e2e/{module}/*.spec.ts`
   - Generates Vitest unit tests → `src/{module}/__tests__/*.test.ts`
   - Uses `@bdd-generated` and `@bdd-hash` markers to track changes

2. **TDD Development** (`.claude/agents/tdd-development.md`)
   - Implements code to pass generated tests (Red → Green → Refactor)
   - Does NOT modify `@bdd-generated` tests

3. **Code Review** (`.claude/agents/code-review.md`)
   - Reviews code for quality, security, performance
   - Reports issues with severity levels (🔴 Critical, 🟡 Suggested, 💡 Positive)

### Directory Structure

```
features/           # BDD feature files (Gherkin in zh-TW)
  {module}/         # One directory per domain module
  support/          # Cucumber World class and hooks
e2e/                # Auto-generated Playwright E2E tests
src/
  {module}/         # Domain modules (auth, patient, claim, fhir, etc.)
    __tests__/      # Auto-generated Vitest unit tests
    {module}-validation.ts
    {module}-service.ts
  lib/
    types/          # Centralized TypeScript type definitions
mock-app/           # Simple Express server for E2E testing
.claude/
  agents/           # Agent definitions (bdd-test-sync, tdd-development, code-review)
```

### Module Pattern

Each domain module follows this structure:
- `src/{module}/{module}-validation.ts` - Validation logic
- `src/{module}/{module}-service.ts` - Business logic
- `src/{module}/__tests__/{module}.test.ts` - Unit tests (auto-generated)

### Test File Conventions

**BDD-generated tests** have markers that must be preserved:
```typescript
// @bdd-generated: features/path/feature.feature
// @bdd-hash: {8-char-hash}
```

Manual tests go below the separator:
```typescript
// ============================================================================
// Manual Tests - Add below this line
// ============================================================================
```

### Feature Tags

| Tag | Purpose |
|-----|---------|
| `@happy-path` | Normal flow scenarios |
| `@error-handling` | Error cases |
| `@validation` | Validation rules |
| `@api` | API-only tests (no browser) |
| `@login-required` | Pre-login via hook |
| `@database-seed` | Needs seed data |
| `@database-cleanup` | Cleanup after test |
| `@wip` | Work in progress |
| `@flaky` | Unstable, allow retry |

## Key Patterns

### Validation Functions
```typescript
export function validateFeature(data: Data): ValidationResult {
  const errors: string[] = [];
  if (!field) errors.push('error message');
  return { valid: errors.length === 0, errors };
}
```

### Type Definitions
Centralized in `src/lib/types/` - one file per domain (auth.ts, claim.ts, patient.ts, fhir.ts, etc.)

## Testing Notes

- **Unit tests:** `src/**/*.test.ts` run with Vitest
- **E2E tests:** `e2e/**/*.spec.ts` run with Playwright against mock-server
- Playwright auto-starts mock-server before E2E tests
- CI uses 4 parallel workers for Cucumber, 1 worker for Playwright with 2 retries

## FHIR Integration

- Implements TWPAS FHIR IG v1.1.0
- 35+ NHI-defined value sets supported
- FHIR conversion: `src/fhir/fhir-converter.ts`
- FHIR validation: `src/fhir/fhir-validator.ts`
