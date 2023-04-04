import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from '../enums/TaskStatus';

@Entity('task')
export class Task {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ example: TaskStatus.PENDING })
  @Column('enum', {
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status!: TaskStatus;

  @ApiProperty()
  @Column('varchar', { nullable: true })
  failed_reason!: string;

  @ApiProperty()
  @Column('jsonb', { nullable: true })
  meta!: object;
}
