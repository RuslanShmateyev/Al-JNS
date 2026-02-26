import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AuthResponseDto, LinkTelegramDto, RoadmapResponseDto, UserResponseDto } from '@al-jns/contracts';

@Injectable()
export class ApiService {
    private readonly apiUrl = process.env.API_URL || 'http://localhost:3000';

    constructor(private readonly httpService: HttpService) { }

    async findByTelegramId(telegramId: string): Promise<UserResponseDto | null> {
        try {
            const { data } = await firstValueFrom(
                this.httpService.get<UserResponseDto | null>(`${this.apiUrl}/users/telegram/${telegramId}`)
            );
            return data;
        } catch (error) {
            return null;
        }
    }

    async linkTelegram(dto: LinkTelegramDto): Promise<AuthResponseDto> {
        const { data } = await firstValueFrom(
            this.httpService.post<AuthResponseDto>(`${this.apiUrl}/auth/link-telegram`, dto)
        );
        return data;
    }

    async findAllRoadmaps(token: string): Promise<RoadmapResponseDto[]> {
        const { data } = await firstValueFrom(
            this.httpService.get<RoadmapResponseDto[]>(`${this.apiUrl}/roadmap`, {
                headers: { Authorization: `Bearer ${token}` }
            })
        );
        return data;
    }

    async findActiveNode(roadmapId: string, token: string): Promise<any> {
        const { data } = await firstValueFrom(
            this.httpService.get(`${this.apiUrl}/roadmap/${roadmapId}/active-node`, {
                headers: { Authorization: `Bearer ${token}` }
            })
        );
        return data;
    }

    async generateTenMinuteTask(theme: string, token: string): Promise<any> {
        const { data } = await firstValueFrom(
            this.httpService.post(`${this.apiUrl}/ai/ten-minute-task`, { theme }, {
                headers: { Authorization: `Bearer ${token}` }
            })
        );
        return data;
    }
}
