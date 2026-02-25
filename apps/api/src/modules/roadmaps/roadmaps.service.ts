import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roadmap } from './roadmap.entity';
import { AiService } from '../ai/ai.service';

@Injectable()
export class RoadmapsService {
    constructor(
        @InjectRepository(Roadmap)
        private readonly roadmapsRepository: Repository<Roadmap>,
        private readonly aiService: AiService,
    ) { }

    async findAll(): Promise<Roadmap[]> {
        return this.roadmapsRepository.find();
    }

    async findOne(id: string): Promise<Roadmap> {
        const roadmap = await this.roadmapsRepository.findOne({ where: { id } });
        if (!roadmap) {
            throw new NotFoundException(`Roadmap with ID ${id} not found`);
        }
        return roadmap;
    }

    async create(roadmap: Partial<Roadmap>): Promise<Roadmap> {
        return this.roadmapsRepository.save(roadmap);
    }

    async generateAndCreate(topic: string, level: string, interests: string[], project: string): Promise<Roadmap> {
        const nodes = await this.generate(topic, level, interests, project);

        const roadmap: Partial<Roadmap> = {
            title: topic,
            nodes: JSON.stringify(nodes),
            userid: "1"
        };

        return await this.create(roadmap);
    }

    async getInterests(topic: string, level: string): Promise<string[]> {
        return this.aiService.generateInterests(topic, level);
    }

    async getProjects(topic: string, level: string, interests: string[]): Promise<string[]> {
        return this.aiService.generateProjects(topic, level, interests);
    }

    async generate(topic: string, level: string, interests: string[], project: string): Promise<any[]> {
        let roadmap = await this.aiService.generateRoadmap(topic, level, interests, project);

        roadmap = await Promise.all(roadmap.map(async node => {
            const extraData = await this.generateNode(level, project, node.title);
            return {
                ...node,
                ...extraData
            };
        }));

        return roadmap;
    }

    async generateNode(level: string, project: string, nodeName: string): Promise<{ description: string, tasks: { title: string, description: string, difficulty: number }[], history: string }> {
        const roadmap = await this.aiService.generateRoadmapNode(level, project, nodeName);
        return roadmap;
    }
}
