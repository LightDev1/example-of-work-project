import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseCrudService } from 'src/modules/shared/base-crud/services/base-crud.service';
import { Repository } from 'typeorm';
import { BonusLevel } from '../models/bonus-level.entity';

@Injectable()
export class BonusLevelsService extends BaseCrudService<BonusLevel> {
  constructor(
    @InjectRepository(BonusLevel)
    repository: Repository<BonusLevel>,
  ) {
    super(repository);
  }

  public getRepo(): Repository<BonusLevel> {
    return this.repository;
  }
}
