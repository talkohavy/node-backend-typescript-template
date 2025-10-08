import fs from 'fs';
import { SwaggerService } from './swagger.service';

jest.mock('fs', () => ({
  writeFileSync: jest.fn(),
}));

const mockFs = fs as jest.Mocked<typeof fs>;

jest.mock('../logic/swagger.abstract.config', () => ({
  UsersSwagger: jest.fn().mockImplementation(() => ({
    name: 'Users',
    docs: {
      swagger: '2.0',
      info: { title: 'Users API', version: '1.0.0' },
      paths: {},
    },
  })),
}));

describe('SwaggerService', () => {
  let swaggerService: SwaggerService;
  let MockUsersSwagger: any;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.SWAGGER_DOCS_BASE_URL = 'http://localhost:8000';

    MockUsersSwagger = class {
      name = 'Users';
      docs = {
        swagger: '2.0',
        info: { title: 'Users API', version: '1.0.0' },
        paths: {},
      };
    };

    swaggerService = new SwaggerService([MockUsersSwagger]);
  });

  describe('createTopLevelSwaggerConfig', () => {
    it('should create swagger UI options with correct configuration', () => {
      const result = swaggerService.createTopLevelSwaggerConfig();

      expect(result).toHaveProperty('explorer', true);
      expect(result).toHaveProperty('customCssUrl', '/swaggerDark.css');
      expect(result).toHaveProperty('customCss', '.opblock-summary-operation-id { white-space: nowrap; }');
      expect(result.swaggerOptions).toHaveProperty('displayOperationId', true);
      expect(result.swaggerOptions).toHaveProperty('filter', true);
      expect(result.swaggerOptions).toHaveProperty('docExpansion', 'list');
      expect(result.swaggerOptions).toHaveProperty('displayRequestDuration', true);
      expect(result.swaggerOptions).toHaveProperty('tryItOutEnabled', true);
      expect(result.swaggerOptions).toHaveProperty('urls');
    });

    it('should include dropdown options in urls', () => {
      const result = swaggerService.createTopLevelSwaggerConfig();

      expect(result.swaggerOptions?.urls).toEqual([{ name: 'Users', url: 'http://localhost:8000/Users.swagger.json' }]);
    });

    it('should handle multiple swagger docs', () => {
      const MockChatsSwagger = class {
        name = 'Chats';
        docs = {
          swagger: '2.0',
          info: { title: 'Chats API' },
          paths: {},
        };
      };

      swaggerService = new SwaggerService([MockUsersSwagger, MockChatsSwagger]);

      const result = swaggerService.createTopLevelSwaggerConfig();

      expect(result.swaggerOptions?.urls).toHaveLength(2);
      expect(result.swaggerOptions?.urls).toContainEqual({
        name: 'Users',
        url: 'http://localhost:8000/Users.swagger.json',
      });
      expect(result.swaggerOptions?.urls).toContainEqual({
        name: 'Chats',
        url: 'http://localhost:8000/Chats.swagger.json',
      });
    });
  });

  describe('createJsonFilesFromAllSwaggerConfigs', () => {
    it('should create JSON files for all swagger configs', () => {
      const outputDir = '/test/output';

      swaggerService.generateSwaggerDocsFromConfigs(outputDir);

      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        `${outputDir}/Users.swagger.json`,
        JSON.stringify({
          swagger: '2.0',
          info: { title: 'Users API', version: '1.0.0' },
          paths: {},
        }),
      );
    });

    it('should handle multiple swagger configs', () => {
      const outputDir = '/test/output';
      const MockChatsSwagger = class {
        name = 'Chats';
        docs = {
          swagger: '2.0',
          info: { title: 'Chats API' },
          paths: {},
        };
      };

      swaggerService = new SwaggerService([MockUsersSwagger, MockChatsSwagger]);

      swaggerService.generateSwaggerDocsFromConfigs(outputDir);

      expect(mockFs.writeFileSync).toHaveBeenCalledTimes(2);
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        `${outputDir}/Users.swagger.json`,
        JSON.stringify(new MockUsersSwagger().docs),
      );
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        `${outputDir}/Chats.swagger.json`,
        JSON.stringify(new MockChatsSwagger().docs),
      );
    });

    it('should handle empty docs array', () => {
      const outputDir = '/test/output';
      swaggerService = new SwaggerService([]);

      swaggerService.generateSwaggerDocsFromConfigs(outputDir);

      expect(mockFs.writeFileSync).not.toHaveBeenCalled();
    });
  });
});
