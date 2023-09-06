import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignupDto } from '../dtos/signUp.dto';
import { SigninDto } from '../dtos/signIn.dto';

@Controller('auth')
export class ControllersController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: SignupDto) {
    return await this.authService.signUp(body);
  }

  @Post('signin')
  async signin(@Body() body: SigninDto) {
    const user = await this.authService.signIn(body);
    return { message: 'login successfully', user };
  }
}
