import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import * as fs from 'fs/promises';
import { HadislarService } from '../hadislar/hadislar.service';
import axios from 'axios';

@Injectable()
export class BotService {
  private currentPage: number = 0; // Hozirgi sahifa
  private currentView: string = 'main'; // Hozirgi ko'rish: 'main', 'hadislar', 'namoz', 'ismlar'
  private currentMessageId: number; // Hozirgi xabar ID'si

  constructor(
    @InjectBot() private bot: Telegraf<Context>,
    private hadislarService: HadislarService,
  ) {
    this.bot.start((ctx) => this.onStart(ctx));
    this.bot.on('callback_query', (ctx) => this.callbackQuery(ctx));
  }

  async onStart(ctx: Context) {
    this.currentPage = 0; // Sahifani boshlanishiga qaytarish
    this.currentView = 'main'; // Hozirgi ko'rishni boshlash

    const message = await ctx.reply('Bizni tanlaganingizdan mamnunmiz 😊', {
      reply_markup: {
        inline_keyboard: this.getMainKeyboard() // Asosiy menyu tugmalari
      }
    });

    this.currentMessageId = message.message_id; // Hozirgi xabar ID'sini saqlash
  }

  async callbackQuery(ctx: Context) {
    if ('data' in ctx.callbackQuery) {
      const callbackData = ctx.callbackQuery.data;

      if (callbackData === 'xadis') {
        this.currentPage = 0; // Sahifani 0 ga qaytarish
        this.currentView = 'hadislar'; // Hozirgi ko'rishni hadislar sifatida belgilash
        await this.showHadislar(ctx);
      } else if (callbackData === 'next' && this.currentView === 'hadislar') {
        this.currentPage += 1; // Keyingi sahifaga o'tish
        await this.showHadislar(ctx);
      } else if (callbackData === 'back' && this.currentView === 'hadislar') {
        this.currentView = 'main'; // Asosiy menyuga qaytish
        this.currentPage = 0; // Sahifani 0 ga qaytarish
        await this.updateMessage(ctx, 'Bizni tanlaganingizdan mamnunmiz 😊', this.getMainKeyboard()); // Asosiy menyu xabarini yangilash
      } else if (callbackData === 'taqvim') {
        this.currentView = 'namoz'; // Hozirgi ko'rishni namoz vaqtlariga belgilash
        await this.getNamozVaqtlarini(ctx);
      } else if (callbackData === 'ismlar') {
        this.currentView = 'ismlar'; // Hozirgi ko'rishni ismlar sifatida belgilash
        await this.getIsmlar(ctx);
      } else if (callbackData === 'back') {
        // Boshqa barcha sahifalar uchun orqaga qaytish
        this.currentView = 'main'; // Asosiy menyuga qaytish
        this.currentPage = 0; // Sahifani 0 ga qaytarish
        await this.updateMessage(ctx, 'Bizni tanlaganingizdan mamnunmiz 😊', this.getMainKeyboard()); // Asosiy menyu xabarini yangilash
      }
    }
  }

  async showHadislar(ctx: Context) {
    const hadislarPerPage = 10; // Har sahifada ko'rsatish uchun hadislar soni
    const hadislar = await this.hadislarService.findAll(); // Barcha hadislarni olish
    const paginatedHadislar = hadislar.slice(this.currentPage * hadislarPerPage, (this.currentPage + 1) * hadislarPerPage); // Sahifaga mos hadislarni olish

    let message: string;

    if (paginatedHadislar.length > 0) {
      message = paginatedHadislar.map(had => `<b>${had.name}</b>\n${had.about}`).join('\n\n');
      message += `\n\nSahifa: ${this.currentPage + 1}`;
    } else {
      message = 'Boshqa hadislar qolmadi.';
    }

    await this.updateMessage(ctx, message, this.getInlineKeyboard());
  }

  private async updateMessage(ctx: Context, message: string, keyboard: any) {
    try {
      await ctx.telegram.editMessageText(ctx.chat.id, this.currentMessageId, undefined, message, {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: keyboard // Yangilangan tugmalarni ko'rsatish uchun
        }
      });
    } catch (error) {
      const newMessage = await ctx.reply(message, {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: keyboard // Yangilangan tugmalarni ko'rsatish uchun
        }
      });
      this.currentMessageId = newMessage.message_id; // Yangi xabar ID'sini yangilash
    }
  }

  private getInlineKeyboard() {
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

  private getMainKeyboard() {
    return [
      [{ text: 'Suralar', callback_data: 'surah' }, { text: 'Xadislar', callback_data: 'xadis' }],
      [{ text: 'Alloh ismlari', callback_data: 'ismlar' }, { text: 'Taqvim', callback_data: 'taqvim' }]
    ];
  }

  private async getNamozVaqtlarini(ctx: Context) {
    try {
      const response = await axios.get('https://api.aladhan.com/v1/timingsByCity/20-10-2024?city=Tashkent&country=Uzbekistan&method=2');
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
    } catch (error) {
      await ctx.reply("Xatolik yuz berdi, iltimos keyinroq urinib ko'ring.", {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Orqaga qayt', callback_data: 'back' }]
          ]
        }
      });
    }
  }

  private async getIsmlar(ctx: Context) {
    try {
      const namesData = await fs.readFile('/home/asus/project/my_quran/src/bot/name.json', 'utf8');
      const names = JSON.parse(namesData).allNames; // allNames massividan foydalanish
      const formattedNames = names.map(name => `${name.Name} - ${name.Arabic}`).join('\n\n');

      const maxMessageLength = 4096;
      if (formattedNames.length > maxMessageLength) {
        let offset = 0;
        while (offset < formattedNames.length) {
          const messagePart = formattedNames.slice(offset, offset + maxMessageLength);
          await this.updateMessage(ctx, messagePart, this.getInlineKeyboard());
          offset += maxMessageLength; // Keyingi bo'lak uchun offsetni yangilash
        }
      } else {
        await this.updateMessage(ctx, formattedNames, this.getInlineKeyboard());
      }
    } catch (error) {
      console.error(error); // Xatolik haqida ma'lumot chiqarish
      await ctx.reply("Faylni o'qishda xato yuz berdi. Iltimos, faylning mavjudligini va formatini tekshiring.", {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Orqaga qayt', callback_data: 'back' }]
          ]
        }
      });
    }
  }
}
