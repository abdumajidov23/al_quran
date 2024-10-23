import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BotService } from './bot.service';
import { CreateBotDto } from './dto/create-bot.dto';
import { UpdateBotDto } from './dto/update-bot.dto';

@Controller('bot')
export class BotUpdate {
  constructor(private readonly botService: BotService) {}
}
