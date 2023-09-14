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
import { reverseSlug, slug } from 'src/services/slug.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async findUsers(page: number, pageSize: number) {
    try {
      if (page < 1 || pageSize < 1) {
        throw new BadRequestException(
          'page and pageSize must be positive integers.',
        );
      }
      const limit = pageSize > 10 ? 10 : pageSize;
      const start = (page - 1) * limit;
      console.log(start);
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
        take: limit,
        skip: start,
      });

      const users = results.map(
        (user) =>
          new UserResponse({
            ...user,
            username: reverseSlug(user.username),
            token: 'rahasia-user',
          }),
      );

      const pagination = {};
      Object.assign(pagination, {
        totalData: total,
        totalPage: Math.ceil(total / limit),
        currentPage: page,
      });

      if (end < total) {
        Object.assign(pagination, {
          next: { page: page + 1, limit, remaining: total - (start + limit) },
        });
      }

      if (start > 0 && page - Math.ceil(total / limit) < 1) {
        Object.assign(pagination, {
          prev: { page: page - 1, limit, ramaining: total - (total - start) },
        });
      }
      console.log(page - Math.ceil(total / limit) === 1);
      if (page - Math.ceil(total / limit) === 1) {
        Object.assign(pagination, {
          prev: { remaining: total },
        });
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
        username: reverseSlug(findUser.username),
        token: 'rahasia-user',
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

  async findUserByUsernameAndEmail(username?: string, email?: string) {
    try {
      const sanitizedUsername = slug(username ?? '');
      const user = await this.userRepository
        .createQueryBuilder()
        .select(['id, username, email, active, createdAt, updatedAt'])
        .where(`username = :username`, { username: sanitizedUsername })
        .orWhere('email = :email', { email })
        .getRawOne();

      if (!user) {
        throw new NotFoundException('user not found');
      }

      return new UserResponse({
        ...user,
        username: reverseSlug(user.username),
      });
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }
}
