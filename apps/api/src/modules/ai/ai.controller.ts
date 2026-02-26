// src/ai/tasks/tasks.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';
import { GetInterestsDto, GetProjectsDto, GenerateRoadmapDto } from '@al-jns/contracts';

@Controller('ai')
export class AiController {
    constructor(private readonly aiService: AiService) { }

    @Post('interests')
    async getInterests(@Body() dto: GetInterestsDto) {
        return this.aiService.generateInterests(dto.topic, dto.level);
    }

    @Post('projects')
    async getProjects(@Body() dto: GetProjectsDto) {
        return this.aiService.generateProjects(dto.topic, dto.level, dto.interests);
    }

    @Post('roadmap')
    async generateRoadmap(@Body() dto: GenerateRoadmapDto) {
        return this.aiService.generateRoadmap(dto.topic, dto.level, dto.interests, dto.project);
    }

    @Post('ten-minute-task')
    async generateTenMinuteTask(@Body() dto: { theme: string }) {
        return this.aiService.generateTenMinuteTask(dto.theme);
    }
}