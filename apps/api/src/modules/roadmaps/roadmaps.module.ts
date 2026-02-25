import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roadmap } from './roadmap.entity';
import { RoadmapsService } from './roadmaps.service';
import { RoadmapController } from './roadmaps.controller';
import { AiModule } from '../ai/ai.module';

@Module({
    imports: [TypeOrmModule.forFeature([Roadmap]), AiModule],
    controllers: [RoadmapController],
    providers: [RoadmapsService],
    exports: [RoadmapsService],
})
export class RoadmapsModule { }
