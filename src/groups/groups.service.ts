import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';

import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { groups } from './entities/group.entity';
import {
  permissions_groups,
  permissions,
} from '../permissions/entities/permissions.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(groups)
    private groupsModel: typeof groups,
    @InjectModel(permissions)
    private permissionsModel: typeof permissions,
    @InjectModel(permissions_groups)
    private permissionsGroupsModel: typeof permissions_groups,
    private sequelize: Sequelize,
  ) {}

  async create(createGroupDto: CreateGroupDto) {
    const transaction = await this.sequelize.transaction();
    try {
      const group = await groups.create(
        {
          name: createGroupDto.name,
        },
        { transaction },
      );

      await Promise.all(
        createGroupDto.permission.map(async (permission) => {
          const permissionData = await this.permissionsModel.findOne({
            where: {
              permission,
            },
            transaction,
          });
          await this.permissionsGroupsModel.create(
            {
              permissions_id: permissionData.getDataValue('id'),
              group_id: group.getDataValue('id'),
            },
            { transaction },
          );
        }),
      );
      await transaction.commit();
      return group;
    } catch (error) {
      await transaction.rollback();
      console.log(error.message);
      throw error;
    }
  }

  findAll() {
    return this.groupsModel.findAll();
  }

  findOne(id: string) {
    return this.groupsModel.findOne({
      where: {
        id,
      },
    });
  }

  update(id: string, updateGroupDto: UpdateGroupDto) {
    return this.groupsModel.update(updateGroupDto, {
      where: {
        id,
      },
    });
  }

  remove(id: string) {
    return this.groupsModel.destroy({
      where: {
        id,
      },
    });
  }
}
