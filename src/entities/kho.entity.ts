import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TraiCay } from './traicay.entity';

@Entity('kho')
export class Kho {
  @PrimaryColumn()
  MaKho!: string;

  @Column()
  MaTraiCay!: string;

  @Column('int')
  SoLuongSanPham!: number;

  @Column('int')
  TonKho!: number;

  @Column({ type: 'date', nullable: true })
  NgayNhapKho!: Date;

  @Column({ type: 'date', nullable: true })
  NgayXuatKho!: Date;

  @Column({ nullable: true })
  DiaChi!: string;

  // ✅ Liên kết đúng tới bảng trái cây
  @ManyToOne(() => TraiCay, (tc) => tc.kho)
  @JoinColumn({ name: 'MaTraiCay' })
  traiCay!: TraiCay;
}
