import { Model } from "sequelize-typescript";
interface IBotCreationAttr {
    user_id: number;
    username: string;
    first_name: string;
    last_name: string;
    lang: string;
}
export declare class Users extends Model<Users, IBotCreationAttr> {
    user_id: number;
    username: string;
    first_name: string;
    last_name: string;
    lang: string;
    status: boolean;
}
export {};
