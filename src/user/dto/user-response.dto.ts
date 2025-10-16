import { Exclude, Expose, Transform } from 'class-transformer';
import type { FlattenMaps } from 'mongoose';

export class UserResponseDto {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  image?: string;

  @Expose()
  phone?: string;

  @Expose()
  country?: string;

  @Expose()
  dateOfBirth?: Date;

  @Exclude()
  password: string;

  @Exclude()
  verificationCode?: string;

  @Exclude()
  isVerified: boolean;

  @Exclude()
  role: string;

  @Exclude()
  status: string;

  @Exclude()
  __v: number;

  @Exclude()
  _id: FlattenMaps<unknown>;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;

  @Expose()
  isReady?: boolean;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
