import type { Application } from 'express';

export type ServerApp = Application & {
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
