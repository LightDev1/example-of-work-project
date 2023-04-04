import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('app_file')
class AppFile {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  public id: number;

  @ApiProperty()
  @Column('varchar', { default: 'file' })
  public title: string;

  @ApiProperty()
  @Column()
  public url: string;

  @ApiProperty()
  @Column()
  public key: string;

  @ApiProperty()
  @Column('integer', { default: 0 })
  public size: number;

  @ApiProperty()
  @Column('varchar', { default: '' })
  public extension: string;

  @ApiProperty()
  @Column('varchar', { default: '' })
  public mime_type: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}

export default AppFile;
