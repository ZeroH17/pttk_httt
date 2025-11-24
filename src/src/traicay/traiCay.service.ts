import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TraiCay } from '../entities/traicay.entity';
import { DonHang } from '../entities/donhang.entity';
import { CreateOrderDto } from '../donhang/dto/create-order.dto';

@Injectable()
export class TraiCayService {
  constructor(
    @InjectRepository(TraiCay)
    private traicayRepo: Repository<TraiCay>,
    @InjectRepository(DonHang)
    private donhangRepo: Repository<DonHang>,
  ) {}

  findAll(): Promise<TraiCay[]> {
    return this.traicayRepo.find();
  }

  findOne(MaTraiCay: string): Promise<TraiCay> {
    return this.traicayRepo.findOne({ where: { MaTraiCay } });
  }

  async addToCart(dto: CreateOrderDto) {
    const product = await this.traicayRepo.findOne({ where: { MaTraiCay: dto.MaTraiCay } });
    if (!product) throw new Error('Sản phẩm không tồn tại');

    const donHang = new DonHang();
    donHang.MaKhachHang = dto.MaKhachHang;
    donHang.SoLuong = dto.SoLuong;
    donHang.traicay = product;

    return this.donhangRepo.save(donHang);
  }
}
