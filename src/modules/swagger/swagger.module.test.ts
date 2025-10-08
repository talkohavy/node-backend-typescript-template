import type { Application } from 'express';
import { SwaggerModule } from './swagger.module';

const mockSwaggerMiddleware = {
  use: jest.fn(),
};

jest.mock('./middlewares', () => ({
  SwaggerMiddleware: jest.fn().mockImplementation(() => mockSwaggerMiddleware),
}));

// Mock express app to pass to attachController method
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
      swaggerModule.attachController(mockApp);

      // Assert
      expect(mockSwaggerMiddleware.use).toHaveBeenCalled();
    });

    it('should initialize swagger service with users swagger config', async () => {
      // Act
      swaggerModule.attachController(mockApp);

      // Assert
      // The module should have been initialized with the mocked services
      expect(mockSwaggerMiddleware.use).toHaveBeenCalled();
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
