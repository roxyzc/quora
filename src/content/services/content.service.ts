import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Content } from '../entities/content.entity';
import { Tags } from '../entities/tag.entity';

interface ParamsCreateContent {
  title: string;
  public: boolean;
  content: string;
}

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
    @InjectRepository(Tags) private readonly tagRepository: Repository<Tags>,
    private readonly entityManager: EntityManager,
  ) {}

  async createContent(params: ParamsCreateContent) {
    const create = this.entityManager.create(Content, params);
    await this.entityManager.save(create);
    return { ...create };
  }

  async findAll() {
    const data = this.contentRepository.find({ relations: { tags: true } });
    return data;
  }

  // nanti lagi
  async deleteContent(id: string) {
    try {
      const data = await this.contentRepository.findOne({
        where: { id },
        relations: { tags: true },
      });

      data.tags.forEach(async (tag) => {
        await this.tagRepository.delete({ id: tag.id });
      });
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }
}
