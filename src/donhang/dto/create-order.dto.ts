import { IsString, IsNotEmpty, IsDateString, IsArray, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

// Chi tiết từng sản phẩm trong đơn hàng
export class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  MaTraiCay: string;

  @IsNumber()
  @Min(1)
  SoLuong: number;

  @IsNumber()
  @Min(0)
  Gia: number;

  SanPham?: string; // Tên sản phẩm, optional
}

// DTO chính để tạo hóa đơn + đơn hàng
export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  MaHoaDon: string;

  @IsString()
  MaNhanVien: string;

  @IsString()
  MaKhachHang: string;

  @IsDateString()
  NgayXuatHoaDon: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  ThongTinKhachHang?: string;
  ThongTinSanPham?: string;
}
