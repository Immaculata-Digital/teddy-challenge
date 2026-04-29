import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(process.cwd(), 'back-end/.env') });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'teddy',
  password: process.env.DB_PASS || 'teddy_secret',
  database: process.env.DB_NAME || 'teddy_db',
  synchronize: false,
  logging: true,
  entities: ['back-end/src/**/*.entity{.ts,.js}'],
  migrations: ['back-end/src/database/migrations/*{.ts,.js}'],
  subscribers: [],
});
