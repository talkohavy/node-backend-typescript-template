import { ControllerFactory } from '../../../lib/controller-factory';
import { AuthenticationController } from './authentication/authentication.controller';
import { UsersController } from './users/users.controller';

export class BackendController implements ControllerFactory {
  constructor(
    private readonly authenticationController: AuthenticationController,
    private readonly usersController: UsersController,
  ) {}

  attachRoutes() {
    this.authenticationController.attachRoutes();
    this.usersController.attachRoutes();
  }
}
