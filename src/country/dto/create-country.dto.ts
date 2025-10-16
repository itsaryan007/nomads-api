import { IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class CreateCountryDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  continent: string;

  @IsOptional()
  @IsUrl()
  flagUrl?: string;
}
