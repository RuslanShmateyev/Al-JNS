import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../modules/users/users.module';
import { UsersController } from '../modules/users/users.controller';
import { AiModule } from '../modules/ai/ai.module';
import { AiController } from '../modules/ai/ai.controller';
import { RoadmapsModule } from '../modules/roadmaps/roadmaps.module';
import { RoadmapController } from '../modules/roadmaps/roadmaps.controller';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/aljns_db',
      autoLoadEntities: true,
      synchronize: false,
    }),
    UsersModule,
    AiModule,
    RoadmapsModule,
  ],
  controllers: [AppController, AiController, UsersController, RoadmapController],
  providers: [AppService],
})
export class AppModule { }
