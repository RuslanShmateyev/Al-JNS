import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { RoadmapsService } from './roadmaps.service';
import { GetInterestsDto, GetProjectsDto, GenerateRoadmapDto, RoadmapResponseDto, CompleteNodeDto } from '@al-jns/contracts';
import { Roadmap } from './roadmap.entity';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/user.entity';

@Controller('roadmap')
export class RoadmapController {
    constructor(private readonly roadmapService: RoadmapsService) { }

    @Post('generate')
    async generate(
        @Body() dto: GenerateRoadmapDto,
        @CurrentUser() user: User,
    ): Promise<RoadmapResponseDto> {
        return this.roadmapService.generateAndCreate(dto.topic, dto.level, dto.interests, dto.project, user.id);
    }

    @Get()
    async findAll(@CurrentUser() user: User): Promise<RoadmapResponseDto[]> {
        return this.roadmapService.findAll(user.id);
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
    async findOne(@Param('id') id: string, @CurrentUser() user: User): Promise<RoadmapResponseDto> {
        return this.roadmapService.findOne(id, user.id);
    }

    @Post('completeNode')
    async completeNode(
        @Body() dto: CompleteNodeDto,
        @CurrentUser() user: User,
    ): Promise<Roadmap> {
        return this.roadmapService.completeNode(dto.id, dto.nodeName, user.id);
    }
}