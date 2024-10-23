import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HadislarService } from './hadislar.service';
import { CreateHadislarDto } from './dto/create-hadislar.dto';
import { UpdateHadislarDto } from './dto/update-hadislar.dto';

@Controller('hadislar')
export class HadislarController {
  constructor(private readonly hadislarService: HadislarService) {}

  @Post('create')
  create(@Body() createHadislarDto: CreateHadislarDto) {
    return this.hadislarService.create(createHadislarDto);
  }

  @Get('getAll')
  findAll() {
    return this.hadislarService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hadislarService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHadislarDto: UpdateHadislarDto) {
    return this.hadislarService.update(+id, updateHadislarDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hadislarService.remove(+id);
  }
}
