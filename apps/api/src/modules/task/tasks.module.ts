// src/app.module.ts
import { Module } from '@nestjs/common';
import { TaskController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { AiModule } from '../ai/ai.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Task]), AiModule
    ],
    controllers: [TaskController],
    providers: [TasksService],
})
export class TasksModule { }