import { Controller, Get, Param } from '@nestjs/common';
import { DonHangService } from '../donhang/donhang.service';

@Controller('diemthuong')
export class DiemThuongController {
  constructor(private readonly donHangService: DonHangService) {}

  @Get(':MaKhachHang')
  async getRewardPoints(@Param('MaKhachHang') MaKhachHang: string) {
    const points = await this.donHangService.getRewardPoints(MaKhachHang);
    return { DiemThuong: points };
  }
}
