import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { TraiCayService } from './traiCay.service';
import { CreateTraiCayDto } from '../DTO/create-traicay.dto';
import { UpdateTraiCayDto } from '../DTO/update-traicay.dto';
import { CreateOrderDto } from '../donhang/dto/create-order.dto';

@Controller('traicay')
export class TraiCayController {
  constructor(private service: TraiCayService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateTraiCayDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTraiCayDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Post('add-to-cart')
  addToCart(@Body() dto: CreateOrderDto) {
    return this.service.addToCart(dto);
  }
}
