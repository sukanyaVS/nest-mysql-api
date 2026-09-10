import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { StringValue } from 'ms';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private async signToken(user: { id: number; email: string }, type: 'access' | 'refresh') {
    const isRefresh = type === 'refresh';
    const secretKey = isRefresh
      ? this.configService.get<string>('JWT_REFRESH_SECRET') ?? 'default-refresh-secret'
      : this.configService.get<string>('JWT_SECRET') ?? 'default-secret';

    const expiresIn = (isRefresh
      ? this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d'
      : this.configService.get<string>('JWT_EXPIRES_IN') ?? '1h') as StringValue;

    return this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
        ...(isRefresh ? { type: 'refresh' } : {}),
      },
      {
        secret: secretKey,
        expiresIn,
      },
    );
  }

  async signup(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = hashedPassword;
    return await this.userService.create(createUserDto);
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = await this.signToken(user, 'access');
    const refreshToken = await this.signToken(user, 'refresh');

    const { password, ...userWithoutPassword } = user;
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: userWithoutPassword,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') ?? 'default-refresh-secret',
      });

      const user = await this.userService.findOne(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newAccessToken = await this.signToken(user, 'access');
      const newRefreshToken = await this.signToken(user, 'refresh');

      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
