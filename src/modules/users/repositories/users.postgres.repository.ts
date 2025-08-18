import { PostgresConnection } from '../../../lib/database/postgres.connection';
import { DatabaseUser } from '../types';
import { IUsersRepository } from './interfaces/users.repository.base';
import {
  GetUserByIdOptions,
  GetUsersProps,
  CreateUserDto,
  UpdateUserDto,
  GetUserByEmailOptions,
} from './interfaces/users.repository.interface';

export class UsersPostgresRepository implements IUsersRepository {
  constructor(private readonly dbClient: PostgresConnection) {}

  async getUserByEmail(email: string, options: GetUserByEmailOptions = {}): Promise<DatabaseUser | null> {
    const fields = options.fields || ['*'];
    const query = `SELECT ${fields.join(', ')} FROM users WHERE email = $1`;
    const result = await this.dbClient.query(query, [email]);

    return result.rows[0] || null;
  }

  async createUser(body: CreateUserDto): Promise<DatabaseUser> {
    const query = `
      INSERT INTO users (email, hashed_password, nickname, date_of_birth, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING *
    `;
    const values = [body.email, body.hashedPassword, body.nickname || null, body.dateOfBirth || null];

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
