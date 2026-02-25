import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../../../.env') });

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/al_jns',
    synchronize: false,
    logging: true,
    entities: [User],
    migrations: [path.join(__dirname, '/migrations/**/*{.ts,.js}')],
    subscribers: [],
});
