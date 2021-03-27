import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
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
  create(createUserDto: CreateUserDto): User {
    const newUser = {
      ...createUserDto,
      id: v4(),
      isDeleted: false,
    };
    Users.push(newUser);
    return newUser;
  }

  findAll(): User[] {
    return Users.filter((user) => user.isDeleted === false);
  }

  findOne(id: string): User {
    const user = Users.find((user) => user.id === id && !user.isDeleted);
    if (user) {
      return user;
    } else {
      throw new NotFoundException('Invalid id');
    }
  }

  update(id: string, updateUserDto: UpdateUserDto): User {
    const user = this.findOne(id);
    if (user === undefined) {
      throw new NotFoundException('Invalid id');
    }
    const userIndex = Users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new InternalServerErrorException('Update faled');
    }
    Users[userIndex] = { ...Users[userIndex], ...updateUserDto };
    return Users[userIndex];
  }

  remove(id: string): User {
    const user = Users.find((user) => user.id === id && !user.isDeleted);
    if (user === undefined) {
      throw new NotFoundException('Invalid id');
    }
    user.isDeleted = true;
    return user;
  }

  getSuggested(loginSubstring: string, limit: number): User[] {
    const suggested = this.filterUsersBySubstring(Users, loginSubstring).sort(
      this.compareByLogin,
    );
    return limit >= suggested.length ? suggested : suggested.slice(0, limit);
  }

  compareByLogin(firstUser: User, secondUser: User): number {
    if (firstUser.login > secondUser.login) {
      return 1;
    } else if (firstUser.login < secondUser.login) {
      return -1;
    } else {
      return 0;
    }
  }

  filterUsersBySubstring(users: User[], loginSubstring: string) {
    return users.filter((user) => user.login.includes(loginSubstring));
  }
}
