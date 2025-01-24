import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import * as dotenv from 'dotenv';
import { UsersModule } from 'src/users/users.module';
import { HashingService } from 'src/hashing/hashing.service';

dotenv.config();

console.log('JWT_SECRET:', process.env.JWT_SECRET);

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'default_secret',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, HashingService, JwtService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
