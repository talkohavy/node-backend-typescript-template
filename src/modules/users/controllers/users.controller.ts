import { ControllerFactory } from '../../../lib/lucky-server';
import { UserUtilitiesController } from './user-utilities.controller';
import { UsersCrudController } from './users-crud.controller';

export class UsersController implements ControllerFactory {
  constructor(
    private readonly userUtilitiesController: UserUtilitiesController,
    private readonly usersCrudController: UsersCrudController,
  ) {}

  attachRoutes() {
    this.userUtilitiesController.attachRoutes();
    this.usersCrudController.attachRoutes();
  }
}
