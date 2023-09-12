import { AbstractEntity } from 'src/entities/abstract.entity';
import { Entity, Column, OneToOne, Index } from 'typeorm';
import { UserRoles } from 'src/types/roles.type';
import { Token } from 'src/token/entities/token.entity';

interface IUser {
  username: string;
  email: string;
  password: string;
  active: boolean;
  role: UserRoles;
  token: Token;
}

@Entity()
export class User extends AbstractEntity<User> implements IUser {
  @Column({ type: 'varchar', length: 24, unique: true, nullable: false })
  @Index('index_f_username', { fulltext: true })
  username: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'boolean', default: false })
  active: boolean;

  @Column({ type: 'enum', enum: UserRoles, default: UserRoles.USER })
  role: UserRoles;

  @OneToOne(() => Token, (token) => token.user, {
    eager: true,
  })
  token: Token;
}
