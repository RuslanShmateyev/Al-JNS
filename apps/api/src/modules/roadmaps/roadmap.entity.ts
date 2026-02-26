import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('roadmaps')
export class Roadmap {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    title: string;

    @Column({ nullable: false })
    nodes: string;

    @Column({ nullable: false })
    authorId: string;

    @ManyToOne(() => User)
    author: User;

    @CreateDateColumn()
    createdAt: Date;
}
