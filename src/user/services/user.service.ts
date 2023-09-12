import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserResponse } from '../dtos/response.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async findUsers(skip: number, take: number) {
    try {
      if (skip < 1 || take < 1) {
        throw new BadRequestException(
          'Skip and take must be positive integers.',
        );
      }
      const limit = take > 10 ? 10 : take;
      const page = skip;
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
        },
        take: page - 1,
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
        totalData: total,
        totalPage: Math.ceil(total / limit),
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

  async findUserById(id: string): Promise<UserResponse> {
    try {
      const value = await this.cacheManager.get(`key=${id}`);
      if (value) return new UserResponse(value);
      const findUser = await this.userRepository.findOne({
        where: { id },
        select: {
          id: true,
          username: true,
          email: true,
          active: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (!findUser) throw new NotFoundException('User not found');

      const user = new UserResponse({
        ...findUser,
        token: 'rahasia',
      });

      await this.cacheManager.set(`key=${id}`, user);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async findUsersByIndexFullText(username: string) {
    try {
      const users = await this.userRepository
        .createQueryBuilder()
        .select()
        .where(`MATCH(username) AGAINST ("${username} " IN BOOLEAN MODE)`)
        .getMany();

      return users;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }
}
