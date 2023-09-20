import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AllExceptionsFilter } from './filters/exception-custom.filter';
import { RoleGuard } from './guards/roles.guard';
import { TokenModule } from './token/token.module';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheConfigService } from './cache/cache.service';
import { ContentModule } from './content/content.module';
import config from './config';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.production.env'
          : '.development.env',
      load: [config, databaseConfig],
      expandVariables: true,
      cache: true,
    }),
    CacheModule.registerAsync({
      useClass: CacheConfigService,
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    TokenModule,
    ContentModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
