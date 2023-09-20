import { Module } from '@nestjs/common';
import { ContentController } from './controllers/content.controller';
import { ContentService } from './services/content.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Content } from './entities/content.entity';
import { Tags } from './entities/tag.entity';
import { ContentSubscriber } from './subscribers/content.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([Content, Tags])],
  controllers: [ContentController],
  providers: [ContentService, ContentSubscriber],
})
export class ContentModule {}
