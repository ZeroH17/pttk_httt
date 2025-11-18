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
-- Table structure for table `traicay`
--

DROP TABLE IF EXISTS `traicay`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `traicay` (
  `SoLuong` int DEFAULT '0',
  `GiaTien` decimal(12,2) DEFAULT NULL,
  `NgayNhap` date DEFAULT NULL,
  `MaTraiCay` varchar(255) NOT NULL,
  `XuatXu` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `TenTraiCay` varchar(100) NOT NULL,
  `img` varchar(255) DEFAULT NULL,
  `tag` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`MaTraiCay`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `traicay`
--

LOCK TABLES `traicay` WRITE;
/*!40000 ALTER TABLE `traicay` DISABLE KEYS */;
INSERT INTO `traicay` VALUES (94,35000.00,NULL,'TC001','Mỹ','Táo Mỹ','assets/img/tao_my.jpg','Mới nhập'),(95,45000.00,'2025-11-17','TC002','Việt Nam','Cam sành','assets/img/cam.jpg','Mới nhập'),(92,90000.00,'2025-11-17','TC003','Nhập khẩu','Nho đỏ','assets/img/nho.jpg','Mới nhập'),(99,55000.00,'2025-11-17','TC004','Nhập khẩu','Táo Gala','assets/img/tao.jpg','Sắp hết'),(97,75000.00,'2025-11-17','TC005','Việt Nam','Lê xanh','assets/img/le.jpg','Mới nhập'),(92,30000.00,'2025-11-17','TC006','Việt Nam','Dưa hấu ruột đỏ','assets/img/dua-hau.jpg','Ưa chuộng'),(100,120000.00,'2025-11-17','TC007','Úc','Kiwi vàng','assets/img/kiwi.jpg','Nhập khẩu'),(100,40000.00,'2025-11-17','TC008','Việt Nam','Thanh long ruột đỏ','assets/img/thanh-long.jpg','Đặc sản Việt'),(100,60000.00,'2025-11-17','TC009','Việt Nam','Xoài cát Hòa Lộc','assets/img/xoai.jpg','Việt Nam'),(100,35000.00,'2025-11-17','TC010','Việt Nam','Chôm chôm','assets/img/chom-chom.jpg','Theo mùa'),(100,150000.00,'2025-11-17','TC011','Việt Nam','Dâu tây Đà Lạt','assets/img/dau-tay.jpg','Nhập nội địa'),(100,140000.00,'2025-11-17','TC012','Nhập khẩu','Cam Mỹ','assets/img/cam-my.jpg','Nhập khẩu'),(98,90000.00,'2025-11-17','TC013','Thái Lan','Lựu đỏ','assets/img/luu.jpg','Nhập khẩu');
/*!40000 ALTER TABLE `traicay` ENABLE KEYS */;
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
