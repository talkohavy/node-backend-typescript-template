import type { ControllerFactory } from '../../../lib/lucky-server';
import type { AuthenticationController } from './authentication/authentication.controller';
import type { UsersController } from './users/users.controller';

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
