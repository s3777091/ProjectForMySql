/*
** Target DBMS:           MySQL 8
** Project name:          aStore
** Author:                Dathuynh
** Created on:            2020-12-08 15:30
*/
DROP DATABASE IF EXISTS astore;

CREATE DATABASE IF NOT EXISTS astore;

USE astore;

*/

CREATE TABLE `Categories` (
  `CategoryID`   INTEGER     NOT NULL AUTO_INCREMENT,
  `CategoryName` VARCHAR(58) NOT NULL,
  `Description`  MEDIUMTEXT,
  `CategorySlug` VARCHAR(68) NOT NULL,
  `Image`        VARCHAR(58) NOT NULL,
  CONSTRAINT `PK_Categories` PRIMARY KEY (`CategoryID`)
);

CREATE INDEX `CategoryName` ON `Categories` (`CategoryName`);

/*
** Add table "Users"
*/


SELECT * FROM Users;

CREATE TABLE `Users` (
  `UserID`        INTEGER      NOT NULL AUTO_INCREMENT,
  `FullName`      VARCHAR(50)  NOT NULL,
  `StreetAddress` VARCHAR(255) NOT NULL,
  `PostCode`      VARCHAR(5)   NOT NULL,
  `City`          VARCHAR(28)  NOT NULL,
  `Country`       VARCHAR(28)  NOT NULL,
  `Phone`         VARCHAR(12)  NOT NULL,
  `Email`         VARCHAR(50)  NOT NULL,
  `Username`      VARCHAR(28),
  `Password`      VARCHAR(158),
  `Admin`         BOOLEAN      NOT NULL DEFAULT 0,
  CONSTRAINT `PK_Users` PRIMARY KEY (`UserID`)
);
INSERT INTO Users
VALUES (NULL, 'Admin', 'Vanha Maantie 6', '02650', 'Espoo', 'Finland', '0123456789', 'admin@astore.com', 'admin', '$2a$10$mpJCYlSr762SwQVzdLwxR.KgRuWEHA2NzUanxxG/nxEStDRcRBbB6', 1);
CREATE INDEX `Username` ON `Users` (`Username`);

/*
** Add table "Addresses"
*/

CREATE TABLE `Addresses` (
  `AddressID`     INTEGER      NOT NULL AUTO_INCREMENT,
  `UserID`        INTEGER,
  `FullName`      VARCHAR(50)  NOT NULL,
  `StreetAddress` VARCHAR(255) NOT NULL,
  `PostCode`      VARCHAR(5)   NOT NULL,
  `City`          VARCHAR(28)  NOT NULL,
  `Country`       VARCHAR(28)  NOT NULL,
  `Phone`         VARCHAR(12)  NOT NULL,
  CONSTRAINT `PK_Addresses` PRIMARY KEY (`AddressID`),
  CONSTRAINT `FK_Users_UserID` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE
);

/*
** Add table "Products"
*/

CREATE TABLE `Products` (
  `ProductID`       INTEGER      NOT NULL AUTO_INCREMENT,
  `ProductName`     VARCHAR(40)  NOT NULL,
  `CategoryID`      INTEGER,
  `ProductPrice`    DECIMAL(10, 2)        DEFAULT 0,
  `UnitsInStock`    SMALLINT(5)           DEFAULT 0,
  `Description`     VARCHAR(255) NOT NULL,
  `ManufactureYear` SMALLINT(5)  NOT NULL,
  `Image`           VARCHAR(50)  NOT NULL,
  `ProductSlug`     VARCHAR(50)  NOT NULL,
  `Feature`         BOOLEAN      NOT NULL DEFAULT 0,
  CONSTRAINT `PK_Products` PRIMARY KEY (`ProductID`),
  CONSTRAINT `FK_Products_Categories` FOREIGN KEY (`CategoryID`) REFERENCES `Categories` (`CategoryID`) ON DELETE CASCADE
);

CREATE INDEX `ProductName` ON `Products` (`ProductName`);

/*
** Add table "Orders"
*/

CREATE TABLE `Orders` (
  `OrderID`   INTEGER NOT NULL AUTO_INCREMENT,
  `UserID`    INTEGER NOT NULL,
  `AddressID` INTEGER NOT NULL,
  `SubTotal`  DECIMAL(10,2),
  `Discount`  DECIMAL(10,2),
  `ShippingFee`  DECIMAL(10,2),
  `Total`  DECIMAL(10,2),
  `OrderDate` DATETIME,
  `Status`    VARCHAR(150) NOT NULL,
  CONSTRAINT `PK_Orders` PRIMARY KEY (`OrderID`),
  CONSTRAINT `FK_Orders_Users` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE
);

/*
** Add table "Order Details"
*/

CREATE TABLE `Order Details` (
  `OrderID`   INTEGER     NOT NULL,
  `ProductID` INTEGER     NOT NULL,
  `Quantity`  SMALLINT(2) NOT NULL DEFAULT 1,
  `Total`     DECIMAL(10,2) NOT NULL,
  CONSTRAINT `PK_Order Details` PRIMARY KEY (`OrderID`, `ProductID`),
  CONSTRAINT `FK_Order_Details_Orders` FOREIGN KEY (`OrderID`) REFERENCES `Orders` (`OrderID`) ON DELETE CASCADE,
  CONSTRAINT `FK_Order_Details_Products` FOREIGN KEY (`ProductID`) REFERENCES `Products` (`ProductID`) ON DELETE CASCADE
);

/*
** Add table "Messages"
*/

CREATE TABLE `Messages` (
  `MessageID` INTEGER     NOT NULL AUTO_INCREMENT,
  `FullName`  VARCHAR(50) NOT NULL,
  `Email`     VARCHAR(50) NOT NULL,
  `Subject`   VARCHAR(128),
  `Content`   VARCHAR(158),
  CONSTRAINT `PK_Messages` PRIMARY KEY (`MessageID`)
);

/*
** Add table "Subscribers"
*/

CREATE TABLE `Subscribers` (
  `Email` VARCHAR(50)  NOT NULL
);

/*
** Data
*/

/*
** Add data into "Categories"
*/

INSERT INTO Categories
VALUES (NULL, 'Smartphone', 'Mobile phones', 'smartphone', 'smartphone.png');

** Add data into "Products"
*/

INSERT INTO Products
VALUES (NULL, 'iPhone 6', 1, 850.52, 18, 'Lateast', 2015, '1.png', 'iphone-6', 1);

/*
** Add data into "Customers"
*/

INSERT INTO Users
VALUES (NULL, 'Admin', 'Vanha Maantie 6', '02650', 'Espoo', 'Finland', '0123456789', 'admin@astore.com', 'admin', '$2a$10$mpJCYlSr762SwQVzdLwxR.KgRuWEHA2NzUanxxG/nxEStDRcRBbB6', 1);
INSERT INTO Users
VALUES
  (NULL, 'Dat Huynh', 'Vanha Maantie 8', '02650', 'Helsinki', 'Finland', '012 345 6787', 'anh.pham@astore.com', 'anhpham', '$2a$10$TsD7IW0m1g/57C931nC7R.FjwXw9i0tAbJZk7u4Uk0gDoneR9yBim',
   0);

/*
** Add data into "Addresses"
*/
INSERT INTO Addresses
VALUES (NULL, 1, 'Admin', 'Vanha Maantie 6', '02650', 'Espoo', 'Finland', '0123456789');
INSERT INTO Addresses
VALUES (NULL, 2, 'Dath huynh', 'Vanha Maantie 8', '02650', 'Helsinki', 'Finland', '012 345 6787');