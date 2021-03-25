import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'The login',
    default: 'user@user.com',
    required: false,
  })
  login: string;

  @ApiProperty({
    description: 'Should contain letters and numbers',
    default: 'qwerty1234',
    required: false,
  })
  password: string;

  @ApiProperty({
    description: 'Should be more then 4 and less then 130',
    default: 30,
    required: false,
  })
  age: number;
}
