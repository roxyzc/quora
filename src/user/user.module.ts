import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Token } from 'src/token/entities/token.entity';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserSubscriber } from './subscribers/user.subscribers';

@Module({
  imports: [TypeOrmModule.forFeature([User, Token])],
  controllers: [UserController],
  providers: [UserService, UserSubscriber],
})
export class UserModule {}
