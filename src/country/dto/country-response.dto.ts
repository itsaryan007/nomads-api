import { Exclude, Expose, Transform } from 'class-transformer';

export class CountryResponseDto {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  id: string;

  @Expose()
  name: string;

  @Expose()
  continent: string;

  @Expose()
  flagUrl?: string;

  @Exclude()
  _id: any;

  constructor(partial: Partial<CountryResponseDto>) {
    Object.assign(this, partial);
  }
}
