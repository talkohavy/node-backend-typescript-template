import { FeatureFlagFields } from '@src/databases/postgres/models/feature-flag';
import { Tables } from '../../logic/constants';
import { FeatureFlagAlreadyExistsError } from '../../logic/errors';
import { isUniqueViolation } from './logic/utils/isUniqueViolation';
import type { Kysely } from 'kysely';
import type { Database } from '@src/databases/postgres/types';
import type { DataTransformerService } from '../../services/data-transformer';
import type { CreateFeatureFlagData, FeatureFlagDB, UpdateFeatureFlagByKeyProps } from './types';

export class FeatureFlagsRepository {
  constructor(
    private readonly kysely: Kysely<Database>,
    private readonly dataTransformerService: DataTransformerService,
  ) {}

  async create(data: CreateFeatureFlagData): Promise<FeatureFlagDB> {
    const values = this.dataTransformerService.transformCreateToDB(data);

    try {
      const featureFlag = await this.kysely
        .insertInto(Tables.FeatureFlags)
        .values(values)
        .returningAll()
        .executeTakeFirstOrThrow();

      return featureFlag;
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new FeatureFlagAlreadyExistsError(data.key);
      }

      throw error;
    }
  }

  async getAll(): Promise<Array<FeatureFlagDB>> {
    const featureFlags = await this.kysely
      .selectFrom(Tables.FeatureFlags)
      .selectAll()
      .orderBy(FeatureFlagFields.key, 'asc')
      .execute();

    return featureFlags;
  }

  async getByKey(key: string): Promise<FeatureFlagDB | null> {
    const featureFlag = await this.kysely
      .selectFrom(Tables.FeatureFlags)
      .selectAll()
      .where(FeatureFlagFields.key, '=', key)
      .executeTakeFirst();

    if (!featureFlag) return null;

    return featureFlag;
  }

  async getByKeys(keys: Array<string>): Promise<Array<FeatureFlagDB>> {
    if (keys.length === 0) return [];

    const featureFlags = await this.kysely
      .selectFrom(Tables.FeatureFlags)
      .selectAll()
      .where(FeatureFlagFields.key, 'in', keys)
      .execute();

    return featureFlags;
  }

  async updateByKey(props: UpdateFeatureFlagByKeyProps): Promise<FeatureFlagDB | null> {
    const { key, data } = props;

    const mappedValues = this.dataTransformerService.transformUpdateToDB(data);

    const values = {
      ...mappedValues,
      updated_at: new Date(),
    };

    const featureFlag = await this.kysely
      .updateTable(Tables.FeatureFlags)
      .set(values)
      .where(FeatureFlagFields.key, '=', key)
      .returningAll()
      .executeTakeFirst();

    if (!featureFlag) return null;

    return featureFlag;
  }

  async deleteByKey(key: string): Promise<boolean> {
    const featureFlag = await this.kysely
      .deleteFrom(Tables.FeatureFlags)
      .where(FeatureFlagFields.key, '=', key)
      .returningAll()
      .executeTakeFirst();

    if (!featureFlag) return false;

    return true;
  }
}
