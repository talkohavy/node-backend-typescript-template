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

export class UsersModule {
  private usersRepository!: IUsersRepository;
  private usersCrudService!: UsersCrudService;
  private userUtilitiesService!: UserUtilitiesService;

  constructor(private readonly app: any) {
    this.initializeModule();
  }

  private async initializeModule(): Promise<void> {
    // Initialize repositories
    // this.usersRepository = new UsersMongoRepository();
    this.usersRepository = new UsersPostgresRepository();

    // Initialize helper services
    const fieldScreeningService = new FieldScreeningService(['hashed_password'], ['nickname']);

    // Initialize main services
    this.userUtilitiesService = new UserUtilitiesService(this.usersRepository, fieldScreeningService);
    this.usersCrudService = new UsersCrudService(this.usersRepository);

    this.attachController();
  }

  private attachController(): void {
    const userUtilitiesController = new UserUtilitiesController(this.app, this.userUtilitiesService);
    const usersCrudController = new UsersCrudController(this.app, this.usersCrudService);

    const usersController = new UsersController(userUtilitiesController, usersCrudController);
    const usersMiddleware = new UsersMiddleware(this.app);

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
