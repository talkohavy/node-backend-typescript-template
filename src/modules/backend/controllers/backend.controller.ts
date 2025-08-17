import { AuthController } from './auth/auth.controller';
import { UsersController } from './users/users.controller';

export class BackendController {
  constructor(
    private readonly authController: AuthController,
    private readonly usersController: UsersController,
  ) {}

  attachRoutes() {
    this.authController.attachRoutes();
    this.usersController.attachRoutes();
  }
}
