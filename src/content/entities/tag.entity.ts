import { TitleTags } from 'src/enums/tags.enum';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tags {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ enum: TitleTags, type: 'enum', default: TitleTags.ALL })
  title: TitleTags;
}
