import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateKhachHangDto {
  @IsNotEmpty()
  HoTen: string;

  @IsEmail()
  Email: string;

  @IsNotEmpty()
  MatKhau: string;

  @IsOptional()
  SDT?: string;

  @IsOptional()
  DiaChi?: string;
}
