import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('roadmaps')
export class Roadmap {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    title: string;

    @Column({ nullable: false })
    difficulty: number;

    @Column({ nullable: false })
    userid: string;

    @CreateDateColumn()
    createdAt: Date;
}
