import {
  Column,
  Model,
  Table,
  DataType,
  PrimaryKey,
  BelongsToMany,
  ForeignKey,
} from 'sequelize-typescript';
import Seq from 'sequelize';
import { groups } from '../../groups/entities/group.entity';

@Table({ timestamps: false })
export class permissions extends Model<any> {
  @BelongsToMany(() => permissions, {
    through: () => permissions_groups,
    as: 'groupPermissionId',
    onDelete: 'CASCADE',
  })
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: Seq.UUIDV4 })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  permission: string;
}

/*
 * Something wrong with that table
 * because it put unexpected uniq constrains on the properties,
 * so we need to delete it manually
 */

@Table({ timestamps: false })
export class permissions_groups extends Model<any> {
  @ForeignKey(() => permissions)
  @Column
  permissions_id: string;

  @ForeignKey(() => groups)
  @Column
  group_id: string;
}
