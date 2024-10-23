import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface IHadisCreationAttr {
  name: string;
  about: string;
}

@Table({ tableName: 'hadislar', timestamps: false })
export class Hadislar extends Model<Hadislar, IHadisCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.STRING,})
  about: string;
}