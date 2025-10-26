import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './database/typeorrm.config';
import { DonHangModule } from './donhang/donhang.module';
import { BaoCaoModule } from './baocao/baocao.module';

@Module({
  imports: [
    // ❌ Tắt TypeORM khi chưa có DB
    // TypeOrmModule.forRoot(typeOrmConfig),
    DonHangModule,
    BaoCaoModule,
  ],
})
export class AppModule {}
