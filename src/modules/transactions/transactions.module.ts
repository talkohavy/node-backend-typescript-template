import type { Application } from 'express';
import { TransactionsController } from './transactions.controller';

export class TransactionsModule {
  private static instance: TransactionsModule;

  static getInstance(app?: any): TransactionsModule {
    if (!TransactionsModule.instance) {
      TransactionsModule.instance = new TransactionsModule(app);
    }
    return TransactionsModule.instance;
  }

  private constructor(private readonly app: any) {
    this.initializeModule();
  }

  private initializeModule(): void {
    this.attachController(this.app);
  }

  private attachController(app: Application): void {
    const controller = new TransactionsController(app);

    controller.attachRoutes();
  }
}
