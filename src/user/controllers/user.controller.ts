import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  Param,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRoles } from 'src/enums/userRoles.enum';
import { success } from 'src/interfaces/success.interfaces';
import { UserResponse } from '../dtos/response.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @Get('/find/all')
  async findUsers(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<
    success & { data: { pagination?: object; users: UserResponse[] } }
  > {
    const users = await this.userService.findUsers(page, limit);
    return {
      statusCode: HttpStatus.OK,
      success: 'Ok',
      message: 'successfully',
      data: { ...users },
    };
  }

  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @Get('/find/:id')
  async findUserById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<success & { data: UserResponse }> {
    const user = await this.userService.findUserById(id);
    return {
      statusCode: HttpStatus.OK,
      success: 'Ok',
      message: 'successfully',
      data: user,
    };
  }

  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @Get('search')
  async searchUsers(
    @Query('username') username: string,
    @Query('email') email: string,
  ): Promise<success & { data: UserResponse }> {
    const user = await this.userService.findUserByUsernameAndEmail(
      username,
      email,
    );
    return {
      statusCode: HttpStatus.OK,
      success: 'Ok',
      message: 'successfully',
      data: user,
    };
  }
}
