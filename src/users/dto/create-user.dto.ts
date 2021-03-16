import { IsNumber, IsNotEmpty, Min, Max, Matches } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  login: string;

  @IsNotEmpty()
  @Matches(/.*?(?:[a-z].*?[0-9]|[0-9].*?[a-z]).*?/, {
    message: 'password should contain numbers and letters',
  })
  password: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(4)
  @Max(130)
  age: number;
}
