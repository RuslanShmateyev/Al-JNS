import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto, AuthResponseDto } from '@al-jns/contracts';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
        const existingUser = await this.usersService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = await this.usersService.create({
            ...registerDto,
            password: hashedPassword,
        });

        const payload = { sub: user.id, email: user.email };
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name || '',
            },
            accessToken: this.jwtService.sign(payload),
        };
    }

    async login(loginDto: LoginDto): Promise<AuthResponseDto> {
        const user = await this.usersService.findByEmailWithPassword(loginDto.email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: user.id, email: user.email };
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name || '',
            },
            accessToken: this.jwtService.sign(payload),
        };
    }
}
