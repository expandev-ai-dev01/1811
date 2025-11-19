/**
 * @schema subscription
 * Subscription and account management schema
 */
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'subscription')
BEGIN
    EXEC('CREATE SCHEMA [subscription]');
END
GO

/**
 * @table account
 * @description Represents a tenant/account in the system
 */
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[subscription].[account]') AND type in (N'U'))
BEGIN
    CREATE TABLE [subscription].[account] (
        [idAccount] INTEGER IDENTITY(1, 1) NOT NULL,
        [name] NVARCHAR(100) NOT NULL,
        [active] BIT NOT NULL DEFAULT 1,
        [dateCreated] DATETIME2 NOT NULL DEFAULT GETUTCDATE()
    );

    ALTER TABLE [subscription].[account]
    ADD CONSTRAINT [pkAccount] PRIMARY KEY CLUSTERED ([idAccount]);
END
GO
