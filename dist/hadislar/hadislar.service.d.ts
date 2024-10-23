import { CreateHadislarDto } from './dto/create-hadislar.dto';
import { UpdateHadislarDto } from './dto/update-hadislar.dto';
import { Hadislar } from './models/hadislar.model';
export declare class HadislarService {
    private hadislarModel;
    constructor(hadislarModel: typeof Hadislar);
    create(createHadislarDto: CreateHadislarDto): Promise<Hadislar>;
    findAll(): Promise<Hadislar[]>;
    findOne(id: number): Promise<Hadislar | {
        message: string;
    }>;
    update(id: number, updateHadislarDto: UpdateHadislarDto): Promise<Hadislar | {
        message: string;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
