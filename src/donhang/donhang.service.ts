import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { HoaDon } from '../entities/hoadon.entity';
import { DonHang, OrderStatus } from '../entities/donhang.entity';
import { TraiCay } from '../entities/traicay.entity';
import { Kho } from '../entities/kho.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class DonHangService {
  constructor(
    @InjectRepository(HoaDon) private hoaDonRepo: Repository<HoaDon>,
    @InjectRepository(DonHang) private donHangRepo: Repository<DonHang>,
    @InjectRepository(TraiCay) private traiCayRepo: Repository<TraiCay>,
    @InjectRepository(Kho) private khoRepo: Repository<Kho>,
  ) {}

  // Lấy mã hóa đơn cuối (HDxxx)
  async getLastInvoiceCode(): Promise<string> {
    const all = await this.hoaDonRepo.find();
    if (!all.length) return 'HD000';

    const numbers = all.map(hd => {
      const match = hd.MaHoaDon.match(/\d{3}$/);
      return match ? parseInt(match[0]) : 0;
    });
    const maxNumber = Math.max(...numbers);
    return 'HD' + maxNumber.toString().padStart(3, '0');
  }

  // Lấy mã đơn hàng cuối (DHxxx)
  async getLastOrderCode(): Promise<string> {
    const last = await this.donHangRepo.find({
      order: { MaDonHang: 'DESC' },
      take: 1,
    });
    return last.length ? last[0].MaDonHang : 'DH000';
  }

  // Tạo mã mới dựa trên mã cuối
  private generateNextCode(prefix: string, lastCode: string): string {
    const num = parseInt(lastCode.replace(prefix, '')) + 1;
    return prefix + num.toString().padStart(3, '0');
  }

  // Tạo đơn hàng + hóa đơn
  async createOrder(dto: CreateOrderDto) {
    // Tạo mã hóa đơn
    const lastHD = await this.getLastInvoiceCode();
    const newMaHoaDon = this.generateNextCode('HD', lastHD);

    // --- Chuyển ThongTinSanPham từ text sang JSON ---
    // Ví dụ: "Dưa hấu x2, Cam sành x3"
    let products: { TenTraiCay: string; SoLuong: number }[] = [];

    if (dto.ThongTinSanPham) {
      products = dto.ThongTinSanPham.split(',').map(item => {
        const match = item.trim().match(/^(.+?)\s*x(\d+)$/i);
        if (match) {
          return { TenTraiCay: match[1].trim(), SoLuong: parseInt(match[2], 10) };
        }
        // Nếu không có x số lượng thì mặc định 1
        return { TenTraiCay: item.trim(), SoLuong: 1 };
      });
    }

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
      TrangThai: OrderStatus.PENDING, // mặc định "Chờ xử lý"
    });
    await this.donHangRepo.save(dh);

    return {
      message: 'Tạo đơn hàng thành công',
      MaHoaDon: newMaHoaDon,
      MaDonHang: newMaDonHang,
    };
  }


  // Cập nhật trạng thái đơn hàng
  async updateOrderStatus(MaDonHang: string, status: OrderStatus) {
    const order = await this.donHangRepo.findOne({ where: { MaDonHang } });
    if (!order) throw new Error('Đơn hàng không tồn tại');

    order.TrangThai = status;
    return this.donHangRepo.save(order);
  }

  // Lấy tất cả đơn hàng + hóa đơn
  async getAllOrders() {
    return this.hoaDonRepo.find({
      relations: ['donhangs', 'khachhang', 'nhanvien'],
      order: { NgayXuatHoaDon: 'DESC' },
    });
  }

  // Tìm theo ngày
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

  // Lấy hóa đơn theo mã đơn hàng
  async findByMaDonHang(MaDonHang: string) {
    return this.donHangRepo.find({
      where: { MaDonHang },
      relations: ['hoaDon'],
    });
  }
}
