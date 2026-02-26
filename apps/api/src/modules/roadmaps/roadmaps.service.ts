import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roadmap } from './roadmap.entity';
import { AiService } from '../ai/ai.service';
import type { RoadmapNode, RoadmapResponseDto } from '@al-jns/contracts';

@Injectable()
export class RoadmapsService {
    constructor(
        @InjectRepository(Roadmap)
        private readonly roadmapsRepository: Repository<Roadmap>,
        private readonly aiService: AiService,
    ) { }

    async findAll(userId: string): Promise<RoadmapResponseDto[]> {
        return this.roadmapsRepository.find({ where: { authorId: userId } }).then(async roadmaps => {
            return Promise.all(roadmaps.map(async roadmap => {
                return {
                    ...roadmap,
                    progress: await this.calculateProgress(JSON.parse(roadmap.nodes))
                } as RoadmapResponseDto;
            }));
        });
    }

    async findOne(id: string, userId: string): Promise<RoadmapResponseDto> {
        const roadmap = await this.roadmapsRepository.findOne({ where: { id, authorId: userId } });
        if (!roadmap) {
            throw new NotFoundException(`Roadmap with ID ${id} not found`);
        }
        return {
            ...roadmap,
            progress: await this.calculateProgress(JSON.parse(roadmap.nodes))
        };
    }

    async create(roadmap: Partial<Roadmap>, userId: string): Promise<RoadmapResponseDto> {
        if (!roadmap.nodes) {
            throw new NotFoundException(`Roadmap nodes not found`);
        }

        const newRoadmap = this.roadmapsRepository.create({
            ...roadmap,
            authorId: userId,
        });

        return {
            ...(await this.roadmapsRepository.save(newRoadmap)),
            progress: await this.calculateProgress(JSON.parse(newRoadmap.nodes))
        };
    }

    async generateAndCreate(topic: string, level: string, interests: string[], project: string, userId: string): Promise<RoadmapResponseDto> {
        const nodes = await this.generate(topic, level, interests, project);

        const roadmap: Partial<Roadmap> = {
            title: topic,
            nodes: JSON.stringify(nodes),
        };

        return await this.create(roadmap, userId);
    }

    async getInterests(topic: string, level: string): Promise<string[]> {
        return this.aiService.generateInterests(topic, level);
    }

    async getProjects(topic: string, level: string, interests: string[]): Promise<string[]> {
        return this.aiService.generateProjects(topic, level, interests);
    }

    async generate(topic: string, level: string, interests: string[], project: string): Promise<any[]> {
        let roadmap = await this.aiService.generateRoadmap(topic, level, interests, project);
        let history = "";

        for (let i = 0; i < roadmap.length; i++) {
            const node = roadmap[i];
            const extraData = await this.generateNode(level, project, node.title, history);
            roadmap[i] = {
                ...node,
                ...extraData
            };
            history = extraData.history;
        }

        return roadmap;
    }

    async generateNode(level: string, project: string, nodeName: string, history: string): Promise<{ description: string, tasks: { title: string, description: string, difficulty: number }[], history: string }> {
        const roadmap = await this.aiService.generateRoadmapNode(level, project, nodeName, history);
        return roadmap;
    }

    async completeNode(id: string, nodeName: string, userId: string): Promise<Roadmap> {
        const roadmap = await this.findOne(id, userId);
        const nodes: RoadmapNode[] = JSON.parse(roadmap.nodes);
        const node = nodes.find(n => n.title === nodeName);

        if (!node) {
            throw new NotFoundException(`Node with name ${nodeName} not found`);
        }

        await this.roadmapsRepository.update({ id, authorId: userId }, {
            nodes: JSON.stringify(nodes.map(n => {
                if (n.title === nodeName) {
                    return {
                        ...n,
                        status: 'completed'
                    };
                }
                return n;
            }))
        });

        // Refetch to get updated roadmap
        return this.roadmapsRepository.findOne({ where: { id, authorId: userId } }) as Promise<Roadmap>;
    }

    async findActiveNode(id: string, userId: string): Promise<RoadmapNode | null> {
        const roadmap = await this.findOne(id, userId);
        const nodes: RoadmapNode[] = JSON.parse(roadmap.nodes);
        return nodes.find(n => n.status !== 'completed') || null;
    }

    async calculateProgress(nodes: RoadmapNode[]): Promise<number> {
        const totalDifficulty = nodes.reduce((acc, node) => acc + node.difficulty, 0);
        const completedDifficulty = nodes.filter(n => n.status === 'completed').reduce((acc, node) => acc + node.difficulty, 0);
        return (completedDifficulty / totalDifficulty) * 100;
    }
}
