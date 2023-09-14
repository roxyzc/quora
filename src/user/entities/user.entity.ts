import { AbstractEntity } from 'src/entities/abstract.entity';
import { Entity, Column, OneToOne, Index } from 'typeorm';
import { UserRoles } from 'src/enums/userRoles.enum';
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
@Index('idx_username', ['username'], { unique: true })
@Index('idx_email', ['email'], { unique: true })
export class User extends AbstractEntity<User> implements IUser {
  @Column({ type: 'varchar', length: 24, unique: true, nullable: false })
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
