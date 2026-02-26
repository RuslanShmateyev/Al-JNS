import { Update, Start, Hears, Action, Ctx } from 'nestjs-telegraf';
import { Context, Markup } from 'telegraf';
import { ApiService } from './api.service';
import { Injectable } from '@nestjs/common';

@Update()
@Injectable()
export class BotUpdate {
    private readonly tokens = new Map<string, string>();

    constructor(private readonly apiService: ApiService) { }

    @Start()
    async onStart(@Ctx() ctx: Context) {
        if (!ctx.from) return;
        const telegramId = ctx.from.id.toString();
        const user = await this.apiService.findByTelegramId(telegramId);

        if (user) {
            await ctx.reply(
                `Welcome back, ${user.name || user.email}!`,
                Markup.keyboard([
                    ['Get list of my roadmaps'],
                    ['Get task for 10 minutes'],
                ]).resize(),
            );
        } else {
            await ctx.reply(
                'Welcome! To use this bot, please login first using /login <email> <password>',
            );
        }
    }

    @Hears(/^\/login (.+) (.+)$/)
    async onLogin(@Ctx() ctx: Context) {
        if (!ctx.from) return;
        const [, email, password] = (ctx as any).match;
        const telegramId = ctx.from.id.toString();

        try {
            const auth = await this.apiService.linkTelegram({ email, password, telegramId });
            this.tokens.set(telegramId, auth.accessToken);

            await ctx.reply(
                'Login successful!',
                Markup.keyboard([
                    ['Get list of my roadmaps'],
                    ['Get task for 10 minutes'],
                ]).resize(),
            );
        } catch (error) {
            await ctx.reply('Login failed. Please check your credentials.');
        }
    }

    @Hears('Get list of my roadmaps')
    async onGetRoadmaps(@Ctx() ctx: Context): Promise<any> {
        if (!ctx.from) return;
        const telegramId = ctx.from.id.toString();
        const token = this.tokens.get(telegramId);

        if (!token) {
            return ctx.reply('Please login first using /login <email> <password>');
        }

        try {
            const roadmaps = await this.apiService.findAllRoadmaps(token);
            if (roadmaps.length === 0) {
                return ctx.reply('You have no roadmaps yet.');
            }

            const buttons = roadmaps.map((r) => [
                Markup.button.callback(r.title, `roadmap_${r.id}`),
            ]);

            await ctx.reply('Your roadmaps:', Markup.inlineKeyboard(buttons));
        } catch (error) {
            await ctx.reply('Failed to fetch roadmaps. You might need to login again.');
        }
    }

    @Action(/^roadmap_(.+)$/)
    async onRoadmapClick(@Ctx() ctx: Context): Promise<any> {
        const roadmapId = (ctx as any).match[1];
        if (!ctx.from) return;
        const telegramId = ctx.from.id.toString();
        const token = this.tokens.get(telegramId);

        if (!token) {
            return ctx.reply('Please login again.');
        }

        try {
            const activeNode = await this.apiService.findActiveNode(roadmapId, token);
            if (activeNode) {
                await ctx.reply(
                    `Active Node: ${activeNode.title}\n\nDescription: ${activeNode.description}`,
                );
            } else {
                await ctx.reply('No active nodes found for this roadmap.');
            }
        } catch (error) {
            await ctx.reply('Error fetching active node.');
        }
        await ctx.answerCbQuery();
    }

    @Hears('Get task for 10 minutes')
    async onGetTask(@Ctx() ctx: Context): Promise<any> {
        if (!ctx.from) return;
        const telegramId = ctx.from.id.toString();
        if (!this.tokens.has(telegramId)) {
            return ctx.reply('Please login first using /login <email> <password>');
        }
        await ctx.reply('What theme are you interested in?');
    }

    @Hears(/^(?!\/|Get list of my roadmaps|Get task for 10 minutes).+$/)
    async onThemeMessage(@Ctx() ctx: Context): Promise<any> {
        if (!ctx.from) return;
        const telegramId = ctx.from.id.toString();
        const token = this.tokens.get(telegramId);

        if (!token) return;

        const message = (ctx as any).message.text;
        await ctx.reply('Generating your 10-minute task...');

        try {
            const task = await this.apiService.generateTenMinuteTask(message, token);
            await ctx.reply(
                `Task: ${task.title}\n\nDescription: ${task.description}\nDifficulty: ${task.difficulty}`,
            );
        } catch (error) {
            await ctx.reply('Failed to generate task.');
        }
    }
}
