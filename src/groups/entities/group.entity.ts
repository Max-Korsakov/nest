import {
  Column,
  Model,
  Table,
  DataType,
  PrimaryKey,
  Unique,
  BelongsToMany,
} from 'sequelize-typescript';
import { Exclude } from 'class-transformer';
import Seq from 'sequelize';
import { user_groups, users } from '../../users/entities/user.entity';
import {
  permissions,
  permissions_groups,
} from '../../permissions/entities/permissions.entity';

@Table({ timestamps: false })
export class groups extends Model<any> {
  @BelongsToMany(() => permissions, {
    through: () => permissions_groups,
    as: 'groupPermissionId',
    onDelete: 'CASCADE',
  })
  @BelongsToMany(() => users, {
    through: () => user_groups,
    as: 'groupId',
    onDelete: 'CASCADE',
  })
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: Seq.UUIDV4 })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;
}
