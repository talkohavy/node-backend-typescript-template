# Code Reviewer Memory

## Patterns & Recurring Issues

### Spurious `await` on synchronous transformer methods
- `feature-flags.service.ts` has `await this.dataTransformerService.transformOneToData(...)` inside `updateFeatureFlag`, even though `transformOneToData` is synchronous.
- Root cause: was originally mocked with `mockResolvedValue` in tests, masking the issue. Fixed in tests (`mockReturnValue`) but `await` left in actual service code.
- Watch for this pattern in any service that calls `DataTransformerService` methods.

### DataTransformerService design
- All transformer methods are synchronous (no `async`, return concrete types not Promises).
- Public methods are thin wrappers around private implementation methods — this doubles method count; the indirection is intentional but worth documenting.
- `fromUpdateDataToDB` uses `!== undefined` to support explicit `null` for nullable fields (e.g., `description`).

### Empty-patch guard
- `updateByKey` in `FeatureFlagsRepository` has no guard when `transformUpdateToDB` returns `{}`.
  - An empty data payload causes a real `UPDATE … SET updated_at = NOW()` — silent no-op.
  - Neither repository nor service currently validates that at least one patch field is provided.
  - Flagged but not yet fixed as of this review.

## Test Conventions Observed
- `expectedResult` / `actualResult` variable pattern consistently used.
- `beforeEach` to reset `new DataTransformerService()` / mock objects.
- `jest.Mocked<ServiceClass>` for mock types in service tests.
- Repository methods mocked via `{ method: jest.fn() } as any` — no jest.mock() at module level.

## Type Conventions (feature-flags module)
- DB types: `FeatureFlagDB` (Selectable), `FeatureFlagInsertDB` (Insertable), `FeatureFlagUpdateDB` (Updateable) — all from Kysely helpers.
- Domain types live in `src/modules/feature-flags/types.ts`.
- Write-path input types (`CreateFeatureFlagData`, `UpdateFeatureFlagData`) defined in `repositories/feature-flags/types.ts` and re-exported from the barrel.
- Duplicate `UpdateFeatureFlagByKeyProps` type exists in both `repositories/feature-flags/types.ts` and `services/feature-flags/types.ts` — structurally identical, not yet consolidated.
