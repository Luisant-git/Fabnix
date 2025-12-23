import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateWeightDto } from './dto/create-weight.dto';

@Injectable()
export class WeightService {
  constructor(private prisma: PrismaService) {}

  async create(createWeightDto: CreateWeightDto) {
    return this.prisma.weight.create({
      data: {
        name: `${createWeightDto.value}${createWeightDto.unit}`,
        value: createWeightDto.value,
        unit: createWeightDto.unit,
      },
    });
  }

  async findAll() {
    return this.prisma.weight.findMany({
      orderBy: { value: 'asc' },
    });
  }

  async update(id: number, updateWeightDto: CreateWeightDto) {
    return this.prisma.weight.update({
      where: { id },
      data: {
        name: `${updateWeightDto.value}${updateWeightDto.unit}`,
        value: updateWeightDto.value,
        unit: updateWeightDto.unit,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.weight.delete({
      where: { id },
    });
  }
}