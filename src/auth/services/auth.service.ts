import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { TokenService } from 'src/token/token.service';
import { UserRoles } from 'src/user/interfaces/user.interface';
import { Token } from 'src/token/entities/token.entity';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
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

interface IAuthService {
  signUp(params: ISignUpParams): Promise<string>;
  signIn(params: ISignInParams): Promise<User>;
  findUserByEmail(email: string): Promise<User>;
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly entityManager: EntityManager,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async signUp({ email, username, password }: ISignUpParams) {
    let role = UserRoles.USER;
    try {
      const existingUser = await this.findUserByEmail(email);
      if (existingUser) throw new ConflictException('Email already exists');
      if (email === 'roxyzc12@gmail.com') role = UserRoles.ADMIN;
      const { accessToken, refreshToken } = await this.tokenService.getToken({
        name: username,
        email,
        role,
      });

      await this.entityManager.transaction(async (entityManager) => {
        const token = entityManager.create(Token, {
          accessToken,
          refreshToken,
        });
        const user = entityManager.create(User, {
          username,
          password,
          token,
          email,
          role,
        });
        await entityManager.save(user);
      });
      return accessToken;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async signIn({ email, password }: ISignInParams): Promise<User> {
    try {
      const user = await this.findUserByEmail(email);
      if (!user) throw new NotFoundException('User not found');
      if (user.active === false)
        throw new BadRequestException('User is not active');
      console.log(password, user.password);
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw new BadRequestException('Password invalid');
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
}
