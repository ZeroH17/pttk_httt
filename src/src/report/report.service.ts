import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HoaDon } from '../entities/hoadon.entity';
import { DonHang } from '../entities/donhang.entity';
import { TraiCay } from '../entities/traicay.entity';
import { Kho } from '../entities/kho.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(HoaDon)
    private hoaDonRepo: Repository<HoaDon>,

    @InjectRepository(DonHang)
    private donHangRepo: Repository<DonHang>,

    @InjectRepository(TraiCay)
    private traiCayRepo: Repository<TraiCay>,

    @InjectRepository(Kho)
    private khoRepo: Repository<Kho>,
  ) {}

  // 🧾 Báo cáo doanh thu theo ngày / tuần / tháng
  async getRevenueBy(period: 'day' | 'week' | 'month') {
    let dateExpr = '';
    let groupExpr = '';

    switch (period) {
      case 'day':
        dateExpr = "DATE_FORMAT(hd.NgayXuatHoaDon, '%Y-%m-%d')";
        groupExpr = "DATE_FORMAT(hd.NgayXuatHoaDon, '%Y-%m-%d')";
        break;
      case 'week':
        dateExpr = "DATE_FORMAT(hd.NgayXuatHoaDon, '%x-%v')";
        groupExpr = "DATE_FORMAT(hd.NgayXuatHoaDon, '%x-%v')";
        break;
      case 'month':
        dateExpr = "DATE_FORMAT(hd.NgayXuatHoaDon, '%Y-%m')";
        groupExpr = "DATE_FORMAT(hd.NgayXuatHoaDon, '%Y-%m')";
        break;
    }

    const data = await this.donHangRepo
      .createQueryBuilder('dh')
      .innerJoin('dh.hoaDon', 'hd')
      .select(`${dateExpr} AS period`)
      .addSelect('SUM(dh.Gia * dh.SoLuong)', 'revenue')
      .groupBy(groupExpr)
      .orderBy('period')
      .getRawMany();

    return data;
  }

  // 🍎 Trái cây bán chạy nhất
  async getBestSellingFruits(limit: number = 5) {
    // ✅ Đảm bảo entity DonHang có quan hệ ManyToOne(() => TraiCay, (tc) => tc.donhangs)
    const data = await this.donHangRepo
      .createQueryBuilder('dh')
      .innerJoin('dh.traicay', 'tc') // viết đúng tên property trong DonHang entity!
      .select('tc.TenTraiCay', 'tenTraiCay')
      .addSelect('SUM(dh.SoLuong)', 'tongSoLuong')
      .groupBy('tc.TenTraiCay')
      .orderBy('tongSoLuong', 'DESC')
      .limit(limit)
      .getRawMany();

    return data;
  }

  // 📦 Báo cáo tồn kho
  async getInventory() {
    // ✅ Đảm bảo entity Kho có property tên "traiCay"
    const data = await this.khoRepo.find({
      relations: ['traiCay'],
    });

    return data.map((item) => ({
      tenTraiCay: item.traiCay?.TenTraiCay || '',
      tonKho: item.TonKho,
      soLuongSanPham: item.SoLuongSanPham,
    }));
  }
}
