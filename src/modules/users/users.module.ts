import { Application } from 'express';
import { ConfigKeys, DatabaseConfig } from '../../configurations';
import { configService } from '../../core';
import { PostgresConnection } from '../../lib/database/postgres.connection';
import { UserUtilitiesController } from './controllers/user-utilities.controller';
import { UsersCrudController } from './controllers/users-crud.controller';
import { UsersController } from './controllers/users.controller';
import { UsersMiddleware } from './middleware/users.middleware';
import { IUsersRepository } from './repositories/interfaces/users.repository.base';
import { UsersPostgresRepository } from './repositories/users.postgres.repository';
import { FieldScreeningService } from './services/field-screening.service';
import { UserUtilitiesService } from './services/user-utilities.service';
import { UsersCrudService } from './services/users-crud.service';
// import { MongodbConnection } from '../../lib/database/mongo.connection';
// import { UsersMongoRepository } from './repositories/users.mongo.repository';

export class UsersModule {
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
    const { connectionString } = configService.get<DatabaseConfig>(ConfigKeys.Database);

    // Initialize repositories
    // const dbClient = MongodbConnection.getInstance(connectionString);
    // await dbClient.connect();
    // this.usersRepository = new UsersMongoRepository(dbClient);
    const dbClient = PostgresConnection.getInstance(connectionString);
    dbClient.connect();
    this.usersRepository = new UsersPostgresRepository(dbClient);

    // Initialize helper services
    const fieldScreeningService = new FieldScreeningService(['hashedPassword'], ['nickname']);

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
