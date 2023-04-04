import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Country } from 'src/modules/countries/models/country.entity';
import { UserRole } from 'src/modules/users/enums/UserRole';
import { User } from 'src/modules/users/models/user.entity';

export class EmailRegisterDto {
  @ApiProperty({ example: 'myemail@gmail.com', required: true })
  email: string;

  @ApiProperty({ example: 'Имя', required: false })
  first_name: string;

  @ApiProperty({ example: 'Фамилия', required: false })
  last_name: string;

  @ApiProperty({ example: '+71111111111', required: false })
  phone: string;

  @ApiProperty({
    type: Country,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  country: Country;

  @ApiProperty({ enum: UserRole, example: UserRole.OPERATOR })
  role: UserRole;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  owner: User;
}
