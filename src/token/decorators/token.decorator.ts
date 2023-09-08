import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface IUser {
  email: string;
  id: string;
  iat: number;
  exp: number;
}

export const GetToken = createParamDecorator(
  async (data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const token = request.headers?.authorization?.split(' ')[1] ?? undefined;
    return token;
  },
);
