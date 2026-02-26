import { Controller, Get, Param, Patch, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponseDto, UpdateUserDto } from '@al-jns/contracts';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getMe(@CurrentUser() user: any): Promise<UserResponseDto> {
        const u = await this.usersService.findOne(user.userId);
        return {
            id: u.id,
            email: u.email,
            name: u.name || '',
            createdAt: u.createdAt,
            telegramId: u.telegramId,
        } as any;
    }

    @UseGuards(JwtAuthGuard)
    @Patch('me')
    async updateMe(@CurrentUser() user: any, @Body() updateDto: UpdateUserDto): Promise<UserResponseDto> {
        const u = await this.usersService.update(user.userId, updateDto);
        return {
            id: u.id,
            email: u.email,
            name: u.name || '',
            createdAt: u.createdAt,
            telegramId: u.telegramId,
        } as any;
    }

    @Get()
    async findAll(): Promise<UserResponseDto[]> {
        return this.usersService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<UserResponseDto> {
        return this.usersService.findOne(id);
    }

    @Get('telegram/:telegramId')
    async findByTelegramId(@Param('telegramId') telegramId: string): Promise<UserResponseDto | null> {
        const user = await this.usersService.findByTelegramId(telegramId);
        if (!user) return null;
        return {
            id: user.id,
            email: user.email,
            name: user.name || '',
            createdAt: user.createdAt,
        };
    }
}
