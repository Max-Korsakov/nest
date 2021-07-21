import { ApiProperty } from '@nestjs/swagger';

export class AddUserToGroup {
  @ApiProperty({
    description: 'user login name',
    default: 'user',
  })
  groupName: string;

  @ApiProperty({
    description: 'user login name',
    default: 'user@user.com',
  })
  userLogin: string;
}
