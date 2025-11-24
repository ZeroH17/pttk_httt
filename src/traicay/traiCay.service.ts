import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TraiCay } from '../entities/traicay.entity';
import { DonHang } from '../entities/donhang.entity';
import { CreateTraiCayDto } from '../DTO/create-traicay.dto';
import { UpdateTraiCayDto } from '../DTO/update-traicay.dto';
import { CreateOrderDto } from '../donhang/dto/create-order.dto';

@Injectable()
export class TraiCayService {
  constructor(
    @InjectRepository(TraiCay)
    private traicayRepo: Repository<TraiCay>,

    @InjectRepository(DonHang)
    private donhangRepo: Repository<DonHang>,
  ) {}

  // ===========================
  // GET ALL
  // ===========================
  findAll(): Promise<TraiCay[]> {
    return this.traicayRepo.find();
  }

  // ===========================
  // GET ONE
  // ===========================
  async findOne(MaTraiCay: string): Promise<TraiCay> {
    const item = await this.traicayRepo.findOne({
      where: { MaTraiCay },
    });

    if (!item) {
      throw new NotFoundException('Không tìm thấy trái cây');
    }

    return item;
  }

  async create(dto: CreateTraiCayDto): Promise<TraiCay> {
    // Auto-generate MaTraiCay
    const last = await this.traicayRepo
      .createQueryBuilder('t')
      // Sửa lại cho MySQL
      .orderBy('CAST(SUBSTRING(t.MaTraiCay, 3) AS SIGNED)', 'DESC')
      .getOne();

    let nextNumber = 1;
    if (last?.MaTraiCay) {
      nextNumber = parseInt(last.MaTraiCay.substring(2), 10) + 1;
    }

    const MaTraiCay = `TC${nextNumber.toString().padStart(3, '0')}`;

    const fruit = this.traicayRepo.create({ ...dto, MaTraiCay });
    return this.traicayRepo.save(fruit);
  }


  // ===========================
  // UPDATE
  // ===========================
  async update(MaTraiCay: string, dto: UpdateTraiCayDto) {
    const fruit = await this.findOne(MaTraiCay); // đảm bảo tồn tại

    Object.assign(fruit, dto);

    await this.traicayRepo.save(fruit);

    return {
      message: 'Cập nhật thành công',
      data: fruit,
    };
  }

  // ===========================
  // DELETE
  // ===========================
  async remove(MaTraiCay: string) {
    const result = await this.traicayRepo.delete({ MaTraiCay });

    if (result.affected === 0) {
      throw new NotFoundException('Không tìm thấy trái cây để xóa');
    }

    return { message: 'Xóa thành công' };
  }

  // ===========================
  // ADD TO CART
  // ===========================
  async addToCart(dto: CreateOrderDto) {
    const product = await this.findOne(dto.MaTraiCay);

    const order = this.donhangRepo.create({
      MaKhachHang: dto.MaKhachHang,
      SoLuong: dto.SoLuong,
      traicay: product,
    });

    return this.donhangRepo.save(order);
  }
}
