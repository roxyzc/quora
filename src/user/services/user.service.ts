import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserResponse } from '../dtos/response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findUsers(
    skip: number,
    take: number,
  ): Promise<{ total_data: number; users: UserResponse[] }> {
    const maxSkip = 1000;
    const maxTake = 10;
    try {
      const safeSkip = Math.min(skip, maxSkip);
      const safeTake = Math.min(take, maxTake);
      const [results, total] = await this.userRepository.findAndCount({
        select: {
          id: true,
          username: true,
          email: true,
          active: true,
          createdAt: true,
          updatedAt: true,
          token: {
            accessToken: true,
          },
        },
        take: safeTake,
        skip: safeSkip - 1,
      });
      const users = results.map(
        (user) =>
          new UserResponse({
            ...user,
            token: user.token.accessToken,
          }),
      );

      return { total_data: total, users };
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }
}
