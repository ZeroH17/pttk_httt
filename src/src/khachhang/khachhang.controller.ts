import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { KhachHangService } from './khachhang.service';
import { CreateKhachHangDto } from '../DTO/khachhang.dto';
import { UpdateKhachHangDto } from '../DTO/update-khachhang.dto';


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

  @Put('update/:id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateKhachHangDto
  ) {
    return this.service.update(id, dto);
  }
}
