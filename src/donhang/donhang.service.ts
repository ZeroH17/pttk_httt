import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';

import { HoaDon } from '../entities/hoadon.entity';
import { DonHang, OrderStatus } from '../entities/donhang.entity';
import { TraiCay } from '../entities/traicay.entity';
import { DiemThuong } from '../entities/diemthuong.entity';

import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class DonHangService {
  constructor(
    @InjectRepository(HoaDon) private hoaDonRepo: Repository<HoaDon>,
    @InjectRepository(DonHang) private donHangRepo: Repository<DonHang>,
    @InjectRepository(TraiCay) private traiCayRepo: Repository<TraiCay>,
    @InjectRepository(DiemThuong) private diemRepo: Repository<DiemThuong>,
  ) {}

  // ===================================================
  // ===============   SINH MÃ TỰ ĐỘNG   ================
  // ===================================================
  async getLastInvoiceCode(): Promise<string> {
    const last = await this.hoaDonRepo.find({
      order: { MaHoaDon: 'DESC' },
      take: 1,
    });
    return last.length ? last[0].MaHoaDon : 'HD000';
  }

  async getLastOrderCode(): Promise<string> {
    const last = await this.donHangRepo.find({
      order: { MaDonHang: 'DESC' },
      take: 1,
    });
    return last.length ? last[0].MaDonHang : 'DH000';
  }

  private generateNextCode(prefix: string, lastCode: string): string {
    const num = parseInt(lastCode.replace(prefix, ''), 10) + 1;
    return prefix + num.toString().padStart(3, '0');
  }

  // ===================================================
  // ========   TẠO ĐƠN HÀNG + HÓA ĐƠN   ===============
  // ===================================================
  async createOrder(dto: CreateOrderDto) {
    const lastHD = await this.getLastInvoiceCode();
    const newMaHoaDon = this.generateNextCode('HD', lastHD);

    // Parse sản phẩm
    let products: { TenTraiCay: string; SoLuong: number }[] = [];

    if (dto.ThongTinSanPham) {
      products = dto.ThongTinSanPham.split(',').map(item => {
        const match = item.trim().match(/^(.+?)\s*x(\d+)$/i);
        if (match)
          return {
            TenTraiCay: match[1].trim(),
            SoLuong: parseInt(match[2], 10),
          };
        return { TenTraiCay: item.trim(), SoLuong: 1 };
      });
    }

    // Trừ số lượng
    for (const item of products) {
      const tc = await this.traiCayRepo.findOne({
        where: { TenTraiCay: item.TenTraiCay },
      });
      if (!tc)
        throw new BadRequestException(
          `Không tìm thấy trái cây: ${item.TenTraiCay}`,
        );

      if (tc.SoLuong < item.SoLuong)
        throw new BadRequestException(
          `Số lượng '${item.TenTraiCay}' không đủ. Còn ${tc.SoLuong}, cần ${item.SoLuong}`,
        );

      tc.SoLuong -= item.SoLuong;
      await this.traiCayRepo.save(tc);
    }

    // Tạo hóa đơn
    const hoadon = this.hoaDonRepo.create({
      MaHoaDon: newMaHoaDon,
      MaNhanVien: dto.MaNhanVien,
      MaKhachHang: dto.MaKhachHang,
      NgayXuatHoaDon: new Date(dto.NgayXuatHoaDon),
      ThongTinKhachHang: dto.ThongTinKhachHang || '',
      ThongTinSanPham: JSON.stringify(products),
      TongTien: dto.TongTien || 0,
    });

    await this.hoaDonRepo.save(hoadon);

    // Tạo đơn hàng
    const lastDH = await this.getLastOrderCode();
    const newMaDonHang = this.generateNextCode('DH', lastDH);

    const dh = this.donHangRepo.create({
      MaDonHang: newMaDonHang,
      MaHoaDon: newMaHoaDon,
      TrangThai: OrderStatus.PENDING,
    });

    await this.donHangRepo.save(dh);

    return {
      message: 'Tạo đơn hàng thành công!',
      MaHoaDon: newMaHoaDon,
      MaDonHang: newMaDonHang,
    };
  }

  // ===================================================
  // ===========   CỘNG ĐIỂM THƯỞNG   ==================
  // ===================================================
  private async addRewardPoints(maKH: string, tongTien: number) {
    const points = 1; // mỗi đơn = 1 điểm

    const existing = await this.diemRepo.findOne({
      where: { MaKhachHang: maKH },
    });

    if (existing) {
      existing.DiemThuong += points;
      return this.diemRepo.save(existing);
    }

    const diem = this.diemRepo.create({
      MaKhachHang: maKH,
      DiemThuong: points,
    });

    return this.diemRepo.save(diem);
  }

  // LẤY TỔNG ĐIỂM THƯỞNG  
  async getRewardPoints(maKH: string) {
    const list = await this.diemRepo.find({ where: { MaKhachHang: maKH } });
    if (!list.length) return 0;
    return list.reduce((sum, item) => sum + item.DiemThuong, 0);
  }


  // CẬP NHẬT TRẠNG THÁI ĐƠN   
  async updateOrderStatus(MaDonHang: string, status: OrderStatus) {
    const order = await this.donHangRepo.findOne({
      where: { MaDonHang },
      relations: ['hoaDon'],
    });

    if (!order) throw new BadRequestException('Đơn hàng không tồn tại');

    // Hoàn tất → cộng điểm
    if (status === OrderStatus.COMPLETED && order.TrangThai !== OrderStatus.COMPLETED) {
      await this.addRewardPoints(order.hoaDon.MaKhachHang, order.hoaDon.TongTien);
    }

    // Hủy → hoàn lại số lượng
    if (status === OrderStatus.CANCELED && order.TrangThai !== OrderStatus.CANCELED) {
      const products = JSON.parse(order.hoaDon.ThongTinSanPham);

      for (const item of products) {
        const tc = await this.traiCayRepo.findOne({
          where: { TenTraiCay: item.TenTraiCay },
        });

        if (tc) {
          tc.SoLuong += item.SoLuong;
          await this.traiCayRepo.save(tc);
        }
      }
    }

    order.TrangThai = status;
    return this.donHangRepo.save(order);
  }

  async cancelOrder(MaDonHang: string) {
    return this.updateOrderStatus(MaDonHang, OrderStatus.CANCELED);
  }

  // ===================================================
  // ================   API KHÁC   =====================
  // ===================================================
  async getAllOrders() {
    return this.hoaDonRepo.find({
      relations: ['donhangs', 'khachhang', 'nhanvien'],
      order: { NgayXuatHoaDon: 'DESC' },
    });
  }

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

  async findByMaDonHang(MaDonHang: string) {
    return this.donHangRepo.find({
      where: { MaDonHang },
      relations: ['hoaDon'],
    });
  }
}
