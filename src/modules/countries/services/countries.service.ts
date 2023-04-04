import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginateQuery, Paginated } from 'nestjs-paginate';
import { BaseCrudService } from 'src/modules/shared/base-crud/services/base-crud.service';
import { Repository } from 'typeorm';
import { Country } from '../models/country.entity';

@Injectable()
export class CountriesService extends BaseCrudService<Country> {
  constructor(@InjectRepository(Country) repository: Repository<Country>) {
    super(repository);
  }

  public getMany(query: PaginateQuery): Promise<Paginated<Country>> {
    return super.getMany(query, this.repository, {
      sortableColumns: ['id'],
      maxLimit: 50,
    });
  }
}
