import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { UserRoles } from 'src/enums/userRoles.enum';

interface JWTPayload {
  email: string;
  username: string;
  role: UserRoles;
}

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
    ]);
    if (roles?.length) {
      try {
        const request = context.switchToHttp().getRequest();
        const token = request.headers?.authorization?.split(' ')[1];
        const secret = this.configService.getOrThrow('accessTokenSecret');
        const payload = jwt.verify(token, secret) as JWTPayload;
        if (roles.includes(payload.role)) {
          request.user = payload;
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    }

    return true;
  }
}
