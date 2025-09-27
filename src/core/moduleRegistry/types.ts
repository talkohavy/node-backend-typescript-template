import { Application } from 'express';

export type IModule = {
  attachController(app: Application): void;
};
