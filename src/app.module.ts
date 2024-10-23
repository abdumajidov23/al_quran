import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { SequelizeModule } from '@nestjs/sequelize';
import { BotModule } from './bot/bot.module';
import { Hadislar } from './hadislar/models/hadislar.model';
import { HadislarModule } from './hadislar/hadislar.module';

console.log(process.env.BOT_TOKEN, 'salom');

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TelegrafModule.forRoot({
      token: process.env.BOT_TOKEN,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [Hadislar], // Bot modelini qo'shish,
      autoLoadModels: true,
      synchronize: true
    }),
    BotModule,
    HadislarModule
  ],
})
export class AppModule {}
