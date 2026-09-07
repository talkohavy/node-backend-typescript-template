import type { Insertable, Selectable, Updateable } from 'kysely';
import type { FeatureFlagsTable } from '@src/databases/postgres/types';

export type UpdateFeatureFlagData = {
  isEnabled?: boolean;
  description?: string | null;
};

export type CreateFeatureFlagData = {
  key: string;
  isEnabled?: boolean;
  description?: string | null;
};

export type UpdateFeatureFlagByKeyProps = {
  key: string;
  data: UpdateFeatureFlagData;
};

export type FeatureFlagDB = Selectable<FeatureFlagsTable>;
export type FeatureFlagInsertDB = Insertable<FeatureFlagsTable>;
export type FeatureFlagUpdateDB = Updateable<FeatureFlagsTable>;
