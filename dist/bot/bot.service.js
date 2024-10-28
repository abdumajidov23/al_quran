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
const fs = require("fs/promises");
const hadislar_service_1 = require("../hadislar/hadislar.service");
const axios_1 = require("axios");
let BotService = class BotService {
    constructor(bot, hadislarService) {
        this.bot = bot;
        this.hadislarService = hadislarService;
        this.currentPage = 0;
        this.currentView = 'main';
        this.bot.start((ctx) => this.onStart(ctx));
        this.bot.on('callback_query', (ctx) => this.callbackQuery(ctx));
    }
    async onStart(ctx) {
        this.currentPage = 0;
        this.currentView = 'main';
        const message = await ctx.reply('Bizni tanlaganingizdan mamnunmiz 😊', {
            reply_markup: {
                inline_keyboard: this.getMainKeyboard()
            }
        });
        this.currentMessageId = message.message_id;
    }
    async callbackQuery(ctx) {
        if ('data' in ctx.callbackQuery) {
            const callbackData = ctx.callbackQuery.data;
            if (callbackData === 'xadis') {
                this.currentPage = 0;
                this.currentView = 'hadislar';
                await this.showHadislar(ctx);
            }
            else if (callbackData === 'next' && this.currentView === 'hadislar') {
                this.currentPage += 1;
                await this.showHadislar(ctx);
            }
            else if (callbackData === 'back' && this.currentView === 'hadislar') {
                this.currentView = 'main';
                this.currentPage = 0;
                await this.updateMessage(ctx, 'Bizni tanlaganingizdan mamnunmiz 😊', this.getMainKeyboard());
            }
            else if (callbackData === 'taqvim') {
                this.currentView = 'namoz';
                await this.getNamozVaqtlarini(ctx);
            }
            else if (callbackData === 'ismlar') {
                this.currentView = 'ismlar';
                await this.getIsmlar(ctx);
            }
            else if (callbackData === 'back') {
                this.currentView = 'main';
                this.currentPage = 0;
                await this.updateMessage(ctx, 'Bizni tanlaganingizdan mamnunmiz 😊', this.getMainKeyboard());
            }
        }
    }
    async showHadislar(ctx) {
        const hadislarPerPage = 10;
        const hadislar = await this.hadislarService.findAll();
        const paginatedHadislar = hadislar.slice(this.currentPage * hadislarPerPage, (this.currentPage + 1) * hadislarPerPage);
        let message;
        if (paginatedHadislar.length > 0) {
            message = paginatedHadislar.map(had => `<b>${had.name}</b>\n${had.about}`).join('\n\n');
            message += `\n\nSahifa: ${this.currentPage + 1}`;
        }
        else {
            message = 'Boshqa hadislar qolmadi.';
        }
        await this.updateMessage(ctx, message, this.getInlineKeyboard());
    }
    async updateMessage(ctx, message, keyboard) {
        try {
            await ctx.telegram.editMessageText(ctx.chat.id, this.currentMessageId, undefined, message, {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: keyboard
                }
            });
        }
        catch (error) {
            const newMessage = await ctx.reply(message, {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: keyboard
                }
            });
            this.currentMessageId = newMessage.message_id;
        }
    }
    getInlineKeyboard() {
        if (this.currentView === 'hadislar') {
            return [
                [{ text: 'Keyingi', callback_data: 'next' }],
                [{ text: 'Orqaga qayt', callback_data: 'back' }]
            ];
        }
        return [
            [{ text: 'Orqaga qayt', callback_data: 'back' }]
        ];
    }
    getMainKeyboard() {
        return [
            [{ text: 'Suralar', callback_data: 'surah' }, { text: 'Xadislar', callback_data: 'xadis' }],
            [{ text: 'Alloh ismlari', callback_data: 'ismlar' }, { text: 'Taqvim', callback_data: 'taqvim' }]
        ];
    }
    async getNamozVaqtlarini(ctx) {
        try {
            const response = await axios_1.default.get('https://api.aladhan.com/v1/timingsByCity/20-10-2024?city=Beijing&country=China&method=2');
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
            await this.updateMessage(ctx, message, this.getInlineKeyboard());
        }
        catch (error) {
            await ctx.reply("Xatolik yuz berdi, iltimos keyinroq urinib ko'ring.", {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Orqaga qayt', callback_data: 'back' }]
                    ]
                }
            });
        }
    }
    async getIsmlar(ctx) {
        try {
            const namesData = await fs.readFile('/home/asus/project/my_quran/src/bot/name.json', 'utf8');
            const names = JSON.parse(namesData).allNames;
            const formattedNames = names.map(name => `${name.Name} - ${name.Arabic}`).join('\n\n');
            const maxMessageLength = 4096;
            if (formattedNames.length > maxMessageLength) {
                let offset = 0;
                while (offset < formattedNames.length) {
                    const messagePart = formattedNames.slice(offset, offset + maxMessageLength);
                    await this.updateMessage(ctx, messagePart, this.getInlineKeyboard());
                    offset += maxMessageLength;
                }
            }
            else {
                await this.updateMessage(ctx, formattedNames, this.getInlineKeyboard());
            }
        }
        catch (error) {
            console.error(error);
            await ctx.reply("Faylni o'qishda xato yuz berdi. Iltimos, faylning mavjudligini va formatini tekshiring.", {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Orqaga qayt', callback_data: 'back' }]
                    ]
                }
            });
        }
    }
};
exports.BotService = BotService;
exports.BotService = BotService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_telegraf_1.InjectBot)()),
    __metadata("design:paramtypes", [telegraf_1.Telegraf,
        hadislar_service_1.HadislarService])
], BotService);
//# sourceMappingURL=bot.service.js.map