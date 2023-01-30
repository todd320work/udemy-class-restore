USE [tdpRestore]
GO

/****** Object:  StoredProcedure [dbo].[up_products_select]    Script Date: 1/24/2023 3:23:53 PM ******/
DROP PROCEDURE IF EXISTS [dbo].[up_products_select]
GO

/****** Object:  StoredProcedure [dbo].[up_products_select]    Script Date: 1/24/2023 3:23:53 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[up_products_select] 
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT  *
	from Products
END
GO

GRANT EXECUTE ON [dbo].[up_products_select] TO [piersall] AS [dbo]
GO


