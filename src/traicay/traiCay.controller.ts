import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { TraiCayService } from './traiCay.service';
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

  @Post('add-to-cart')
  addToCart(@Body() dto: CreateOrderDto) {
    return this.service.addToCart(dto);
  }
}
