import { API_PATHS } from '@src/common/constants';
import { ServiceNames } from '@src/plugins/config-service';
import type {
  CreateFeatureFlagData,
  EvaluateFeatureFlagsResult,
  FeatureFlag,
  UpdateFeatureFlagByKeyProps,
} from '../../../feature-flags';
import type { HttpClient } from '../../logic/http-client';
import type { IFeatureFlagsAdapter } from './feature-flags.adapter.interface';

export class FeatureFlagsHttpAdapter implements IFeatureFlagsAdapter {
  constructor(private readonly httpClient: HttpClient) {}

  async createFeatureFlag(data: CreateFeatureFlagData): Promise<FeatureFlag> {
    const response = await this.httpClient.post<FeatureFlag>({
      serviceName: ServiceNames.FeatureFlags,
      route: API_PATHS.featureFlags,
      body: data,
    });

    return response;
  }

  async getFeatureFlags(): Promise<Array<FeatureFlag>> {
    const response = await this.httpClient.get<Array<FeatureFlag>>({
      serviceName: ServiceNames.FeatureFlags,
      route: API_PATHS.featureFlags,
    });

    return response;
  }

  async getFeatureFlagByKey(key: string): Promise<FeatureFlag> {
    const route = `${API_PATHS.featureFlags}/${key}`;
    const response = await this.httpClient.get<FeatureFlag>({
      serviceName: ServiceNames.FeatureFlags,
      route,
    });

    return response;
  }

  async updateFeatureFlag(props: UpdateFeatureFlagByKeyProps): Promise<FeatureFlag> {
    const { key, data } = props;
    const route = `${API_PATHS.featureFlags}/${key}`;
    const response = await this.httpClient.patch<FeatureFlag>({
      serviceName: ServiceNames.FeatureFlags,
      route,
      body: data,
    });

    return response;
  }

  async deleteFeatureFlagByKey(key: string): Promise<{ success: boolean }> {
    const route = `${API_PATHS.featureFlags}/${key}`;
    const response = await this.httpClient.delete<{ success: boolean }>({
      serviceName: ServiceNames.FeatureFlags,
      route,
    });

    return response;
  }

  async evaluateFeatureFlags(keys: Array<string>): Promise<EvaluateFeatureFlagsResult> {
    const response = await this.httpClient.post<EvaluateFeatureFlagsResult>({
      serviceName: ServiceNames.FeatureFlags,
      route: API_PATHS.evaluateFeatureFlags,
      body: { keys },
    });

    return response;
  }
}
