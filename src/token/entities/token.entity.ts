import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

interface IToken {
  accessToken?: string;
  refreshToken?: string;
  user: User;
}

@Entity()
export class Token implements IToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true, length: 1000 })
  accessToken?: string;

  @Column({ type: 'varchar', nullable: true, length: 1000 })
  refreshToken?: string;

  @OneToOne(() => User, (user) => user.token, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  constructor(data: Partial<Token>) {
    Object.assign(this, data);
  }
}
