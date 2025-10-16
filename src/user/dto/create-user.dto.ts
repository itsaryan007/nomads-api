import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MinLength,
  IsString,
  IsPhoneNumber,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsPhoneNumber(undefined)
  phone?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  dateOfBirth?: Date;

  @IsOptional()
  isVerified?: boolean;

  @IsOptional()
  @IsString()
  verificationCode?: string;

  @IsOptional()
  @IsString()
  isReady?: string;
}
