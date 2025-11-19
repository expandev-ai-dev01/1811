/**
 * @summary
 * Retrieves detailed information about a specific vehicle including photos, items, history, and similar vehicles.
 * 
 * @procedure spCarGet
 * @schema functional
 * @type stored-procedure
 * 
 * @parameters
 * @param {INT} idAccount - Account identifier
 * @param {INT} idCar - Vehicle identifier
 * 
 * @output {details, 1, 1} Vehicle main details
 * @output {photos, n, n} Gallery photos
 * @output {items, n, n} Standard items and optionals
 * @output {history, 1, 1} Vehicle history summary
 * @output {revisions, n, n} Revision history
 * @output {claims, n, n} Claim history
 * @output {saleConditions, 1, 1} Sales conditions
 * @output {similar, n, n} Similar vehicles
 */
CREATE OR ALTER PROCEDURE [functional].[spCarGet]
    @idAccount INTEGER,
    @idCar INTEGER
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. Main Details
    SELECT 
        [c].[idCar],
        [c].[idAccount],
        [c].[model],
        [c].[brand],
        [c].[year],
        [c].[modelYear],
        [c].[price],
        [c].[mileage],
        [c].[transmission],
        [c].[fuel],
        [c].[color],
        [c].[doors],
        [c].[bodyType],
        [c].[motor],
        [c].[power],
        [c].[plateEnd],
        [c].[image],
        [c].[description],
        [c].[status],
        [c].[dateCreated]
    FROM [functional].[car] [c]
    WHERE [c].[idAccount] = @idAccount
      AND [c].[idCar] = @idCar
      AND [c].[deleted] = 0;

    -- 2. Photos
    SELECT 
        [cp].[idCarPhoto],
        [cp].[url],
        [cp].[isMain],
        [cp].[caption],
        [cp].[order]
    FROM [functional].[carPhoto] [cp]
    WHERE [cp].[idAccount] = @idAccount
      AND [cp].[idCar] = @idCar
    ORDER BY [cp].[isMain] DESC, [cp].[order] ASC;

    -- 3. Items
    SELECT 
        [ci].[idCarItem],
        [ci].[name],
        [ci].[category],
        [ci].[isOptional]
    FROM [functional].[carItem] [ci]
    WHERE [ci].[idAccount] = @idAccount
      AND [ci].[idCar] = @idCar
    ORDER BY [ci].[category], [ci].[name];

    -- 4. History Summary
    SELECT 
        [ch].[idCarHistory],
        [ch].[provenance],
        [ch].[ownerCount],
        [ch].[warrantyDetails],
        [ch].[technicalReportJson]
    FROM [functional].[carHistory] [ch]
    WHERE [ch].[idAccount] = @idAccount
      AND [ch].[idCar] = @idCar;

    -- 5. Revisions
    SELECT 
        [cr].[idCarRevision],
        [cr].[date],
        [cr].[mileage],
        [cr].[location]
    FROM [functional].[carRevision] [cr]
    WHERE [cr].[idAccount] = @idAccount
      AND [cr].[idCar] = @idCar
    ORDER BY [cr].[date] DESC;

    -- 6. Claims
    SELECT 
        [cc].[idCarClaim],
        [cc].[date],
        [cc].[type],
        [cc].[description]
    FROM [functional].[carClaim] [cc]
    WHERE [cc].[idAccount] = @idAccount
      AND [cc].[idCar] = @idCar
    ORDER BY [cc].[date] DESC;

    -- 7. Sale Conditions
    SELECT 
        [csc].[idCarSaleCondition],
        [csc].[acceptsTrade],
        [csc].[saleObservations],
        [csc].[paymentMethodsJson],
        [csc].[financingConditionsJson],
        [csc].[requiredDocsJson],
        [csc].[docStatusJson]
    FROM [functional].[carSaleCondition] [csc]
    WHERE [csc].[idAccount] = @idAccount
      AND [csc].[idCar] = @idCar;

    -- 8. Similar Vehicles
    -- Logic: Same brand OR same bodyType, Price +/- 20%, Exclude current car
    DECLARE @targetPrice NUMERIC(18, 2);
    DECLARE @targetBrand NVARCHAR(50);
    DECLARE @targetBody NVARCHAR(30);

    SELECT 
        @targetPrice = [price],
        @targetBrand = [brand],
        @targetBody = [bodyType]
    FROM [functional].[car]
    WHERE [idCar] = @idCar;

    SELECT TOP 6
        [c].[idCar],
        [c].[brand],
        [c].[model],
        [c].[year],
        [c].[price],
        [c].[image],
        [c].[status]
    FROM [functional].[car] [c]
    WHERE [c].[idAccount] = @idAccount
      AND [c].[idCar] <> @idCar
      AND [c].[deleted] = 0
      AND [c].[status] = 1 -- Only active
      AND (
          [c].[brand] = @targetBrand 
          OR 
          ([c].[bodyType] IS NOT NULL AND [c].[bodyType] = @targetBody)
      )
      AND [c].[price] BETWEEN (@targetPrice * 0.8) AND (@targetPrice * 1.2)
    ORDER BY ABS([c].[price] - @targetPrice) ASC;
END
GO