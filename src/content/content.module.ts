import { Module } from '@nestjs/common';
import { ContentController } from './controllers/content.controller';
import { ContentService } from './services/content.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Content } from './entities/content.entity';
import { Tags } from './entities/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Content, Tags])],
  controllers: [ContentController],
  providers: [ContentService],
})
export class ContentModule {}
