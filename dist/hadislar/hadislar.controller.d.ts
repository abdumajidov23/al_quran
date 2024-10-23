import { HadislarService } from './hadislar.service';
import { CreateHadislarDto } from './dto/create-hadislar.dto';
import { UpdateHadislarDto } from './dto/update-hadislar.dto';
export declare class HadislarController {
    private readonly hadislarService;
    constructor(hadislarService: HadislarService);
    create(createHadislarDto: CreateHadislarDto): Promise<import("./models/hadislar.model").Hadislar>;
    findAll(): Promise<import("./models/hadislar.model").Hadislar[]>;
    findOne(id: string): Promise<import("./models/hadislar.model").Hadislar | {
        message: string;
    }>;
    update(id: string, updateHadislarDto: UpdateHadislarDto): Promise<import("./models/hadislar.model").Hadislar | {
        message: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
