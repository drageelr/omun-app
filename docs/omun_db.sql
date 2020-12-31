-- MySQL dump 10.13  Distrib 8.0.22, for Linux (x86_64)
--
-- Host: localhost    Database: omun_db
-- ------------------------------------------------------
-- Server version	8.0.22

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` char(64) NOT NULL,
  `active` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `chat_message_del_del`
--

DROP TABLE IF EXISTS `chat_message_del_del`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_message_del_del` (
  `id` int NOT NULL,
  `committeeId` int NOT NULL,
  `sessionId` int NOT NULL,
  `senderDelegateId` int NOT NULL,
  `recipientDelegateId` int NOT NULL,
  `message` varchar(250) NOT NULL,
  `timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`committeeId`,`sessionId`,`id`,`senderDelegateId`,`recipientDelegateId`),
  KEY `fk_chat_message_del_del_committeeId_idx` (`committeeId`),
  KEY `fk_chat_message_del_del_sessionId_idx` (`sessionId`),
  KEY `fk_chat_message_del_del_senderDelegateId_idx` (`senderDelegateId`),
  KEY `fk_chat_message_del_del_recipientDelegateId_idx` (`recipientDelegateId`),
  KEY `S_TO_R` (`committeeId`,`sessionId`,`senderDelegateId`,`recipientDelegateId`,`id`),
  KEY `R_TO_S` (`committeeId`,`sessionId`,`recipientDelegateId`,`senderDelegateId`,`id`),
  CONSTRAINT `fk_chat_message_del_del_committeeId` FOREIGN KEY (`committeeId`) REFERENCES `committee` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_chat_message_del_del_recipientDelegateId` FOREIGN KEY (`recipientDelegateId`) REFERENCES `delegate` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_chat_message_del_del_senderDelegateId` FOREIGN KEY (`senderDelegateId`) REFERENCES `delegate` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_chat_message_del_del_sessionId` FOREIGN KEY (`sessionId`) REFERENCES `session` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`omun`@`localhost`*/ /*!50003 TRIGGER `chat_message_del_del_BEFORE_INSERT` BEFORE INSERT ON `chat_message_del_del` FOR EACH ROW BEGIN
	SET NEW.id = (SELECT MAX(id) + 1 FROM chat_message_del_del WHERE committeeId = NEW.committeeId AND sessionId = NEW.sessionId AND senderDelegateId IN (NEW.senderDelegateId, NEW.recipientDelegateId) AND recipientDelegateId IN (NEW.senderDelegateId, NEW.recipientDelegateId));
	IF (NEW.id IS NULL) THEN
		SET NEW.id = 1;
	END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `chat_message_del_dias`
--

DROP TABLE IF EXISTS `chat_message_del_dias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_message_del_dias` (
  `id` int NOT NULL,
  `committeeId` int NOT NULL,
  `sessionId` int NOT NULL,
  `diasId` int NOT NULL,
  `delegateId` int NOT NULL,
  `message` varchar(250) NOT NULL,
  `diasSent` tinyint NOT NULL DEFAULT '0',
  `timestamp` datetime NOT NULL,
  PRIMARY KEY (`committeeId`,`sessionId`,`id`,`diasId`,`delegateId`),
  KEY `fk_chat_message_del_dias_committeeId_idx` (`committeeId`),
  KEY `fk_chat_message_del_dias_sessionId_idx` (`sessionId`),
  KEY `fk_chat_message_del_dias_diasId_idx` (`diasId`),
  KEY `fk_chat_message_del_dias_delegateId_idx` (`delegateId`),
  KEY `DIAS_TO_DEL` (`committeeId`,`sessionId`,`diasId`,`delegateId`,`id`),
  KEY `DEL_TO_DIAS` (`committeeId`,`sessionId`,`delegateId`,`diasId`,`id`),
  CONSTRAINT `fk_chat_message_del_dias_committeeId` FOREIGN KEY (`committeeId`) REFERENCES `committee` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_chat_message_del_dias_delegateId` FOREIGN KEY (`delegateId`) REFERENCES `delegate` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_chat_message_del_dias_diasId` FOREIGN KEY (`diasId`) REFERENCES `dias` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_chat_message_del_dias_sessionId` FOREIGN KEY (`sessionId`) REFERENCES `session` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`omun`@`localhost`*/ /*!50003 TRIGGER `chat_message_del_dias_BEFORE_INSERT` BEFORE INSERT ON `chat_message_del_dias` FOR EACH ROW BEGIN
	SET NEW.id = (SELECT MAX(id) + 1 FROM chat_message_del_dias WHERE committeeId = NEW.committeeId AND sessionId = NEW.sessionId AND delegateId = NEW.delegateId AND diasId = NEW.diasId);
	IF (NEW.id IS NULL) THEN
		SET NEW.id = 1;
	END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `committee`
--

DROP TABLE IF EXISTS `committee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `committee` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `initials` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`omun`@`localhost`*/ /*!50003 TRIGGER `committee_AFTER_INSERT` AFTER INSERT ON `committee` FOR EACH ROW BEGIN
	SET @x = 0;
    WHILE @x < 50 DO
		INSERT INTO seat (committeeId) VALUES (NEW.id);
        SET @x = @x + 1;
    END WHILE;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `country`
--

DROP TABLE IF EXISTS `country`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `country` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `initials` varchar(20) NOT NULL,
  `veto` tinyint NOT NULL DEFAULT '0',
  `personality` tinyint DEFAULT '0',
  `imageName` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `delegate`
--

DROP TABLE IF EXISTS `delegate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delegate` (
  `id` int NOT NULL AUTO_INCREMENT,
  `committeeId` int NOT NULL,
  `countryId` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` char(64) NOT NULL,
  `active` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `COMMITTEE` (`committeeId`),
  KEY `COUNTRY` (`countryId`),
  CONSTRAINT `fk_delegate_committeeId` FOREIGN KEY (`committeeId`) REFERENCES `committee` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_delegate_countryId` FOREIGN KEY (`countryId`) REFERENCES `country` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `delegate_permission`
--

DROP TABLE IF EXISTS `delegate_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delegate_permission` (
  `delegateId` int NOT NULL,
  `chatDias` tinyint NOT NULL DEFAULT '1',
  `chatDelegate` tinyint NOT NULL DEFAULT '1',
  `raisePlacard` tinyint NOT NULL DEFAULT '1',
  `uploadFile` tinyint NOT NULL DEFAULT '1',
  `joinZoom` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`delegateId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dias`
--

DROP TABLE IF EXISTS `dias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `committeeId` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` char(64) NOT NULL,
  `title` varchar(10) NOT NULL,
  `active` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `COMMITTEE` (`committeeId`),
  CONSTRAINT `fk_dias_committeeId` FOREIGN KEY (`committeeId`) REFERENCES `committee` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `gsl`
--

DROP TABLE IF EXISTS `gsl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gsl` (
  `id` int NOT NULL,
  `committeeId` int NOT NULL,
  `delegateId` int NOT NULL,
  `review` varchar(500) DEFAULT NULL,
  `spokenTime` int NOT NULL DEFAULT '0',
  `visible` tinyint NOT NULL DEFAULT '1',
  `timestampAdded` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `timestampSpoken` datetime DEFAULT NULL,
  PRIMARY KEY (`id`,`committeeId`),
  KEY `fk_gsl_delegateId_idx` (`delegateId`),
  KEY `COM-ID` (`committeeId`,`id`),
  KEY `COM-DEL-ID` (`committeeId`,`delegateId`,`id`),
  CONSTRAINT `fk_gsl_committeeId` FOREIGN KEY (`committeeId`) REFERENCES `committee` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_gsl_delegateId` FOREIGN KEY (`delegateId`) REFERENCES `delegate` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`omun`@`localhost`*/ /*!50003 TRIGGER `gsl_BEFORE_INSERT` BEFORE INSERT ON `gsl` FOR EACH ROW BEGIN
	SET NEW.id = (SELECT MAX(id) + 1 FROM gsl WHERE committeeId = NEW.committeeId);
	IF (NEW.id IS NULL) THEN
		SET NEW.id = 1;
	END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `log`
--

DROP TABLE IF EXISTS `log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `log` (
  `id` int NOT NULL,
  `committeeId` int NOT NULL,
  `sessionId` int NOT NULL,
  `message` varchar(500) NOT NULL,
  `timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`,`committeeId`,`sessionId`),
  KEY `SESSION` (`sessionId`),
  KEY `fk_log_committeeId_idx` (`committeeId`),
  KEY `COM-SESSION-ID` (`committeeId`,`sessionId`,`id`),
  CONSTRAINT `fk_log_committeeId` FOREIGN KEY (`committeeId`) REFERENCES `committee` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_logs_sessionId` FOREIGN KEY (`sessionId`) REFERENCES `session` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`omun`@`localhost`*/ /*!50003 TRIGGER `log_BEFORE_INSERT` BEFORE INSERT ON `log` FOR EACH ROW BEGIN
	SET NEW.id = (SELECT MAX(id) + 1 FROM log WHERE committeeId = NEW.committeeId AND sessionId = NEW.sessionId);
	IF (NEW.id IS NULL) THEN
		SET NEW.id = 1;
	END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `id` int NOT NULL,
  `committeeId` int NOT NULL,
  `sessionId` int NOT NULL,
  `diasId` int DEFAULT NULL,
  `message` varchar(250) NOT NULL,
  `timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`,`committeeId`,`sessionId`),
  KEY `fk_notification_committeeId_idx` (`committeeId`),
  KEY `fk_notification_sessionId_idx` (`sessionId`),
  KEY `COM-SESSION-ID` (`committeeId`,`sessionId`,`id`),
  KEY `fk_notification_diasId_idx` (`diasId`),
  CONSTRAINT `fk_notification_committeeId` FOREIGN KEY (`committeeId`) REFERENCES `committee` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_notification_diasId` FOREIGN KEY (`diasId`) REFERENCES `dias` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_notification_sessionId` FOREIGN KEY (`sessionId`) REFERENCES `session` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`omun`@`localhost`*/ /*!50003 TRIGGER `notification_BEFORE_INSERT` BEFORE INSERT ON `notification` FOR EACH ROW BEGIN
	SET NEW.id = (SELECT MAX(id) + 1 FROM notification WHERE committeeId = NEW.committeeId AND sessionId = NEW.sessionId);
	IF (NEW.id IS NULL) THEN
		SET NEW.id = 1;
	END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `seat`
--

DROP TABLE IF EXISTS `seat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seat` (
  `id` int NOT NULL,
  `committeeId` int NOT NULL,
  `delegateId` int DEFAULT NULL,
  `placard` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`,`committeeId`),
  KEY `COMMITTEE` (`committeeId`),
  KEY `DELEGATE` (`delegateId`),
  KEY `COM-ID` (`committeeId`,`id`),
  CONSTRAINT `fk_seat_committeeId` FOREIGN KEY (`committeeId`) REFERENCES `committee` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_seat_delegateId` FOREIGN KEY (`delegateId`) REFERENCES `delegate` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`omun`@`localhost`*/ /*!50003 TRIGGER `seat_BEFORE_INSERT` BEFORE INSERT ON `seat` FOR EACH ROW BEGIN
	SET NEW.id = (SELECT MAX(id) + 1 FROM seat WHERE committeeId = NEW.committeeId);
	IF (NEW.id IS NULL) THEN
		SET NEW.id = 1;
	END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `session`
--

DROP TABLE IF EXISTS `session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `session` (
  `id` int NOT NULL,
  `committeeId` int NOT NULL,
  `topicId` int DEFAULT NULL,
  `speakerId` int DEFAULT NULL,
  `speakerTime` int NOT NULL DEFAULT '0',
  `topicTime` int NOT NULL DEFAULT '0',
  `active` tinyint NOT NULL DEFAULT '0',
  `type` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`,`committeeId`),
  KEY `COMMITTEE` (`committeeId`),
  KEY `SPEAKER` (`speakerId`),
  KEY `TOPIC` (`topicId`),
  KEY `COM-ID` (`committeeId`,`id`),
  CONSTRAINT `fk_session_committeeId` FOREIGN KEY (`committeeId`) REFERENCES `committee` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_session_speakerId` FOREIGN KEY (`speakerId`) REFERENCES `delegate` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_session_topicId` FOREIGN KEY (`topicId`) REFERENCES `topic` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`omun`@`localhost`*/ /*!50003 TRIGGER `session_BEFORE_INSERT` BEFORE INSERT ON `session` FOR EACH ROW BEGIN
	SET NEW.id = (SELECT MAX(id) + 1 FROM `omun_db`.`session` WHERE committeeId = NEW.committeeId);
	IF (NEW.id IS NULL) THEN
		SET NEW.id = 1;
	END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `topic`
--

DROP TABLE IF EXISTS `topic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `topic` (
  `id` int NOT NULL AUTO_INCREMENT,
  `committeeId` int NOT NULL,
  `sessionId` int NOT NULL,
  `delegateId` int NOT NULL,
  `description` varchar(250) NOT NULL,
  `totalTime` int NOT NULL,
  `speakerTime` int NOT NULL,
  `visible` tinyint NOT NULL DEFAULT '1',
  `timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`,`committeeId`),
  KEY `SESSION` (`sessionId`),
  KEY `DELEGATE` (`delegateId`),
  KEY `COM-SESSION-ID` (`committeeId`,`sessionId`,`id`),
  KEY `COM-SESSION-VIS` (`committeeId`,`sessionId`,`visible`,`id`),
  KEY `fk_topic_committeeId_idx` (`committeeId`),
  CONSTRAINT `fk_topic_committeeId` FOREIGN KEY (`committeeId`) REFERENCES `committee` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_topic_delegateId` FOREIGN KEY (`delegateId`) REFERENCES `delegate` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_topic_sessionId` FOREIGN KEY (`sessionId`) REFERENCES `session` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`omun`@`localhost`*/ /*!50003 TRIGGER `topic_BEFORE_INSERT` BEFORE INSERT ON `topic` FOR EACH ROW BEGIN
	SET NEW.id = (SELECT MAX(id) + 1 FROM topic WHERE committeeId = NEW.committeeId);
	IF (NEW.id IS NULL) THEN
		SET NEW.id = 1;
	END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `topic_speaker`
--

DROP TABLE IF EXISTS `topic_speaker`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `topic_speaker` (
  `id` int NOT NULL,
  `topicId` int NOT NULL,
  `delegateId` int NOT NULL,
  `review` varchar(500) DEFAULT NULL,
  `spokenTime` int NOT NULL DEFAULT '0',
  `visible` tinyint NOT NULL DEFAULT '1',
  `timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`,`topicId`),
  KEY `TOPIC` (`topicId`),
  KEY `DELEGATE` (`delegateId`),
  KEY `TOPIC-VIS` (`topicId`,`visible`),
  KEY `TOPIC-ID` (`topicId`,`id`),
  CONSTRAINT `fk_topic_speaker_delegateId` FOREIGN KEY (`delegateId`) REFERENCES `delegate` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_topic_speaker_topicId` FOREIGN KEY (`topicId`) REFERENCES `topic` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`omun`@`localhost`*/ /*!50003 TRIGGER `topic_speaker_BEFORE_INSERT` BEFORE INSERT ON `topic_speaker` FOR EACH ROW BEGIN
	SET NEW.id = (SELECT MAX(id) + 1 FROM topic_speaker WHERE topicId = NEW.topicId);
	IF (NEW.id IS NULL) THEN
		SET NEW.id = 1;
	END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-12-31  5:43:00
