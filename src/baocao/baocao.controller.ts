// baocao.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { BaoCaoService } from './baocao.service';

@Controller('baocao')
export class BaoCaoController {
  constructor(private readonly bcService: BaoCaoService) {}

  // Dashboard tổng hợp
  @Get('dashboard')
  async dashboard() {
    return this.bcService.getDashboardStats();
  }

  // Doanh thu theo ngày/tuần/tháng/năm
  @Get('doanhthu')
  async doanhthu(
    @Query('type') type: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    if (!type || !['day','week','month','year'].includes(type)) {
      return { error: 'type phải là day|week|month|year' };
    }
    return this.bcService.revenueReport(type as any, from, to);
  }

  // Top trái cây bán chạy (riêng nếu cần)
  @Get('banchay')
  async banchay(@Query('limit') limit = '10') {
    const n = Number(limit) || 10;
    return this.bcService.topSellingFruits(n);
  }

  // Báo cáo tồn kho
  @Get('tonkho')
  async tonkho() {
    return this.bcService.inventoryReport();
  }
}
