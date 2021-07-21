import { Test, TestingModule } from '@nestjs/testing';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';

describe('GroupsController', () => {
  let controller: GroupsController;

  const groupsService = {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupsController],
      providers: [{ provide: GroupsService, useValue: groupsService }],
    }).compile();

    controller = module.get<GroupsController>(GroupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create should call usersService.create', async () => {
    const body: any = { name: 'mockLogin', permission: 'qwerty123' };
    await controller.create(body);
    expect(groupsService.create).toHaveBeenCalled();
  });

  it('create should call usersService.findOne', async () => {
    const id = 'mockId';
    await controller.findOne(id);
    expect(groupsService.findOne).toHaveBeenCalled();
  });

  it('create should call usersService.findAll', async () => {
    await controller.findAll();
    expect(groupsService.findAll).toHaveBeenCalled();
  });

  it('create should call usersService.update', async () => {
    const id = 'mockId';
    const body: any = { name: 'mockLogin', permission: 'qwerty123' };
    await controller.update(id, body);
    expect(groupsService.update).toHaveBeenCalled();
  });

  it('create should call usersService.remove', async () => {
    const id = 'mockId';
    await controller.remove(id);
    expect(groupsService.remove).toHaveBeenCalled();
  });
});
