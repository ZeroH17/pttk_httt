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

  // ⭐ Lấy mã hóa đơn cuối (HDxxx)
  async getLastInvoiceCode(): Promise<string> {
    const all = await this.hoaDonRepo.find();

    if (!all.length) return 'HD000';

    // Lấy số cuối cùng của mỗi HD
    const numbers = all.map(hd => {
      const match = hd.MaHoaDon.match(/\d{3}$/); // lấy 3 chữ số cuối
      return match ? parseInt(match[0]) : 0;
    });

    const maxNumber = Math.max(...numbers);

    return 'HD' + maxNumber.toString().padStart(3, '0');
  }

  // ⭐ Lấy mã đơn hàng cuối (DHxxx)
  async getLastOrderCode(): Promise<string> {
    const last = await this.donHangRepo.find({
      order: { MaDonHang: 'DESC' },
      take: 1,
    });

    return last.length ? last[0].MaDonHang : 'DH000';
  }

  // ⭐ Tạo mã mới dựa trên mã cuối
  private generateNextCode(prefix: string, lastCode: string): string {
    const num = parseInt(lastCode.replace(prefix, '')) + 1;
    return prefix + num.toString().padStart(3, '0');
  }

  // ⭐ Tạo đơn hàng + hóa đơn
  async createOrder(dto: CreateOrderDto) {
    // ====== 1️⃣ Tạo mã hóa đơn ======
    const lastHD = await this.getLastInvoiceCode();
    const newMaHoaDon = this.generateNextCode('HD', lastHD);

    // ====== 2️⃣ Tính tổng tiền ======
    const tongTien = dto.items.reduce(
      (sum, item) => sum + item.Gia * item.SoLuong,
      0,
    );

    // ====== 3️⃣ Lưu hóa đơn ======
    const hoadon = this.hoaDonRepo.create({
      MaHoaDon: newMaHoaDon,
      MaNhanVien: dto.MaNhanVien,
      MaKhachHang: dto.MaKhachHang,
      NgayXuatHoaDon: new Date(dto.NgayXuatHoaDon),
      ThongTinKhachHang: dto.ThongTinKhachHang || '',
      ThongTinSanPham: dto.ThongTinSanPham || '',
      TongTien: tongTien, // lưu tổng tiền
    });
    await this.hoaDonRepo.save(hoadon);

    // ====== 4️⃣ Tạo mã đơn hàng dùng chung cho nhiều item ======
    const lastDH = await this.getLastOrderCode();
    const newMaDonHang = this.generateNextCode('DH', lastDH);

    // ====== 5️⃣ Lưu từng DonHang + cập nhật kho ======
    for (const item of dto.items) {
      const dh = this.donHangRepo.create({
        MaDonHang: newMaDonHang,
        MaHoaDon: newMaHoaDon,
        MaTraiCay: item.MaTraiCay,
        SoLuong: item.SoLuong,
        Gia: item.Gia,
        SanPham: item.SanPham || '',
      });
      await this.donHangRepo.save(dh);

      // ⭐ Cập nhật tồn kho & số lượng trái cây
      const traiCay = await this.traiCayRepo.findOne({
        where: { MaTraiCay: item.MaTraiCay },
      });
      if (traiCay) {
        traiCay.SoLuong = Math.max(0, (traiCay.SoLuong || 0) - item.SoLuong);
        await this.traiCayRepo.save(traiCay);
      }

      const kho = await this.khoRepo.findOne({
        where: { MaTraiCay: item.MaTraiCay },
      });
      if (kho) {
        kho.TonKho = Math.max(0, (kho.TonKho || 0) - item.SoLuong);
        await this.khoRepo.save(kho);
      }
    }

    // ====== 6️⃣ Trả về kết quả ======
    return {
      message: 'Tạo đơn hàng thành công',
      MaHoaDon: newMaHoaDon,
      MaDonHang: newMaDonHang,
      TongTien: tongTien,
    };
  }

  // ⭐ Lấy tất cả đơn hàng + hóa đơn
  async getAllOrders() {
    return this.hoaDonRepo.find({
      relations: ['donhangs', 'khachhang', 'nhanvien'],
      order: { NgayXuatHoaDon: 'DESC' },
    });
  }

  //⭐ Tìm theo ngày
  async searchOrdersByDate(from: string, to: string) {
    const fromD = new Date(from);
    const toD = new Date(to);
    toD.setHours(23, 59, 59, 999);

    return this.hoaDonRepo.find({
      where: { NgayXuatHoaDon: Between(fromD, toD) },
      relations: ['donhangs', 'khachhang', 'nhanvien'],
      order: { NgayXuatHoaDon: 'DESC' },
    });
  }

  // ⭐ Lấy hóa đơn theo mã đơn hàng (tuỳ chọn)
  async findByMaDonHang(MaDonHang: string) {
    return this.donHangRepo.find({
      where: { MaDonHang },
      relations: ['hoaDon'],
    });
  }
}
