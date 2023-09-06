import {
  IsEmail,
  IsStrongPassword,
  MinLength,
  MaxLength,
} from 'class-validator';

export class SigninDto {
  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsStrongPassword()
  @MinLength(9)
  @MaxLength(26)
  password: string;
}
