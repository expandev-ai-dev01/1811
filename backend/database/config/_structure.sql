/**
 * @schema config
 * System-wide configuration schema
 */
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'config')
BEGIN
    EXEC('CREATE SCHEMA [config]');
END
GO
