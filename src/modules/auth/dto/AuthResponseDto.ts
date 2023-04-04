import { ApiProperty } from '@nestjs/swagger';
import { Country } from 'src/modules/countries/models/country.entity';
import { UserOS } from 'src/modules/users/enums/UserOS';
import { UserRole } from 'src/modules/users/enums/UserRole';
import { UserStatus } from 'src/modules/users/enums/UserStatus';
import { PublicUser } from 'src/modules/users/interfaces/PublicUser';

export class AuthResponseDto implements PublicUser {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  phone!: string;

  @ApiProperty()
  first_name!: string;

  @ApiProperty()
  last_name!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  role!: UserRole;

  @ApiProperty()
  token!: string;

  @ApiProperty()
  refresh_token!: string;

  @ApiProperty()
  company_name: string;

  @ApiProperty()
  amount_issued_cards: number;

  @ApiProperty()
  country: Country;

  @ApiProperty()
  is_confirmed: boolean;

  @ApiProperty()
  is_fulfilled: boolean;

  @ApiProperty({ enum: UserOS })
  os: UserOS;

  @ApiProperty({ enum: UserStatus })
  status: UserStatus;
}
