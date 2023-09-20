import { IsString, IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { ValidationString } from 'src/decorators/validationString.decorator';

export class CreateContentDto {
  @ValidationString()
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsBoolean()
  @IsOptional()
  public: boolean;

  @IsString()
  @IsNotEmpty()
  content: string;
}
