import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { CountryService } from 'src/country/country.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const countryService = app.get(CountryService);

  const countries = [
    {
      name: 'Brazil',
      continent: 'South America',
      flagUrl: 'https://flagcdn.com/br.svg',
    },
    {
      name: 'Italy',
      continent: 'Europe',
      flagUrl: 'https://flagcdn.com/it.svg',
    },
    {
      name: 'Thailand',
      continent: 'Asia',
      flagUrl: 'https://flagcdn.com/th.svg',
    },
  ];

  for (const c of countries) {
    try {
      await countryService.create(c);
      console.log(`✔ Seeded ${c.name}`);
    } catch (err) {
      if (err.code === 11000) {
        console.log(`🫤 Already exists: ${c.name}`);
      } else {
        console.error(`😆 Failed seeding ${c.name}`, err);
      }
    }
  }

  await app.close();
}

bootstrap();
