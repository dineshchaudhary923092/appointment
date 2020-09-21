-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Aug 26, 2020 at 07:55 AM
-- Server version: 10.4.10-MariaDB
-- PHP Version: 7.3.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `appointment`
--

-- --------------------------------------------------------

--
-- Table structure for table `email_campaign`
--

DROP TABLE IF EXISTS `email_campaign`;
CREATE TABLE IF NOT EXISTS `email_campaign` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `subject` varchar(1000) NOT NULL,
  `type` enum('content','template') NOT NULL DEFAULT 'template',
  `content_id` varchar(200) NOT NULL,
  `visible` enum('show','hide') NOT NULL,
  `timestamp` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `email_campaign`
--

INSERT INTO `email_campaign` (`id`, `subject`, `type`, `content_id`, `visible`, `timestamp`) VALUES
(1, 'Welcome to {app_name}', 'template', 'signup', 'hide', 1597671603),
(2, 'Let`s find your password :)', 'template', 'password-reset', 'hide', 1597671603);

-- --------------------------------------------------------

--
-- Table structure for table `email_content`
--

DROP TABLE IF EXISTS `email_content`;
CREATE TABLE IF NOT EXISTS `email_content` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` longblob NOT NULL,
  `vars` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `firebase`
--

DROP TABLE IF EXISTS `firebase`;
CREATE TABLE IF NOT EXISTS `firebase` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `firebase` varchar(1000) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `login`
--

DROP TABLE IF EXISTS `login`;
CREATE TABLE IF NOT EXISTS `login` (
  `login_id` bigint(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `timestamp` bigint(20) NOT NULL,
  `useragent` varchar(150) NOT NULL,
  `ip` varchar(150) NOT NULL,
  `login_token` varchar(500) NOT NULL,
  `expiry` varchar(16) NOT NULL,
  PRIMARY KEY (`login_id`),
  KEY `user_id` (`user_id`),
  KEY `user_id_2` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=678 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `login`
--

INSERT INTO `login` (`login_id`, `user_id`, `timestamp`, `useragent`, `ip`, `login_token`, `expiry`) VALUES
(675, 700, 0, 'PostmanRuntime/7.26.2', 'UNKNOWN', 'a84962e9ddc08d4206ea6a7a4d10b64963131e5a16b6675ace62b067f0c5fe9cca947477a31da78e821693778b80b628', '1599936444'),
(677, 700, 0, 'PostmanRuntime/7.26.2', 'UNKNOWN', 'a84962e9ddc08d4206ea6a7a4d10b64963131e5a16b6675ace62b067f0c5fe9cca947477a31da78e821693778b80b628', '1599936444');

-- --------------------------------------------------------

--
-- Table structure for table `media`
--

DROP TABLE IF EXISTS `media`;
CREATE TABLE IF NOT EXISTS `media` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `file` varchar(1000) NOT NULL,
  `type` enum('img','video') NOT NULL DEFAULT 'img',
  `thumb` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
CREATE TABLE IF NOT EXISTS `notification` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `to_user` int(11) NOT NULL,
  `from_user` int(11) NOT NULL,
  `heading` varchar(1000) NOT NULL,
  `type` enum('request','info','temp') NOT NULL,
  `image` varchar(400) NOT NULL,
  `timestamp` int(11) NOT NULL,
  `seen` enum('y','n') NOT NULL DEFAULT 'n',
  `push` enum('y','n') NOT NULL DEFAULT 'n',
  `type_id` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `to_user` (`to_user`,`from_user`),
  KEY `from_user` (`from_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `options`
--

DROP TABLE IF EXISTS `options`;
CREATE TABLE IF NOT EXISTS `options` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key_data` varchar(50) NOT NULL,
  `value` varchar(1000) NOT NULL,
  `type_display` enum('show','hide') DEFAULT 'hide',
  PRIMARY KEY (`id`),
  UNIQUE KEY `key_data` (`key_data`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `send_mail`
--

DROP TABLE IF EXISTS `send_mail`;
CREATE TABLE IF NOT EXISTS `send_mail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `receiver` int(11) NOT NULL,
  `status` enum('sent','failed','opened','pending') NOT NULL DEFAULT 'pending',
  `campaign_id` int(11) NOT NULL,
  `timestamp` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `send_mail`
--

INSERT INTO `send_mail` (`id`, `receiver`, `status`, `campaign_id`, `timestamp`) VALUES
(23, 704, 'sent', 1, 1597685945);

-- --------------------------------------------------------

--
-- Table structure for table `subscribers`
--

DROP TABLE IF EXISTS `subscribers`;
CREATE TABLE IF NOT EXISTS `subscribers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(300) NOT NULL,
  `email` varchar(300) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `callingcode` int(11) NOT NULL,
  `country` varchar(5) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(500) NOT NULL,
  `email` varchar(500) NOT NULL,
  `password` varchar(500) NOT NULL,
  `status` enum('Y','N','B') NOT NULL DEFAULT 'N',
  `type` enum('U','SA') NOT NULL DEFAULT 'U',
  `image` varchar(500) DEFAULT NULL,
  `signup_stamp` bigint(20) NOT NULL,
  `country` varchar(20) NOT NULL DEFAULT 'IN',
  `phone` bigint(20) NOT NULL,
  `token` varchar(500) NOT NULL,
  `status_phone` enum('Y','N') NOT NULL DEFAULT 'N',
  `username` varchar(100) DEFAULT NULL,
  `callingcode` varchar(6) NOT NULL DEFAULT '91',
  `login` enum('online','offline') NOT NULL DEFAULT 'offline',
  `last_updated` int(11) NOT NULL,
  `lng` float(10,6) DEFAULT NULL,
  `lat` float(10,6) DEFAULT NULL,
  `location_main` enum('y','n') NOT NULL DEFAULT 'y',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=705 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `password`, `status`, `type`, `image`, `signup_stamp`, `country`, `phone`, `token`, `status_phone`, `username`, `callingcode`, `login`, `last_updated`, `lng`, `lat`, `location_main`) VALUES
(700, 'Himanshu Sharma DON', 'admin@lincollc.net', 'cf63314af12daf2c4ce6c0f204dfae97', 'Y', 'SA', 'dropbox/users/1597258046-avatar.png', 20200810104059, 'IN', 9056619454, 'cf63314af12daf2c4ce6c0f204dfae97', 'N', 'hsharma1996', '91', 'offline', 0, 0.000000, 0.000000, 'y'),
(704, 'Himanshu Sharma', 'sharma.himanshu0405@gmail.com', '27e1d3cef66c47d7563b203c5e044e3b', 'N', 'U', 'dropbox/users/1597258046-avatar.png', 1597230298, 'IN', 9056619455, 'd1f6814b2fe7a244fa04e770061f35c6c105b6bc98639b04dc4f70ac327f796a', 'Y', 'Himanshu-Sharma-704', '91', 'offline', 0, NULL, NULL, 'y');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
