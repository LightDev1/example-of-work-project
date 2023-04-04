import { paginate, PaginateConfig, PaginateQuery } from 'nestjs-paginate';
import {
  EntityTarget,
  FindOneOptions,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class BaseCrudService<Entity> {
  constructor(public repository: Repository<Entity>) {}

  public async create(data: Entity | object): Promise<Entity> {
    const entity = await this.repository.create(data as any);
    const savedEntity = await this.repository.save(entity as any);
    return savedEntity as unknown as Entity;
  }

  public async createMany(data: Entity[] | object[]): Promise<Entity[]> {
    const entity = await this.repository.create(data as any);
    return this.repository.save(entity as any);
  }

  public async update(
    id: number | string,
    data: QueryDeepPartialEntity<Entity>,
  ): Promise<Entity> {
    await this.repository.update(id, data);
    return this.repository.findOne(id);
  }

  public getOne(
    id: number | string,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity> {
    return this.repository.findOne(id, options);
  }

  public getMany(
    query: PaginateQuery,
    repo: Repository<Entity> | SelectQueryBuilder<Entity>,
    config: PaginateConfig<Entity>,
  ) {
    return paginate(query, repo, config);
  }

  public async delete(id: number | string): Promise<void> {
    await this.repository.delete(id);
  }

  public createRelation(
    targetEntity: EntityTarget<Entity>,
    entityOrId: number | string | Entity,
    relation: string,
    addingValue: any,
  ): Promise<void> {
    return this.repository
      .createQueryBuilder()
      .relation(targetEntity, relation)
      .of(entityOrId)
      .add(addingValue);
  }

  public removeRelation(
    targetEntity: EntityTarget<Entity>,
    entityOrId: number | string | Entity,
    relation: string,
    removingValue: any,
  ): Promise<void> {
    return this.repository
      .createQueryBuilder()
      .relation(targetEntity, relation)
      .of(entityOrId)
      .remove(removingValue);
  }

  public getOneBy(options: FindOneOptions<Entity>): Promise<Entity> {
    return this.repository.findOne(options);
  }
}
