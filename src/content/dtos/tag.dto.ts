import { IsString, IsAlpha, IsNotEmpty } from 'class-validator';

export class TagDto {
  @IsString()
  @IsNotEmpty()
  @IsAlpha()
  title: string;
}
