// src/ai/tasks/tasks.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { AiService } from '../ai/ai.service';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>,
        private aiService: AiService,
    ) { }

    async saveTask(task: Partial<Task>, userId: string): Promise<Task> {
        return this.taskRepository.save({
            ...task,
            authorId: userId,
        });
    }

    async getTaskById(id: string, userId: string): Promise<Task | null> {
        return this.taskRepository.findOne({ where: { id, authorId: userId } });
    }

    async updateTask(id: string, data: Partial<Task>, userId: string): Promise<Task> {
        await this.taskRepository.update({ id, authorId: userId }, data);
        const task = await this.taskRepository.findOne({ where: { id, authorId: userId } });
        if (!task) {
            throw new Error('Task not found');
        }
        return task;
    }

    async generateTask(nodeTitle: string, level: string, userId: string): Promise<Task> {
        const task = await this.aiService.generateTask(nodeTitle, level);
        return this.saveTask({
            nodeTitle,
            status: 'pending',
            ...task
        }, userId);
    }

    async checkAnswer(taskId: string, userAnswer: string, userId: string): Promise<Task> {
        const task = await this.taskRepository.findOne({ where: { id: taskId, authorId: userId } });
        if (!task) {
            throw new Error('Task not found');
        }
        const result = await this.aiService.checkAnswer(task.description, userAnswer);
        return this.saveTask({
            id: taskId,
            ...result
        }, userId);
    }
}