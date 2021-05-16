/* eslint-disable prefer-rest-params */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { CreateUserDto, CreatedUserRes } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { users, user_groups } from './entities/user.entity';
import { groups } from '../groups/entities/group.entity';
import { Op, Sequelize } from 'sequelize';
import CustomLogger from '../utils/loggers/common-logger/logger.servece';

@Injectable()
export class UsersService {
  private readonly logger = new CustomLogger('UsersService');
  constructor(
    @InjectModel(users)
    private userModel: typeof users,
    @InjectModel(user_groups)
    private userGroupsModel: typeof user_groups,
    @InjectModel(groups)
    private groupsModel: typeof groups,
    private sequelize: Sequelize,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<CreatedUserRes> {
    this.logger.log(
      `Method: ${this.create.name} was called with arguments:${JSON.stringify(
        arguments,
      )}`,
    );
    try {
      const user = await users.create({
        login: createUserDto.login,
        password: createUserDto.password,
        age: createUserDto.age,
      });

      return { login: user.login, age: user.age, id: user.id };
    } catch (error) {
      this.logger.error(
        `Method: ${this.create.name}, arguments:${JSON.stringify(
          arguments,
        )}, error: ${error.message}`,
      );
      throw new HttpException(error, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async findAll(): Promise<CreatedUserRes[]> {
    this.logger.log(
      `Method: ${this.findAll.name} was called with arguments:${JSON.stringify(
        arguments,
      )}`,
    );
    try {
      const response = await this.userModel.findAll({
        attributes: { exclude: ['password', 'isdeleted'] },
        where: {
          isdeleted: false,
        },
      });
      return response;
    } catch (error) {
      this.logger.error(
        `Method: ${this.findAll.name}, arguments:${JSON.stringify(
          arguments,
        )}, error: ${error.message}`,
      );
      throw new HttpException(error, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async findOne(id: string): Promise<CreatedUserRes> {
    this.logger.log(
      `Method: ${this.findOne.name} was called with arguments:${JSON.stringify(
        arguments,
      )}`,
    );
    try {
      const user = await this.userModel.findOne({
        attributes: { exclude: ['password', 'isdeleted'] },
        where: {
          id,
          isdeleted: false,
        },
      });
      return user;
    } catch (error) {
      this.logger.error(
        `Method: ${this.findOne.name}, arguments:${JSON.stringify(
          arguments,
        )}, error: ${error.message}`,
      );
      throw new HttpException(error, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<[number, CreatedUserRes[]]> {
    this.logger.log(
      `Method: ${this.update.name} was called with arguments:${JSON.stringify(
        arguments,
      )}`,
    );
    try {
      const resp = await this.userModel.update(updateUserDto, {
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

  async remove(id: string): Promise<boolean> {
    const t = await this.sequelize.transaction();
    this.logger.log(
      `Method: ${this.remove.name} was called with arguments:${JSON.stringify(
        arguments,
      )}`,
    );
    try {
      await this.userModel.update(
        { isdeleted: true },
        {
          where: {
            id,
            isdeleted: false,
          },
          transaction: t,
        },
      );

      await this.userModel.destroy({
        where: {
          id,
        },
        transaction: t,
      });

      await this.userGroupsModel.destroy({
        where: {
          user_id: id,
        },
        transaction: t,
      });
      await t.commit();
      return true;
    } catch (error) {
      await t.rollback();
      this.logger.error(
        `Method: ${this.update.name}, arguments:${JSON.stringify(
          arguments,
        )}, error: ${error.message}`,
      );
      throw new HttpException(error, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async getSuggested(
    loginSubstring: string,
    limit: number,
  ): Promise<CreatedUserRes[]> {
    this.logger.log(
      `Method: ${
        this.getSuggested.name
      } was called with arguments:${JSON.stringify(arguments)}`,
    );
    try {
      const userArray = await this.userModel.findAll({
        where: {
          isdeleted: false,
          login: {
            [Op.substring]: loginSubstring,
          },
        },
        order: [['login', 'ASC']],
        limit,
      });
      return userArray.map((user) => {
        return { login: user.login, age: user.age, id: user.id };
      });
    } catch (error) {
      this.logger.error(
        `Method: ${this.getSuggested.name}, arguments:${JSON.stringify(
          arguments,
        )}, error: ${error.message}`,
      );
      throw new HttpException(error, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async addUserToGroup(addUserToGroup: any) {
    this.logger.log(
      `Method: ${
        this.addUserToGroup.name
      } was called with arguments:${JSON.stringify(arguments)}`,
    );
    const login = addUserToGroup.userLogin;
    const name = addUserToGroup.groupName;
    const t = await this.sequelize.transaction();
    try {
      const userRes = await this.userModel.findOne({
        where: {
          login,
        },
        transaction: t,
      });

      const groupRes = await this.groupsModel.findOne({
        where: {
          name,
        },
        transaction: t,
      });

      await this.userGroupsModel.create({
        user_id: userRes.getDataValue('id'),
        group_id: groupRes.getDataValue('id'),
      });
      t.commit();
      return true;
    } catch (error) {
      t.rollback();
      this.logger.error(
        `Method: ${this.getSuggested.name}, arguments:${JSON.stringify(
          arguments,
        )}, error: ${error.message}`,
      );
      throw new HttpException(error, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
}
