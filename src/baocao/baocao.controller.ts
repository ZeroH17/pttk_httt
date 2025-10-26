import { Controller, Get, Query } from '@nestjs/common';
import { BaoCaoService } from './baocao.service';

@Controller('baocao')
export class BaoCaoController {
  constructor(private readonly bcService: BaoCaoService) {}

  // /baocao/doanhthu?type=day|week|month&from=2025-01-01&to=2025-01-31
  @Get('doanhthu')
  async doanhthu(
    @Query('type') type: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    if (!type || !['day', 'week', 'month'].includes(type))
      return { error: 'type phải là day|week|month' };
    return this.bcService.revenueReport(type as any, from, to);
  }

  // /baocao/banchay?limit=10
  @Get('banchay')
  async banchay(@Query('limit') limit = '10') {
    const n = Number(limit) || 10;
    return this.bcService.topSellingFruits(n);
  }

  // /baocao/tonkho
  @Get('tonkho')
  async tonkho() {
    return this.bcService.inventoryReport();
  }
}
