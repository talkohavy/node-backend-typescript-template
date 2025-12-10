import type { Application } from 'express';

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
  };
};

export type ServerApp = Application & OptimizedModules;
