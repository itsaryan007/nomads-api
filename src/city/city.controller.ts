import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { CityService } from './city.service';
import { CreateCityDto } from './dto/create-city.dto';
import { CityRecommendationDto } from './dto/city-recommendation.dto';

@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post()
  async create(@Body() dto: CreateCityDto) {
    return this.cityService.create(dto);
  }

  @Get()
  async findAll() {
    return this.cityService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.cityService.findOne(id);
  }

  @Delete()
  async deleteAll() {
    return this.cityService.deleteAll();
  }

  /** ✅ New: Recommend a city and mark user as ready */
  @Post('recommend')
  async recommendCity(@Body() dto: CityRecommendationDto) {
    return this.cityService.recommendCity({ ...dto });
  }
}
