import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignupDto } from '../dtos/signUp.dto';
import { SigninDto } from '../dtos/signIn.dto';
import { success } from 'src/interfaces/success.interfaces';

@Controller('auth')
export class ControllersController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: SignupDto): Promise<success> {
    const response = await this.authService.signUp(body);
    return {
      statusCode: HttpStatus.CREATED,
      message: response,
      success: 'Created',
    };
  }

  @Post('signin')
  async signin(@Body() body: SigninDto): Promise<success & { token: string }> {
    const { token } = await this.authService.signIn(body);
    return {
      statusCode: HttpStatus.OK,
      message: 'login successfully',
      success: 'Ok',
      token,
    };
  }
}
