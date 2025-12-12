import type { ControllerFactory } from '../../../lib/lucky-server';
import type { UserUtilitiesController } from './user-utilities.controller';
import type { UsersCrudController } from './users-crud.controller';

export class UsersController implements ControllerFactory {
  constructor(
    private readonly userUtilitiesController: UserUtilitiesController,
    private readonly usersCrudController: UsersCrudController,
  ) {}

  registerRoutes() {
    this.userUtilitiesController.registerRoutes();
    this.usersCrudController.registerRoutes();
  }
}
