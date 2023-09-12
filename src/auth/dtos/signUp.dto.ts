import {
  IsString,
  IsEmail,
  IsStrongPassword,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsAlphanumeric,
} from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  @IsAlphanumeric()
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
