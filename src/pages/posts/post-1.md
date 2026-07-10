---
title: 'Spatial SQL Basics in SQL Server'
subtitle: 'the very very basics, to build off of in future posts'
date: 2023-12-20
author: 'Thomas Lillo'
tags: ["astro", "blogging", "learning in public", "spatial", "sql", "data", "gis"]
layout: ../../layouts/BlogLayout.astro
---

In my role as a backend developer, where I do a lot of database and data engineering work, I've found myself teaching other developers about spatial sql. I thought this would make a good first blog post. Introducing people to the basics of working with spatial data in SQL server. In later posts we'll build upon this information to do more advanced analytics and how to use these concepts to build spatail analytics products and reports that can be deliverd via web API.

## Introduction to Spatial Data in SQL Server

Spatial data is used to represent the physical location and shape of objects. SQL Server supports two types of spatial data: `geometry`, for data in a flat coordinate system (like a map), and `geography`, for data on a round surface (like the Earth).

## Setting Up Your Environment

Before diving into Spatial SQL, ensure your SQL Server instance is set up to handle spatial data. This typically involves installing SQL Server with the Full-Text and Spatial Indexes feature.

## Working with Spatial Data Types

SQL Server uses two primary spatial data types:

- **Geometry**: Use this for planar, or “flat-earth,” data. Common uses include mapping out floor plans or property boundaries.
- **Geography**: This type is for geodetic, or “round-earth,” data. It's useful for global locations, like cities or natural features.

### Example 1: Creating a Spatial Table

```sql
CREATE TABLE SpatialTable
(
    Id int PRIMARY KEY,
    GeomData geometry,
    GeoData geography
);

```

### Example 2: Inserting Spatial Data

Insert data using WKT (Well-Known Text) format:

```sql
INSERT INTO SpatialTable (Id, GeomData, GeoData)
VALUES (1, geometry::STGeomFromText('POINT(0 0)', 0), geography::Point(0, 0, 4326));

```

## Spatial Functions

Now that we have some data in SQL Server, we can start working with it using built in spatial functions. These functions allow us to analyze and manipulate spatial data.

### Example 3: Calculating Distance

Find the distance between two points:

```sql
DECLARE @g geography;
DECLARE @h geography;
SET @g = geography::Point(47.65100, -122.34900, 4326);
SET @h = geography::Point(47.65100, -122.34800, 4326);
SELECT @g.STDistance(@h);

```
### Example 4: Checking Spatial Relationships

Determine if one geography intersects another:

```sql
DECLARE @g geography;
DECLARE @h geography;
SET @g = geography::Point(47.65100, -122.34900, 4326);
SET @h = geography::STGeomFromText('POLYGON((-122.358 47.653, -122.348 47.653, -122.348 47.640, -122.358 47.640, -122.358 47.653))', 4326);
SELECT @g.STIntersects(@h);

```

## Spatial Indexing

Spatial indexing improves the performance of spatial queries. Use 'CREATE SPATIAL INDEX' to add an index to your spatial columns.

### Example 5: Creating a Spatial Index

```sql
CREATE SPATIAL INDEX SI_SpatialTable_GeomData
ON SpatialTable(GeomData);

```

There is a whole world within spatial indexing, which I will discuss in other posts.