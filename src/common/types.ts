import type { Application, Express as OriginalExpress } from 'express';
import type { ConfigService } from '../lib/config-service';
import type { LoggerService } from '../lib/logger-service';
import type { AuthenticationModule } from '../modules/authentication';
import type { BooksModule } from '../modules/books';
import type { FileUploadModule } from '../modules/file-upload';
import type { HealthCheckModule } from '../modules/health-check';
import type { UsersModule } from '../modules/users';

export type OptimizedApp = {
  modules: {
    HealthCheckModule: HealthCheckModule;
    UsersModule: UsersModule;
    AuthenticationModule: AuthenticationModule;
    BooksModule: BooksModule;
    FileUploadModule: FileUploadModule;
  };
  configService: ConfigService;
};

export type ServerApp = Application & OptimizedApp;

export type ConfiguredExpress = OriginalExpress & {
  logger: LoggerService;
};
