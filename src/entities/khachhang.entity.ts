import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { HoaDon } from './hoadon.entity';
import { DiemThuong } from './diemthuong.entity';

@Entity('khachhang')
export class KhachHang {
  @PrimaryColumn()
  MaKhachHang!: string;

  @Column({ type: 'nvarchar', length: 100, nullable: true })
  HoTen!: string;

  @Column({ type: 'nvarchar', length: 15, nullable: true })
  SDT!: string;

  @Column({ type: 'nvarchar', length: 200, nullable: true })
  DiaChi!: string;

  @OneToMany(() => HoaDon, (hd) => hd.khachhang)
  hoadons!: HoaDon[];

  @OneToMany(() => DiemThuong, (dt) => dt.khachhang)
  diemthuongs!: DiemThuong[];
}
