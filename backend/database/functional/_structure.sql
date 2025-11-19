/**
 * @schema functional
 * Business logic schema
 */
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'functional')
BEGIN
    EXEC('CREATE SCHEMA [functional]');
END
GO
