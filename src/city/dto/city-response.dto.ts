import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { CountryResponseDto } from '../../country/dto/country-response.dto';

export class CityResponseDto {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  id: string;

  @Expose()
  name: string;

  @Expose()
  weather?: string;

  @Expose()
  airQuality?: string;

  @Expose()
  bestTaxiApp?: string;

  @Expose()
  visaEase?: string;

  @Expose()
  costOfLiving?: Record<string, string>;

  @Expose()
  internetSpeed?: string;

  @Expose()
  safety?: string;

  @Expose()
  fun?: string;

  @Expose()
  healthcareAccess?: string;

  @Expose()
  temperature?: string;

  @Expose()
  humidity?: string;

  @Expose()
  image?: string;

  @Expose()
  meta?: Record<string, string>;

  @Expose()
  internetRating?: number;

  @Expose()
  costOfLivingRating?: number;

  @Expose()
  safetyRating?: number;

  @Expose()
  overallRating?: number;

  @Expose()
  lng?: number;

  @Expose()
  lat?: number;

  @Expose({ name: 'countryId' })
  @Type(() => CountryResponseDto)
  country: CountryResponseDto;

  @Exclude()
  _id: any;

  constructor(partial: Partial<CityResponseDto>) {
    Object.assign(this, partial);
  }
}
