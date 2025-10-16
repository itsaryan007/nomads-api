import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Country } from '../country/country.schema';

export type CityDocument = City & Document;

@Schema({ timestamps: true })
export class City {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: Country.name, required: true })
  countryId: Types.ObjectId;

  @Prop()
  weather: string;

  @Prop()
  airQuality: string;

  @Prop()
  bestTaxiApp: string;

  @Prop()
  visaEase: string;

  @Prop({ type: Map, of: String })
  costOfLiving: Record<string, string>;

  @Prop()
  internetSpeed: string;

  @Prop()
  safety: string;

  @Prop()
  fun: string;

  @Prop()
  healthcareAccess: string;

  @Prop()
  temperature: string;

  @Prop()
  humidity: string;

  @Prop()
  image: string;

  @Prop({ type: Map, of: String })
  meta: Record<string, string>;

  @Prop()
  internetRating: number;

  @Prop()
  costOfLivingRating: number;

  @Prop()
  safetyRating: number;

  @Prop()
  overallRating: number;

  @Prop()
  lng: number;

  @Prop()
  lat: number;
}

export const CitySchema = SchemaFactory.createForClass(City);
