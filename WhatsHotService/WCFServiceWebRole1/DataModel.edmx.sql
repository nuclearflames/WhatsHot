
-- --------------------------------------------------
-- Entity Designer DDL Script for SQL Server 2005, 2008, 2012 and Azure
-- --------------------------------------------------
-- Date Created: 02/27/2014 19:59:01
-- Generated from EDMX file: C:\Users\Adam\Documents\GitHub\WhatsHot\WhatsHotService\WCFServiceWebRole1\DataModel.edmx
-- --------------------------------------------------

SET QUOTED_IDENTIFIER OFF;
GO
USE [whatshot];
GO
IF SCHEMA_ID(N'dbo') IS NULL EXECUTE(N'CREATE SCHEMA [dbo]');
GO

-- --------------------------------------------------
-- Dropping existing FOREIGN KEY constraints
-- --------------------------------------------------


-- --------------------------------------------------
-- Dropping existing tables
-- --------------------------------------------------


-- --------------------------------------------------
-- Creating all tables
-- --------------------------------------------------

-- Creating table 'Users'
CREATE TABLE [dbo].[Users] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [UserName] nvarchar(max)  NOT NULL,
    [HashedPassword] nvarchar(max)  NOT NULL,
    [DefaultLocation] nvarchar(max)  NOT NULL
);
GO

-- Creating table 'Tokens1'
CREATE TABLE [dbo].[Tokens1] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [TokenString] nvarchar(max)  NOT NULL,
    [TimeAdded] datetime  NOT NULL,
    [User_Id] int  NOT NULL
);
GO

-- Creating table 'Locations'
CREATE TABLE [dbo].[Locations] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Lat] nvarchar(max)  NOT NULL,
    [Long] nvarchar(max)  NOT NULL,
    [TimeAdded] datetime  NOT NULL,
    [User_Id] int  NOT NULL
);
GO

-- --------------------------------------------------
-- Creating all PRIMARY KEY constraints
-- --------------------------------------------------

-- Creating primary key on [Id] in table 'Users'
ALTER TABLE [dbo].[Users]
ADD CONSTRAINT [PK_Users]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Tokens1'
ALTER TABLE [dbo].[Tokens1]
ADD CONSTRAINT [PK_Tokens1]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Locations'
ALTER TABLE [dbo].[Locations]
ADD CONSTRAINT [PK_Locations]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- --------------------------------------------------
-- Creating all FOREIGN KEY constraints
-- --------------------------------------------------

-- Creating foreign key on [User_Id] in table 'Tokens1'
ALTER TABLE [dbo].[Tokens1]
ADD CONSTRAINT [FK_UserTokens]
    FOREIGN KEY ([User_Id])
    REFERENCES [dbo].[Users]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Creating non-clustered index for FOREIGN KEY 'FK_UserTokens'
CREATE INDEX [IX_FK_UserTokens]
ON [dbo].[Tokens1]
    ([User_Id]);
GO

-- Creating foreign key on [User_Id] in table 'Locations'
ALTER TABLE [dbo].[Locations]
ADD CONSTRAINT [FK_UserLocation]
    FOREIGN KEY ([User_Id])
    REFERENCES [dbo].[Users]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Creating non-clustered index for FOREIGN KEY 'FK_UserLocation'
CREATE INDEX [IX_FK_UserLocation]
ON [dbo].[Locations]
    ([User_Id]);
GO

-- --------------------------------------------------
-- Script has ended
-- --------------------------------------------------