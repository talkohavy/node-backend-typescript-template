import type { Application } from 'express';
import { SwaggerModule } from './swagger.module';

const mockSwaggerController = {
  registerRoutes: jest.fn(),
};

jest.mock('./controllers', () => ({
  SwaggerController: jest.fn().mockImplementation(() => mockSwaggerController),
}));

const mockApp = {
  use: jest.fn(),
  get: jest.fn(),
  post: jest.fn(),
} as unknown as Application;

describe('SwaggerModule', () => {
  it('should create instance and initialize swagger middleware', () => {
    const instance = new SwaggerModule(mockApp);

    expect(instance).toBeInstanceOf(SwaggerModule);
    expect(mockSwaggerController.registerRoutes).toHaveBeenCalled();
  });
});
