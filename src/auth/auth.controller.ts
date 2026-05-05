import { Controller, Get, Post, Body, UseGuards, Request, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthResponseDto } from './dto/auth-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<{
    statusCode: number;
    message: string;
    data: AuthResponseDto;
  }> {
    const user = this.authService.register(registerDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User registered successfully',
      data: await user,
    };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{
    statusCode: number;
    message: string;
    data: AuthResponseDto;
  }> {
    const result = await this.authService.login(loginDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Login successful',
      data: result,
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req): Promise<{
    statusCode: number;
    message: string;
    data: any;
  }> {
    const user = this.authService.getProfile(req.user);
    return {
      statusCode: HttpStatus.OK,
      message: 'Profile retrieved successfully',
      data: await user,
    };
  }

  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }
}
