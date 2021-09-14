GRANT ALL PRIVILEGES ON shop_sever.* TO 'doadmin'@'%' WITH GRANT OPTION;

GRANT ALL PRIVILEGES ON shop_sever.* TO 'dathuynh'@'%' WITH GRANT OPTION;
ALTER USER 'dathuynh'@'%' IDENTIFIED WITH mysql_native_password BY 'Dathuynh$1909';
FLUSH PRIVILEGES;
#
# SELECT user,authentication_string,plugin FROM mysql.user;

#     host: 'shop-do-user-9342162-0.b.db.ondigitalocean.com',
#     user: 'dathuynh',
#     password : 'Dathuynh$1909',
#     database: 'shop_sever',
#     sslmode: 'REQUIRED',
#     port: '25060'

CREATE TABLE `Categories` (
  `CategoryID`   INTEGER     NOT NULL AUTO_INCREMENT,
  `CategoryName` VARCHAR(200) NOT NULL,
  `Description`  MEDIUMTEXT,
  `CategorySlug` VARCHAR(68) NOT NULL,
  `Image`        VARCHAR(255) NOT NULL,
  CONSTRAINT `PK_Categories` PRIMARY KEY (`CategoryID`)
);

CREATE INDEX `CategoryName` ON `Categories` (`CategoryName`);

DROP TABLE Products;

DROP TABLE Categories;


CREATE TABLE `Products` (
  `ProductID`       INTEGER      NOT NULL AUTO_INCREMENT,
  `ProductName`     VARCHAR(255)  NOT NULL,
  `CategoryID`      INTEGER,
  `ProductPrice`    DECIMAL(10, 3)        DEFAULT 0,
  `UnitsInStock`    SMALLINT(5)           DEFAULT 0,
  `Description`     MEDIUMTEXT,
  `ManufactureYear` SMALLINT(5)  NOT NULL,
  `Image`           VARCHAR(255)  NOT NULL,
  `ProductSlug`     VARCHAR(100)  NOT NULL,
  `Feature`         BOOLEAN      NOT NULL DEFAULT 0,
  `Banner_event`    VARCHAR(255) NOT NULL,
  CONSTRAINT `PK_Products` PRIMARY KEY (`ProductID`),
  CONSTRAINT `FK_Products_Categories` FOREIGN KEY (`CategoryID`) REFERENCES `Categories` (`CategoryID`) ON DELETE CASCADE
);

CREATE INDEX `ProductName` ON `Products` (`ProductName`);

INSERT INTO Categories
VALUES (NULL, 'Sac dep', 'sac dep cho phai nu', 'sac-dep', 'https://cf.shopee.vn/file/c765998fda99b2be9eb6e348df29af28_tn');


INSERT INTO Products
VALUES (NULL, 'Son kem lì Bbia Last Velvet', 6, 150.000, 1210, 'Lateast', 2021, 'https://cf.shopee.vn/file/acd773f059e470f41a515d74b2c3b9d3', 'son-kem-li-bbia-last-velvet', 1, 'https://cf.shopee.vn/file/88ea00cf060e51583519f53bc7c94257');

SELECT * FROM Products WHERE ProductSlug = 'dau-bo-avocado-oil';

UPDATE Products
SET Banner_event = 'https://cf.shopee.vn/file/f4dfbba1e575489c4a8de620dfba8bf5_xxhdpi'
WHERE ProductID = 4;

SELECT * FROM Products;

SELECT * FROM Categories;

SELECT * FROM Users;



UPDATE Users
SET Avatar = 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png'
WHERE UserID = 2;

CREATE TABLE `Users` (
  `UserID`        INTEGER      NOT NULL AUTO_INCREMENT,
#   `UserShopPost`  VARCHAR(255) NOT NULL,
  `FullName`      VARCHAR(50)  NOT NULL,
  `StreetAddress` VARCHAR(255) NOT NULL,
  `PostCode`      VARCHAR(5)   NOT NULL,
  `City`          VARCHAR(28)  NOT NULL,
  `Country`       VARCHAR(28)  NOT NULL,
  `Avatar` VARCHAR(255) NOT NULL,
  `Phone`         VARCHAR(12)  NOT NULL,
  `Email`         VARCHAR(50)  NOT NULL,
  `Username`      VARCHAR(28),
  `Password`      VARCHAR(158),
  `Admin`         BOOLEAN      NOT NULL DEFAULT 0,
  CONSTRAINT `PK_Users` PRIMARY KEY (`UserID`)
);

CREATE INDEX `Username` ON `Users` (`Username`);


SELECT * FROM Addresses;
CREATE TABLE `Addresses` (
  `AddressID`     INTEGER      NOT NULL AUTO_INCREMENT,
  `UserID`        INTEGER,
  `FullName`      VARCHAR(50)  NOT NULL,
  `StreetAddress` VARCHAR(255) NOT NULL,
  `PostCode`      VARCHAR(5)   NOT NULL,
  `City`          VARCHAR(28)  NOT NULL,
  `Country`       VARCHAR(28)  NOT NULL,
  `Avatar` VARCHAR(255) NOT NULL,
  `Phone`         VARCHAR(12)  NOT NULL,
  CONSTRAINT `PK_Addresses` PRIMARY KEY (`AddressID`),
  CONSTRAINT `FK_Users_UserID` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE
);

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


CREATE TABLE `Order Details` (
  `OrderID`   INTEGER     NOT NULL,
  `ProductID` INTEGER     NOT NULL,
  `Quantity`  SMALLINT(2) NOT NULL DEFAULT 1,
  `Total`     DECIMAL(10,2) NOT NULL,
  CONSTRAINT `PK_Order Details` PRIMARY KEY (`OrderID`, `ProductID`),
  CONSTRAINT `FK_Order_Details_Orders` FOREIGN KEY (`OrderID`) REFERENCES `Orders` (`OrderID`) ON DELETE CASCADE,
  CONSTRAINT `FK_Order_Details_Products` FOREIGN KEY (`ProductID`) REFERENCES `Products` (`ProductID`) ON DELETE CASCADE
);


INSERT INTO Products
VALUES (NULL, 'Cọ Trang Điểm Cán Đuôi Cá', 6, 30.000, 500, 'Latest', 2021, 'https://cf.shopee.vn/file/5ef115afb58c3d9f8a933c94fe71fff4', 'Cọ Trang Điểm Cán Đuôi Cá', 1, 'https://cf.shopee.vn/file/88ea00cf060e51583519f53bc7c94257');
INSERT INTO Products
VALUES (NULL, 'Bảng Phấn Mắt 4 Màu Làm Đẹp Trang Điểm Lâu Trôi', 6, 15.000, 1000, 'Ben', 2021, 'https://cf.shopee.vn/file/f1f8aa39de0b06bb2353baf3bfec45ba', 'sBảng Phấn Mắt 4 Màu Làm Đẹp Trang Điểm Lâu Trôi', 1, 'https://cf.shopee.vn/file/88ea00cf060e51583519f53bc7c94257');
INSERT INTO Products
VALUES (NULL, 'Smart Tivi Netflix 4K UHD Coocaa 50 inch - Model 50S3N', 1, 6.899,000, 110, '4K', 2021, 'https://cf.shopee.vn/file/28e4dc3fed8d34d2027eda8f5a065294', 'Smart Tivi Netflix 4K UHD Coocaa 50 inch - Model 50S3N', 1, 'https://cf.shopee.vn/file/88ea00cf060e51583519f53bc7c94257');
INSERT INTO Products
VALUES (NULL, 'Điều kiển tivi LG Smart RM-L930+2', 1, 35.000, 300, 'Smart', 2021, 'https://cf.shopee.vn/file/b91da7d3d50567b0dd22ade895808dd8', 'Điều kiển tivi LG Smart RM-L930+2', 1, 'https://cf.shopee.vn/file/88ea00cf060e51583519f53bc7c94257');
INSERT INTO Products
VALUES (NULL, 'Ấm Đun Nước Bluestone KTB-3455', 2, 599.000, 800, 'Nhanh', 2021, 'https://cf.shopee.vn/file/2f1d8c3fde44e04735776cb40cf9d17c', 'Ấm Đun Nước Bluestone KTB-3455', 1, 'https://cf.shopee.vn/file/88ea00cf060e51583519f53bc7c94257');
INSERT INTO Products
VALUES (NULL, 'Máy xay sinh tố và làm sữa hạt 1300W Tefal BL967B66', 2, 2.719000, 670, 'Ben', 2021, 'https://cf.shopee.vn/file/e7d268f3a604bec997033023ee42fc09', 'Máy xay sinh tố và làm sữa hạt 1300W Tefal BL967B66', 1, 'https://cf.shopee.vn/file/88ea00cf060e51583519f53bc7c94257');