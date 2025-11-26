import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { DonHangService } from './donhang.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { OrderStatus } from '../entities/donhang.entity';

@Controller('donhang')
export class DonHangController {
  constructor(private readonly donHangService: DonHangService) {}

  // Tạo đơn hàng
  @Post()
  async createOrder(@Body() body: any) {
    const dto = plainToInstance(CreateOrderDto, body);
    await validateOrReject(dto).catch(err => { throw err });

    return this.donHangService.createOrder(dto);
  }

  // Lấy tất cả
  @Get()
  async getAll() {
    return this.donHangService.getAllOrders();
  }

  // Lấy theo mã đơn
  @Get(':MaDonHang')
  async getDonHangByMaDonHang(@Param('MaDonHang') MaDonHang: string) {
    return this.donHangService.findByMaDonHang(MaDonHang);
  }

  // Cập nhật trạng thái đơn hàng
  @Patch(':MaDonHang/status')
  async updateStatus(
    @Param('MaDonHang') MaDonHang: string,
    @Body('status') status: string
  ) {
    if (!Object.values(OrderStatus).includes(status as OrderStatus)) {
      throw new BadRequestException(
        'Trạng thái không hợp lệ. Chỉ chấp nhận: PENDING, SHIPPING, COMPLETED, CANCELED',
      );
    }
    return this.donHangService.updateOrderStatus(MaDonHang, status as OrderStatus);
  }

  // Hoàn đơn
  @Post('cancel/:MaDonHang')
  async cancelOrder(@Param('MaDonHang') MaDonHang: string) {
    return this.donHangService.cancelOrder(MaDonHang);
  }
}
