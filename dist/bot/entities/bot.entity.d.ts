import { Model } from 'sequelize-typescript';
export declare class Bot extends Model<Bot> {
    user_id: number;
    username: string;
    first_name: string;
    last_name: string;
    lang: string;
}
