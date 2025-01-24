import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { CustomMailerService } from '../mailer/mailer.service';
import { AuthController } from 'src/auth/auth.controller';
import { HashingService } from 'src/hashing/hashing.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController, AuthController],
  providers: [
    UsersService,
    CustomMailerService,
    HashingService,
    AuthService,
    JwtService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
