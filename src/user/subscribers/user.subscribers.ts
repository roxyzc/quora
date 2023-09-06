import {
  EventSubscriber,
  DataSource,
  EntitySubscriberInterface,
  InsertEvent,
} from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo(): typeof User {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>) {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(event.entity.password, salt);
    event.entity.password = hashPassword;
    event.entity.createdAt = new Date().getTime();
    event.entity.updatedAt = new Date().getTime();
  }
}
