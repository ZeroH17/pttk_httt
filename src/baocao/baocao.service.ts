import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { HoaDon } from '../entities/hoadon.entity';

@Injectable()
export class BaoCaoService {
  constructor(
    @InjectRepository(HoaDon)
    private hoaDonRepo: Repository<HoaDon>,
  ) {}

  // ================================
  // 🔹 1. Dashboard tổng hợp
  // ================================
  async getDashboardStats() {
    const allInvoices = await this.hoaDonRepo.find();
    let totalProductsSold = 0;
    let totalRevenue = 0;
    let fruitSales: Record<string, number> = {};

    allInvoices.forEach(inv => {
      totalRevenue += Number(inv.TongTien || 0);
      if (!inv.ThongTinSanPham) return;

      let products: { TenTraiCay: string; SoLuong: number }[] = [];
      try {
        products = JSON.parse(inv.ThongTinSanPham);
      } catch {
        products = inv.ThongTinSanPham.split(",").map(name => ({
          TenTraiCay: name.trim(),
          SoLuong: 1,
        }));
      }

      products.forEach(p => {
        const qty = Number(p.SoLuong) || 0;
        totalProductsSold += qty;
        if (!fruitSales[p.TenTraiCay]) fruitSales[p.TenTraiCay] = 0;
        fruitSales[p.TenTraiCay] += qty;
      });
    });

    // Lấy top 5 trái cây bán chạy
    const topFruits = Object.entries(fruitSales)
      .sort((a,b) => b[1]-a[1])
      .slice(0, 5)
      .map(([TenTraiCay, SoLuongBan]) => ({ TenTraiCay, SoLuongBan }));

    return {
      totalOrders: allInvoices.length,
      totalProductsSold,
      totalRevenue,
      topFruits,
    };
  }

  // ================================
  // 🔹 2. Doanh thu theo type (day/week/month/year)
  // ================================
  async revenueReport(
    type: 'day' | 'week' | 'month' | 'year',
    from?: string,
    to?: string,
  ) {
    let invoices = await this.hoaDonRepo.find();

    if (from) {
      const fromDate = new Date(from);
      invoices = invoices.filter(inv => new Date(inv.NgayXuatHoaDon) >= fromDate);
    }
    if (to) {
      const toDate = new Date(to);
      invoices = invoices.filter(inv => new Date(inv.NgayXuatHoaDon) <= toDate);
    }

    const revenueMap: Record<string, number> = {};

    invoices.forEach(hd => {
      if (!hd.NgayXuatHoaDon || !hd.TongTien) return;

      const date = new Date(hd.NgayXuatHoaDon);
      let key = '';

      switch (type) {
        case 'day':
          key = date.toISOString().split('T')[0]; // YYYY-MM-DD
          break;
        case 'week':
          const onejan = new Date(date.getFullYear(),0,1);
          const week = Math.ceil((((date.getTime() - onejan.getTime()) / 86400000) + onejan.getDay()+1)/7);
          key = `Tuần ${week} - ${date.getFullYear()}`;
          break;
        case 'month':
          key = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}`;
          break;
        case 'year':
          key = `${date.getFullYear()}`;
          break;
      }

      revenueMap[key] = (revenueMap[key] || 0) + Number(hd.TongTien);
    });

    return Object.entries(revenueMap)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => (a.label > b.label ? 1 : -1));
  }

  // ================================
  // 🔹 3. Top trái cây bán chạy
  // ================================
  async topSellingFruits(limit = 10) {
    const allInvoices = await this.hoaDonRepo.find();
    const fruitSales: Record<string, number> = {};

    allInvoices.forEach(inv => {
      if (!inv.ThongTinSanPham) return;

      let products: { TenTraiCay: string; SoLuong: number }[] = [];

      try {
        products = JSON.parse(inv.ThongTinSanPham);
      } catch {
        products = inv.ThongTinSanPham.split(",").map(name => ({
          TenTraiCay: name.trim(),
          SoLuong: 1,
        }));
      }

      products.forEach(p => {
        const qty = Number(p.SoLuong) || 0;
        if (!fruitSales[p.TenTraiCay]) fruitSales[p.TenTraiCay] = 0;
        fruitSales[p.TenTraiCay] += qty;
      });
    });

    return Object.entries(fruitSales)
      .sort((a,b) => b[1]-a[1])
      .slice(0, limit)
      .map(([TenTraiCay, SoLuongBan]) => ({ TenTraiCay, SoLuongBan }));
  }
}
