import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HoaDon } from '../entities/hoadon.entity';
import { DonHang } from '../entities/donhang.entity';
import { Repository, Between } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { TraiCay } from '../entities/traicay.entity';
import { Kho } from '../entities/kho.entity';

@Injectable()
export class DonHangService {
  constructor(
    @InjectRepository(HoaDon) private hoaDonRepo: Repository<HoaDon>,
    @InjectRepository(DonHang) private donHangRepo: Repository<DonHang>,
    @InjectRepository(TraiCay) private traiCayRepo: Repository<TraiCay>,
    @InjectRepository(Kho) private khoRepo: Repository<Kho>,
  ) {}

  async createOrder(dto: CreateOrderDto) {
    // Tạo hóa đơn và items (transaction recommended)
    const hoadon = this.hoaDonRepo.create({
      MaHoaDon: dto.MaHoaDon,
      MaNhanVien: dto.MaNhanVien,
      MaKhachHang: dto.MaKhachHang,
      NgayXuatHoaDon: new Date(dto.NgayXuatHoaDon),
      ThongTinKhachHang: dto.ThongTinKhachHang || '',
      ThongTinSanPham: dto.ThongTinSanPham || ''
    });

    // Save hoa don
    await this.hoaDonRepo.save(hoadon);

    // Lưu từng DonHang, cập nhật tồn kho & TraiCay.SoLuong
    for (const item of dto.items) {
      const dh = this.donHangRepo.create({
        MaDonHang: item.MaDonHang,
        MaHoaDon: dto.MaHoaDon,
        MaTraiCay: item.MaTraiCay,
        SoLuong: item.SoLuong,
        Gia: item.Gia,
        SanPham: item.SanPham || ''
      });
      await this.donHangRepo.save(dh);

      // Cập nhật TraiCay.SoLuong
      const tc = await this.traiCayRepo.findOne({ where: { MaTraiCay: item.MaTraiCay } });
      if (tc) {
        tc.SoLuong = (tc.SoLuong || 0) - item.SoLuong;
        if (tc.SoLuong < 0) tc.SoLuong = 0;
        await this.traiCayRepo.save(tc);
      }

      // Cập nhật Kho (ví dụ giảm TonKho)
      const kho = await this.khoRepo.findOne({ where: { MaTraiCay: item.MaTraiCay } });
      if (kho) {
        kho.TonKho = Math.max(0, (kho.TonKho || 0) - item.SoLuong);
        await this.khoRepo.save(kho);
      }
    }

    return { message: 'Tạo đơn hàng thành công', MaHoaDon: dto.MaHoaDon };
  }

  async getAllOrders() {
    return this.hoaDonRepo.find({ relations: ['donhangs', 'khachhang', 'nhanvien'], order: { NgayXuatHoaDon: 'DESC' } });
  }

  async searchOrdersByDate(from: string, to: string) {
    const fromD = new Date(from);
    const toD = new Date(to);
    // ensure end of day
    toD.setHours(23,59,59,999);
    return this.hoaDonRepo.find({
      where: { NgayXuatHoaDon: Between(fromD, toD) },
      relations: ['donhangs', 'khachhang', 'nhanvien'],
      order: { NgayXuatHoaDon: 'DESC' }
    });
  }
}
