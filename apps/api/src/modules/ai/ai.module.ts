import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
    // Здесь регистрируем все контроллеры модуля
    controllers: [
        AiController,
        TasksController
    ],
    // Здесь регистрируем все сервисы, чтобы Nest мог их "инжектить"
    providers: [
        AiService,
        TasksService
    ],
    // Экспортируем сервисы, если они понадобятся в RoadmapsModule или UsersModule
    exports: [
        AiService,
        TasksService
    ],
})
export class AiModule { }