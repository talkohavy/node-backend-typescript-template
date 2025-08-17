import { UsersCrudController } from './users-crud.controller';

export class UsersController {
  constructor(private readonly usersCrudController: UsersCrudController) {}

  attachRoutes() {
    this.usersCrudController.attachRoutes();
  }
}
