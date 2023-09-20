import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tags {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 30 })
  title: string;
}
