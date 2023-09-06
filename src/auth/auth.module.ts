import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from './services/auth.service';
import { ControllersController } from './controllers/controllers.controller';
import { Token } from 'src/token/entities/token.entity';
import { TokenService } from 'src/token/token.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Token])],
  providers: [AuthService, TokenService],
  controllers: [ControllersController],
})
export class AuthModule {}
