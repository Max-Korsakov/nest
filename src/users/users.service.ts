import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { v4 } from 'uuid';

type User = {
  id: string;
  login: string;
  password: string;
  age: number;
  isDeleted: boolean;
};

const Users: User[] = [];

@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto) {
    const newUser = {
      ...createUserDto,
      id: v4(),
      isDeleted: false,
    };
    Users.push(newUser);
    return newUser;
  }

  async findAll() {
    return Users.filter((user) => user.isDeleted === false);
  }

  findOne(id: string) {
    return Users.find((user) => user.id === id && !user.isDeleted);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const userIndex = Users.findIndex((user) => user.id === id);
    Users[userIndex] = { ...Users[userIndex], ...updateUserDto };
    return Users[userIndex];
  }

  remove(id: string) {
    const user = Users.find((user) => user.id === id && !user.isDeleted);
    if (user) {
      user.isDeleted = true;
      return 'User has been deleted';
    }

    return null;
  }

  getSuggested(loginSubstring: string, limit: number) {
    const suggested = Users.filter((user) =>
      user.login.includes(loginSubstring),
    ).sort((a, b) => {
      if (a.login > b.login) {
        return 1;
      } else if (a.login < b.login) {
        return -1;
      } else {
        return 0;
      }
    });
    const limited =
      limit >= suggested.length ? suggested : suggested.slice(0, limit);
    return limited;
  }
}
