import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

@Module({
    // Здесь регистрируем все контроллеры модуля
    controllers: [
        AiController,
    ],
    // Здесь регистрируем все сервисы, чтобы Nest мог их "инжектить"
    providers: [
        AiService,
    ],
    // Экспортируем сервисы, если они понадобятся в RoadmapsModule или UsersModule
    exports: [
        AiService,
    ],
})
export class AiModule { }