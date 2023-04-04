import { ApiProperty } from '@nestjs/swagger';

export class GetGooglePassLinkDto {
  @ApiProperty()
  link!: string;
}
