import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { DonHang } from './donhang.entity';
import { Kho } from './kho.entity';

@Entity('traicay')
export class TraiCay {
  @PrimaryColumn()
  MaTraiCay!: string;

  @Column({ type: 'nvarchar', length: 100, nullable: false })
  TenTraiCay!: string;

  @Column('int', { nullable: true, default: 0 })
  SoLuong!: number;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  GiaTien!: number;

  @Column({ type: 'date', nullable: true })
  NgayNhap!: Date;

  @Column({ type: 'nvarchar', length: 100, nullable: true })
  XuatXu!: string;

  @OneToMany(() => DonHang, (dh) => dh.traicay)
  donhangs!: DonHang[];

  @OneToMany(() => Kho, (k) => k.traicay)
  kho!: Kho[];
}
