import { GetTokenParams } from '../interfaces/token.interface';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from '../entities/token.entity';
import { User } from 'src/user/entities/user.entity';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);
  private accessTokenSecret: string;
  private refreshTokenSecret: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly entityManager: EntityManager,
    @InjectRepository(User)
    private readonly repositoryUser: Repository<User>,
  ) {
    this.accessTokenSecret = this.configService.getOrThrow('accessTokenSecret');
    this.refreshTokenSecret =
      this.configService.getOrThrow('refreshTokenSecret');
  }

  async getToken(payload: GetTokenParams) {
    const accessToken = jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: '1h',
    });
    const refreshToken = jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: '1d',
    });

    return { accessToken, refreshToken };
  }

  async verifyAccessToken(accessToken: string): Promise<boolean> {
    try {
      jwt.verify(accessToken, this.accessTokenSecret);
      return true;
    } catch (error) {
      return false;
    }
  }

  async verifyRefreshToken(refreshToken: string): Promise<boolean> {
    try {
      jwt.verify(refreshToken, this.refreshTokenSecret);
      return true;
    } catch (error) {
      return false;
    }
  }

  async refreshToken(accessToken: string) {
    try {
      const accessTokenValid = await this.verifyAccessToken(accessToken);

      if (accessTokenValid) {
        throw new BadRequestException('Invalid');
      }

      const findUser = await this.repositoryUser.findOne({
        where: {
          token: {
            accessToken,
          },
        },
        select: {
          id: true,
          email: true,
          role: true,
        },
      });

      if (!findUser) {
        throw new NotFoundException();
      }

      const payload = {
        userId: findUser.id,
        role: findUser.role,
        email: findUser.email,
      };

      const refreshTokenValid = await this.verifyRefreshToken(
        findUser.token.refreshToken,
      );

      if (refreshTokenValid) {
        const token = jwt.sign(payload, this.accessTokenSecret, {
          expiresIn: '1h',
        });
        await this.entityManager.update(
          Token,
          { id: findUser.token.id },
          { accessToken: token },
        );
        return { accessToken: token };
      }

      const token = await this.getToken(payload);
      await this.entityManager.update(Token, { id: findUser.token.id }, token);
      return { token };
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }
}
