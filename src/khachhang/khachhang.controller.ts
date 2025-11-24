import { Body, Controller, Get, Param, Post, Put, Delete } from '@nestjs/common';
import { KhachHangService } from './khachhang.service';
import { CreateKhachHangDto } from '../DTO/khachhang.dto';
import { UpdateKhachHangDto } from '../DTO/update-khachhang.dto';

@Controller('khachhang')
export class KhachHangController {
  constructor(private service: KhachHangService) {}

  @Post('register')
  create(@Body() dto: CreateKhachHangDto) {
    return this.service.create(dto);
  }

  @Post('login')
  login(@Body() body: { email: string; matKhau: string }) {
    return this.service.login(body.email, body.matKhau);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put('update/:id')
  update(@Param('id') id: string, @Body() dto: UpdateKhachHangDto) {
    return this.service.update(id, dto);
  }

  // 🔹 Toggle khóa / mở khóa
  @Put('toggle-lock/:id')
  toggleLock(@Param('id') id: string) {
    return this.service.toggleLock(id);
  }

  // 🔹 Xóa tài khoản
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
