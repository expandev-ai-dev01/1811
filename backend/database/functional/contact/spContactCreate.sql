/**
 * @summary
 * Creates a new contact request, generates a protocol number, and returns the created record.
 * 
 * @procedure spContactCreate
 * @schema functional
 * @type stored-procedure
 * 
 * @parameters
 * @param {INT} idAccount - Account identifier
 * @param {INT} idCar - Vehicle identifier
 * @param {NVARCHAR} name - User full name
 * @param {NVARCHAR} email - User email
 * @param {NVARCHAR} phone - User phone
 * @param {NVARCHAR} contactPreference - Preferred contact method
 * @param {NVARCHAR} bestTime - Best time for contact
 * @param {NVARCHAR} subject - Subject of the message
 * @param {NVARCHAR} message - Message content
 * @param {BIT} financing - Interest in financing
 * @param {BIT} newsletter - Newsletter subscription
 * @param {BIT} termsAccepted - Privacy terms acceptance
 * @param {NVARCHAR} ipAddress - User IP address
 * 
 * @output {contact, 1, 1} Created contact record with protocol
 * @output {car, 1, 1} Associated vehicle details for email notification
 */
CREATE OR ALTER PROCEDURE [functional].[spContactCreate]
    @idAccount INTEGER,
    @idCar INTEGER,
    @name NVARCHAR(100),
    @email NVARCHAR(100),
    @phone NVARCHAR(20),
    @contactPreference NVARCHAR(20),
    @bestTime NVARCHAR(20) = NULL,
    @subject NVARCHAR(50),
    @message NVARCHAR(1000),
    @financing BIT,
    @newsletter BIT,
    @termsAccepted BIT,
    @ipAddress NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    -- Validation
    IF NOT EXISTS (SELECT 1 FROM [functional].[car] WHERE [idCar] = @idCar AND [idAccount] = @idAccount)
    BEGIN
        ;THROW 51000, 'VehicleNotFound', 1;
    END

    DECLARE @newId INTEGER;
    DECLARE @protocol NVARCHAR(20);
    DECLARE @currentDate DATETIME2 = GETUTCDATE();

    BEGIN TRY
        BEGIN TRAN;

            -- Insert Contact
            INSERT INTO [functional].[contact] (
                [idAccount], [idCar], [name], [email], [phone], 
                [contactPreference], [bestTime], [subject], [message], 
                [financing], [newsletter], [termsAccepted], [ipAddress], 
                [status], [dateCreated], [dateModified]
            )
            VALUES (
                @idAccount, @idCar, @name, @email, @phone,
                @contactPreference, @bestTime, @subject, @message,
                @financing, @newsletter, @termsAccepted, @ipAddress,
                'Novo', @currentDate, @currentDate
            );

            SET @newId = SCOPE_IDENTITY();

            -- Generate Protocol: YYYYMMDD + 5-digit ID (e.g., 2023051200001)
            -- Note: Using ID for sequence ensures uniqueness but resets aren't daily. 
            -- For this scope, this is sufficient and robust.
            SET @protocol = FORMAT(@currentDate, 'yyyyMMdd') + RIGHT('00000' + CAST(@newId AS NVARCHAR(20)), 5);

            UPDATE [functional].[contact]
            SET [protocol] = @protocol
            WHERE [idContact] = @newId;

        COMMIT TRAN;

        -- Output 1: Contact Details
        SELECT 
            [idContact],
            [idAccount],
            [idCar],
            [name],
            [email],
            [protocol],
            [status],
            [dateCreated]
        FROM [functional].[contact]
        WHERE [idContact] = @newId;

        -- Output 2: Car Details (for email context)
        SELECT 
            [idCar],
            [brand],
            [model],
            [year],
            [price],
            [image]
        FROM [functional].[car]
        WHERE [idCar] = @idCar;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRAN;
        THROW;
    END CATCH
END
GO