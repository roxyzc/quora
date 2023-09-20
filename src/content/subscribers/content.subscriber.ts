import {
  EventSubscriber,
  DataSource,
  EntitySubscriberInterface,
  InsertEvent,
} from 'typeorm';
import { Content } from '../entities/content.entity';

@EventSubscriber()
export class ContentSubscriber implements EntitySubscriberInterface<Content> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo(): typeof Content {
    return Content;
  }

  beforeInsert(event: InsertEvent<Content>) {
    event.entity.createdAt = new Date().getTime();
    event.entity.updatedAt = new Date().getTime();
  }
}
