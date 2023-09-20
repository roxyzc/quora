import { Body, Controller, Get, Post } from '@nestjs/common';
import { ContentService } from '../services/content.service';
import { CreateContentDto } from '../dtos/content.dto';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post('create')
  async createContent(@Body() body: CreateContentDto) {
    const data = await this.contentService.createContent(body);
    return { data };
  }

  @Get('get/all')
  async getAllContent() {
    return await this.contentService.findAll();
  }
}
