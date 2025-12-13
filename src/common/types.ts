import type { Application, Express as OriginalExpress } from 'express';
import type { LoggerService } from '../lib/logger-service';

export type OptimizedModules = {
  modules: {
    HealthCheckModule: any;
    UsersModule: {
      usersCrudService: any;
      userUtilitiesService: any;
    };
    AuthenticationModule: {
      getAuthenticationService: () => {
        passwordManagementService: any;
        tokenGenerationService: any;
        tokenVerificationService: any;
      };
    };
    FileUploadModule: {
      fileUploadService: any;
    };
  };
};

export type ServerApp = Application & OptimizedModules;

export type ConfiguredExpress = OriginalExpress & {
  logger: LoggerService;
};
