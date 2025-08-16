import { Application } from 'express';
import { configService } from '../../lib/config/config.service';
import { PostgresConnection } from '../../lib/database/postgres.connection';
import { UsersController } from './controllers/users.controller';
import { UsersMiddleware } from './middleware/users.middleware';
import { UsersRepository } from './repositories/users.repository';
import { UsersService } from './services/users.service';

class UsersModule {
  private static instance: UsersModule;
  private usersService!: UsersService;
  private usersRepository!: UsersRepository;

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
    const { connectionString } = configService.get<any>('mongodb');

    // Initialize repositories
    const dbClient = PostgresConnection.getInstance(connectionString);
    this.usersRepository = new UsersRepository(dbClient);

    // // Initialize services
    // this.usersTransformerService = new UsersTransformerService();
    // this.fieldScreeningService = new FieldScreeningService(sensitiveFields, nonSensitiveFields);

    this.usersService = new UsersService(this.usersRepository);
    // this.usersRepository,
    // this.usersTransformerService,
    // this.fieldScreeningService,
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
