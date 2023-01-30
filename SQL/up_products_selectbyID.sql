USE [tdpRestore]
GO

/****** Object:  StoredProcedure [dbo].[up_products_selectbyID]    Script Date: 1/24/2023 4:08:14 PM ******/
DROP PROCEDURE IF EXISTS [dbo].[up_products_selectbyID]
GO

/****** Object:  StoredProcedure [dbo].[up_products_selectbyID]    Script Date: 1/24/2023 4:08:14 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[up_products_selectbyID]
( @id int )
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT *
	from Products
	where ID = @id
END
GO

GRANT EXECUTE ON [dbo].[up_products_selectbyID] TO [piersall] AS [dbo]
GO


