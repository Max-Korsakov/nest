import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('suggested')
  getSuggested(
    @Query('loginSubstring') loginSubstring: string,
    @Query('limit') limit: number,
  ) {
    return this.usersService.getSuggested(loginSubstring, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const user = this.usersService.findOne(id);
    if (user === undefined) {
      throw new BadRequestException('Invalid id');
    }
    return user;
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = this.usersService.findOne(id);
    if (user === undefined) {
      throw new NotFoundException('Invalid id');
    }
    const updatedUser = this.usersService.update(id, updateUserDto);
    if (updatedUser === undefined) {
      throw new InternalServerErrorException('Update faled');
    }
    return updatedUser;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const isDeleted = this.usersService.remove(id);
    if (!isDeleted) {
      throw new NotFoundException('Invalid id');
    }
    return isDeleted;
  }
}
