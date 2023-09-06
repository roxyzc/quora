import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

interface IToken {
  accessToken: string;
  refreshToken: string;
}

@Entity()
export class Token implements IToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false, length: 1000 })
  accessToken: string;

  @Column({ type: 'varchar', nullable: false, length: 1000 })
  refreshToken: string;

  constructor(data: Partial<Token>) {
    Object.assign(this, data);
  }
}
