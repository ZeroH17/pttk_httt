import { Body, Controller, Get, Param, Post, Put, Delete } from '@nestjs/common';
import { KhachHangService } from './khachhang.service';
import { CreateKhachHangDto } from '../DTO/khachhang.dto';
import { UpdateKhachHangDto } from '../DTO/update-khachhang.dto';

@Controller('khachhang')
export class KhachHangController {
  constructor(private readonly service: KhachHangService) {}

  // Đăng ký tài khoản
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

  // Lấy 1 khách hàng theo ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // Cập nhật thông tin khách hàng
  @Put('update/:id')
  update(@Param('id') id: string, @Body() dto: UpdateKhachHangDto) {
    return this.service.update(id, dto);
  }

  // Khóa / mở khóa tài khoản
  @Put('toggle-lock/:id')
  toggleLock(@Param('id') id: string) {
    return this.service.toggleLock(id);
  }

  // Xóa tài khoản
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  // Lấy điểm thưởng của khách hàng
  @Get(':id/diemthuong')
  async getDiemThuong(@Param('id') id: string) {
    const khachHang = await this.service.findOne(id);

    if (!khachHang) return { DiemThuong: 0 };

    return {
      DiemThuong: khachHang.diemthuongs || 0
    };
  }
}
