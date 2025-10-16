import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { City } from '../city/city.schema';
import { User } from '../user/user.schema';

export type ConversationDocument = Conversation & Document;

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ type: Types.ObjectId, ref: City.name, required: true })
  cityId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({
    type: [
      {
        sender: { type: String, enum: ['user', 'assistant'], required: true },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  })
  messages: {
    sender: 'user' | 'assistant';
    content: string;
    createdAt: Date;
  }[];
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
