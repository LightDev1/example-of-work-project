import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Country } from '../../countries/models/country.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserOS } from '../enums/UserOS';
import { UserRole } from '../enums/UserRole';
import { UserStatus } from '../enums/UserStatus';
import { Card } from 'src/modules/cards/models/card.entity';

@Entity('app_user')
export class User {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ example: 'myemail@gmail.com', required: true })
  @Column('varchar', { unique: true })
  email!: string;

  @ApiProperty({ example: 'Имя', required: false })
  @Column('varchar', { nullable: true })
  first_name!: string;

  @ApiProperty({ example: 'Фамилия', required: false })
  @Column('varchar', { nullable: true })
  last_name!: string;

  @ApiProperty({ example: '+71111111111', required: false })
  @Column('varchar', { nullable: true, unique: true })
  phone!: string;

  @ApiProperty()
  @ManyToOne(() => Country)
  @JoinColumn()
  country: Country;

  @ApiProperty({ example: 'Название компании' })
  @Column('varchar', { nullable: true })
  company_name!: string;

  @ApiProperty({ required: false })
  @Column('integer', { default: 0 })
  amount_issued_cards!: number;

  @ApiProperty({ enum: UserStatus, example: UserStatus.ACTIVE })
  @Column('enum', { enum: UserStatus, default: UserStatus.ACTIVE })
  status!: UserStatus;

  @ApiProperty({ enum: UserRole, example: UserRole.ADMIN })
  @Column('enum', { enum: UserRole })
  role!: UserRole;

  @ApiProperty()
  @Column('boolean', { default: false })
  is_confirmed: boolean;

  @Exclude({ toPlainOnly: true })
  @Column('varchar', { nullable: true })
  password!: string;

  @ApiProperty({ required: false })
  @Column('varchar', { nullable: true })
  hashed_refresh_token!: string;

  @ApiProperty({ required: false })
  @Column('boolean', { default: false })
  is_fulfilled!: boolean;

  @ApiProperty({ example: UserOS.ANDROID })
  @Column('enum', { enum: UserOS, nullable: true })
  os!: UserOS;

  @ApiProperty({ type: () => Card })
  @OneToMany(() => Card, (card) => card.company_owner, { cascade: true })
  cards!: Card[];

  @ManyToOne(() => User, (user) => user.operators)
  owner!: User;

  @OneToMany(() => User, (user) => user.owner)
  operators!: User[];
}
