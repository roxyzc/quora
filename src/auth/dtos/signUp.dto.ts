import {
  IsString,
  IsEmail,
  IsStrongPassword,
  IsAlpha,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  @IsAlpha()
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
