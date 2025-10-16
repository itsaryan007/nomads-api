import { IsString, IsOptional } from 'class-validator';

export class CityRecommendationDto {
  @IsString()
  wifiPreference: string;

  @IsString()
  workspacePreference: string;

  @IsString()
  cityPreference: string;

  @IsString()
  incomeRange: string;

  @IsString()
  citizenshipCountry: string;

  @IsOptional()
  @IsString()
  userId?: string;
}
