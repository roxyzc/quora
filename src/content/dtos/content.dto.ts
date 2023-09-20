import {
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ValidationString } from 'src/decorators/validationString.decorator';
import { TagDto } from './tag.dto';
import { ValidationArray } from 'src/decorators/validationArray.decorator';

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

  @IsArray()
  @Type(() => TagDto)
  @ValidationArray({ each: true })
  @IsOptional()
  tags: TagDto[];
}
