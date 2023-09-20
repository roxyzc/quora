import { AbstractEntity } from 'src/entities/abstract.entity';
import { Column, Entity, Index, ManyToMany, JoinTable } from 'typeorm';
import { Tags } from './tag.entity';

@Entity()
export class Content extends AbstractEntity<Content> {
  @Column({ length: 250, nullable: false, type: 'varchar' })
  @Index('fulltext_title', { fulltext: true })
  title: string;

  @Column({ type: 'boolean', default: true })
  public: boolean;

  @Column({ type: 'text' })
  content: string;

  @ManyToMany(() => Tags, { cascade: true })
  @JoinTable()
  tags: Tags[];
}
