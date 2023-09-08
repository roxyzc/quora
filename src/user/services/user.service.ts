import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserResponse } from '../dtos/response.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findUsers(skip: number, take: number) {
    try {
      if (skip < 1 || take < 1) {
        throw new BadRequestException(
          'Skip and take must be positive integers.',
        );
      }
      const limit = skip > 10 ? 10 : take;
      const page = take;
      const start = (page - 1) * limit;
      const end = page * limit;
      const [results, total] = await this.userRepository.findAndCount({
        where: {
          active: true,
        },
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
        take: limit,
        skip: start,
      });

      const users = results.map(
        (user) =>
          new UserResponse({
            ...user,
            token: user.token?.accessToken ?? 'undefined',
          }),
      );

      const pagination = {};
      Object.assign(pagination, {
        total_data: total,
        total_page: Math.ceil(total / limit),
      });

      if (end < total) {
        Object.assign(pagination, {
          next: { page: page + 1, limit, remaining: total - (start + limit) },
        });
      }

      if (start > 0) {
        Object.assign(pagination, {
          prev: { page: page - 1, limit, ramaining: total - (total - start) },
        });
      }
      if (page > Math.ceil(total / limit)) {
        Object.assign(pagination, { prev: { remaining: total } });
      }

      return { pagination, users };
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }
}
