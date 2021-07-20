import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { Response } from 'express';

import { UsersService } from './users.service';
import { CreateUserDto, CreatedUserRes } from './dto/create-user.dto';
import { AddUserToGroup } from './dto/add-to-group.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LogDecorator } from '../utils/loggers/time-logget/timelogger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ description: 'User created', type: CreatedUserRes })
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiBody({ type: [CreateUserDto] })
  @LogDecorator()
  async create(
    @Body() createUserDto: CreateUserDto,
    @Res() response: Response,
  ) {
    const userData = await this.usersService.create(createUserDto);
    return response.send(userData);
  }

  @Post('addgroup')
  @ApiCreatedResponse({
    description: 'Add user to group',
    type: AddUserToGroup,
  })
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiBody({ type: [AddUserToGroup] })
  @LogDecorator()
  async addUserToGroup(
    @Body() addUserToGroup: AddUserToGroup,
    @Res() response: Response,
  ) {
    const resp = await this.usersService.addUserToGroup(addUserToGroup);
    return response.send(resp);
  }

  @Get('suggested')
  @ApiOkResponse({ description: 'Users received' })
  @ApiQuery({ name: 'loginSubstring', type: 'string' })
  @ApiQuery({ name: 'limit', type: 'number' })
  @LogDecorator()
  async getSuggested(
    @Query('loginSubstring') loginSubstring: string,
    @Query('limit') limit: number,
    @Res() response: Response,
  ) {
    const userData = await this.usersService.getSuggested(
      loginSubstring,
      limit,
    );
    return response.send(userData);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'User received' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiParam({ name: 'id', type: 'string' })
  @LogDecorator()
  async findOne(@Param('id') id: string, @Res() response: Response) {
    const userData = await this.usersService.findOne(id);
    return response.send(userData);
  }

  @Get()
  @ApiOkResponse({ description: 'All users received' })
  @LogDecorator()
  async findAll(@Res() response: Response) {
    const userData = await this.usersService.findAll();
    return response.send(userData);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'User updated' })
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiNotFoundResponse({ description: 'Invalid id' })
  @ApiInternalServerErrorResponse({ description: 'Update failed' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiBody({ type: [UpdateUserDto] })
  @LogDecorator()
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() response: Response,
  ) {
    const userData = await this.usersService.update(id, updateUserDto);
    return response.send(userData);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'User deleted' })
  @ApiNotFoundResponse({ description: 'Invalid id' })
  @ApiParam({ name: 'id', type: 'string' })
  @LogDecorator()
  async remove(@Param('id') id: string, @Res() response: Response) {
    const userData = await this.usersService.remove(id);
    return response.send(userData);
  }
}
