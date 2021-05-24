import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { groups } from './entities/group.entity';
import {
  permissions_groups,
  permissions,
} from '../permissions/entities/permissions.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([groups, permissions_groups, permissions]),
  ],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule {}
