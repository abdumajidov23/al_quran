import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { HadislarService } from './hadislar.service';
import { HadislarController } from './hadislar.controller';
import { Hadislar } from './models/hadislar.model';
import { Bot } from '../bot/entities/bot.entity';
// import { Hadislar } from './entities/hadislar.entity';
// import { Hadislar } from './model/hadislar.model';

@Module({
  imports: [SequelizeModule.forFeature([Hadislar,Bot])],
  controllers: [HadislarController],
  providers: [HadislarService],
})
export class HadislarModule {}
