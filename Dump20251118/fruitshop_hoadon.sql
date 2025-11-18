-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: fruitshop
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `hoadon`
--

DROP TABLE IF EXISTS `hoadon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hoadon` (
  `NgayXuatHoaDon` date NOT NULL,
  `ThongTinSanPham` text,
  `ThongTinKhachHang` text,
  `MaHoaDon` varchar(255) NOT NULL,
  `MaNhanVien` varchar(255) NOT NULL,
  `MaKhachHang` varchar(255) NOT NULL,
  `TongTien` decimal(12,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`MaHoaDon`),
  KEY `FK_c91ac72a44f75fbbf6a5b66c895` (`MaNhanVien`),
  KEY `FK_80914aed54d9fbd44e22923f738` (`MaKhachHang`),
  CONSTRAINT `FK_80914aed54d9fbd44e22923f738` FOREIGN KEY (`MaKhachHang`) REFERENCES `khachhang` (`MaKhachHang`),
  CONSTRAINT `FK_c91ac72a44f75fbbf6a5b66c895` FOREIGN KEY (`MaNhanVien`) REFERENCES `nhanvien` (`MaNhanVien`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hoadon`
--

LOCK TABLES `hoadon` WRITE;
/*!40000 ALTER TABLE `hoadon` DISABLE KEYS */;
INSERT INTO `hoadon` VALUES ('2025-10-26','Xoài cát Hòa Lộc','Nguyen Van A','HD001','NV001','KH001',0.00),('2025-10-26','Cam sành Tiền Giang','Tran Thi B','HD002','NV001','KH002',0.00),('2025-10-26','Táo Mỹ đỏ','Le Van C','HD003','NV001','KH003',0.00),('2025-11-17','Táo Gala, Dưa hấu ruột đỏ','Họ tên: Vũ Hoàng, Giới tính: nam, Địa chỉ: đồn cảnh sát, SDT: 0375770747, Email: , Hình thức thanh toán: cash','HD1763381262091','NV001','KH005',0.00),('2025-11-17','Táo Gala, Dưa hấu ruột đỏ, Táo Mỹ','Họ tên: Vũ Hoàng, Giới tính: nam, Địa chỉ: 1428/32/4 Huỳnh Tấn Phát, SDT: 0585195803, Email: hoangdepzai17102005@gmail.com, Hình thức thanh toán: cod','HD1763381851944','NV001','KH005',0.00),('2025-11-17','Cam sành, Táo Mỹ, Nho đỏ','Họ tên: Vũ Hoàng, Giới tính: nam, Địa chỉ: 1428/32/4 Huỳnh Tấn Phát, SDT: 0585195803, Email: hoangdepzai17102005@gmail.com, Hình thức thanh toán: cash','HD1763382073609','NV001','KH005',0.00),('2025-11-17','Táo Mỹ, Cam sành','Họ tên: Vũ Hoàng, Giới tính: nu, Địa chỉ: 1428/32/4 Huỳnh Tấn Phát, SDT: 0585195803, Email: hoangdepzai17102005@gmail.com, Thanh toán: cash','HD1763382073610','NV001','KH005',0.00),('2025-11-17','Lê xanh, Nho đỏ, Dưa hấu ruột đỏ, Lựu đỏ','Họ tên: Vũ Hoàng, Giới tính: nam, Địa chỉ: 1428/32/4 Huỳnh Tấn Phát, SDT: 0585195803, Email: hoangdepzai17102005@gmail.com, Thanh toán: cash','HD945','NV001','KH005',0.00),('2025-11-17','Lê xanh, Dưa hấu ruột đỏ','Họ tên: Vũ Hoàng, Giới tính: nam, Địa chỉ: 1428/32/4 Huỳnh Tấn Phát, SDT: 0585195803, Email: hoangdepzai17102005@gmail.com, Thanh toán: cash','HD946','NV001','KH005',105000.00),('2025-11-17','Nho đỏ, Cam sành, Lê xanh, Dưa hấu ruột đỏ','Họ tên: Vũ Hoàng, Giới tính: nam, Địa chỉ: 1428/32/4 Huỳnh Tấn Phát, SDT: 0585195803, Email: hoangdepzai17102005@gmail.com, Thanh toán: cash','HD947','NV001','KH005',825000.00),('2025-11-18','Cam sành, Dưa hấu ruột đỏ, Lựu đỏ','Họ tên: Vũ Hoàng, Giới tính: nam, Địa chỉ: 1205/31 Huỳnh Tấn Phát, SDT: 0585195803, Email: hoangdepzai17102005@gmail.com, Thanh toán: bank','HD948','NV001','KH005',165000.00),('2025-11-18','Táo Mỹ, Cam sành, Lê xanh','Họ tên: Vũ Hoàng, Giới tính: nam, Địa chỉ: 1428/32/4 Huỳnh Tấn Phát, SDT: 0585195803, Email: hoangdepzai17102005@gmail.com, Thanh toán: cash','HD949','NV001','KH005',0.00),('2025-11-18','Nho đỏ, Lê xanh','Họ tên: Vũ Hoàng, Giới tính: nam, Địa chỉ: 1428/32/4 Huỳnh Tấn Phát, SDT: 0585195803, Email: hoangdepzai17102005@gmail.com, Thanh toán: cash','HD950','NV001','KH005',0.00),('2025-11-18','Cam sành, Nho đỏ, Lê xanh, Dưa hấu ruột đỏ, Thanh long ruột đỏ','Họ tên: Vũ Hoàng, Giới tính: nam, Địa chỉ: 1428/32/4 Huỳnh Tấn Phát, SDT: 0585195803, Email: hoangdepzai17102005@gmail.com, Thanh toán: cash','HD951','NV001','KH005',280000.00);
/*!40000 ALTER TABLE `hoadon` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-18 21:10:00
