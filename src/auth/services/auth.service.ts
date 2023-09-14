import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { TokenService } from 'src/token/services/token.service';
import { UserRoles } from 'src/enums/userRoles.enum';
import { Token } from 'src/token/entities/token.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import { slug } from 'src/services/slug.service';
import * as bcrypt from 'bcrypt';

interface ISignUpParams {
  username: string;
  password: string;
  email: string;
}

interface ISignInParams {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly tokenService: TokenService,
    private readonly entityManager: EntityManager,
    private readonly userService: UserService,
  ) {}

  async signUp({ email, username, password }: ISignUpParams) {
    let role = UserRoles.USER;

    try {
      const existingUser = await this.userService.findUserByEmail(email);

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      if (email === 'roxyzc12@gmail.com') {
        role = UserRoles.ADMIN;
      }

      await this.entityManager.transaction(async (entityManager) => {
        const createUser = entityManager.create(User, {
          username: slug(username),
          password,
          email,
          role,
        });

        await entityManager.save(createUser);
      });

      return 'Created successfully';
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async signIn({ email, password }: ISignInParams): Promise<{ token: string }> {
    try {
      const user = await this.userService.findUserByEmail(email);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (!user.active) {
        throw new BadRequestException('User is not active');
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        throw new UnauthorizedException('Password invalid');
      }

      let token = user.token?.accessToken;
      if (!user.token) {
        const { accessToken, refreshToken } = await this.tokenService.getToken({
          userId: user.id,
          email,
          role: user.role,
        });

        await this.entityManager.transaction(async (entityManager) => {
          const createToken = entityManager.create(Token, {
            user,
            accessToken,
            refreshToken,
          });

          await entityManager.save(createToken);
        });
        token = accessToken;
      }

      return { token };
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }
}
