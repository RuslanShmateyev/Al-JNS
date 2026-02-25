import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

@Module({
    controllers: [AiController],
    providers: [AiService],
    exports: [AiService], // Экспортируем, если захотим использовать в RoadmapsModule
})
export class AiModule { }