import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Bot extends Model<Bot> {
  @Column
  user_id: number;

  @Column
  username: string;

  @Column
  first_name: string;

  @Column
  last_name: string;

  @Column
  lang: string;
}
