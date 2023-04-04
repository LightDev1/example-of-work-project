import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { CardStatus } from '../enums/CardStatus';

export class UpdateStatusDto {
  @ApiProperty({ enum: CardStatus })
  @IsEnum(CardStatus)
  status!: CardStatus;
}
