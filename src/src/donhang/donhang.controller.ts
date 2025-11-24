import { Controller, Post, Body, Get, Query, Param, Patch, BadRequestException } from '@nestjs/common';
import { DonHangService } from './donhang.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { OrderStatus } from '../entities/donhang.entity';

@Controller('donhang')
export class DonHangController {
  constructor(private readonly donHangService: DonHangService) {}

  // Tạo hóa đơn + đơn hàng
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

  // Lấy tất cả đơn hàng
  @Get()
  async getAll() {
    return this.donHangService.getAllOrders();
  }

  // Tìm theo ngày
  @Get('search')
  async searchByDate(@Query('from') from: string, @Query('to') to: string) {
    if (!from || !to) throw new BadRequestException('Thiếu tham số from hoặc to');
    return this.donHangService.searchOrdersByDate(from, to);
  }

  // Lấy theo Mã Đơn Hàng
  @Get(':MaDonHang')
  async getDonHangByMaDonHang(@Param('MaDonHang') MaDonHang: string) {
    return this.donHangService.findByMaDonHang(MaDonHang);
  }

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

  // Cập nhật trạng thái đơn hàng
  @Patch(':MaDonHang/status')
  async updateStatus(
    @Param('MaDonHang') MaDonHang: string,
    @Body('status') status: string
  ) {
    // Kiểm tra status hợp lệ
    if (!Object.values(OrderStatus).includes(status as OrderStatus)) {
      throw new BadRequestException('Trạng thái không hợp lệ. Chỉ chấp nhận: Chờ xử lý, Đang giao, Hoàn tất');
    }

    return this.donHangService.updateOrderStatus(MaDonHang, status as OrderStatus);
  }
}
