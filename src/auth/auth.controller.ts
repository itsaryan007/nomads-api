import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDocument } from 'src/user/user.schema';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto): Promise<{ access_token: string }> {
    const user: UserDocument = await this.authService.validateUser(
      body.email,
      body.password,
    );
    return this.authService.login(user);
  }

  @Post('send-code')
  async sendVerification(
    @Body('email') email: string,
  ): Promise<{ message: string }> {
    await this.authService.sendVerificationCode(email);
    return { message: 'Verification code sent to email' };
  }

  @Post('signup')
  async signup(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ access_token: string }> {
    return this.authService.signup(createUserDto);
  }
}
