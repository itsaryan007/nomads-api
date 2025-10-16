import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Country, CountryDocument } from './country.schema';
import { CreateCountryDto } from './dto/create-country.dto';
import { CountryResponseDto } from './dto/country-response.dto';
import { City, CityDocument } from '../city/city.schema';

@Injectable()
export class CountryService {
  constructor(
    @InjectModel(Country.name) private countryModel: Model<CountryDocument>,
    @InjectModel(City.name) private cityModel: Model<CityDocument>,
  ) {}

  async create(dto: CreateCountryDto): Promise<Country> {
    return this.countryModel.create(dto);
  }

  async findAll(): Promise<CountryResponseDto[]> {
    const countries = await this.countryModel.find().lean();
    return countries.map(
      (c) => new CountryResponseDto({ ...c, id: c._id.toString() }),
    );
  }

  async findOne(id: string): Promise<CountryResponseDto> {
    const country = await this.countryModel.findById(id).lean();
    if (!country) throw new NotFoundException('Country not found');
    return new CountryResponseDto({ ...country, id: country._id.toString() });
  }

  async findCities(countryId: string): Promise<City[]> {
    return this.cityModel.find({ countryId }).lean();
  }
}
