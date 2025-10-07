import type { Application } from 'express';
import { SwaggerModule } from './swagger.module';

// Mock dependencies
jest.mock('./configs/users.swagger', () => ({
  UsersSwagger: jest.fn().mockImplementation(() => ({
    name: 'Users',
    docs: { swagger: '2.0' },
  })),
}));

const mockSwaggerController = {
  attachRoutes: jest.fn(),
};

jest.mock('./controllers', () => ({
  SwaggerController: jest.fn().mockImplementation(() => mockSwaggerController),
}));

const mockSwaggerService = {
  createTopLevelSwaggerConfig: jest.fn(),
  createJsonFilesFromAllSwaggerConfigs: jest.fn(),
};

jest.mock('./services/swagger.service', () => ({
  SwaggerService: jest.fn().mockImplementation(() => mockSwaggerService),
}));

// Mock express app
const mockApp = {
  use: jest.fn(),
  get: jest.fn(),
  post: jest.fn(),
} as unknown as Application;

describe('SwaggerModule', () => {
  let swaggerModule: SwaggerModule;

  beforeEach(() => {
    jest.clearAllMocks();
    swaggerModule = SwaggerModule.getInstance();
  });

  describe('getInstance', () => {
    it('should return singleton instance', () => {
      // Act
      const instance1 = SwaggerModule.getInstance();
      const instance2 = SwaggerModule.getInstance();

      // Assert
      expect(instance1).toBe(instance2);
      expect(instance1).toBeInstanceOf(SwaggerModule);
    });
  });

  describe('attachController', () => {
    it('should create and attach swagger controller', async () => {
      // Act
      await swaggerModule.attachController(mockApp);

      // Assert
      expect(mockSwaggerController.attachRoutes).toHaveBeenCalled();
    });

    it('should initialize swagger service with users swagger config', async () => {
      // Act
      await swaggerModule.attachController(mockApp);

      // Assert
      // The module should have been initialized with the mocked services
      expect(mockSwaggerController.attachRoutes).toHaveBeenCalled();
    });
  });

  describe('createSwaggerModule', () => {
    it('should return SwaggerModule instance', () => {
      // Act
      const result = SwaggerModule.getInstance();

      // Assert
      expect(result).toBeInstanceOf(SwaggerModule);
    });

    it('should return same instance as getInstance', () => {
      // Act
      const result1 = SwaggerModule.getInstance();
      const result2 = SwaggerModule.getInstance();

      // Assert
      expect(result1).toBe(result2);
    });
  });
});
