import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

jest.mock('./users.service');

describe('UsersController', () => {
  let controller: UsersController;
  const res: any = {};
  res.send = jest.fn().mockReturnValue(res);

  const usersService = {
    create: jest.fn(),
    addUserToGroup: jest.fn(),
    getSuggested: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create should call usersService.create', async () => {
    const body = { login: 'mockLogin', password: 'qwerty123', age: 15 };
    await controller.create(body, res);
    expect(usersService.create).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalled();
  });

  it('create should call usersService.addUserToGroup', async () => {
    const body = { groupName: 'mockLogin', userLogin: 'qwerty123' };
    await controller.addUserToGroup(body, res);
    expect(usersService.addUserToGroup).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalled();
  });

  it('create should call usersService.getSuggested', async () => {
    const loginSubstring = 'mockLogin';
    const limit = 2;
    await controller.getSuggested(loginSubstring, limit, res);
    expect(usersService.getSuggested).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalled();
  });

  it('create should call usersService.findOne', async () => {
    const id = 'mockId';
    await controller.findOne(id, res);
    expect(usersService.findOne).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalled();
  });

  it('create should call usersService.findAll', async () => {
    await controller.findAll(res);
    expect(usersService.findAll).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalled();
  });

  it('create should call usersService.update', async () => {
    const id = 'mockId';
    const body = { login: 'mockLogin', password: 'qwerty123', age: 15 };
    await controller.update(id, body, res);
    expect(usersService.update).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalled();
  });

  it('create should call usersService.remove', async () => {
    const id = 'mockId';
    await controller.remove(id, res);
    expect(usersService.remove).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalled();
  });
});
