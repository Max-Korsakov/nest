/* eslint-disable prefer-rest-params */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';

import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { groups } from './entities/group.entity';
import {
  permissions_groups,
  permissions,
} from '../permissions/entities/permissions.entity';
import CustomLogger from '../utils/loggers/common-logger/logger.servece';

@Injectable()
export class GroupsService {
  private readonly logger = new CustomLogger('GroupsService');
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
    this.logger.log(
      `Method: ${this.create.name} was called with arguments:${JSON.stringify(
        arguments,
      )}`,
    );
    const t = await this.sequelize.transaction();
    try {
      const group = await groups.create(
        {
          name: createGroupDto.name,
        },
        { transaction: t },
      );

      await Promise.all(
        createGroupDto.permission.map(async (permission) => {
          const permissionData = await this.permissionsModel.findOne({
            where: {
              permission,
            },
            transaction: t,
          });
          await this.permissionsGroupsModel.create(
            {
              permissions_id: permissionData.getDataValue('id'),
              group_id: group.getDataValue('id'),
            },
            { transaction: t },
          );
        }),
      );
      await t.commit();
      return group;
    } catch (error) {
      await t.rollback();
      this.logger.error(
        `Method: ${this.create.name}, arguments:${JSON.stringify(
          arguments,
        )}, error: ${error.message}`,
      );
      throw new HttpException(error, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async findAll() {
    this.logger.log(
      `Method: ${this.findAll.name} was called with arguments:${JSON.stringify(
        arguments,
      )}`,
    );
    try {
      const resp = await this.groupsModel.findAll();
      return resp;
    } catch (error) {
      this.logger.error(
        `Method: ${this.findAll.name}, arguments:${JSON.stringify(
          arguments,
        )}, error: ${error.message}`,
      );
      throw new HttpException(error, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async findOne(id: string) {
    this.logger.log(
      `Method: ${this.findOne.name} was called with arguments:${JSON.stringify(
        arguments,
      )}`,
    );
    try {
      const resp = await this.groupsModel.findOne({
        where: {
          id,
        },
      });
      return resp;
    } catch (error) {
      this.logger.error(
        `Method: ${this.findOne.name}, arguments:${JSON.stringify(
          arguments,
        )}, error: ${error.message}`,
      );
      throw new HttpException(error, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async update(id: string, updateGroupDto: UpdateGroupDto) {
    this.logger.log(
      `Method: ${this.update.name} was called with arguments:${JSON.stringify(
        arguments,
      )}`,
    );
    try {
      const resp = await this.groupsModel.update(updateGroupDto, {
        where: {
          id,
        },
      });
      return resp;
    } catch (error) {
      this.logger.error(
        `Method: ${this.update.name}, arguments:${JSON.stringify(
          arguments,
        )}, error: ${error.message}`,
      );
      throw new HttpException(error, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async remove(id: string) {
    this.logger.log(
      `Method: ${this.remove.name} was called with arguments:${JSON.stringify(
        arguments,
      )}`,
    );
    try {
      const resp = await this.groupsModel.destroy({
        where: {
          id,
        },
      });
      return resp;
    } catch (error) {
      this.logger.error(
        `Method: ${this.remove.name}, arguments:${JSON.stringify(
          arguments,
        )}, error: ${error.message}`,
      );
      throw new HttpException(error, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
}
