import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TraiCay } from './traicay.entity';

@Entity('Kho')
export class Kho {
  @PrimaryColumn()
  MaKho!: string;

  @Column()
  MaTraiCay!: string;

  @Column('int', { default: 0 })
  SoLuongSanPham!: number;

  @Column('int', { default: 0 })
  TonKho!: number;

  @Column({ type: 'date', nullable: true })
  NgayNhapKho!: Date;

  @Column({ type: 'date', nullable: true })
  NgayXuatKho!: Date;

  @Column({ nullable: true })
  DiaChi!: string;

  @ManyToOne(() => TraiCay, (tc) => tc.kho)
  @JoinColumn({ name: 'MaTraiCay' })
  traicay!: TraiCay;
}
