import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ITokenParams } from './interfaces/token.interface';
import { ConfigService } from '@nestjs/config';

interface ITokenResponse {
  accessToken: string;
  refreshToken: string;
}

interface ITokenService {
  getToken(payload: ITokenParams): Promise<ITokenResponse>;
}

@Injectable()
export class TokenService implements ITokenService {
  private accessTokenSecret: string;
  private refreshTokenSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.accessTokenSecret = this.configService.getOrThrow('accessTokenSecret');
    this.refreshTokenSecret =
      this.configService.getOrThrow('refreshTokenSecret');
  }

  async getToken(payload: ITokenParams): Promise<ITokenResponse> {
    const accessToken = jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: '1h',
    });
    const refreshToken = jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: '1d',
    });

    return { accessToken, refreshToken };
  }
}
