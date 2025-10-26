import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HoaDon } from '../entities/hoadon.entity';
import { DonHang } from '../entities/donhang.entity';
import { TraiCay } from '../entities/traicay.entity';
import { Kho } from '../entities/kho.entity';
import { DonHangService } from './donhang.service';
import { DonHangController } from './donhang.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HoaDon, DonHang, TraiCay, Kho])],
  providers: [DonHangService],
  controllers: [DonHangController]
})
export class DonHangModule {}
