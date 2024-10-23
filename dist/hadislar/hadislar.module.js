"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HadislarModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const hadislar_service_1 = require("./hadislar.service");
const hadislar_controller_1 = require("./hadislar.controller");
const hadislar_model_1 = require("./models/hadislar.model");
const bot_entity_1 = require("../bot/entities/bot.entity");
let HadislarModule = class HadislarModule {
};
exports.HadislarModule = HadislarModule;
exports.HadislarModule = HadislarModule = __decorate([
    (0, common_1.Module)({
        imports: [sequelize_1.SequelizeModule.forFeature([hadislar_model_1.Hadislar, bot_entity_1.Bot])],
        controllers: [hadislar_controller_1.HadislarController],
        providers: [hadislar_service_1.HadislarService],
    })
], HadislarModule);
//# sourceMappingURL=hadislar.module.js.map