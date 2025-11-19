/**
 * @load car_details
 * @description Seed data for extended car details
 */
DECLARE @idAccount INT = (SELECT TOP 1 [idAccount] FROM [subscription].[account] WHERE [name] = 'Default Account');

-- Update existing cars with extended specs
UPDATE [functional].[car]
SET 
    [modelYear] = [year] + 1,
    [fuel] = 'Flex',
    [color] = 'Prata',
    [doors] = 4,
    [bodyType] = 'Sedan',
    [motor] = '2.0',
    [power] = '177 cv',
    [plateEnd] = 5
WHERE [brand] = 'Toyota' AND [model] = 'Corolla XEi' AND [idAccount] = @idAccount;

UPDATE [functional].[car]
SET 
    [modelYear] = [year],
    [fuel] = 'Gasolina',
    [color] = 'Branco',
    [doors] = 4,
    [bodyType] = 'Sedan',
    [motor] = '1.5 Turbo',
    [power] = '173 cv',
    [plateEnd] = 8
WHERE [brand] = 'Honda' AND [model] = 'Civic Touring' AND [idAccount] = @idAccount;

-- Insert Photos
INSERT INTO [functional].[carPhoto] ([idAccount], [idCar], [url], [isMain], [caption], [order])
SELECT 
    @idAccount, 
    [idCar], 
    [image], 
    1, 
    'Vista Frontal', 
    1
FROM [functional].[car] 
WHERE [idAccount] = @idAccount 
AND NOT EXISTS (SELECT 1 FROM [functional].[carPhoto] WHERE [idCar] = [functional].[car].[idCar]);

-- Insert Items (Sample for Corolla)
INSERT INTO [functional].[carItem] ([idAccount], [idCar], [name], [category], [isOptional])
SELECT 
    @idAccount, 
    [idCar], 
    'Ar condicionado digital', 
    'Conforto', 
    0
FROM [functional].[car] 
WHERE [model] = 'Corolla XEi' AND [idAccount] = @idAccount
AND NOT EXISTS (SELECT 1 FROM [functional].[carItem] WHERE [idCar] = [functional].[car].[idCar]);

INSERT INTO [functional].[carItem] ([idAccount], [idCar], [name], [category], [isOptional])
SELECT 
    @idAccount, 
    [idCar], 
    'Airbags laterais', 
    'Segurança', 
    0
FROM [functional].[car] 
WHERE [model] = 'Corolla XEi' AND [idAccount] = @idAccount
AND NOT EXISTS (SELECT 1 FROM [functional].[carItem] WHERE [idCar] = [functional].[car].[idCar] AND [name] = 'Airbags laterais');

-- Insert History (Sample)
INSERT INTO [functional].[carHistory] ([idAccount], [idCar], [provenance], [ownerCount], [warrantyDetails], [technicalReportJson])
SELECT 
    @idAccount, 
    [idCar], 
    'Particular', 
    1, 
    'Garantia de fábrica até 2025', 
    '{"inspectionDate": "2023-12-01", "result": "Aprovado", "notes": "Veículo em perfeito estado"}'
FROM [functional].[car] 
WHERE [model] = 'Corolla XEi' AND [idAccount] = @idAccount
AND NOT EXISTS (SELECT 1 FROM [functional].[carHistory] WHERE [idCar] = [functional].[car].[idCar]);

-- Insert Sale Conditions (Sample)
INSERT INTO [functional].[carSaleCondition] ([idAccount], [idCar], [acceptsTrade], [saleObservations], [paymentMethodsJson], [financingConditionsJson], [requiredDocsJson], [docStatusJson])
SELECT 
    @idAccount, 
    [idCar], 
    1, 
    'Aceitamos carta de crédito',
    '["À vista", "Financiamento", "Consórcio"]',
    '{"minDownPayment": 20, "interestRate": 1.49, "maxInstallments": 60}',
    '[{"name": "CNH", "notes": "Válida"}, {"name": "Comprovante de Residência", "notes": "Atual"}]',
    '{"status": "Regular", "pending": [], "notes": "IPVA 2024 Pago"}'
FROM [functional].[car] 
WHERE [model] = 'Corolla XEi' AND [idAccount] = @idAccount
AND NOT EXISTS (SELECT 1 FROM [functional].[carSaleCondition] WHERE [idCar] = [functional].[car].[idCar]);
GO