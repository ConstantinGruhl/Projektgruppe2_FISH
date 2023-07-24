-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: fishdb
-- ------------------------------------------------------
-- Server version	8.0.33

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
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account` (
  `Name` varchar(45) NOT NULL,
  `LastName` varchar(45) NOT NULL,
  `AccountName` varchar(45) NOT NULL,
  `Email` varchar(45) NOT NULL,
  `Password` varchar(60) NOT NULL,
  `idProfile` int NOT NULL,
  KEY `idProfile_idx` (`idProfile`),
  CONSTRAINT `idProfile_User` FOREIGN KEY (`idProfile`) REFERENCES `profile` (`idProfile`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `appointmentrequests`
--

DROP TABLE IF EXISTS `appointmentrequests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointmentrequests` (
  `idAppointmentRequests` int NOT NULL AUTO_INCREMENT,
  `ProposedStartTime` datetime NOT NULL,
  `ProposedEndTime` datetime NOT NULL,
  `Description` varchar(500) DEFAULT NULL,
  `idGame_AppointmentRequest` int NOT NULL,
  `idProfileSender_AppointmentRequest` int NOT NULL,
  `idPlatform_AppointmentRequest` int DEFAULT NULL,
  PRIMARY KEY (`idAppointmentRequests`),
  KEY `idProfile_AppointmentRequest_idx` (`idProfileSender_AppointmentRequest`),
  KEY `idGame_AppointmentRequest_idx` (`idGame_AppointmentRequest`),
  KEY `idPlatform_AppointmentRequest_idx` (`idPlatform_AppointmentRequest`),
  CONSTRAINT `idGame_AppointmentRequest` FOREIGN KEY (`idGame_AppointmentRequest`) REFERENCES `game` (`idGame`),
  CONSTRAINT `idPlatform_AppointmentRequest` FOREIGN KEY (`idPlatform_AppointmentRequest`) REFERENCES `platform` (`idPlatform`),
  CONSTRAINT `idProfileSender_AppointmentRequest` FOREIGN KEY (`idProfileSender_AppointmentRequest`) REFERENCES `profile` (`idProfile`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointmentrequests`
--

LOCK TABLES `appointmentrequests` WRITE;
/*!40000 ALTER TABLE `appointmentrequests` DISABLE KEYS */;
/*!40000 ALTER TABLE `appointmentrequests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `friends`
--

DROP TABLE IF EXISTS `friends`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `friends` (
  `idProfile_Sender` int NOT NULL,
  `idProfile_Receiver` int NOT NULL,
  `RequestStatus` enum('sent','accepted','denied') DEFAULT NULL,
  KEY `idProfile_Sender_idx` (`idProfile_Sender`),
  KEY `idProfile_Receiver_idx` (`idProfile_Receiver`),
  CONSTRAINT `idProfile_Receiver` FOREIGN KEY (`idProfile_Receiver`) REFERENCES `profile` (`idProfile`),
  CONSTRAINT `idProfile_Sender` FOREIGN KEY (`idProfile_Sender`) REFERENCES `profile` (`idProfile`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `friends`
--

LOCK TABLES `friends` WRITE;
/*!40000 ALTER TABLE `friends` DISABLE KEYS */;
/*!40000 ALTER TABLE `friends` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game`
--

DROP TABLE IF EXISTS `game`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game` (
  `idGame` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(45) NOT NULL,
  PRIMARY KEY (`idGame`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game`
--

LOCK TABLES `game` WRITE;
/*!40000 ALTER TABLE `game` DISABLE KEYS */;
INSERT INTO `game` VALUES (1,'Clash Royale'),(2,'League of Legends'),(3,'Call of Duty: Warzone'),(4,'PlayerUnknown\'s Battlegrounds'),(5,'Fortnite'),(6,'Rainbow Six Siege'),(7,'Counter-Strike: Global Offensive'),(8,'Among Us'),(9,'Valorant'),(10,'Roblox');
/*!40000 ALTER TABLE `game` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group`
--

DROP TABLE IF EXISTS `group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group` (
  `idGroup` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(45) NOT NULL,
  `Description` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idGroup`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group`
--

LOCK TABLES `group` WRITE;
/*!40000 ALTER TABLE `group` DISABLE KEYS */;
/*!40000 ALTER TABLE `group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `platform`
--

DROP TABLE IF EXISTS `platform`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `platform` (
  `idPlatform` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(45) NOT NULL,
  PRIMARY KEY (`idPlatform`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `platform`
--

LOCK TABLES `platform` WRITE;
/*!40000 ALTER TABLE `platform` DISABLE KEYS */;
INSERT INTO `platform` VALUES (1,'PC'),(2,'Xbox'),(3,'Nintendo Switch'),(4,'PlayStation'),(5,'Mobile');
/*!40000 ALTER TABLE `platform` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `playtime`
--

DROP TABLE IF EXISTS `playtime`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `playtime` (
  `idProfile_PlayTime` int NOT NULL,
  `PlayTime_Start` datetime DEFAULT NULL,
  `PlayTime_End` datetime DEFAULT NULL,
  KEY `idProfile_PlayTime_idx` (`idProfile_PlayTime`),
  CONSTRAINT `idProfile_PlayTime` FOREIGN KEY (`idProfile_PlayTime`) REFERENCES `profile` (`idProfile`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `playtime`
--

LOCK TABLES `playtime` WRITE;
/*!40000 ALTER TABLE `playtime` DISABLE KEYS */;
/*!40000 ALTER TABLE `playtime` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profile`
--

DROP TABLE IF EXISTS `profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profile` (
  `idProfile` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(45) NOT NULL,
  PRIMARY KEY (`idProfile`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profile`
--

LOCK TABLES `profile` WRITE;
/*!40000 ALTER TABLE `profile` DISABLE KEYS */;
/*!40000 ALTER TABLE `profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profile_appointmentrequest`
--

DROP TABLE IF EXISTS `profile_appointmentrequest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profile_appointmentrequest` (
  `idAppointmentRequest` int NOT NULL,
  `idProfile_AppointmentRequest` int NOT NULL,
  `Status` enum('sent','accepted','denied') NOT NULL,
  KEY `idAppointmentRequest_idx` (`idAppointmentRequest`),
  KEY `idProfile_AppointmentRequest_idx` (`idProfile_AppointmentRequest`),
  CONSTRAINT `idAppointmentRequest` FOREIGN KEY (`idAppointmentRequest`) REFERENCES `appointmentrequests` (`idAppointmentRequests`),
  CONSTRAINT `idProfile_AppointmentRequest` FOREIGN KEY (`idProfile_AppointmentRequest`) REFERENCES `profile` (`idProfile`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profile_appointmentrequest`
--

LOCK TABLES `profile_appointmentrequest` WRITE;
/*!40000 ALTER TABLE `profile_appointmentrequest` DISABLE KEYS */;
/*!40000 ALTER TABLE `profile_appointmentrequest` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profile_gameandplatform`
--

DROP TABLE IF EXISTS `profile_gameandplatform`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profile_gameandplatform` (
  `idProfile_GameAndPlatform` int NOT NULL,
  `idGame` int NOT NULL,
  `idPlatform` int NOT NULL,
  KEY `idProfile_GameAndPlatform_idx` (`idProfile_GameAndPlatform`),
  KEY `idPlatform_idx` (`idPlatform`),
  KEY `idGame_idx` (`idGame`),
  CONSTRAINT `idGame` FOREIGN KEY (`idGame`) REFERENCES `game` (`idGame`),
  CONSTRAINT `idPlatform` FOREIGN KEY (`idPlatform`) REFERENCES `platform` (`idPlatform`),
  CONSTRAINT `idProfile_GameAndPlatform` FOREIGN KEY (`idProfile_GameAndPlatform`) REFERENCES `profile` (`idProfile`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profile_gameandplatform`
--

LOCK TABLES `profile_gameandplatform` WRITE;
/*!40000 ALTER TABLE `profile_gameandplatform` DISABLE KEYS */;
/*!40000 ALTER TABLE `profile_gameandplatform` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profile_group`
--

DROP TABLE IF EXISTS `profile_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profile_group` (
  `idProfile` int DEFAULT NULL,
  `idGroup` int DEFAULT NULL,
  KEY `idProfile_idx` (`idProfile`),
  KEY `idGroup_idx` (`idGroup`),
  CONSTRAINT `idGroup` FOREIGN KEY (`idGroup`) REFERENCES `group` (`idGroup`) ON DELETE CASCADE,
  CONSTRAINT `idProfile_Group` FOREIGN KEY (`idProfile`) REFERENCES `profile` (`idProfile`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Connects Groups with profile to create member list';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profile_group`
--

LOCK TABLES `profile_group` WRITE;
/*!40000 ALTER TABLE `profile_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `profile_group` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-07-23 16:42:32
