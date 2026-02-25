import { Controller, Post, Body } from '@nestjs/common';
import { RoadmapsService } from './roadmaps.service';
import { Roadmap } from './roadmap.entity';

@Controller('roadmap')
export class RoadmapController {
    constructor(private readonly roadmapService: RoadmapsService) { }

    @Post('generate')
    async generate(@Body('topic') topic: string): Promise<any> {
        return this.roadmapService.generate(topic);
    }
}