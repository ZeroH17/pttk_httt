import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { HoaDon } from './hoadon.entity';
import { TraiCay } from './traicay.entity';

@Entity('donhang')
export class DonHang {
  @PrimaryColumn()
  MaDonHang!: string;

  @Column()
  MaHoaDon!: string;

  @Column()
  MaTraiCay!: string;

  @Column('int')
  SoLuong!: number;

  @Column('decimal', { precision: 12, scale: 2 })
  Gia!: number;

  @Column({ nullable: true })
  SanPham!: string;

  @ManyToOne(() => HoaDon, (hd) => hd.donhangs)
  @JoinColumn({ name: 'MaHoaDon' })
  hoaDon!: HoaDon;

  @ManyToOne(() => TraiCay, (tc) => tc.donhangs)
  @JoinColumn({ name: 'MaTraiCay' })
  traicay!: TraiCay;
}
