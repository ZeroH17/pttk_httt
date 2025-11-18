import { IsString, IsNotEmpty, IsDateString, IsNumber, Min } from 'class-validator';

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

  @IsNumber()
  @Min(0)
  TongTien: number; // tổng tiền từ frontend

  ThongTinKhachHang?: string;
  ThongTinSanPham?: string;
}
