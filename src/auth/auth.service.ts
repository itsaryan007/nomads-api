import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async sendVerificationCode(email: string): Promise<void> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // save code to user (or temp table)
    await this.userService.updateVerificationCode(email, code);

    await this.mailerService.sendMail({
      to: email,
      subject: 'Your Verification Code',
      template: './verification',
      context: { code },
    });
  }

  async validateUser(email: string, pwd: string): Promise<UserDocument> {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid user');

    const isMatch = await bcrypt.compare(pwd, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async login(user: UserDocument): Promise<{ access_token: string }> {
    const payload = { sub: user._id, email: user.email };
    return { access_token: this.jwtService.sign(payload) };
  }

  async signup(
    createUserDto: CreateUserDto,
  ): Promise<{ access_token: string }> {
    const user = await this.userService.findByEmail(createUserDto.email);
    if (user && user?.isVerified) {
      throw new BadRequestException('User already exists');
    }

    // require verification first
    if (!createUserDto.verificationCode) {
      throw new BadRequestException('Verification code required');
    }

    const dbUser = await this.userService.findByEmail(createUserDto.email);
    if (!dbUser || dbUser.verificationCode !== createUserDto.verificationCode) {
      throw new BadRequestException('Invalid verification code');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const newUser = await this.userService.findByEmailAndUpdate(
      createUserDto.email,
      {
        ...createUserDto,
        password: hashedPassword,
        isVerified: true,
        isReady: false,
      },
    );

    // issue JWT token just like login
    const payload = { sub: newUser._id, email: newUser.email };
    return { access_token: this.jwtService.sign(payload) };
  }
}
