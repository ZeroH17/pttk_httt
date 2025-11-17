import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KhachHang } from '../entities/khachhang.entity';
import { CreateKhachHangDto } from '../DTO/khachhang.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class KhachHangService {
  constructor(
    @InjectRepository(KhachHang)
    private repo: Repository<KhachHang>,
  ) {}

  // Tạo khách hàng mới (đăng ký)
  async create(dto: CreateKhachHangDto) {
    const newKH = new KhachHang();

    // Tạo mã KH tự động (VD: KH005)
    const count = await this.repo.count();
    newKH.MaKhachHang = `KH${String(count + 1).padStart(3, '0')}`;

    newKH.HoTen = dto.HoTen;
    newKH.Email = dto.Email;

    // Hash mật khẩu trước khi lưu
    newKH.MatKhau = await bcrypt.hash(dto.MatKhau, 10);

    // Các trường chưa nhập => null
    newKH.SDT = dto.SDT ?? null;
    newKH.DiaChi = dto.DiaChi ?? null;

    return this.repo.save(newKH);
  }

  // Lấy tất cả khách hàng
  async findAll() {
    return this.repo.find();
  }

  // Lấy khách hàng theo mã
  async findOne(maKH: string) {
    return this.repo.findOne({ where: { MaKhachHang: maKH } });
  }

  // Đăng nhập
  async login(email: string, matKhau: string) {
    const user = await this.repo.findOne({ where: { Email: email } });
    if (!user) throw new UnauthorizedException('Email không tồn tại');

    const isMatch = await bcrypt.compare(matKhau, user.MatKhau);
    if (!isMatch) throw new UnauthorizedException('Mật khẩu không đúng');

    // Trả về thông tin cơ bản (không trả mật khẩu)
    return {
      MaKhachHang: user.MaKhachHang,
      HoTen: user.HoTen,
      Email: user.Email,
      SDT: user.SDT,
      DiaChi: user.DiaChi,
    };
  }
}
