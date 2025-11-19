/**
 * @summary
 * Retrieves a paginated list of cars based on filters and sorting criteria.
 * 
 * @procedure spCarList
 * @schema functional
 * @type stored-procedure
 * 
 * @parameters
 * @param {INT} idAccount - Account identifier
 * @param {NVARCHAR(50)} brand - Filter by brand
 * @param {NVARCHAR(50)} model - Filter by model
 * @param {INT} yearMin - Minimum year
 * @param {INT} yearMax - Maximum year
 * @param {NUMERIC(18,2)} priceMin - Minimum price
 * @param {NUMERIC(18,2)} priceMax - Maximum price
 * @param {NVARCHAR(MAX)} transmission - Comma-separated list of transmission types
 * @param {NVARCHAR(50)} sortOrder - Sorting criteria
 * @param {INT} page - Page number
 * @param {INT} pageSize - Items per page
 * 
 * @output {data, n, n} List of cars
 * @output {total, 1, 1} Total count of records
 */
CREATE OR ALTER PROCEDURE [functional].[spCarList]
    @idAccount INTEGER,
    @brand NVARCHAR(50) = NULL,
    @model NVARCHAR(50) = NULL,
    @yearMin INTEGER = NULL,
    @yearMax INTEGER = NULL,
    @priceMin NUMERIC(18, 2) = NULL,
    @priceMax NUMERIC(18, 2) = NULL,
    @transmission NVARCHAR(MAX) = NULL,
    @sortOrder NVARCHAR(50) = 'Relevância',
    @page INTEGER = 1,
    @pageSize INTEGER = 12
AS
BEGIN
    SET NOCOUNT ON;

    -- Calculate offset
    DECLARE @offset INTEGER = (@page - 1) * @pageSize;

    -- Parse transmission list if provided (simple split for demo, ideally use a split function)
    -- For simplicity in this generated code, we assume exact match or LIKE if single value,
    -- or use STRING_SPLIT if available (SQL Server 2016+).
    
    -- Main Query CTE
    ;WITH FilteredCars AS (
        SELECT 
            [c].[idCar],
            [c].[idAccount],
            [c].[model],
            [c].[brand],
            [c].[year],
            [c].[price],
            [c].[mileage],
            [c].[transmission],
            [c].[image],
            [c].[description],
            [c].[status],
            [c].[dateCreated]
        FROM [functional].[car] [c]
        WHERE [c].[idAccount] = @idAccount
          AND [c].[deleted] = 0
          AND [c].[status] = 1 -- Only active cars
          AND (@brand IS NULL OR [c].[brand] = @brand)
          AND (@model IS NULL OR [c].[model] LIKE '%' + @model + '%')
          AND (@yearMin IS NULL OR [c].[year] >= @yearMin)
          AND (@yearMax IS NULL OR [c].[year] <= @yearMax)
          AND (@priceMin IS NULL OR [c].[price] >= @priceMin)
          AND (@priceMax IS NULL OR [c].[price] <= @priceMax)
          AND (@transmission IS NULL OR [c].[transmission] IN (SELECT value FROM STRING_SPLIT(@transmission, ',')))
    ),
    OrderedCars AS (
        SELECT 
            *,
            ROW_NUMBER() OVER (
                ORDER BY 
                    CASE WHEN @sortOrder = 'Preço (menor para maior)' THEN [price] END ASC,
                    CASE WHEN @sortOrder = 'Preço (maior para menor)' THEN [price] END DESC,
                    CASE WHEN @sortOrder = 'Ano (mais recente)' THEN [year] END DESC,
                    CASE WHEN @sortOrder = 'Ano (mais antigo)' THEN [year] END ASC,
                    CASE WHEN @sortOrder = 'Modelo (A-Z)' THEN [model] END ASC,
                    CASE WHEN @sortOrder = 'Modelo (Z-A)' THEN [model] END DESC,
                    -- Default 'Relevância' (Newest created first as proxy for relevance)
                    CASE WHEN @sortOrder = 'Relevância' OR @sortOrder IS NULL THEN [dateCreated] END DESC
            ) AS [RowNum],
            COUNT(*) OVER() AS [TotalCount]
        FROM FilteredCars
    )
    
    -- Result Set 1: Data
    SELECT 
        [idCar],
        [idAccount],
        [model],
        [brand],
        [year],
        [price],
        [mileage],
        [transmission],
        [image],
        [description],
        [status],
        [dateCreated]
    FROM OrderedCars
    WHERE [RowNum] > @offset AND [RowNum] <= (@offset + @pageSize)
    ORDER BY [RowNum];

    -- Result Set 2: Total
    SELECT TOP 1 [TotalCount] AS [total]
    FROM OrderedCars;
    
    -- If no records found, return total 0
    IF @@ROWCOUNT = 0
    BEGIN
        SELECT 0 AS [total];
    END
END
GO
