/**
 * @load account
 */
IF NOT EXISTS (SELECT * FROM [subscription].[account] WHERE [name] = 'Default Account')
BEGIN
    INSERT INTO [subscription].[account] ([name], [active])
    VALUES ('Default Account', 1);
END
GO

/**
 * @load car
 */
DECLARE @idAccount INT = (SELECT TOP 1 [idAccount] FROM [subscription].[account] WHERE [name] = 'Default Account');

IF NOT EXISTS (SELECT * FROM [functional].[car] WHERE [idAccount] = @idAccount)
BEGIN
    INSERT INTO [functional].[car] 
    ([idAccount], [brand], [model], [year], [price], [mileage], [transmission], [image], [description], [status])
    VALUES 
    (@idAccount, 'Toyota', 'Corolla XEi', 2022, 145000.00, 15000, 'Automático', 'https://example.com/corolla.jpg', 'Excellent condition', 1),
    (@idAccount, 'Honda', 'Civic Touring', 2021, 160000.00, 25000, 'Automático', 'https://example.com/civic.jpg', 'Single owner', 1),
    (@idAccount, 'Volkswagen', 'T-Cross Highline', 2023, 155000.00, 5000, 'Automático', 'https://example.com/tcross.jpg', 'Like new', 1),
    (@idAccount, 'Fiat', 'Pulse Audace', 2022, 110000.00, 12000, 'Automático', 'https://example.com/pulse.jpg', 'Great city car', 1),
    (@idAccount, 'Jeep', 'Compass Longitude', 2020, 135000.00, 45000, 'Automático', 'https://example.com/compass.jpg', 'Ready for adventure', 1);
END
GO
