import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
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

  async create(dto: CreateKhachHangDto) {
    const newKH = new KhachHang();
    const count = await this.repo.count();
    newKH.MaKhachHang = `KH${String(count + 1).padStart(3, '0')}`;
    newKH.HoTen = dto.HoTen;
    newKH.Email = dto.Email;
    newKH.MatKhau = await bcrypt.hash(dto.MatKhau, 10);
    newKH.SDT = dto.SDT ?? null;
    newKH.DiaChi = dto.DiaChi ?? null;
    newKH.isLocked = false; // mặc định mở khóa
    return this.repo.save(newKH);
  }

  async findAll() {
    return this.repo.find();
  }

  async findOne(maKH: string) {
    const user = await this.repo.findOne({ where: { MaKhachHang: maKH } });
    if (!user) throw new NotFoundException("Không tìm thấy khách hàng");
    return user;
  }

  async login(email: string, matKhau: string) {
    const user = await this.repo.findOne({ where: { Email: email } });
    if (!user) throw new UnauthorizedException('Email không tồn tại');

    const isMatch = await bcrypt.compare(matKhau, user.MatKhau);
    if (!isMatch) throw new UnauthorizedException('Mật khẩu không đúng');

    return {
      MaKhachHang: user.MaKhachHang,
      HoTen: user.HoTen,
      Email: user.Email,
      SDT: user.SDT,
      DiaChi: user.DiaChi,
      isLocked: user.isLocked
    };
  }

  async update(maKH: string, dto: any) {
    const user = await this.repo.findOne({ where: { MaKhachHang: maKH } });
    if (!user) throw new NotFoundException("Không tìm thấy khách hàng");

    if (dto.HoTen !== undefined) user.HoTen = dto.HoTen;
    if (dto.Email !== undefined) user.Email = dto.Email;
    if (dto.SDT !== undefined) user.SDT = dto.SDT;
    if (dto.DiaChi !== undefined) user.DiaChi = dto.DiaChi;

    if (dto.MatKhau && dto.MatKhau.trim() !== "") {
      user.MatKhau = await bcrypt.hash(dto.MatKhau, 10);
    }

    await this.repo.save(user);
    return user;
  }

  // 🔹 Khóa hoặc mở khóa tài khoản
  async toggleLock(maKH: string) {
    const user = await this.repo.findOne({ where: { MaKhachHang: maKH } });
    if (!user) throw new NotFoundException("Không tìm thấy khách hàng");

    user.isLocked = !user.isLocked;
    await this.repo.save(user);
    return { MaKhachHang: user.MaKhachHang, isLocked: user.isLocked };
  }

  // 🔹 Xóa tài khoản
  async remove(maKH: string) {
    const user = await this.repo.findOne({ where: { MaKhachHang: maKH } });
    if (!user) throw new NotFoundException("Không tìm thấy khách hàng");

    await this.repo.delete({ MaKhachHang: maKH });
    return { message: "Xóa tài khoản thành công" };
  }
}
