import { Application } from 'express';

export type StaticModule = {
  getInstance: () => RegisteredModule;
};

export type RegisteredModule = {
  attachController(app: Application): void;
};
