import type { Application } from 'express';
import type { ModuleFactory } from '../../lib/lucky-server';
import { TransactionsController } from './transactions.controller';

export class TransactionsModule implements ModuleFactory {
  private static instance: TransactionsModule;

  private constructor() {}

  static getInstance(): TransactionsModule {
    if (!TransactionsModule.instance) {
      TransactionsModule.instance = new TransactionsModule();
    }
    return TransactionsModule.instance;
  }

  attachController(app: Application): void {
    const controller = new TransactionsController(app);

    controller.attachRoutes();
  }
}
