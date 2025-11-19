/**
 * @table car
 * @multitenancy true
 * @softDelete true
 * @alias car
 * @description Stores vehicle information for the catalog
 */
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[functional].[car]') AND type in (N'U'))
BEGIN
    CREATE TABLE [functional].[car] (
        [idCar] INTEGER IDENTITY(1, 1) NOT NULL,
        [idAccount] INTEGER NOT NULL,
        [model] NVARCHAR(50) NOT NULL,
        [brand] NVARCHAR(50) NOT NULL,
        [year] INTEGER NOT NULL,
        [modelYear] INTEGER NOT NULL DEFAULT 2024,
        [price] NUMERIC(18, 2) NOT NULL,
        [mileage] INTEGER NULL,
        [transmission] NVARCHAR(20) NULL,
        [fuel] NVARCHAR(20) NULL,
        [color] NVARCHAR(30) NULL,
        [doors] INTEGER NULL,
        [bodyType] NVARCHAR(30) NULL,
        [motor] NVARCHAR(20) NULL,
        [power] NVARCHAR(20) NULL,
        [plateEnd] INTEGER NULL,
        [image] NVARCHAR(500) NOT NULL,
        [description] NVARCHAR(500) NOT NULL DEFAULT (''),
        [status] INTEGER NOT NULL DEFAULT 1, -- 1: Active, 2: Sold, 3: Reserved
        [dateCreated] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        [dateModified] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        [deleted] BIT NOT NULL DEFAULT 0
    );

    ALTER TABLE [functional].[car]
    ADD CONSTRAINT [pkCar] PRIMARY KEY CLUSTERED ([idCar]);

    ALTER TABLE [functional].[car]
    ADD CONSTRAINT [fkCar_Account] FOREIGN KEY ([idAccount])
    REFERENCES [subscription].[account]([idAccount]);

    -- Indexes for performance
    CREATE NONCLUSTERED INDEX [ixCar_Account_Brand_Model] 
    ON [functional].[car]([idAccount], [brand], [model])
    INCLUDE ([year], [price], [image])
    WHERE [deleted] = 0;

    CREATE NONCLUSTERED INDEX [ixCar_Account_Price] 
    ON [functional].[car]([idAccount], [price])
    WHERE [deleted] = 0;

    CREATE NONCLUSTERED INDEX [ixCar_Account_Year] 
    ON [functional].[car]([idAccount], [year])
    WHERE [deleted] = 0;
END
ELSE
BEGIN
    -- Add new columns if table exists (Migration logic for existing envs)
    IF NOT EXISTS(SELECT * FROM sys.columns WHERE Name = N'modelYear' AND Object_ID = Object_ID(N'[functional].[car]'))
        ALTER TABLE [functional].[car] ADD [modelYear] INTEGER NOT NULL DEFAULT 2024;
        
    IF NOT EXISTS(SELECT * FROM sys.columns WHERE Name = N'fuel' AND Object_ID = Object_ID(N'[functional].[car]'))
        ALTER TABLE [functional].[car] ADD [fuel] NVARCHAR(20) NULL;
        
    IF NOT EXISTS(SELECT * FROM sys.columns WHERE Name = N'color' AND Object_ID = Object_ID(N'[functional].[car]'))
        ALTER TABLE [functional].[car] ADD [color] NVARCHAR(30) NULL;
        
    IF NOT EXISTS(SELECT * FROM sys.columns WHERE Name = N'doors' AND Object_ID = Object_ID(N'[functional].[car]'))
        ALTER TABLE [functional].[car] ADD [doors] INTEGER NULL;
        
    IF NOT EXISTS(SELECT * FROM sys.columns WHERE Name = N'bodyType' AND Object_ID = Object_ID(N'[functional].[car]'))
        ALTER TABLE [functional].[car] ADD [bodyType] NVARCHAR(30) NULL;
        
    IF NOT EXISTS(SELECT * FROM sys.columns WHERE Name = N'motor' AND Object_ID = Object_ID(N'[functional].[car]'))
        ALTER TABLE [functional].[car] ADD [motor] NVARCHAR(20) NULL;
        
    IF NOT EXISTS(SELECT * FROM sys.columns WHERE Name = N'power' AND Object_ID = Object_ID(N'[functional].[car]'))
        ALTER TABLE [functional].[car] ADD [power] NVARCHAR(20) NULL;
        
    IF NOT EXISTS(SELECT * FROM sys.columns WHERE Name = N'plateEnd' AND Object_ID = Object_ID(N'[functional].[car]'))
        ALTER TABLE [functional].[car] ADD [plateEnd] INTEGER NULL;
END
GO

/**
 * @table carPhoto
 * @multitenancy true
 * @alias photo
 * @description Stores gallery photos for vehicles
 */
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[functional].[carPhoto]') AND type in (N'U'))
BEGIN
    CREATE TABLE [functional].[carPhoto] (
        [idCarPhoto] INTEGER IDENTITY(1, 1) NOT NULL,
        [idAccount] INTEGER NOT NULL,
        [idCar] INTEGER NOT NULL,
        [url] NVARCHAR(500) NOT NULL,
        [isMain] BIT NOT NULL DEFAULT 0,
        [caption] NVARCHAR(50) NULL,
        [order] INTEGER NOT NULL DEFAULT 0,
        [dateCreated] DATETIME2 NOT NULL DEFAULT GETUTCDATE()
    );

    ALTER TABLE [functional].[carPhoto]
    ADD CONSTRAINT [pkCarPhoto] PRIMARY KEY CLUSTERED ([idCarPhoto]);

    ALTER TABLE [functional].[carPhoto]
    ADD CONSTRAINT [fkCarPhoto_Car] FOREIGN KEY ([idCar])
    REFERENCES [functional].[car]([idCar]);

    ALTER TABLE [functional].[carPhoto]
    ADD CONSTRAINT [fkCarPhoto_Account] FOREIGN KEY ([idAccount])
    REFERENCES [subscription].[account]([idAccount]);

    CREATE NONCLUSTERED INDEX [ixCarPhoto_Car] 
    ON [functional].[carPhoto]([idAccount], [idCar])
    INCLUDE ([url], [isMain], [order]);
END
GO

/**
 * @table carItem
 * @multitenancy true
 * @alias item
 * @description Stores standard items and optionals for vehicles
 */
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[functional].[carItem]') AND type in (N'U'))
BEGIN
    CREATE TABLE [functional].[carItem] (
        [idCarItem] INTEGER IDENTITY(1, 1) NOT NULL,
        [idAccount] INTEGER NOT NULL,
        [idCar] INTEGER NOT NULL,
        [name] NVARCHAR(100) NOT NULL,
        [category] NVARCHAR(50) NOT NULL, -- 'Conforto', 'Segurança', etc.
        [isOptional] BIT NOT NULL DEFAULT 0,
        [dateCreated] DATETIME2 NOT NULL DEFAULT GETUTCDATE()
    );

    ALTER TABLE [functional].[carItem]
    ADD CONSTRAINT [pkCarItem] PRIMARY KEY CLUSTERED ([idCarItem]);

    ALTER TABLE [functional].[carItem]
    ADD CONSTRAINT [fkCarItem_Car] FOREIGN KEY ([idCar])
    REFERENCES [functional].[car]([idCar]);

    ALTER TABLE [functional].[carItem]
    ADD CONSTRAINT [fkCarItem_Account] FOREIGN KEY ([idAccount])
    REFERENCES [subscription].[account]([idAccount]);

    CREATE NONCLUSTERED INDEX [ixCarItem_Car] 
    ON [functional].[carItem]([idAccount], [idCar]);
END
GO

/**
 * @table carHistory
 * @multitenancy true
 * @alias hist
 * @description Stores vehicle history information
 */
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[functional].[carHistory]') AND type in (N'U'))
BEGIN
    CREATE TABLE [functional].[carHistory] (
        [idCarHistory] INTEGER IDENTITY(1, 1) NOT NULL,
        [idAccount] INTEGER NOT NULL,
        [idCar] INTEGER NOT NULL,
        [provenance] NVARCHAR(50) NOT NULL,
        [ownerCount] INTEGER NOT NULL DEFAULT 0,
        [warrantyDetails] NVARCHAR(100) NULL,
        [technicalReportJson] NVARCHAR(MAX) NULL,
        [dateCreated] DATETIME2 NOT NULL DEFAULT GETUTCDATE()
    );

    ALTER TABLE [functional].[carHistory]
    ADD CONSTRAINT [pkCarHistory] PRIMARY KEY CLUSTERED ([idCarHistory]);

    ALTER TABLE [functional].[carHistory]
    ADD CONSTRAINT [fkCarHistory_Car] FOREIGN KEY ([idCar])
    REFERENCES [functional].[car]([idCar]);

    ALTER TABLE [functional].[carHistory]
    ADD CONSTRAINT [fkCarHistory_Account] FOREIGN KEY ([idAccount])
    REFERENCES [subscription].[account]([idAccount]);

    CREATE UNIQUE NONCLUSTERED INDEX [uqCarHistory_Car] 
    ON [functional].[carHistory]([idAccount], [idCar]);
END
GO

/**
 * @table carRevision
 * @multitenancy true
 * @alias rev
 * @description Stores vehicle revision history
 */
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[functional].[carRevision]') AND type in (N'U'))
BEGIN
    CREATE TABLE [functional].[carRevision] (
        [idCarRevision] INTEGER IDENTITY(1, 1) NOT NULL,
        [idAccount] INTEGER NOT NULL,
        [idCar] INTEGER NOT NULL,
        [date] DATE NOT NULL,
        [mileage] INTEGER NOT NULL,
        [location] NVARCHAR(100) NOT NULL,
        [dateCreated] DATETIME2 NOT NULL DEFAULT GETUTCDATE()
    );

    ALTER TABLE [functional].[carRevision]
    ADD CONSTRAINT [pkCarRevision] PRIMARY KEY CLUSTERED ([idCarRevision]);

    ALTER TABLE [functional].[carRevision]
    ADD CONSTRAINT [fkCarRevision_Car] FOREIGN KEY ([idCar])
    REFERENCES [functional].[car]([idCar]);

    ALTER TABLE [functional].[carRevision]
    ADD CONSTRAINT [fkCarRevision_Account] FOREIGN KEY ([idAccount])
    REFERENCES [subscription].[account]([idAccount]);

    CREATE NONCLUSTERED INDEX [ixCarRevision_Car] 
    ON [functional].[carRevision]([idAccount], [idCar]);
END
GO

/**
 * @table carClaim
 * @multitenancy true
 * @alias claim
 * @description Stores vehicle claim/accident history
 */
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[functional].[carClaim]') AND type in (N'U'))
BEGIN
    CREATE TABLE [functional].[carClaim] (
        [idCarClaim] INTEGER IDENTITY(1, 1) NOT NULL,
        [idAccount] INTEGER NOT NULL,
        [idCar] INTEGER NOT NULL,
        [date] DATE NOT NULL,
        [type] NVARCHAR(50) NOT NULL,
        [description] NVARCHAR(200) NOT NULL,
        [dateCreated] DATETIME2 NOT NULL DEFAULT GETUTCDATE()
    );

    ALTER TABLE [functional].[carClaim]
    ADD CONSTRAINT [pkCarClaim] PRIMARY KEY CLUSTERED ([idCarClaim]);

    ALTER TABLE [functional].[carClaim]
    ADD CONSTRAINT [fkCarClaim_Car] FOREIGN KEY ([idCar])
    REFERENCES [functional].[car]([idCar]);

    ALTER TABLE [functional].[carClaim]
    ADD CONSTRAINT [fkCarClaim_Account] FOREIGN KEY ([idAccount])
    REFERENCES [subscription].[account]([idAccount]);

    CREATE NONCLUSTERED INDEX [ixCarClaim_Car] 
    ON [functional].[carClaim]([idAccount], [idCar]);
END
GO

/**
 * @table carSaleCondition
 * @multitenancy true
 * @alias sale
 * @description Stores sales conditions and documentation info
 */
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[functional].[carSaleCondition]') AND type in (N'U'))
BEGIN
    CREATE TABLE [functional].[carSaleCondition] (
        [idCarSaleCondition] INTEGER IDENTITY(1, 1) NOT NULL,
        [idAccount] INTEGER NOT NULL,
        [idCar] INTEGER NOT NULL,
        [acceptsTrade] BIT NOT NULL DEFAULT 0,
        [saleObservations] NVARCHAR(500) NULL,
        [paymentMethodsJson] NVARCHAR(MAX) NOT NULL, -- JSON array of strings
        [financingConditionsJson] NVARCHAR(MAX) NULL, -- JSON object
        [requiredDocsJson] NVARCHAR(MAX) NOT NULL, -- JSON array of objects
        [docStatusJson] NVARCHAR(MAX) NOT NULL, -- JSON object
        [dateCreated] DATETIME2 NOT NULL DEFAULT GETUTCDATE()
    );

    ALTER TABLE [functional].[carSaleCondition]
    ADD CONSTRAINT [pkCarSaleCondition] PRIMARY KEY CLUSTERED ([idCarSaleCondition]);

    ALTER TABLE [functional].[carSaleCondition]
    ADD CONSTRAINT [fkCarSaleCondition_Car] FOREIGN KEY ([idCar])
    REFERENCES [functional].[car]([idCar]);

    ALTER TABLE [functional].[carSaleCondition]
    ADD CONSTRAINT [fkCarSaleCondition_Account] FOREIGN KEY ([idAccount])
    REFERENCES [subscription].[account]([idAccount]);

    CREATE UNIQUE NONCLUSTERED INDEX [uqCarSaleCondition_Car] 
    ON [functional].[carSaleCondition]([idAccount], [idCar]);
END
GO