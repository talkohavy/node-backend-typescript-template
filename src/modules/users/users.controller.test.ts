import express, { Application } from 'express';
import request from 'supertest';
import { STATUS_CODES } from '../../common/constants';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

jest.mock('../../lib/logger', () => ({
  logger: {
    debug: jest.fn(),
    info: jest.fn(),
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

describe('UsersController', () => {
  let app: Application;
  let usersService: UsersService;
  let usersController: UsersController;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    usersService = new UsersService();
    usersController = new UsersController(app, usersService);
    usersController.attachRoutes();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch all users', async () => {
    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should fetch a user by ID', async () => {
    const user = await usersService.createUser({ name: 'John Doe' });

    const response = await request(app).get(`/users/${user.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(user);
  });

  it('should return 404 if user not found', async () => {
    const response = await request(app).get('/users/999');

    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    expect(response.body).toEqual({ message: 'User not found' });
  });

  it('should create a new user', async () => {
    const newUser = { name: 'Jane Doe', age: 32, email: 'jane.doe@example.com' };

    const response = await request(app).post('/users').send(newUser);

    expect(response.status).toBe(STATUS_CODES.CREATED);
    expect(response.body).toMatchObject({ id: 2, name: 'Jane Doe', age: 32, email: 'jane.doe@example.com' });
  });

  it('should delete a user', async () => {
    const user = await usersService.createUser({ name: 'John Doe' });

    const response = await request(app).delete(`/users/${user.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'User deleted successfully' });
  });
});
