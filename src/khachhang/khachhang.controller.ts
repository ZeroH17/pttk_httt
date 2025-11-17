import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { KhachHangService } from './khachhang.service';
import { CreateKhachHangDto } from '../DTO/khachhang.dto';

@Controller('khachhang')
export class KhachHangController {
  constructor(private service: KhachHangService) {}

  // Đăng ký
  @Post('register')
  create(@Body() dto: CreateKhachHangDto) {
    return this.service.create(dto);
  }

  // Đăng nhập
  @Post('login')
  login(@Body() body: { email: string; matKhau: string }) {
    return this.service.login(body.email, body.matKhau);
  }

  // Lấy tất cả khách hàng
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // Lấy khách hàng theo mã
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
