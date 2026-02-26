import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    nodeTitle: string;

    @Column({ nullable: false })
    title: string;

    @Column({ nullable: false })
    description: string;

    @Column({ nullable: false })
    status: string;

    @Column({ nullable: false })
    feedback: string;

    @Column({ nullable: false })
    difficulty: number;

    @Column({ nullable: false })
    authorId: string;

    @ManyToOne(() => User)
    author: User;
}
