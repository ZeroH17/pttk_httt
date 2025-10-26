import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { DonHangService } from './donhang.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Controller('donhang')
export class DonHangController {
  constructor(private readonly donHangService: DonHangService) {}

  @Post()
  async createOrder(@Body() body: any) {
    // validate DTO
    const dto = plainToInstance(CreateOrderDto, body);
    await validateOrReject(dto).catch(err => { throw err; });
    return this.donHangService.createOrder(dto);
  }

  @Get()
  async getAll() {
    return this.donHangService.getAllOrders();
  }

  // /donhang/search?from=2025-01-01&to=2025-01-31
  @Get('search')
  async searchByDate(@Query('from') from: string, @Query('to') to: string) {
    if (!from || !to) return { error: 'Thiếu tham số from hoặc to' };
    return this.donHangService.searchOrdersByDate(from, to);
  }
}
