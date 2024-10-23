import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Markup, Telegraf } from 'telegraf';
const axios = require('axios');

@Injectable()
export class BotService {
  constructor(
    @InjectBot() private bot: Telegraf<Context>
  ) {
    this.bot.start((ctx) => this.onStart(ctx));
    this.bot.on('callback_query', (ctx) => this.callbackQuery(ctx));
  }

  async onStart(ctx: Context) {
    ctx.reply('Bizni tanlaganingizdan mamnunmiz 😊', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Suralar', callback_data: 'surah' }, { text: 'Xadislar', callback_data: 'xadis' }],
          [{ text: 'Duolar', callback_data: 'duo' }, { text: 'Taqvim', callback_data: 'taqvim' }],
        ]
      }
    });
  }

  async callbackQuery(ctx: Context) {
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
        // API dan namoz vaqtlarini olish uchun so'rov yuboriladi

        // axios.get('https://worldtimeapi.org/api/timezone/Asia/Tashkent')
        axios.get('https://api.aladhan.com/v1/timingsByCity/20-10-2024?city=Tashkent&country=Uzbekistan&method=2')
          .then(response => {
            const now = new Date();
            const hours = now.getHours();
            const minuts = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            const timings = response.data.data.timings;
            
            // Namoz vaqtlarini formatlash
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
            
            // Foydalanuvchiga namoz vaqtlarini qaytarish
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
            // Xatolik yuz bersa, xabarni qaytarish
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
        // Orqaga qaytish tugmasi bosilganda onStart funksiyasi qaytadan chaqiriladi
        this.onStart(ctx);
      }
    }
  }
}
