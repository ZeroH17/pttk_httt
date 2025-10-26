import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DonHang } from '../entities/donhang.entity';
import { TraiCay } from '../entities/traicay.entity';
import { Kho } from '../entities/kho.entity';
import { HoaDon } from '../entities/hoadon.entity';
import { BaoCaoService } from './baocao.service';
import { BaoCaoController } from './baocao.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DonHang, TraiCay, Kho, HoaDon])],
  providers: [BaoCaoService],
  controllers: [BaoCaoController],
})
export class BaoCaoModule {}
