import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Country, CountrySchema } from './country.schema';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';
import { City, CitySchema } from '../city/city.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Country.name, schema: CountrySchema },
      { name: City.name, schema: CitySchema },
    ]),
  ],
  providers: [CountryService],
  controllers: [CountryController],
  exports: [CountryService],
})
export class CountryModule {}
