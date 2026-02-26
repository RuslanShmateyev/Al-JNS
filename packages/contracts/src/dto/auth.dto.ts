export class LoginDto {
    email!: string;
    password!: string;
}

export class RegisterDto {
    email!: string;
    password!: string;
    name?: string;
}

export class AuthResponseDto {
    user!: {
        id: string;
        email: string;
        name: string;
    };
    accessToken!: string;
}

export class LinkTelegramDto {
    email!: string;
    password!: string;
    telegramId!: string;
}
