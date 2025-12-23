import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UnitService } from './unit.service';
import { CreateUnitDto } from './dto/create-unit.dto';

@ApiTags('Units')
@Controller('units')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new unit' })
  async create(@Body() createUnitDto: CreateUnitDto) {
    return this.unitService.create(createUnitDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all units' })
  async findAll() {
    return this.unitService.findAll();
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update unit' })
  async update(@Param('id') id: string, @Body() updateUnitDto: CreateUnitDto) {
    return this.unitService.update(+id, updateUnitDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete unit' })
  async remove(@Param('id') id: string) {
    return this.unitService.remove(+id);
  }
}