import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TraiCay } from '../entities/traicay.entity';
import { DonHang } from '../entities/donhang.entity';
import { TraiCayService } from './traiCay.service';
import { TraiCayController } from './traiCay.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TraiCay, DonHang])],
  providers: [TraiCayService],
  controllers: [TraiCayController],
})
export class TraiCayModule {}
