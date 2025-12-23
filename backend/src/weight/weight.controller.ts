import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WeightService } from './weight.service';
import { CreateWeightDto } from './dto/create-weight.dto';

@ApiTags('Weights')
@Controller('weights')
export class WeightController {
  constructor(private readonly weightService: WeightService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new weight' })
  async create(@Body() createWeightDto: CreateWeightDto) {
    return this.weightService.create(createWeightDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all weights' })
  async findAll() {
    return this.weightService.findAll();
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update weight' })
  async update(@Param('id') id: string, @Body() updateWeightDto: CreateWeightDto) {
    return this.weightService.update(+id, updateWeightDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete weight' })
  async remove(@Param('id') id: string) {
    return this.weightService.remove(+id);
  }
}