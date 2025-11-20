import type { DatabaseUser } from '../types';
import type { IUsersRepository } from './interfaces/users.repository.base';
import type {
  GetUserByIdOptions,
  GetUsersProps,
  CreateUserDto,
  UpdateUserDto,
  GetUserByEmailOptions,
} from './interfaces/users.repository.interface';
import { PostgresConnection } from '../../../lib/database/postgres.connection';

export class UsersPostgresRepository implements IUsersRepository {
  private readonly dbClient: PostgresConnection;

  constructor() {
    this.dbClient = PostgresConnection.getInstance();
    this.dbClient.ensureConnected();
    this.initializeTable();
  }

  private async initializeTable(): Promise<void> {
    try {
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS public.users
        (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          nickname VARCHAR(255),
          hashed_password VARCHAR(255) NOT NULL,
          date_of_birth BIGINT,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;

      await this.dbClient.query(createTableQuery);
      console.log('✅ Users table initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing users table:', error);
      throw error;
    }
  }

  async getUserByEmail(email: string, options: GetUserByEmailOptions = {}): Promise<DatabaseUser | null> {
    const fields = options.fields || ['*'];
    const query = `SELECT ${fields.join(', ')} FROM users WHERE email = $1`;
    const result = await this.dbClient.query(query, [email]);

    if (result.rows.length === 0) {
      result.rows.push({
        id: -1,
        nickname: 'dummy',
        email: 'dummy@gmail.com',
        hashed_password:
          'salt:94177b3f3685418853031cda2a9845bc5f7098b0a92b0acdd637694541160da8e2b2607f3331f30bff62746785a63549c05ddf09bf15384077a5f0129bbab2d0',
      } as DatabaseUser);
    }

    return result.rows[0] || null;
  }

  async createUser(body: CreateUserDto): Promise<DatabaseUser> {
    const query = `
      INSERT INTO users (email, hashed_password, nickname, date_of_birth, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING *
    `;
    const values = [body.email, body.hashed_password, body.nickname, body.date_of_birth];

    const result = await this.dbClient.query(query, values);
    return result.rows[0] as DatabaseUser;
  }

  async getUsers(props?: GetUsersProps): Promise<Array<DatabaseUser>> {
    let query = 'SELECT * FROM users';
    const values: any[] = [];
    let paramCount = 0;

    if (props?.filter && Object.keys(props.filter).length > 0) {
      const conditions = Object.keys(props.filter).map((key) => {
        paramCount++;
        values.push(props.filter[key]);
        return `${key} = $${paramCount}`;
      });
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    if (props?.options?.sort && Object.keys(props.options.sort).length > 0) {
      const sortClauses = Object.entries(props.options.sort).map(
        ([field, direction]) => `${field} ${direction === 1 ? 'ASC' : 'DESC'}`,
      );
      query += ` ORDER BY ${sortClauses.join(', ')}`;
    }

    if (props?.options?.limit) {
      query += ` LIMIT ${props.options.limit}`;
    }

    if (props?.options?.skip) {
      query += ` OFFSET ${props.options.skip}`;
    }

    const result = await this.dbClient.query(query, values);
    return result.rows as DatabaseUser[];
  }

  async getUserById(userId: string, _options: GetUserByIdOptions = {}): Promise<DatabaseUser | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await this.dbClient.query(query, [userId]);

    return result.rows[0] || null;
  }

  async updateUserById(userId: string, body: UpdateUserDto): Promise<DatabaseUser> {
    const fields = Object.keys(body).filter(
      (key) => body[key as keyof UpdateUserDto] !== undefined && key !== 'updated_at',
    );
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const values = [userId, ...fields.map((field) => body[field as keyof UpdateUserDto])];

    const query = `
      UPDATE users 
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;

    const result = await this.dbClient.query(query, values);
    return result.rows[0] as DatabaseUser;
  }

  async deleteUserById(userId: string): Promise<boolean> {
    const query = 'DELETE FROM users WHERE id = $1';
    const result = await this.dbClient.query(query, [userId]);

    return (result.rowCount ?? 0) > 0;
  }
}
