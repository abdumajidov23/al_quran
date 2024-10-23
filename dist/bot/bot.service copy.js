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
exports.BotService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_telegraf_1 = require("nestjs-telegraf");
const telegraf_1 = require("telegraf");
const axios = require('axios');
let BotService = class BotService {
    constructor(bot) {
        this.bot = bot;
        this.bot.start((ctx) => this.onStart(ctx));
        this.bot.on('callback_query', (ctx) => this.callbackQuery(ctx));
    }
    async onStart(ctx) {
        ctx.reply('Bizni tanlaganingizdan mamnunmiz 😊', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Suralar', callback_data: 'surah' }, { text: 'Xadislar', callback_data: 'xadis' }],
                    [{ text: 'Duolar', callback_data: 'duo' }, { text: 'Taqvim', callback_data: 'taqvim' }],
                ]
            }
        });
    }
    async callbackQuery(ctx) {
        if ('data' in ctx.callbackQuery) {
            const callbackData = ctx.callbackQuery.data;
            if (callbackData === 'xadis') {
                ctx.reply('+998950091350', {
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: 'Orqaga qayt', callback_data: 'back' }]
                        ]
                    }
                });
            }
            else if (callbackData === 'taqvim') {
                axios.get('https://api.aladhan.com/v1/timingsByCity/20-10-2024?city=Tashkent&country=Uzbekistan&method=2')
                    .then(response => {
                    const now = new Date();
                    const hours = now.getHours();
                    const minuts = now.getMinutes().toString().padStart(2, '0');
                    const seconds = now.getSeconds().toString().padStart(2, '0');
                    const timings = response.data.data.timings;
                    const message = `
<b>Toshkent namoz vaqtlar:</b>
<b>Toshkentda soat: ${hours}:${minuts}:${seconds}</b>
🕋 Bomdod: ${timings.Fajr}
🌅 Quyosh: ${timings.Sunrise}
🕌 Peshin: ${timings.Dhuhr}
🕌 Asr: ${timings.Asr}
🌇 Shom: ${timings.Maghrib}
🌌 Xufton: ${timings.Isha}

vaqtlar 2-3 daqiqaga farq qilishimi mumkin😊!
            `;
                    ctx.reply(message, {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: 'Orqaga qayt', callback_data: 'back' }]
                            ]
                        }
                    });
                })
                    .catch(error => {
                    ctx.reply("Xatolik yuz berdi, iltimos keyinroq urinib ko'ring.", {
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: 'Orqaga qayt', callback_data: 'back' }]
                            ]
                        }
                    });
                });
            }
            else if (callbackData === 'back') {
                this.onStart(ctx);
            }
        }
    }
};
exports.BotService = BotService;
exports.BotService = BotService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_telegraf_1.InjectBot)()),
    __metadata("design:paramtypes", [telegraf_1.Telegraf])
], BotService);
//# sourceMappingURL=bot.service%20copy.js.map