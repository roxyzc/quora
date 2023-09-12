import { Module, ClassSerializerInterceptor } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Token } from 'src/token/entities/token.entity';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserSubscriber } from './subscribers/user.subscribers';
import { UserInterceptor } from './interceptors/user.interceptor';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Module({
  imports: [TypeOrmModule.forFeature([User, Token])],
  controllers: [UserController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    UserService,
    UserSubscriber,
  ],
  exports: [UserService],
})
export class UserModule {}
