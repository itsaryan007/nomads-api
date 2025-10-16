import { ConfigService } from '@nestjs/config';

export function getAppConfig(config: ConfigService) {
  return {
    port: config.get<number>('PORT', 3000),
    mongoUri: config.get<string>('MONGO_URI'),
    nodeEnv: config.get<string>('NODE_ENV', 'development'),
  };
}
