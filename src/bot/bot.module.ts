// import { Module } from '@nestjs/common';
// import { BotService } from './bot.service';
// import { BotController } from './bot.controller';

// @Module({
//   controllers: [BotController],
//   providers: [BotService],
// })
// export class BotModule {}


import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BotService } from './bot.service';
import { Hadislar } from '../hadislar/models/hadislar.model'; // Hadislar modelini import qiling
import { HadislarService } from '../hadislar/hadislar.service'; // Hadislar servisini import qiling

@Module({
  imports: [
    SequelizeModule.forFeature([Hadislar]), // Hadislar modelini qo'shing
  ],
  providers: [BotService, HadislarService],
})
export class BotModule {}
