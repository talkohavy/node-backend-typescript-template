import type { SelectQueryBuilder } from 'kysely';
import type { Database } from '@src/databases/postgres';
import type { DatasetDefinition } from '../../types';

export type CompiledDataQuery = {
  dataset: DatasetDefinition;
  queryBuilder: SelectQueryBuilder<Database, any, any>;
};
