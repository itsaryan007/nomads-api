// country.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CountryDocument = Country & Document;

@Schema({ timestamps: true })
export class Country {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  continent: string;

  @Prop()
  flagUrl: string;
}

export const CountrySchema = SchemaFactory.createForClass(Country);
