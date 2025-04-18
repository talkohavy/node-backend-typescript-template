import { Application } from 'express';
import { TransactionsController } from './transactions.controller';

export function attachTransactionsModule(app: Application) {
  const controller = new TransactionsController(app);

  controller.attachRoutes();
}
