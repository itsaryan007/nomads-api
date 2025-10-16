import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  image?: string;

  @Prop()
  phone?: string;

  @Prop()
  country?: string;

  @Prop()
  dateOfBirth?: Date;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop()
  verificationCode?: string;

  @Prop({ default: 'user' })
  role: string;

  @Prop({ default: 'active' })
  status: string;

  @Prop()
  isReady?: boolean;

  @Prop()
  lastLogin?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
