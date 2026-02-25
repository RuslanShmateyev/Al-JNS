// src/ai/tasks/tasks.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('ai/tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Post('get-question')
    async getQuestion(@Body() body: { nodeTitle: string, level: string }) {
        return this.tasksService.generateTask(body.nodeTitle, body.level);
    }

    @Post('submit-answer')
    async submit(@Body() body: { task: string, userAnswer: string }) {
        return this.tasksService.checkAnswer(body.task, body.userAnswer);
    }
}