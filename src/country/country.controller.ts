import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { Country } from './country.schema';

@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Post()
  async create(@Body() dto: CreateCountryDto): Promise<Country> {
    return this.countryService.create(dto);
  }

  @Get()
  async findAll() {
    return this.countryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.countryService.findOne(id);
  }

  @Get(':id/cities')
  async findCities(@Param('id') id: string) {
    return this.countryService.findCities(id);
  }
}
