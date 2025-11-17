import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KhachHang } from '../entities/khachhang.entity';
import { KhachHangService } from './khachhang.service';
import { KhachHangController } from './khachhang.controller';

@Module({
  imports: [TypeOrmModule.forFeature([KhachHang])],
  controllers: [KhachHangController],
  providers: [KhachHangService],
  exports: [KhachHangService],
})
export class KhachHangModule {}
