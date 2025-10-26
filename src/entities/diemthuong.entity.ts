import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { HoaDon } from './hoadon.entity';
import { KhachHang } from './khachhang.entity';

@Entity('DiemThuong')
export class DiemThuong {
  @PrimaryColumn()
  MaDiemThuong!: string;

  @Column()
  MaHoaDon!: string;

  @Column()
  MaKhachHang!: string;

  @Column('int')
  DiemThuong!: number;

  @ManyToOne(() => HoaDon)
  @JoinColumn({ name: 'MaHoaDon' })
  hoadon!: HoaDon;

  @ManyToOne(() => KhachHang, (kh) => kh.diemthuongs)
  @JoinColumn({ name: 'MaKhachHang' })
  khachhang!: KhachHang;
}
