import fs from 'fs';
import { SwaggerService } from './swagger.service';

jest.mock('fs', () => ({
  writeFileSync: jest.fn(),
}));

const mockFs = fs as jest.Mocked<typeof fs>;

jest.mock('../configs/users.swagger', () => ({
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
  let mockUsersSwagger: any;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.USERS_SERVICE_BASE_URL = 'http://localhost:8001';
    mockUsersSwagger = {
      name: 'Users',
      docs: {
        swagger: '2.0',
        info: { title: 'Users API', version: '1.0.0' },
        paths: {},
      },
    };
    swaggerService = new SwaggerService([mockUsersSwagger]);
  });

  describe('constructor', () => {
    it('should initialize with swagger docs array', () => {
      // @ts-ignore
      expect(swaggerService.docsArr).toEqual([mockUsersSwagger]);
    });
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

      expect(result.swaggerOptions?.urls).toEqual([{ name: 'Users', url: 'http://localhost:8001/Users.swagger.json' }]);
    });

    it('should handle multiple swagger docs', () => {
      const mockChatsSwagger = {
        name: 'Chats',
        docs: {
          swagger: '2.0',
          info: { title: 'Chats API' },
          paths: {},
        },
      };

      swaggerService = new SwaggerService([mockUsersSwagger, mockChatsSwagger]);

      const result = swaggerService.createTopLevelSwaggerConfig();

      expect(result.swaggerOptions?.urls).toHaveLength(2);
      expect(result.swaggerOptions?.urls).toContainEqual({
        name: 'Users',
        url: 'http://localhost:8001/Users.swagger.json',
      });
      expect(result.swaggerOptions?.urls).toContainEqual({
        name: 'Chats',
        url: 'http://localhost:8001/Chats.swagger.json',
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
      const mockChatsSwagger = {
        name: 'Chats',
        docs: {
          swagger: '2.0',
          info: { title: 'Chats API' },
          paths: {},
        },
      };

      swaggerService = new SwaggerService([mockUsersSwagger, mockChatsSwagger]);

      swaggerService.generateSwaggerDocsFromConfigs(outputDir);

      expect(mockFs.writeFileSync).toHaveBeenCalledTimes(2);
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        `${outputDir}/Users.swagger.json`,
        JSON.stringify(mockUsersSwagger.docs),
      );
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        `${outputDir}/Chats.swagger.json`,
        JSON.stringify(mockChatsSwagger.docs),
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
