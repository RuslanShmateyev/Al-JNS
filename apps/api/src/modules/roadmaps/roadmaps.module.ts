import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roadmaps } from './roadmap.entity';
import { RoadmapsService } from './roadmaps.service';
import { RoadmapsController } from './roadmaps.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Roadmaps])],
    controllers: [RoadmapsController],
    providers: [RoadmapsService],
    exports: [RoadmapsService],
})
export class RoadmapsModule { }
