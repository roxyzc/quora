import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRoles } from 'src/types/roles.type';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @Get('all')
  async findUsers(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) take: number,
  ) {
    return await this.userService.findUsers(skip, take);
  }
}
