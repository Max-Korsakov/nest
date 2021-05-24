import { IsNumber, IsNotEmpty, Min, Max, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'user login name',
    default: 'user@user.com',
  })
  @IsNotEmpty()
  login: string;

  @ApiProperty({
    description: 'Should contain letters and numbers',
    default: 'qwerty1234',
  })
  @IsNotEmpty()
  @Matches(/.*?(?:[a-z].*?[0-9]|[0-9].*?[a-z]).*?/, {
    message: 'password should contain numbers and letters',
  })
  password: string;

  @ApiProperty({
    description: 'Should be more then 4 and less then 130',
    default: 30,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(4)
  @Max(130)
  age: number;
}

export class CreatedUserRes {
  @ApiProperty()
  id: string;

  @ApiProperty()
  login: string;

  @ApiProperty()
  age: number;
}
