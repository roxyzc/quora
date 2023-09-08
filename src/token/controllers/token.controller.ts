import { Controller, Post } from '@nestjs/common';
import { GetToken } from '../decorators/token.decorator';
import { TokenService } from '../services/token.service';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post('refreshtoken')
  async refreshToken(@GetToken() token: string | undefined) {
    const response = await this.tokenService.refreshToken(token);
    return response;
  }
}
