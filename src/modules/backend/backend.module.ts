import type { ServerApp } from '../../common/types';
import { IS_MICRO_SERVICES } from '../../common/constants';
import { HealthCheckController } from '../health-check/health-check.controller';
import { AuthDirectAdapter, AuthHttpAdapter, AuthenticationController, type IAuthAdapter } from './authentication';
import { BooksDirectAdapter, BooksHttpAdapter, BooksController, type IBooksAdapter } from './books';
import {
  FileUploadDirectAdapter,
  FileUploadHttpAdapter,
  FileUploadController,
  type IFileUploadAdapter,
} from './file-upload';
import { HttpClient } from './logic/http-client';
import {
  UsersDirectAdapter,
  UsersHttpAdapter,
  UsersCrudController,
  UserUtilitiesController,
  type IUsersAdapter,
} from './users';

/**
 * BackendModule serves as the BFF (Backend-For-Frontend).
 * It owns ALL public-facing routes and orchestrates communication with domain modules.
 *
 * In monolith mode: Uses direct adapters that call module services directly.
 * In micro-services mode: Uses HTTP adapters that make HTTP calls to other services.
 */
export class BackendModule {
  private usersAdapter!: IUsersAdapter;
  private authAdapter!: IAuthAdapter;
  private booksAdapter!: IBooksAdapter;
  private fileUploadAdapter!: IFileUploadAdapter;

  constructor(private readonly app: ServerApp) {
    this.initializeAdapters();
    this.attachRoutes();
  }

  private initializeAdapters(): void {
    if (IS_MICRO_SERVICES) {
      // HTTP adapters for micro-services communication
      const httpClient = new HttpClient(this.app.configService);
      this.usersAdapter = new UsersHttpAdapter(httpClient);
      this.authAdapter = new AuthHttpAdapter(httpClient);
      this.booksAdapter = new BooksHttpAdapter(httpClient);
      this.fileUploadAdapter = new FileUploadHttpAdapter(httpClient);
    } else {
      // Direct adapters wrapping module services (monolith mode)
      const { usersCrudService, userUtilitiesService } = this.app.modules.UsersModule.services;
      const { passwordManagementService, tokenGenerationService, tokenVerificationService } =
        this.app.modules.AuthenticationModule.services;
      const { booksService } = this.app.modules.BooksModule.services;
      const { fileUploadService } = this.app.modules.FileUploadModule.services;

      this.usersAdapter = new UsersDirectAdapter(usersCrudService, userUtilitiesService);
      this.authAdapter = new AuthDirectAdapter(
        passwordManagementService,
        tokenGenerationService,
        tokenVerificationService,
      );
      this.booksAdapter = new BooksDirectAdapter(booksService);
      this.fileUploadAdapter = new FileUploadDirectAdapter(fileUploadService);
    }
  }

  private attachRoutes(): void {
    // BackendModule ALWAYS attaches public routes (it's the BFF)
    const healthCheckController = new HealthCheckController(this.app);
    const authController = new AuthenticationController(this.app, this.authAdapter, this.usersAdapter);
    const usersCrudController = new UsersCrudController(this.app, this.usersAdapter, this.authAdapter);
    const userUtilitiesController = new UserUtilitiesController(this.app, this.usersAdapter, this.authAdapter);
    const booksController = new BooksController(this.app, this.booksAdapter);
    const fileUploadController = new FileUploadController(this.app, this.fileUploadAdapter);

    healthCheckController.registerRoutes();
    authController.registerRoutes();
    usersCrudController.registerRoutes();
    userUtilitiesController.registerRoutes();
    booksController.registerRoutes();
    fileUploadController.registerRoutes();
  }
}
