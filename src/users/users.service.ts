import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { users } from './entities/user.entity';
import { Op } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(users)
    private userModel: typeof users,
  ) {}

  create(createUserDto: CreateUserDto) {
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

  findAll() {
    return this.userModel.findAll({
      attributes: { exclude: ['password', 'isdeleted'] },
      where: {
        isdeleted: false,
      },
    });
  }

  findOne(id: string) {
    return this.userModel.findOne({
      attributes: { exclude: ['password', 'isdeleted'] },
      where: {
        id,
        isdeleted: false,
      },
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.update(updateUserDto, {
      where: {
        id,
      },
    });
  }

  remove(id: string) {
    return this.userModel.update(
      { isdeleted: true },
      {
        where: {
          id,
          isdeleted: false,
        },
      },
    );
  }

  getSuggested(loginSubstring: string, limit: number) {
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
}
