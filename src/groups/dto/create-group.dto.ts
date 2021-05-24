import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export type Permissions =
  | 'READ'
  | 'WRITE'
  | 'DELETE'
  | 'SHARE'
  | 'UPLOAD_FILES';

export class CreateGroupDto {
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
