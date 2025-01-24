import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { HashingService } from 'src/hashing/hashing.service';
import { LoginDto } from 'src/users/dto/login.dto';

import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly hashingService: HashingService,
  ) {}

  async signIn(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new Error('User not found');
    }
    if (
      user &&
      (await this.hashingService.verifyPassword(
        user.password,
        loginDto.password,
      ))
    ) {
      const payload = { email: user.email, sub: user.id };
      const userWithoutPassword = {
        ...user,
        password: undefined,
      };
      return {
        access_token: await this.jwtService.signAsync(payload, {
          secret: `${process.env.JWT_SECRET}`,
        }),
        user: userWithoutPassword,
      };
    }
    throw new Error('Invalid credentials');
  }

  async getMe(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const userWithoutPassword = {
      ...user,
      password: undefined,
    };

    return {
      access_token: await this.jwtService.signAsync(
        { email: user.email, sub: user.id },
        { secret: `${process.env.JWT_SECRET}` },
      ),
      user: userWithoutPassword,
    };
  }
}
