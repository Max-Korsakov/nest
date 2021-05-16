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
} from '@nestjs/swagger';
import { Response } from 'express';

import { UsersService } from './users.service';
import { CreateUserDto, CreatedUserRes } from './dto/create-user.dto';
import { AddUserToGroup } from './dto/add-to-group.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { methodExecutionTimeLogger } from '../utils/loggers/time-logget/timelogger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ description: 'User created', type: CreatedUserRes })
  @ApiBadRequestResponse({ description: 'Validation error' })
  async create(
    @Body() createUserDto: CreateUserDto,
    @Res() response: Response,
  ) {
    const userData = await methodExecutionTimeLogger(this.usersService.create)(
      this.usersService,
      createUserDto,
    );
    return response.send(userData);
  }

  @Post('addgroup')
  @ApiCreatedResponse({
    description: 'Add user to group',
    type: AddUserToGroup,
  })
  @ApiBadRequestResponse({ description: 'Validation error' })
  async addUserToGroup(
    @Body() addUserToGroup: AddUserToGroup,
    @Res() response: Response,
  ) {
    const resp = await methodExecutionTimeLogger(
      this.usersService.addUserToGroup,
    )(this.usersService, addUserToGroup);
    return response.send(resp);
  }

  @Get('suggested')
  @ApiOkResponse({ description: 'Users received' })
  async getSuggested(
    @Query('loginSubstring') loginSubstring: string,
    @Query('limit') limit: number,
    @Res() response: Response,
  ) {
    const userData = await methodExecutionTimeLogger(
      this.usersService.getSuggested,
    )(this.usersService, loginSubstring, limit);
    return response.send(userData);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'User received' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  async findOne(@Param('id') id: string, @Res() response: Response) {
    const userData = await methodExecutionTimeLogger(this.usersService.findOne)(
      this.usersService,
      id,
    );
    return response.send(userData);
  }

  @Get()
  @ApiOkResponse({ description: 'All users received' })
  async findAll(@Res() response: Response) {
    const userData = await methodExecutionTimeLogger(this.usersService.findAll)(
      this.usersService,
    );
    return response.send(userData);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'User updated' })
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiNotFoundResponse({ description: 'Invalid id' })
  @ApiInternalServerErrorResponse({ description: 'Update failed' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() response: Response,
  ) {
    const userData = await methodExecutionTimeLogger(this.usersService.update)(
      this.usersService,
      id,
      updateUserDto,
    );
    return response.send(userData);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'User deleted' })
  @ApiNotFoundResponse({ description: 'Invalid id' })
  async remove(@Param('id') id: string, @Res() response: Response) {
    const userData = await methodExecutionTimeLogger(this.usersService.remove)(
      this.usersService,
      id,
    );
    return response.send(userData);
  }
}
