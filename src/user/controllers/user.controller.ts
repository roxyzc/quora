import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRoles } from 'src/types/roles.type';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @Get('/find/all')
  async findUsers(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) take: number,
  ) {
    return await this.userService.findUsers(skip, take);
  }

  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @Get('/find/:id')
  async findUserById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.findUserById(id);
  }

  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @Get('search')
  async searchUsers(@Query('username') username: string) {
    return await this.userService.findUsersByIndexFullText(username);
  }
}
