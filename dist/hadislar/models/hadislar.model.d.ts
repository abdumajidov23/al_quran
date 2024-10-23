import { Model } from 'sequelize-typescript';
interface IHadisCreationAttr {
    name: string;
    about: string;
}
export declare class Hadislar extends Model<Hadislar, IHadisCreationAttr> {
    id: number;
    name: string;
    about: string;
}
export {};
