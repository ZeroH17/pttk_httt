import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DonHangController } from './donhang.controller';
import { DonHangService } from './donhang.service';
import { DiemThuongController } from '../diemthuong/diemthuong.controller';
import { DonHang } from '../entities/donhang.entity';
import { HoaDon } from '../entities/hoadon.entity';
import { TraiCay } from '../entities/traicay.entity';
import { DiemThuong } from '../entities/diemthuong.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DonHang, HoaDon, TraiCay, DiemThuong])],
  controllers: [DonHangController, DiemThuongController],
  providers: [DonHangService],
})
export class DonHangModule {}
