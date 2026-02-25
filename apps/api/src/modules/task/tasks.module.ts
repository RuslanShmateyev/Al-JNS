// src/app.module.ts
import { Module } from '@nestjs/common';
import { AiModule } from './ai.module';
import { UsersModule } from './users.module';
import { RoadmapsModule } from './roadmaps.module';

@Module({
    imports: [
        UsersModule,
        RoadmapsModule,
        AiModule, // Подключаем наш новый AI модуль
    ],
})
export class AppModule { }