import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
config();

import { NhanVien } from '../entities/nhanvien.entity';
import { KhachHang } from '../entities/khachhang.entity';
import { HoaDon } from '../entities/hoadon.entity';
import { DonHang } from '../entities/donhang.entity';
import { TraiCay } from '../entities/traicay.entity';
import { Kho } from '../entities/kho.entity';
import { DiemThuong } from '../entities/diemthuong.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '12345',
  database: process.env.DB_DATABASE || 'fruitshop',
  entities: [NhanVien, KhachHang, HoaDon, DonHang, TraiCay, Kho, DiemThuong],
  synchronize: true, // DEV only
  logging: false
};
