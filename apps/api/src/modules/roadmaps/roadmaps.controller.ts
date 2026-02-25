import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { RoadmapsService } from './roadmaps.service';
import { GetInterestsDto, GetProjectsDto, GenerateRoadmapDto, RoadmapResponseDto } from '@al-jns/contracts';

@Controller('roadmap')
export class RoadmapController {
    constructor(private readonly roadmapService: RoadmapsService) { }

    @Post('generate')
    async generate(
        @Body() dto: GenerateRoadmapDto
    ): Promise<RoadmapResponseDto> {
        return this.roadmapService.generateAndCreate(dto.topic, dto.level, dto.interests, dto.project);
    }

    @Get()
    async findAll(): Promise<RoadmapResponseDto[]> {
        return this.roadmapService.findAll();
    }

    @Post('interests')
    async getInterests(
        @Body() dto: GetInterestsDto
    ): Promise<string[]> {
        return this.roadmapService.getInterests(dto.topic, dto.level);
    }

    @Post('projects')
    async getProjects(
        @Body() dto: GetProjectsDto
    ): Promise<string[]> {
        return this.roadmapService.getProjects(dto.topic, dto.level, dto.interests);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<RoadmapResponseDto> {
        return this.roadmapService.findOne(id);
    }
}