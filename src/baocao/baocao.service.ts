import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DonHang } from '../entities/donhang.entity';
import { Repository } from 'typeorm';
import { TraiCay } from '../entities/traicay.entity';
import { Kho } from '../entities/kho.entity';
import { HoaDon } from '../entities/hoadon.entity';

@Injectable()
export class BaoCaoService {
  constructor(
    @InjectRepository(DonHang) private donHangRepo: Repository<DonHang>,
    @InjectRepository(TraiCay) private traicayRepo: Repository<TraiCay>,
    @InjectRepository(Kho) private khoRepo: Repository<Kho>,
    @InjectRepository(HoaDon) private hoadonRepo: Repository<HoaDon>
  ) {}

  // Doanh thu theo day | week | month
  async revenueReport(type: 'day' | 'week' | 'month', from?: string, to?: string) {
    // Build raw SQL because GROUP BY date functions simpler
    const conn = this.donHangRepo.manager.connection;
    let selectExpr = '';
    if (type === 'day') {
      selectExpr = `DATE(h.NgayXuatHoaDon) as ThoiGian`;
    } else if (type === 'week') {
      selectExpr = `YEAR(h.NgayXuatHoaDon) as Nam, WEEK(h.NgayXuatHoaDon,1) as Tuan`;
    } else {
      selectExpr = `YEAR(h.NgayXuatHoaDon) as Nam, MONTH(h.NgayXuatHoaDon) as Thang`;
    }

    let whereClause = '';
    const params: any[] = [];
    if (from && to) {
      whereClause = `WHERE h.NgayXuatHoaDon BETWEEN ? AND ?`;
      params.push(from, to);
    }

    // Sum Gia * SoLuong per DonHang
    const sql = `
      SELECT ${selectExpr},
             SUM(d.Gia * d.SoLuong) as TongDoanhThu
      FROM DonHang d
      JOIN HoaDon h ON d.MaHoaDon = h.MaHoaDon
      ${whereClause}
      GROUP BY ${ type === 'day' ? 'DATE(h.NgayXuatHoaDon)' : (type === 'week' ? 'YEAR(h.NgayXuatHoaDon), WEEK(h.NgayXuatHoaDon,1)' : 'YEAR(h.NgayXuatHoaDon), MONTH(h.NgayXuatHoaDon)') }
      ORDER BY ThoiGian DESC;
    `;

    const rawResult = await conn.query(sql, params);
    return rawResult;
  }

  // Top selling fruits
  async topSellingFruits(limit = 10) {
    const qb = this.donHangRepo.createQueryBuilder('d')
      .select('d.MaTraiCay', 'MaTraiCay')
      .addSelect('SUM(d.SoLuong)', 'TongBan')
      .groupBy('d.MaTraiCay')
      .orderBy('TongBan', 'DESC')
      .limit(limit);

    const rows = await qb.getRawMany();
    // Join with TraiCay info
    const result = [];
    for (const r of rows) {
      const tc = await this.traicayRepo.findOne({ where: { MaTraiCay: r.MaTraiCay } });
      result.push({
        MaTraiCay: r.MaTraiCay,
        Ten: tc ? tc.MaTraiCay : null,
        GiaTien: tc ? tc.GiaTien : null,
        TongBan: Number(r.TongBan)
      });
    }
    return result;
  }

  // Inventory report
  async inventoryReport() {
    // Join Kho & TraiCay
    return this.khoRepo.createQueryBuilder('k')
      .leftJoinAndSelect('k.traicay', 'tc')
      .select([
        'k.MaTraiCay as MaTraiCay',
        'tc.GiaTien as GiaTien',
        'k.SoLuongSanPham as SoLuongSanPham',
        'k.TonKho as TonKho'
      ]).getRawMany();
  }
}
