import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm'; 
import { HoaDon } from './hoadon.entity';

export enum OrderStatus {
  PENDING = 'Chờ xử lý',
  SHIPPING = 'Đang giao',
  COMPLETED = 'Hoàn tất',
  CANCELED = 'Hoàn đơn',
}

@Entity('donhang')
export class DonHang {
  @PrimaryColumn()
  MaDonHang!: string;

  @Column()
  MaHoaDon!: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  TrangThai!: OrderStatus;

  @ManyToOne(() => HoaDon, (hd) => hd.donhangs)
  @JoinColumn({ name: 'MaHoaDon' })
  hoaDon!: HoaDon;
}
