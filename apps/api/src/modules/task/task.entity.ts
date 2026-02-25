import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    nodeTitle: string;

    @Column({ nullable: false })
    instruction: string;
}
