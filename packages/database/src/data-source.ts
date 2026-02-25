import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../../../.env') });

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/al_jns',
    synchronize: false,
    logging: true,
    entities: [path.join(__dirname, '../../../apps/api/src/**/*.entity{.ts,.js}')],
    migrations: [path.join(__dirname, '/migrations/**/*{.ts,.js}')],
    subscribers: [],
});
