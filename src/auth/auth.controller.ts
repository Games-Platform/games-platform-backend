import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
  Body,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { CreateUserDto } from 'src/users/dto/createUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe())
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) res) {
    const { access_token, message } = await this.authService.login(req, res);
    return { access_token, message };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google')
  async googleLogin() {
    console.log('Logged in by google');
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async callback(@Req() req, @Res({ passthrough: true }) res) {
    return await this.authService.googleLogin(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res) {
    return this.authService.logout(res);
  }
}
