import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { HoaDon } from '../entities/hoadon.entity';
import { DonHang } from '../entities/donhang.entity';
import { TraiCay } from '../entities/traicay.entity';
import { Kho } from '../entities/kho.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HoaDon, DonHang, TraiCay, Kho])],
  providers: [ReportService],
  controllers: [ReportController],
})
export class ReportModule {}