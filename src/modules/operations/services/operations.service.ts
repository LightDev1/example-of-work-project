import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientCardsService } from 'src/modules/client-cards/services/client-cards.service';
import { BaseCrudService } from 'src/modules/shared/base-crud/services/base-crud.service';
import { User } from 'src/modules/users/models/user.entity';
import { Repository } from 'typeorm';
import { CreateOperationDto } from '../dto/CreateOperationDto';
import { Operation } from '../models/operation.entity';
import { CreateOperationTransaction } from '../transactions/operations.transaction';

@Injectable()
export class OperationsService extends BaseCrudService<Operation> {
  constructor(
    @InjectRepository(Operation) repository: Repository<Operation>,
    private readonly createOperationTransaction: CreateOperationTransaction,
  ) {
    super(repository);
  }

  public async create(data: CreateOperationDto): Promise<Operation> {
    return this.createOperationTransaction.run(data);
  }

  public getRepo(): Repository<Operation> {
    return this.repository;
  }
}
