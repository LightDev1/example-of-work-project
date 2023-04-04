import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from '../dto/CreateTaskDto';
import { Task } from '../models/tasks.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly repository: Repository<Task>,
  ) {}

  public create(data: CreateTaskDto): Promise<Task> {
    return this.repository.save(data);
  }

  public findById(id: number): Promise<Task> {
    return this.repository.findOne(id);
  }

  public update(data: Partial<Task> & { id: Task['id'] }): Promise<Task> {
    return this.repository.save(data);
  }
}
