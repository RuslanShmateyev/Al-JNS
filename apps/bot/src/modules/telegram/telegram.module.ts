import { Module } from '@nestjs/common';
import { BotUpdate } from './bot.update';
import { HttpModule } from '@nestjs/axios';
import { ApiService } from './api.service';

@Module({
    imports: [HttpModule],
    providers: [BotUpdate, ApiService],
})
export class TelegramModule { }
