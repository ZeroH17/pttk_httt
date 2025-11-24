import { IsString, IsNotEmpty, IsDateString, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsOptional()  // Thêm @IsOptional
  MaHoaDon?: string;

  @IsString()
  MaNhanVien: string;

  @IsString()
  MaKhachHang: string;

  @IsDateString()
  NgayXuatHoaDon: string;

  @IsNumber()
  @Min(0)
  TongTien: number;

  ThongTinKhachHang?: string;
  ThongTinSanPham?: string;
}
