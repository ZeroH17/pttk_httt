import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './database/typeorrm.config';
import { DonHangModule } from './donhang/donhang.module';
import { BaoCaoModule } from './baocao/baocao.module';
import { ReportModule } from './report/report.module';
import { KhachHangModule } from './khachhang/khachhang.module';
import { TraiCayModule } from './traicay/traiCay.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    DonHangModule,
    BaoCaoModule,
    ReportModule,
    KhachHangModule,
    TraiCayModule,
  ],
})
export class AppModule {}
