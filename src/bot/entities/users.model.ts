import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
// import { Address } from "./address.model";

interface IBotCreationAttr {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  lang: string;
}

@Table({ tableName: "Users" })
export class Users extends Model<Users, IBotCreationAttr> {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
  })
  user_id: number;

  @Column({ type: DataType.STRING })
  username: string;

  @Column({ type: DataType.STRING })
  first_name: string;

  @Column({ type: DataType.STRING })
  last_name: string;

  @Column({ type: DataType.STRING })
  lang: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  status: boolean;

  // @HasMany(()=>Address)
  // addresses: Address[];
}
