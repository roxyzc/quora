import {
  IsString,
  IsEmail,
  IsStrongPassword,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ValidationUsername } from 'src/decorators/validationUsername.decorator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  @ValidationUsername()
  @MinLength(6)
  @MaxLength(24)
  username: string;

  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsStrongPassword()
  @MinLength(9)
  @MaxLength(26)
  password: string;
}
