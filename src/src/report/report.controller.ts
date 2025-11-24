import { Controller, Get, Query } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('revenue')
  getRevenue(@Query('period') period: 'day' | 'week' | 'month' = 'day') {
    return this.reportService.getRevenueBy(period);
  }

  @Get('bestseller')
  getBestSeller(@Query('limit') limit = 5) {
    return this.reportService.getBestSellingFruits(limit);
  }

  @Get('inventory')
  getInventory() {
    return this.reportService.getInventory();
  }
}
