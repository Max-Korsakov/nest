import {
  Column,
  Model,
  Table,
  DataType,
  PrimaryKey,
  Unique,
} from 'sequelize-typescript';
import { Exclude } from 'class-transformer';
import Seq from 'sequelize';

@Table({ timestamps: false })
export class users extends Model {
  @PrimaryKey
  @Unique
  @Column({ type: DataType.UUIDV4, defaultValue: Seq.UUIDV4 })
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
