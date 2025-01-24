import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { UpdateLocationDto } from './dto/update-location.dto';

interface RequestWithUser extends Request {
  user: JwtPayload;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('verify-email')
  verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.usersService.verifyEmail(verifyEmailDto);
  }

  @Post('resend-code/:email')
  resendVerificationCode(@Param('email') email: string) {
    return this.usersService.resendVerificationCode(email);
  }

  @UseGuards(AuthGuard)
  @Put('profile')
  update(
    @Request() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const { id } = req.user;
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Put('profile/location')
  updateLocation(
    @Request() req: RequestWithUser,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    const { id } = req.user;
    return this.usersService.updateLocation(id, updateLocationDto);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  getProfile(@Request() req: RequestWithUser) {
    const { email } = req.user;
    return this.usersService.findByEmail(email);
  }
}
