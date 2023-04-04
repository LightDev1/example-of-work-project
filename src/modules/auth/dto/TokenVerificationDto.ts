import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TokenVerificationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id_token: string;
}
