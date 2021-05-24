import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { CreateGroupDto, Permissions } from './create-group.dto';

export class UpdateGroupDto extends PartialType(CreateGroupDto) {
  @ApiProperty({
    description: 'The name of the group',
    default: 'user',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Array of the permissions',
    default: ['READ'],
  })
  @IsNotEmpty()
  permission: Permissions[];
}
