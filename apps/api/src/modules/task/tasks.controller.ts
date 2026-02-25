import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
    constructor(private readonly aiService: AiService) { }

    @Post('interests')
    async getInterests(@Body() body: { topic: string; level: string }) {
        return this.aiService.getInterests(body.topic, body.level);
    }

    @Post('projects')
    async getProjects(@Body() body: { topic: string; level: string; interests: string[] }) {
        return this.aiService.getProjects(body.topic, body.level, body.interests);
    }

    @Post('roadmap')
    async generateRoadmap(@Body() body: { topic: string; level: string; interests: string[]; project: string }) {
        return this.aiService.generateRoadmap(body.topic, body.level, body.interests, body.project);
    }
}