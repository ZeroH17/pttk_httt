import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { HoaDon } from './hoadon.entity';
import { KhachHang } from './khachhang.entity';

@Entity('diemthuong')
export class DiemThuong {
  @PrimaryGeneratedColumn()
  MaDiemThuong!: number; // INT AUTO_INCREMENT

  @Column()
  MaHoaDon!: string;

  @Column()
  MaKhachHang!: string;

  @Column('int')
  DiemThuong!: number;

  @ManyToOne(() => HoaDon, (hd) => hd.diemthuongs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'MaHoaDon' })
  hoadon!: HoaDon;

  @ManyToOne(() => KhachHang, (kh) => kh.diemthuongs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'MaKhachHang' })
  khachhang!: KhachHang;
}
