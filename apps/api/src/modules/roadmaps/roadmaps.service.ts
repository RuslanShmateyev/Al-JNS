import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roadmap } from './roadmap.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Roadmap)
        private readonly roadmapsRepository: Repository<Roadmap>,
    ) { }

    async findAll(): Promise<Roadmap[]> {
        return this.roadmapsRepository.find();
    }

    async findOne(id: string): Promise<Roadmap> {
        const roadmap = await this.roadmapsRepository.findOne({ where: { id } });
        if (!roadmap) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return roadmap;
    }
}
