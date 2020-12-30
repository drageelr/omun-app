# MySQL Setup

## Install MySQL Server and WorkBench

### Windows
- Go to this [link](https://dev.mysql.com/downloads/installer/) and download the installer for Windows
- Run the installer and in the `Setup Type` screen, select the default option

### Ubuntu
- Update apt: `sudo apt update`
- Instal mysql-server: `sudo apt install mysql-server`
- Secure mysql-server: `sudo mysql_secure_installation`
  - Follow the steps
  - Don't activate `VALIDATE PASSWORD COMPONENT`
- Download mysql workbench from this [link](https://dev.mysql.com/downloads/workbench/) for ubuntu
- Run the downloaded file to install.

## Add New User to MySQL
- Run the command `mysql` (or `mysql -u root -p` if the preceding fails) on Ubuntu terminal OR Windows powershell/command prompt
- Then run the series of commands sequentially:
```
CREATE USER 'omun'@'localhost' IDENTIFIED WITH mysql_native_password BY 'omun123';
GRANT ALL PRIVILEGES ON *.* TO 'omun'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```
- Now close the terminal

## Configure New Connection in MySQL WorkBench
- Open MySQL WorkBench
- Create a new connection
  - Connection Name: Anything
  - Hostname: `127.0.0.1`
  - Port: `13306`
  - Username: `omun`
  - Password: `omun123`
    - This will be prompted to you when you run the connection
- Test the connection, if all good continue
- Press OK

## Configuring New Database using MySQL WorkBench
- Open MySQL WorkBench
- Run the new connection (if prompted for password, enter `omun123`)
- You can follow the following steps for creating the schema OR just run the commands given
    - **Manual Method**
        - Press the option `Create a new schema in the connected server`
        - Write the Schema Name: `omun_db`
        - Press Apply/OK
        - Now double click the `omun_db` in the `Schemas` view (mostly at the left side of the screen)
    - **Alternative Command Method**
```
CREATE DATABASE `omun_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
use `omun_db`;
```

- Excute the following query to populate all tables for our application:
```
CREATE TABLE `admin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` char(64) NOT NULL,
  `active` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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

CREATE TABLE `committee` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `initials` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `country` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `initials` varchar(20) NOT NULL,
  `veto` tinyint NOT NULL DEFAULT '0',
  `imageName` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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

CREATE TABLE `delegate_permission` (
  `delegateId` int NOT NULL,
  `chatDias` tinyint NOT NULL DEFAULT '1',
  `chatDelegate` tinyint NOT NULL DEFAULT '1',
  `raisePlacard` tinyint NOT NULL DEFAULT '1',
  `uploadFile` tinyint NOT NULL DEFAULT '1',
  `joinZoom` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`delegateId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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

CREATE TABLE `gsl` (
  `committeeId` int NOT NULL,
  `delegateId` int NOT NULL,
  `spokenTime` int NOT NULL DEFAULT '0',
  `timestampAdded` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `timestampSpoken` datetime DEFAULT NULL,
  PRIMARY KEY (`committeeId`),
  KEY `fk_gsl_delegateId_idx` (`delegateId`),
  CONSTRAINT `fk_gsl_committeeId` FOREIGN KEY (`committeeId`) REFERENCES `committee` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_gsl_delegateId` FOREIGN KEY (`delegateId`) REFERENCES `delegate` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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

CREATE TABLE `seat` (
  `id` int NOT NULL,
  `committeeId` int NOT NULL,
  `delegateId` int DEFAULT NULL,
  `placard` tinyint NOT NULL,
  PRIMARY KEY (`id`,`committeeId`),
  KEY `COMMITTEE` (`committeeId`),
  KEY `DELEGATE` (`delegateId`),
  KEY `COM-ID` (`committeeId`,`id`),
  CONSTRAINT `fk_seat_committeeId` FOREIGN KEY (`committeeId`) REFERENCES `committee` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_seat_delegateId` FOREIGN KEY (`delegateId`) REFERENCES `delegate` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `session` (
  `id` int NOT NULL,
  `committeeId` int NOT NULL,
  `topicId` int DEFAULT NULL,
  `speakerId` int DEFAULT NULL,
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
  PRIMARY KEY (`id`),
  KEY `SESSION` (`sessionId`),
  KEY `DELEGATE` (`delegateId`),
  KEY `COM-SESSION-ID` (`committeeId`,`sessionId`,`id`),
  KEY `COM-SESSION-VIS` (`committeeId`,`sessionId`,`visible`,`id`),
  KEY `fk_topic_committeeId_idx` (`committeeId`),
  CONSTRAINT `fk_topic_committeeId` FOREIGN KEY (`committeeId`) REFERENCES `committee` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_topic_delegateId` FOREIGN KEY (`delegateId`) REFERENCES `delegate` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_topic_sessionId` FOREIGN KEY (`sessionId`) REFERENCES `session` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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

```