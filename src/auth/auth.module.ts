import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from './services/auth.service';
import { ControllersController } from './controllers/controllers.controller';
import { Token } from 'src/token/entities/token.entity';
import { UserModule } from 'src/user/user.module';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Token]), UserModule, TokenModule],
  providers: [AuthService],
  controllers: [ControllersController],
})
export class AuthModule {}
