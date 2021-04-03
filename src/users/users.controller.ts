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
import {
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateUserDto, CreatedUserRes } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ description: 'User created', type: CreatedUserRes })
  @ApiBadRequestResponse({ description: 'Validation error' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('suggested')
  @ApiOkResponse({ description: 'Users received' })
  getSuggested(
    @Query('loginSubstring') loginSubstring: string,
    @Query('limit') limit: number,
  ) {
    return this.usersService.getSuggested(loginSubstring, limit);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'User received' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get()
  @ApiOkResponse({ description: 'All users received' })
  findAll() {
    return this.usersService.findAll();
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'User updated' })
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiNotFoundResponse({ description: 'Invalid id' })
  @ApiInternalServerErrorResponse({ description: 'Update failed' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'User deleted' })
  @ApiNotFoundResponse({ description: 'Invalid id' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
