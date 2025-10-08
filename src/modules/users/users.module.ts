import type { Application } from 'express';
import type { ModuleFactory } from '../../lib/lucky-server';
import type { IUsersRepository } from './repositories/interfaces/users.repository.base';
import { UserUtilitiesController } from './controllers/user-utilities.controller';
import { UsersCrudController } from './controllers/users-crud.controller';
import { UsersController } from './controllers/users.controller';
import { UsersMiddleware } from './middleware/users.middleware';
import { UsersPostgresRepository } from './repositories/users.postgres.repository';
import { FieldScreeningService } from './services/field-screening.service';
import { UserUtilitiesService } from './services/user-utilities.service';
import { UsersCrudService } from './services/users-crud.service';
// import { UsersMongoRepository } from './repositories/users.mongo.repository';

export class UsersModule implements ModuleFactory {
  private static instance: UsersModule;
  private usersRepository!: IUsersRepository;
  private usersCrudService!: UsersCrudService;
  private userUtilitiesService!: UserUtilitiesService;

  private constructor() {
    this.initializeModule();
  }

  static getInstance(): UsersModule {
    if (!UsersModule.instance) {
      UsersModule.instance = new UsersModule();
    }
    return UsersModule.instance;
  }

  protected async initializeModule(): Promise<void> {
    // Initialize repositories
    // this.usersRepository = new UsersMongoRepository();
    this.usersRepository = new UsersPostgresRepository();

    // Initialize helper services
    const fieldScreeningService = new FieldScreeningService(['hashed_password'], ['nickname']);

    // Initialize main services
    this.userUtilitiesService = new UserUtilitiesService(this.usersRepository, fieldScreeningService);
    this.usersCrudService = new UsersCrudService(this.usersRepository);
  }

  attachController(app: Application): void {
    const userUtilitiesController = new UserUtilitiesController(app, this.userUtilitiesService);
    const usersCrudController = new UsersCrudController(app, this.usersCrudService);

    const usersController = new UsersController(userUtilitiesController, usersCrudController);
    const usersMiddleware = new UsersMiddleware(app);

    usersMiddleware.use();

    usersController.attachRoutes();
  }

  getUserUtilitiesService(): UserUtilitiesService {
    return this.userUtilitiesService;
  }

  getUsersCrudService(): UsersCrudService {
    return this.usersCrudService;
  }
}
