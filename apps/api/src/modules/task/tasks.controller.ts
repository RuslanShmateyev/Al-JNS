import { Controller, Post, Body } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/user.entity';

@Controller('task')
export class TaskController {
    constructor(private readonly taskService: TasksService) { }

    @Post('generate')
    async generateTask(
        @Body() body: { nodeTitle: string, level: string },
        @CurrentUser() user: User,
    ): Promise<Task> {
        return this.taskService.generateTask(body.nodeTitle, body.level, user.id);
    }

    @Post('check')
    async checkAnswer(
        @Body() body: { taskId: string, userAnswer: string },
        @CurrentUser() user: User,
    ): Promise<Task> {
        return this.taskService.checkAnswer(body.taskId, body.userAnswer, user.id);
    }
}