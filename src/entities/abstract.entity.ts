import { PrimaryGeneratedColumn, Column } from 'typeorm';

export abstract class AbstractEntity<T> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'bigint', unsigned: true })
  createdAt?: number;

  @Column({ type: 'bigint', unsigned: true })
  updatedAt?: number;

  constructor(data: Partial<T>) {
    Object.assign(this, data);
  }
}
