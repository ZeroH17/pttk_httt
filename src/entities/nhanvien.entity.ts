import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { HoaDon } from './hoadon.entity';

@Entity('NhanVien')
export class NhanVien {
  @PrimaryColumn()
  MaNhanVien!: string;

  @Column({ nullable: true })
  HoVaTen!: string;

  @Column({ type: 'date', nullable: true })
  NgaySinh!: Date;

  @Column({ nullable: true })
  SoDienThoai!: string;

  @Column({ nullable: true })
  DiaChi!: string;

  @OneToMany(() => HoaDon, (hd) => hd.nhanvien)
  hoadons!: HoaDon[];
}
