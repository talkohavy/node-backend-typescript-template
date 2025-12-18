import type { Application } from 'express';
import { SwaggerModule } from './swagger.module';

const mockSwaggerMiddleware = {
  use: jest.fn(),
};

jest.mock('./middlewares', () => ({
  SwaggerMiddleware: jest.fn().mockImplementation(() => mockSwaggerMiddleware),
}));

const mockApp = {
  use: jest.fn(),
  get: jest.fn(),
  post: jest.fn(),
} as unknown as Application;

describe('SwaggerModule', () => {
  it('should create instance and initialize swagger middleware', () => {
    // Act
    const instance = new SwaggerModule(mockApp);

    // Assert
    expect(instance).toBeInstanceOf(SwaggerModule);
    expect(mockSwaggerMiddleware.use).toHaveBeenCalled();
  });
});
