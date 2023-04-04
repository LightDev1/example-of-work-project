import { ApiProperty } from '@nestjs/swagger';
import { ClientCard } from 'src/modules/client-cards/models/client-card.entity';
import { IsWriteOffBonusesValid } from '../validations/operations.validator';

export class CreateOperationDto {
  @ApiProperty({ example: 1000 })
  product_cost!: number;

  @ApiProperty({ example: 950 })
  purchase_amount!: number;

  @ApiProperty({ example: 50 })
  @IsWriteOffBonusesValid()
  written_off_bonuses!: number;

  @ApiProperty({ example: '952845358328825' })
  check_number!: string;

  @ApiProperty({
    type: ClientCard,
    description: 'Также можно передать всего лишь значение поля id',
  })
  client_card!: ClientCard;
}
