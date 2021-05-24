import {
  Column,
  Model,
  Table,
  DataType,
  PrimaryKey,
  BelongsToMany,
  ForeignKey,
} from 'sequelize-typescript';
import { Exclude } from 'class-transformer';
import Seq from 'sequelize';
import { groups } from '../../groups/entities/group.entity';

@Table({ paranoid: true })
export class users extends Model<any> {
  @BelongsToMany(() => groups, {
    through: () => user_groups,
    as: 'userId',
    onDelete: 'CASCADE',
  })
  @PrimaryKey
  @Column({ type: DataType.STRING, defaultValue: Seq.UUIDV4 })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  login: string;

  @Exclude()
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  age: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isdeleted: boolean;
}

@Table
export class user_groups extends Model<any> {
  @ForeignKey(() => users)
  @Column
  user_id: string;

  @ForeignKey(() => groups)
  @Column
  group_id: string;
}
