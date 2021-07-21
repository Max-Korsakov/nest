import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { users, user_groups } from './entities/user.entity';
import { groups } from '../groups/entities/group.entity';

@Module({
  imports: [SequelizeModule.forFeature([users, user_groups, groups])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
