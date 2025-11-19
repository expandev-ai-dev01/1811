/**
 * @table contact
 * @multitenancy true
 * @softDelete true
 * @alias ctt
 * @description Stores contact requests from users interested in vehicles
 */
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[functional].[contact]') AND type in (N'U'))
BEGIN
    CREATE TABLE [functional].[contact] (
        [idContact] INTEGER IDENTITY(1, 1) NOT NULL,
        [idAccount] INTEGER NOT NULL,
        [idCar] INTEGER NOT NULL,
        [name] NVARCHAR(100) NOT NULL,
        [email] NVARCHAR(100) NOT NULL,
        [phone] NVARCHAR(20) NOT NULL,
        [contactPreference] NVARCHAR(20) NOT NULL,
        [bestTime] NVARCHAR(20) NULL,
        [subject] NVARCHAR(50) NOT NULL,
        [message] NVARCHAR(1000) NOT NULL,
        [financing] BIT NOT NULL DEFAULT 0,
        [newsletter] BIT NOT NULL DEFAULT 0,
        [termsAccepted] BIT NOT NULL DEFAULT 0,
        [ipAddress] NVARCHAR(50) NOT NULL,
        [protocol] NVARCHAR(20) NULL,
        [status] NVARCHAR(20) NOT NULL DEFAULT 'Novo', -- Novo, Em atendimento, Concluído, Cancelado
        [consultantNotes] NVARCHAR(MAX) NULL,
        [dateCreated] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        [dateModified] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        [deleted] BIT NOT NULL DEFAULT 0
    );

    ALTER TABLE [functional].[contact]
    ADD CONSTRAINT [pkContact] PRIMARY KEY CLUSTERED ([idContact]);

    ALTER TABLE [functional].[contact]
    ADD CONSTRAINT [fkContact_Account] FOREIGN KEY ([idAccount])
    REFERENCES [subscription].[account]([idAccount]);

    ALTER TABLE [functional].[contact]
    ADD CONSTRAINT [fkContact_Car] FOREIGN KEY ([idCar])
    REFERENCES [functional].[car]([idCar]);

    -- Indexes
    CREATE NONCLUSTERED INDEX [ixContact_Account_Status] 
    ON [functional].[contact]([idAccount], [status])
    INCLUDE ([dateCreated])
    WHERE [deleted] = 0;

    CREATE NONCLUSTERED INDEX [ixContact_Account_Car] 
    ON [functional].[contact]([idAccount], [idCar])
    WHERE [deleted] = 0;

    CREATE UNIQUE NONCLUSTERED INDEX [uqContact_Protocol]
    ON [functional].[contact]([idAccount], [protocol])
    WHERE [protocol] IS NOT NULL AND [deleted] = 0;
END
GO