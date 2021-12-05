SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

-- Create database magebit-test
CREATE DATABASE IF NOT EXISTS `magebit-test` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `magebit-test`;

-- Create table emails
CREATE TABLE `emails` (
  `id` int(11) NOT NULL,
  `email` varchar(320) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Add primary key
ALTER TABLE `emails`
  ADD PRIMARY KEY (`id`);
ALTER TABLE `emails`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
