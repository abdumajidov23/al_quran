"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HadislarService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const hadislar_model_1 = require("./models/hadislar.model");
let HadislarService = class HadislarService {
    constructor(hadislarModel) {
        this.hadislarModel = hadislarModel;
    }
    create(createHadislarDto) {
        return this.hadislarModel.create(createHadislarDto);
    }
    async findAll() {
        return this.hadislarModel.findAll();
    }
    async findOne(id) {
        const hadis = await this.hadislarModel.findByPk(id);
        if (!hadis) {
            return { message: `Hadis with id ${id} not found` };
        }
        return hadis;
    }
    async update(id, updateHadislarDto) {
        const [numberOfAffectedRows, [updatedHadis]] = await this.hadislarModel.update(updateHadislarDto, {
            where: { id },
            returning: true,
        });
        if (numberOfAffectedRows === 0) {
            return { message: `Hadis with id ${id} not found` };
        }
        return updatedHadis;
    }
    async remove(id) {
        const deletedCount = await this.hadislarModel.destroy({ where: { id } });
        if (deletedCount === 0) {
            return { message: `Hadis with id ${id} not found` };
        }
        return { message: `Hadis with id ${id} has been removed` };
    }
};
exports.HadislarService = HadislarService;
exports.HadislarService = HadislarService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(hadislar_model_1.Hadislar)),
    __metadata("design:paramtypes", [Object])
], HadislarService);
//# sourceMappingURL=hadislar.service.js.map