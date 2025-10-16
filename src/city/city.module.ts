import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { City, CitySchema } from './city.schema';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: City.name, schema: CitySchema }]),
    UserModule,
  ],
  providers: [CityService],
  controllers: [CityController],
  exports: [CityService],
})
export class CityModule {}
