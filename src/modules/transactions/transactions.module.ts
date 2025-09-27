import { Application } from 'express';
import { TransactionsController } from './transactions.controller';

export class TransactionsModule {
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
