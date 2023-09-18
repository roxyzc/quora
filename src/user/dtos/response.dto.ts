import { Exclude, Expose } from 'class-transformer';

export class UserResponse {
  id: string;
  username: string;
  email: string;

  @Exclude()
  password: string;

  @Expose({ name: 'created_at' })
  createdAt: number;

  @Expose({ name: 'updated_at' })
  updatedAt: number;

  active: boolean;

  @Exclude()
  role: string;

  constructor(partial: Partial<UserResponse>) {
    Object.assign(this, partial);
  }
}
