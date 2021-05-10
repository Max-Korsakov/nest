import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { CreateUserDto, CreatedUserRes } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { users, user_groups } from './entities/user.entity';
import { groups } from '../groups/entities/group.entity';
import { Op, Sequelize } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(users)
    private userModel: typeof users,
    @InjectModel(user_groups)
    private userGroupsModel: typeof user_groups,
    @InjectModel(groups)
    private groupsModel: typeof groups,
    private sequelize: Sequelize,
  ) {}

  create(createUserDto: CreateUserDto): Promise<CreatedUserRes> {
    return users
      .create({
        login: createUserDto.login,
        password: createUserDto.password,
        age: createUserDto.age,
      })
      .then((user) => {
        return { login: user.login, age: user.age, id: user.id };
      });
  }

  findAll(): Promise<CreatedUserRes[]> {
    return this.userModel.findAll({
      attributes: { exclude: ['password', 'isdeleted'] },
      where: {
        isdeleted: false,
      },
    });
  }

  findOne(id: string): Promise<CreatedUserRes> {
    return this.userModel.findOne({
      attributes: { exclude: ['password', 'isdeleted'] },
      where: {
        id,
        isdeleted: false,
      },
    });
  }

  update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<[number, CreatedUserRes[]]> {
    return this.userModel.update(updateUserDto, {
      where: {
        id,
      },
    });
  }

  async remove(id: string): Promise<[number, CreatedUserRes[]]> {
    const t = await this.sequelize.transaction();
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
    } catch (error) {
      await t.rollback();
      return error;
    }
  }

  getSuggested(
    loginSubstring: string,
    limit: number,
  ): Promise<CreatedUserRes[]> {
    return this.userModel
      .findAll({
        where: {
          isdeleted: false,
          login: {
            [Op.substring]: loginSubstring,
          },
        },
        order: [['login', 'ASC']],
        limit,
      })
      .then((userArray) =>
        userArray.map((user) => {
          return { login: user.login, age: user.age, id: user.id };
        }),
      );
  }

  async addUserToGroup(addUserToGroup: any) {
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
      console.log(error.message);
      return error;
    }
  }
}
