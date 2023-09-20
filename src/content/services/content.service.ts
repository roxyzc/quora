import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Content } from '../entities/content.entity';

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
    private readonly entityManager: EntityManager,
  ) {}

  async createContent(params: ParamsCreateContent) {
    const create = this.entityManager.create(Content, params);
    await this.entityManager.save(create);
    return { ...create };
  }
}
