import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { CustomMailerService } from '../mailer/mailer.service';
import { randomBytes } from 'crypto';
import { HashingService } from 'src/hashing/hashing.service';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly CustomMailerService: CustomMailerService,
    private readonly hashingService: HashingService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await this.hashingService.hashPassword(
        createUserDto.password,
      );

      const existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new BadRequestException('Email already registered');
      }

      const verificationCode = randomBytes(3).toString('hex').toUpperCase();
      const verificationCodeExpiresAt = new Date();
      verificationCodeExpiresAt.setHours(
        verificationCodeExpiresAt.getHours() + 1,
      );

      const user = this.usersRepository.create({
        ...createUserDto,
        password: hashedPassword,
        verificationCode,
        verificationCodeExpiresAt,
      });

      await this.usersRepository.save(user);
      await this.CustomMailerService.sendVerificationEmail(
        user.email,
        verificationCode,
      );

      return { message: 'Verification code sent to email' };
    } catch (error) {
      console.error('Error creating user:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create user';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    try {
      const user = await this.usersRepository.findOne({
        where: { email: verifyEmailDto.email },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.emailVerified) {
        throw new BadRequestException('Email already verified');
      }

      if (
        user.verificationCode !== verifyEmailDto.code ||
        user.verificationCodeExpiresAt! < new Date()
      ) {
        throw new BadRequestException('Invalid or expired verification code');
      }

      user.emailVerified = true;
      user.verificationCode = null;
      user.verificationCodeExpiresAt = null;

      await this.usersRepository.save(user);
      return { message: 'Email verified successfully', user };
    } catch (error) {
      console.error('Error verifying email:', error);
      throw new InternalServerErrorException('Failed to verify email');
    }
  }

  async resendVerificationCode(email: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: { email },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.emailVerified) {
        throw new BadRequestException('Email already verified');
      }

      const verificationCode = randomBytes(3).toString('hex').toUpperCase();
      const verificationCodeExpiresAt = new Date();
      verificationCodeExpiresAt.setHours(
        verificationCodeExpiresAt.getHours() + 1,
      );

      user.verificationCode = verificationCode;
      user.verificationCodeExpiresAt = verificationCodeExpiresAt;

      await this.usersRepository.save(user);
      await this.CustomMailerService.sendVerificationEmail(
        email,
        verificationCode,
      );

      return { message: 'New verification code sent to email' };
    } catch (error) {
      console.error('Error resending verification code:', error);
      throw new InternalServerErrorException(
        'Failed to resend verification code',
      );
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.usersRepository.findOne({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (!user.emailVerified) {
        throw new BadRequestException('Email not verified');
      }

      Object.assign(user, updateUserDto);
      await this.usersRepository.save(user);

      return user;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async updateLocation(id: string, updateLocationDto: UpdateLocationDto) {
    try {
      const user = await this.usersRepository.findOne({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (!user.emailVerified) {
        throw new BadRequestException('Email not verified');
      }

      Object.assign(user, updateLocationDto);
      await this.usersRepository.save(user);

      return user;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new InternalServerErrorException('Failed to update user');
    }
  }
  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
