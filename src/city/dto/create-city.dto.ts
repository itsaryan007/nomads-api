import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsObject,
  IsNumber,
} from 'class-validator';

export class CreateCityDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsMongoId()
  countryId: string;

  @IsOptional()
  @IsString()
  weather?: string;

  @IsOptional()
  @IsString()
  airQuality?: string;

  @IsOptional()
  @IsString()
  bestTaxiApp?: string;

  @IsOptional()
  @IsString()
  visaEase?: string;

  @IsOptional()
  @IsObject()
  costOfLiving?: Record<string, string>;

  @IsOptional()
  @IsString()
  internetSpeed?: string;

  @IsOptional()
  @IsString()
  safety?: string;

  @IsOptional()
  @IsString()
  fun?: string;

  @IsOptional()
  @IsString()
  healthcareAccess?: string;

  @IsOptional()
  @IsString()
  temperature?: string;

  @IsOptional()
  @IsString()
  humidity?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsObject()
  meta?: Record<string, string>;

  @IsOptional()
  @IsNumber()
  internetRating?: number;

  @IsOptional()
  @IsNumber()
  costOfLivingRating?: number;

  @IsOptional()
  @IsNumber()
  safetyRating?: number;

  @IsOptional()
  @IsNumber()
  overallRating?: number;

  @IsOptional()
  @IsNumber()
  lng?: number;

  @IsOptional()
  @IsNumber()
  lat?: number;
}
