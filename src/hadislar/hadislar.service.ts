import { Injectable } from '@nestjs/common';
import { CreateHadislarDto } from './dto/create-hadislar.dto';
import { UpdateHadislarDto } from './dto/update-hadislar.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Hadislar } from './models/hadislar.model';
// import { Hadislar } from './model/hadislar.model'; // Hadislar modelini import qilish

@Injectable()
export class HadislarService {
  constructor(@InjectModel(Hadislar) private hadislarModel: typeof Hadislar) {}

  create(createHadislarDto: CreateHadislarDto) {
    return this.hadislarModel.create(createHadislarDto);
  }

  async findAll() {
    return this.hadislarModel.findAll(); // Barcha hadislarni qaytarish
  }

  async findOne(id: number) {
    const hadis = await this.hadislarModel.findByPk(id);
    if (!hadis) {
      return { message: `Hadis with id ${id} not found` };
    }
    return hadis; // Maxsus id bo'yicha hadisni qaytarish
  }

  async update(id: number, updateHadislarDto: UpdateHadislarDto) {
    const [numberOfAffectedRows, [updatedHadis]] = await this.hadislarModel.update(updateHadislarDto, {
      where: { id },
      returning: true,
    });

    if (numberOfAffectedRows === 0) {
      return { message: `Hadis with id ${id} not found` };
    }
    return updatedHadis; // Yangilangan hadisni qaytarish
  }

  async remove(id: number) {
    const deletedCount = await this.hadislarModel.destroy({ where: { id } });
    if (deletedCount === 0) {
      return { message: `Hadis with id ${id} not found` };
    }
    return { message: `Hadis with id ${id} has been removed` }; // O'chirilgan hadis haqida xabar
  }
}
