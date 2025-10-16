import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CityModule } from './city/city.module';
import { CountryModule } from './country/country.module';
import { ConversationModule } from './conversation/conversation.module';

@Module({
  imports: [
    // config import
    ConfigModule.forRoot({ isGlobal: true }),
    // mongoose import
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
    // own made module imports
    UserModule,
    AuthModule,
    CityModule,
    CountryModule,
    ConversationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
