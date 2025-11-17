import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { NhanVien } from './nhanvien.entity';
import { KhachHang } from './khachhang.entity';
import { DonHang } from './donhang.entity';

@Entity('hoadon')
export class HoaDon {
  @PrimaryColumn()
  MaHoaDon!: string;

  @Column()
  MaNhanVien!: string;

  @Column()
  MaKhachHang!: string;

  @Column({ type: 'date' })
  NgayXuatHoaDon!: Date;

  @Column({ type: 'text', nullable: true })
  ThongTinSanPham!: string;

  @Column({ type: 'text', nullable: true })
  ThongTinKhachHang!: string;

  // ✅ Thêm cột tổng tiền
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  TongTien!: number;

  @ManyToOne(() => NhanVien, (nv) => nv.hoadons)
  @JoinColumn({ name: 'MaNhanVien' })
  nhanvien!: NhanVien;

  @ManyToOne(() => KhachHang, (kh) => kh.hoadons)
  @JoinColumn({ name: 'MaKhachHang' })
  khachhang!: KhachHang;

  @OneToMany(() => DonHang, (dh) => dh.hoaDon, { cascade: true })
  donhangs!: DonHang[];
}
