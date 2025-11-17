import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { DonHangService } from './donhang.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Controller('donhang')
export class DonHangController {
  constructor(private readonly donHangService: DonHangService) {}

  // ⭐ Tạo hóa đơn + đơn hàng
  @Post()
  async createOrder(@Body() body: any) {
    const dto = plainToInstance(CreateOrderDto, body);
    await validateOrReject(dto).catch(err => { throw err });

    const result = await this.donHangService.createOrder(dto);

    return {
      message: result.message,
      MaHoaDon: result.MaHoaDon,
      MaDonHang: result.MaDonHang,
    };
  }

  // ⭐ Lấy tất cả đơn hàng
  @Get()
  async getAll() {
    return this.donHangService.getAllOrders();
  }

  // ⭐ Tìm theo ngày
  @Get('search')
  async searchByDate(@Query('from') from: string, @Query('to') to: string) {
    if (!from || !to) return { error: 'Thiếu tham số from hoặc to' };
    return this.donHangService.searchOrdersByDate(from, to);
  }

  // ⭐ Lấy theo Mã Đơn Hàng
  @Get(':MaDonHang')
  async getDonHangByMaDonHang(@Param('MaDonHang') MaDonHang: string) {
    return this.donHangService.findByMaDonHang(MaDonHang);
  }

  // ⭐⭐ ====== API LẤY MÃ CUỐI ====== ⭐⭐

  // Lấy mã đơn hàng cuối: DH001, DH002...
  @Get('auto/last-order-code')
  async getLastOrderCode() {
    return this.donHangService.getLastOrderCode();
  }

  // Lấy mã hóa đơn cuối: HD001, HD002...
  @Get('auto/last-invoice-code')
  async getLastInvoiceCode() {
    return this.donHangService.getLastInvoiceCode();
  }
  
}
