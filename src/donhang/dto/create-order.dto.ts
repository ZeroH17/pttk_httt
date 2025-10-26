import { IsString, IsNotEmpty, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsString() MaDonHang: string;
  @IsString() MaTraiCay: string;
  SoLuong: number;
  Gia: number;
  SanPham?: string;
}

export class CreateOrderDto {
  @IsString() @IsNotEmpty() MaHoaDon: string;
  @IsString() MaNhanVien: string;
  @IsString() MaKhachHang: string;
  @IsDateString() NgayXuatHoaDon: string;
  @IsArray() @ValidateNested({ each: true }) @Type(() => OrderItemDto)
  items: OrderItemDto[];
  ThongTinKhachHang?: string;
  ThongTinSanPham?: string;
}
