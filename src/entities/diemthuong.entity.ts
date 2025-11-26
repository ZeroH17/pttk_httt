import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { KhachHang } from './khachhang.entity';

@Entity('diemthuong')
export class DiemThuong {
  @PrimaryGeneratedColumn()
  MaDiemThuong!: number; // INT AUTO_INCREMENT

  @Column()
  MaKhachHang!: string;

  @Column('int')
  DiemThuong!: number;

  @ManyToOne(() => KhachHang, (kh) => kh.diemthuongs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'MaKhachHang' })
  khachhang!: KhachHang;
}
