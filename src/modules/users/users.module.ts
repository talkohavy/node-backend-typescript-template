import { Application } from 'express';
import { configService } from '../../lib/config/config.service';
import { PostgresConnection } from '../../lib/database/postgres.connection';
import { UsersController } from './controllers/users.controller';
import { UsersMiddleware } from './middleware/users.middleware';
import { IUsersRepository } from './repositories/interfaces/users.repository.base';
import { UsersPostgresRepository } from './repositories/users.postgres.repository';
import { UserUtilitiesService } from './services/user-utilities.service';
import { UsersCrudService } from './services/users-crud.service';
import { UsersService } from './services/users.service';
// import { MongodbConnection } from '../../lib/database/mongo.connection';
// import { UsersMongoRepository } from './repositories/users.mongo.repository';

class UsersModule {
  private static instance: UsersModule;
  private usersService!: UsersService;
  private usersRepository!: IUsersRepository;

  private constructor() {
    this.initializeModule();
  }

  static getInstance(): UsersModule {
    if (!UsersModule.instance) {
      UsersModule.instance = new UsersModule();
    }
    return UsersModule.instance;
  }

  protected initializeModule(): void {
    const { connectionString } = configService.get<any>('mongodb'); // 'postgres'

    // Initialize repositories
    // const dbClient = MongodbConnection.getInstance(connectionString, dbName);
    // this.usersRepository = new UsersMongoRepository(dbClient);
    const dbClient = PostgresConnection.getInstance(connectionString);
    this.usersRepository = new UsersPostgresRepository(dbClient);

    // Initialize services
    const usersCrudService = new UsersCrudService(this.usersRepository);
    const userUtilitiesService = new UserUtilitiesService(this.usersRepository);
    this.usersService = new UsersService(usersCrudService, userUtilitiesService);
  }

  attachController(app: Application): void {
    const usersController = new UsersController(app, this.usersService);
    const usersMiddleware = new UsersMiddleware(app);

    usersMiddleware.use();

    usersController.attachRoutes();
  }

  getUsersService(): UsersService {
    return this.usersService;
  }
}

export function getUsersModule(): UsersModule {
  return UsersModule.getInstance();
}
