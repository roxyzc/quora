import { Controller, HttpStatus, Post } from '@nestjs/common';
import { GetToken } from '../decorators/token.decorator';
import { TokenService } from '../services/token.service';
import { success } from 'src/interfaces/success.interfaces';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post('refreshtoken')
  async refreshToken(
    @GetToken() token: string | undefined,
  ): Promise<success & { accessToken: string; refreshToken?: string }> {
    const data = await this.tokenService.refreshToken(token);
    return {
      statusCode: HttpStatus.ACCEPTED,
      message: 'successfully',
      success: 'Accepted',
      ...data,
    };
  }
}
