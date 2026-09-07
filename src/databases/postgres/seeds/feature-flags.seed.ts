import { FEATURE_FLAGS_TABLE_NAME } from '../migrations';
import type { Client } from 'pg';

const DUMMY_FEATURE_FLAGS = [
  {
    key: 'new-onboarding-flow',
    is_enabled: false,
    description: 'Enables the redesigned onboarding flow for all users',
  },
  {
    key: 'maintenance-banner',
    is_enabled: false,
    description: 'Shows a global maintenance banner at the top of the app',
  },
  {
    key: 'experimental-dashboard',
    is_enabled: false,
    description: 'Enables the experimental dashboard layout',
  },
] as const;

export type SeedFeatureFlagsOptions = {
  /**
   * If true, clears existing flags before seeding. Default: false
   */
  clearBeforeSeeding?: boolean;
};

/**
 * Seeds the feature_flags table with dummy global flags.
 *
 * Each flag is inserted with `ON CONFLICT (key) DO NOTHING`, so this is safe to run on every
 * boot: existing flags (and any admin-toggled `is_enabled` value) are left untouched, while new
 * flags added to `DUMMY_FEATURE_FLAGS` still get created.
 */
export async function seedFeatureFlags(pgClient: Client, options: SeedFeatureFlagsOptions = {}): Promise<number> {
  const { clearBeforeSeeding = false } = options;

  if (clearBeforeSeeding) {
    await pgClient.query(`DELETE FROM ${FEATURE_FLAGS_TABLE_NAME}`);
    console.log('🗑️  Cleared existing feature flags');
  }

  const insertedCount = await insertDummyFeatureFlags(pgClient);
  console.log(`🌱 Seeded ${insertedCount} feature flags successfully`);

  return insertedCount;
}

async function insertDummyFeatureFlags(pgClient: Client): Promise<number> {
  const insertQuery = `
    INSERT INTO ${FEATURE_FLAGS_TABLE_NAME} (key, is_enabled, description, created_at, updated_at)
    VALUES ($1, $2, $3, NOW(), NOW())
    ON CONFLICT (key) DO NOTHING
  `;

  let insertedCount = 0;

  for (let i = 0; i < DUMMY_FEATURE_FLAGS.length; i++) {
    const flag = DUMMY_FEATURE_FLAGS[i]!;
    const result = await pgClient.query(insertQuery, [flag.key, flag.is_enabled, flag.description]);

    if (result.rowCount && result.rowCount > 0) {
      insertedCount++;
    }
  }

  return insertedCount;
}
