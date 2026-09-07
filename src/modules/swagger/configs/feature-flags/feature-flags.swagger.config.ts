import { addRequestBody, createApiRoute, createSwaggerApiDocs } from 'api-opener';
import { API_PATHS } from '@src/common/constants';
import { AbstractSwaggerConfig } from '../../logic/swagger.abstract.config';
import { FEATURE_FLAG_REFS, definitions } from './feature-flags.ref';

export class FeatureFlagsSwaggerConfig extends AbstractSwaggerConfig {
  constructor() {
    super('FeatureFlags');

    this.docs = createSwaggerApiDocs({
      title: 'LuckyLove: feature-flags-service',
      baseUrl: 'http://localhost:8000',
      definitions,
      routes: [
        createApiRoute({
          method: 'get',
          route: API_PATHS.featureFlags,
          summary: 'List all feature flags',
          responses: {
            '200': {
              description: 'Feature flags fetched successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: FEATURE_FLAG_REFS.featureFlag },
                  },
                },
                'application/x-www-form-urlencoded': {},
              },
            },
          },
        }),
        createApiRoute({
          method: 'post',
          route: API_PATHS.evaluateFeatureFlags,
          summary: 'Evaluate whether feature flags are enabled',
          operationId: 'evaluate-feature-flags',
          requestBody: addRequestBody({
            refString: FEATURE_FLAG_REFS.evaluateFeatureFlagsRequest,
            isRequired: true,
          }),
          responses: {
            '200': {
              description: 'Feature flags evaluated successfully',
              content: {
                'application/json': {
                  schema: { $ref: FEATURE_FLAG_REFS.evaluateFeatureFlagsResponse },
                },
                'application/x-www-form-urlencoded': {},
              },
            },
          },
        }),
        createApiRoute({
          method: 'get',
          route: '/api/feature-flags/{key}',
          summary: 'Get a feature flag by key',
          operationId: 'single-feature-flag',
          parameters: [
            {
              in: 'path',
              name: 'key',
              description: 'Feature flag key',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            '200': {
              description: 'Feature flag fetched successfully',
              content: {
                'application/json': {
                  schema: { $ref: FEATURE_FLAG_REFS.featureFlag },
                },
                'application/x-www-form-urlencoded': {},
              },
            },
          },
        }),
        createApiRoute({
          method: 'get',
          route: '/api/feature-flags/{key}/enabled',
          summary: 'Check if a feature flag is enabled',
          operationId: 'is-feature-flag-enabled',
          parameters: [
            {
              in: 'path',
              name: 'key',
              description: 'Feature flag key',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            '200': {
              description: 'Feature flag fetched successfully',
              content: {
                'application/json': {
                  schema: { $ref: FEATURE_FLAG_REFS.featureFlag },
                },
                'application/x-www-form-urlencoded': {},
              },
            },
          },
        }),
        createApiRoute({
          method: 'post',
          route: API_PATHS.featureFlags,
          summary: 'Create a feature flag',
          operationId: 'create-feature-flag',
          requestBody: addRequestBody({
            refString: FEATURE_FLAG_REFS.featureFlag,
            isRequired: true,
          }),
        }),
        createApiRoute({
          method: 'patch',
          route: '/api/feature-flags/{key}',
          summary: 'Update a feature flag by key',
          operationId: 'update-feature-flag',
          parameters: [
            {
              in: 'path',
              name: 'key',
              description: 'Feature flag key',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            '200': {
              description: 'Feature flag updated successfully',
              content: {
                'application/json': {
                  schema: { $ref: FEATURE_FLAG_REFS.featureFlag },
                },
                'application/x-www-form-urlencoded': {},
              },
            },
          },
        }),
        createApiRoute({
          method: 'delete',
          route: '/api/feature-flags/{key}',
          summary: 'Delete a feature flag by key',
          operationId: 'delete-feature-flag',
          parameters: [
            {
              in: 'path',
              name: 'key',
              description: 'Feature flag key',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            '200': {
              description: 'Feature flag deleted successfully',
            },
          },
        }),
      ],
    });
  }
}
