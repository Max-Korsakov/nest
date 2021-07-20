import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { users, user_groups } from './users/entities/user.entity';
import { groups } from './groups/entities/group.entity';
import { GroupsModule } from './groups/groups.module';
import {
  permissions_groups,
  permissions,
} from './permissions/entities/permissions.entity';
import { LoggerModule } from './utils/loggers/common-logger/logger.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      models: [users, user_groups, groups, permissions_groups, permissions],
    }),
    GroupsModule,
    LoggerModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
