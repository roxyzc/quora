import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';

export class UserInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler) {
    const { user, params } = context.switchToHttp().getRequest();
    if (
      params &&
      params.id &&
      user.userId !== params.id &&
      user.role !== 'admin'
    ) {
      throw new BadRequestException();
    }
    return next.handle();
  }
}
