import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUnitDto } from './dto/create-unit.dto';

@Injectable()
export class UnitService {
  constructor(private prisma: PrismaService) {}

  async create(createUnitDto: CreateUnitDto) {
    return this.prisma.unit.create({
      data: {
        name: createUnitDto.name,
      },
    });
  }

  async findAll() {
    return this.prisma.unit.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async update(id: number, updateUnitDto: CreateUnitDto) {
    return this.prisma.unit.update({
      where: { id },
      data: {
        name: updateUnitDto.name,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.unit.delete({
      where: { id },
    });
  }
}