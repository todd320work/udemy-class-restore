Create table Products
( 
	Id int identity,
	[Name] varchar(200),
	[Description] varchar(8000),
	[Price] int,
	[PictureUrl] varchar(8000),
	[Type] varchar(100),
	[Brand] varchar(100),
	[QuantityInStock] int
);


CREATE table Baskets 
(
	basketId int identity(1000,1),
	buyerId varchar(8000) not null,
);

Create table BasketItem
(
	basketItemId int identity(1000,1),
	basketId int not null,
	productId int not null,
	quantity int not null
);
ALTER TABLE Products
   ADD CONSTRAINT PK_Products PRIMARY KEY CLUSTERED (Id);
ALTER TABLE Baskets
   ADD CONSTRAINT PK_Baskets PRIMARY KEY CLUSTERED (BasketID);
ALTER TABLE BasketItem
   ADD CONSTRAINT PK_BasketItem PRIMARY KEY CLUSTERED (BasketItemId);


alter table BasketItem
	add Constraint FK_BasketItem_Product FOREIGN KEY (productId)
        REFERENCES Products(Id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
;
alter table BasketItem 
	add Constraint FK_BasketItem_BasketID FOREIGN KEY (basketId)
        REFERENCES Baskets(basketId)
        ON DELETE CASCADE
        ON UPDATE CASCADE
;
