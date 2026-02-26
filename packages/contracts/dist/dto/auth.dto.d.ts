export declare class LoginDto {
    email: string;
    password: string;
}
export declare class RegisterDto {
    email: string;
    password: string;
    name?: string;
}
export declare class AuthResponseDto {
    user: {
        id: string;
        email: string;
        name: string;
    };
    accessToken: string;
}
export declare class LinkTelegramDto {
    email: string;
    password: string;
    telegramId: string;
}
