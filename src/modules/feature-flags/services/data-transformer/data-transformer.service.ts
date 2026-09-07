import type {
  CreateFeatureFlagData,
  FeatureFlagDB,
  FeatureFlagInsertDB,
  FeatureFlagUpdateDB,
  UpdateFeatureFlagData,
} from '../../repositories/feature-flags';
import type { FeatureFlag } from '../../types';

export class DataTransformerService {
  transformOneToData(featureFlag: FeatureFlagDB): FeatureFlag {
    const transformed = this.fromDBToData(featureFlag);

    return transformed;
  }

  transformMultiToData(featureFlags: FeatureFlagDB[]): FeatureFlag[] {
    const transformed = featureFlags.map((featureFlag) => this.fromDBToData(featureFlag));

    return transformed;
  }

  transformCreateToDB(data: CreateFeatureFlagData): FeatureFlagInsertDB {
    const transformed = this.fromCreateDataToDB(data);

    return transformed;
  }

  transformUpdateToDB(data: UpdateFeatureFlagData): FeatureFlagUpdateDB {
    const transformed = this.fromUpdateDataToDB(data);

    return transformed;
  }

  private fromDBToData(row: FeatureFlagDB): FeatureFlag {
    const featureFlagData: FeatureFlag = {
      id: row.id,
      key: row.key,
      isEnabled: row.is_enabled,
      description: row.description,
      createdAt: row.created_at.getTime(),
      updatedAt: row.updated_at.getTime(),
    };

    return featureFlagData;
  }

  private fromCreateDataToDB(data: CreateFeatureFlagData): FeatureFlagInsertDB {
    const { key, isEnabled = false, description = null } = data;
    const featureFlagDB: FeatureFlagInsertDB = {
      key,
      is_enabled: isEnabled,
      description,
    };

    return featureFlagDB;
  }

  private fromUpdateDataToDB(data: UpdateFeatureFlagData): FeatureFlagUpdateDB {
    const { isEnabled, description } = data;
    const values: FeatureFlagUpdateDB = {};

    if (isEnabled !== undefined) {
      values.is_enabled = isEnabled;
    }

    if (description !== undefined) {
      values.description = description;
    }

    return values;
  }
}
