import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@ApiTags('groups')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @ApiBearerAuth()
  @Post()
  @ApiCreatedResponse({ description: 'Create group' })
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto);
  }

  @ApiBearerAuth()
  @Get()
  @ApiCreatedResponse({ description: 'Get all groups' })
  findAll() {
    return this.groupsService.findAll();
  }

  @ApiBearerAuth()
  @Get(':id')
  @ApiCreatedResponse({ description: 'Find group by id' })
  findOne(@Param('id') id: string) {
    return this.groupsService.findOne(id);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @ApiCreatedResponse({ description: 'Update group' })
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupsService.update(id, updateGroupDto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @ApiCreatedResponse({ description: 'Delete group' })
  remove(@Param('id') id: string) {
    return this.groupsService.remove(id);
  }
}
