import { IsEmail, IsOptional } from "class-validator";

export class UpdateKhachHangDto {
  @IsOptional()
  HoTen?: string;

  @IsOptional()
  @IsEmail()
  Email?: string;

  @IsOptional()
  SDT?: string;

  @IsOptional()
  DiaChi?: string;

  @IsOptional()
  MatKhau?: string;
}
