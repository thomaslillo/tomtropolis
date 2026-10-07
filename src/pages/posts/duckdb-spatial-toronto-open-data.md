---
title: 'Using DuckDB spatial with Toronto Open Data'
subtitle: 'A long draft on loading neighbourhood boundaries, handling CRS issues, and doing useful spatial analysis in Python'
date: 2026-09-25
author: 'Thomas Lillo'
tags: ["duckdb", "spatial", "python", "toronto", "open data", "gis"]
layout: ../../layouts/BlogLayout.astro
---

DuckDB has quietly become one of the nicest ways to do local data work, and the spatial extension makes it much more than “SQLite for analytics.” Once the spatial extension is loaded, DuckDB can read common geospatial formats, store geometries in tables, transform coordinate systems, compute areas and centroids, and do spatial predicates such as point-in-polygon tests and intersects checks.

This post is a deliberately long draft for a future shorter post. I am keeping in more explanation, more framing, and more code than I would normally publish so I can cut it down later.

The example here uses Toronto Open Data, specifically the **Neighbourhoods** dataset from the City of Toronto portal. That dataset is a good fit for a spatial DuckDB walkthrough because it is public, easy to understand, and already distributed in a format DuckDB can read through the spatial extension.

## Why DuckDB spatial is worth using

The two big ideas from the DuckDB spatial docs that matter immediately are:

1. The spatial extension adds a `GEOMETRY` type and a large set of spatial functions.
2. The extension integrates GDAL, so DuckDB can read many common vector geospatial formats as tables through `ST_Read()`.

That second point is the one that changes the workflow. Instead of first converting files in a GIS desktop tool and only then loading them into a database, you can often point DuckDB at the file directly and start querying.

A few practical details from the docs are worth keeping in your head from the beginning:

- `spatial` is **not autoloadable**, so you need to `INSTALL spatial;` and `LOAD spatial;` before using it.
- `ST_Read()` is backed by GDAL, and GDAL support is bundled with the extension.
- `ST_Drivers()` will show you which GDAL drivers are available.
- `ST_Area()` returns area in the units of the geometry’s coordinate reference system, which means area calculations are only meaningful if you are in an appropriate projected CRS.
- `ST_Transform()` has an `always_xy` option, which is important when you move between GeoJSON-style longitude/latitude coordinates and CRS definitions like EPSG:4326 that formally describe axis order differently.
- `ST_Read()` is convenient, but the docs note that GDAL is single-threaded, so file ingest is not where DuckDB’s parallel engine shines.

That is already enough to do useful work.

## The Toronto Open Data dataset used here

The example dataset is the Toronto Open Data **Neighbourhoods** package. On the portal, the resource we want is named **Neighbourhoods - 4326.geojson**.

The important detail in that resource name is `4326`. That means the geometries are distributed in **EPSG:4326**, which is a latitude/longitude geographic coordinate system. That is great for interchange and web mapping, but it is not the CRS you want to use directly for area measurements.

That gives us a natural story arc for the post:

1. discover the dataset from the portal metadata,
2. download the GeoJSON,
3. read it with DuckDB spatial,
4. do a few simple geometry queries,
5. then show why CRS handling matters before measuring anything.

## Python environment

You do not need much Python code to make this work.

```bash
pip install duckdb requests
```

Then start with a small Python script or notebook.

```python
from pathlib import Path
import requests
import duckdb
```

## Step 1: discover the file from Toronto Open Data metadata

Toronto’s open data portal exposes CKAN-style API endpoints. Rather than hardcoding a brittle download URL, I like starting from the dataset metadata and selecting the resource by name.

```python
CKAN_BASE = "https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action"
DATASET_ID = "neighbourhoods"
RESOURCE_NAME = "Neighbourhoods - 4326.geojson"

package = requests.get(
    f"{CKAN_BASE}/package_show",
    params={"id": DATASET_ID},
    timeout=60,
).json()["result"]

resources = package["resources"]
for resource in resources:
    print(resource["name"], "|", resource.get("format"), "|", resource["id"])

geojson_resource = next(
    resource for resource in resources if resource["name"] == RESOURCE_NAME
)

download_url = geojson_resource["url"]
print(download_url)
```

That pattern is worth using even if you end up shortening it later. It makes the example more resilient because the portal can change a resource URL while keeping the dataset slug and resource naming stable.

If you want a shorter draft later, you can collapse this to a single hardcoded URL once you have confirmed the exact resource URL you want to use in the published version.

## Step 2: download the GeoJSON locally

I prefer downloading the file first and then reading it from disk. DuckDB plus GDAL can often read remote resources directly, but saving a local copy gives you a reproducible artifact and makes debugging easier.

```python
data_dir = Path("data")
data_dir.mkdir(exist_ok=True)
geojson_path = data_dir / "toronto-neighbourhoods.geojson"

response = requests.get(download_url, timeout=120)
response.raise_for_status()
geojson_path.write_bytes(response.content)

print(f"Saved {geojson_path} ({geojson_path.stat().st_size:,} bytes)")
```

At this point you have a regular GeoJSON file on disk and can treat it like any other local data source.

## Step 3: install and load the DuckDB spatial extension

Now create a DuckDB database and enable the spatial extension.

```python
con = duckdb.connect("toronto-open-data.duckdb")
con.execute("INSTALL spatial;")
con.execute("LOAD spatial;")
```

The install step is only needed once per DuckDB environment, but it is fine to leave it in draft code because DuckDB will ignore the install if the extension is already installed.

If I were tightening this post for publication, I would probably add one sentence here making it explicit that the first `INSTALL spatial` needs network access to DuckDB’s extension repository.

## Step 4: see what spatial file formats DuckDB knows about

The docs mention `ST_Drivers()`, and it is a nice way to make the extension feel concrete.

```python
drivers = con.sql("""
    SELECT short_name, long_name, can_open, can_copy, help_url
    FROM ST_Drivers()
    WHERE can_open
    ORDER BY short_name
    LIMIT 20
""").df()

drivers.head()
```

You do not need this for the analysis itself, but it helps explain that DuckDB spatial is not just “geometry functions inside SQL.” It is also a file-ingestion layer through GDAL.

## Step 5: load the Toronto neighbourhoods into a table

The core ingest step is just `ST_Read()`.

```python
con.execute(f"""
    CREATE OR REPLACE TABLE neighbourhoods AS
    SELECT
        AREA_NAME AS neighbourhood,
        CAST(AREA_SHORT_CODE AS INTEGER) AS neighbourhood_id,
        geom
    FROM ST_Read('{geojson_path.as_posix()}')
""")
```

And now you can treat the file as a normal DuckDB table.

```python
con.sql("SELECT COUNT(*) AS row_count FROM neighbourhoods").show()
```

You can also preview a few rows.

```python
con.sql("""
    SELECT neighbourhood_id, neighbourhood, geom
    FROM neighbourhoods
    ORDER BY neighbourhood_id
    LIMIT 5
""").show()
```

That is the point in the workflow where DuckDB starts to feel extremely pleasant. The geometry column is in a regular analytical table. You can filter it, aggregate it, join it, and persist it without switching tools.

## Step 6: a first useful geometry query

A centroid query is a good first example because it demonstrates that the geometry is live and queryable.

```python
con.sql("""
    SELECT
        neighbourhood_id,
        neighbourhood,
        ST_Centroid(geom) AS centroid
    FROM neighbourhoods
    ORDER BY neighbourhood_id
    LIMIT 5
""").show()
```

This is not yet a polished mapping output, but it proves that spatial functions are operating on the geometry values inside DuckDB rather than on some text representation.

You could also generate a lightweight lookup table of neighbourhood centroids.

```python
con.execute("""
    CREATE OR REPLACE TABLE neighbourhood_centroids AS
    SELECT
        neighbourhood_id,
        neighbourhood,
        ST_Centroid(geom) AS centroid
    FROM neighbourhoods
""")
```

That is useful later if you want label points for a map or representative points for quick joins.

## Step 7: why CRS handling matters before calculating area

This is the part of the post I most want to keep because it is exactly where spatial examples often become misleading.

The neighbourhood GeoJSON is in EPSG:4326. In plain terms, that means the coordinates are latitude/longitude values in degrees. `ST_Area()` returns area in the units of the geometry’s CRS. If the CRS is geographic, those units are not square metres in the way most readers expect.

So this is **not** the query to copy blindly:

```python
con.sql("""
    SELECT
        neighbourhood,
        ST_Area(geom) AS wrong_area_for_most_purposes
    FROM neighbourhoods
    ORDER BY wrong_area_for_most_purposes DESC
    LIMIT 10
""").show()
```

That query is not “wrong” in the sense of a syntax error. It is wrong in the much more interesting sense that it produces numbers whose units are not what most people assume.

The fix is to transform the geometry into a projected CRS before measuring area.

```python
con.sql("""
    SELECT
        neighbourhood,
        ROUND(
            ST_Area(
                ST_Transform(geom, 'EPSG:4326', 'EPSG:3978', always_xy := true)
            ) / 1e6,
            2
        ) AS area_sq_km
    FROM neighbourhoods
    ORDER BY area_sq_km DESC
    LIMIT 10
""").show()
```

There are two important teaching moments in that one query.

### First: `ST_Transform()` is not optional

If you want metres, square metres, or kilometre-scale distances, you usually need a projected CRS. The DuckDB docs are very clear that `ST_Transform()` exists to move geometries between coordinate systems, and the area docs are equally clear that area is returned in the units of the geometry.

That combination explains most “my area values look weird” problems.

### Second: `always_xy := true` is worth explaining

DuckDB’s spatial docs call out axis order explicitly. GeoJSON coordinates are typically treated as **longitude, latitude**. EPSG:4326 is often discussed informally the same way, but CRS definitions can encode axis order differently.

Using `always_xy := true` in this kind of GeoJSON-to-projected-CRS workflow makes the intent obvious: interpret the coordinates as x/y, meaning longitude/latitude.

That one flag is exactly the sort of small thing that saves a lot of head scratching.

## Step 8: point-in-polygon with a Toronto landmark

A good spatial tutorial should include at least one query that feels recognizably geographic instead of purely tabular.

So let’s ask which neighbourhood contains the CN Tower.

```python
cn_tower_lon = -79.3871
cn_tower_lat = 43.6426

con.sql(f"""
    SELECT neighbourhood_id, neighbourhood
    FROM neighbourhoods
    WHERE ST_Intersects(
        geom,
        ST_Point({cn_tower_lon}, {cn_tower_lat})
    )
""").show()
```

If I shorten the post later, I may keep this example even if I cut others, because it gives readers an immediate “oh, right, this is real spatial SQL” moment.

You can generalize that pattern for any Toronto point dataset that arrives as latitude/longitude coordinates in a CSV.

For example, imagine a CSV with columns `name`, `longitude`, and `latitude`.

```python
con.execute("""
    CREATE OR REPLACE TABLE places (
        name VARCHAR,
        longitude DOUBLE,
        latitude DOUBLE
    )
""")

con.execute("""
    INSERT INTO places VALUES
        ('CN Tower', -79.3871, 43.6426),
        ('Toronto City Hall', -79.3841, 43.6535),
        ('Aga Khan Museum', -79.3325, 43.7256)
""")
```

Now assign each point to a neighbourhood.

```python
con.sql("""
    SELECT
        p.name,
        n.neighbourhood
    FROM places p
    JOIN neighbourhoods n
      ON ST_Intersects(n.geom, ST_Point(p.longitude, p.latitude))
    ORDER BY p.name
""").show()
```

This is a nice bridge between “GIS data” and “normal analytics data.” Many practical uses of spatial SQL are really just this: take ordinary rows with coordinates and enrich them by joining against boundaries.

## Step 9: create a smaller derived table for analysis

You often do not want to keep dragging full polygons through every query. A trimmed analytical table is often more ergonomic.

```python
con.execute("""
    CREATE OR REPLACE TABLE neighbourhood_metrics AS
    SELECT
        neighbourhood_id,
        neighbourhood,
        ST_Centroid(geom) AS centroid,
        ST_Area(
            ST_Transform(geom, 'EPSG:4326', 'EPSG:3978', always_xy := true)
        ) AS area_sq_m,
        geom
    FROM neighbourhoods
""")
```

Then your exploration queries get simpler.

```python
con.sql("""
    SELECT
        neighbourhood,
        ROUND(area_sq_m / 1e6, 2) AS area_sq_km
    FROM neighbourhood_metrics
    ORDER BY area_sq_km DESC
    LIMIT 10
""").show()
```

A small detail I like here is that you can persist both the original geometry and the derived metrics together. DuckDB makes it very easy to move between “table thinking” and “spatial thinking” in the same object.

## Step 10: export a result back out to GeoJSON

The GDAL integration goes both directions. That is another detail from the docs that deserves attention.

Suppose you create a table of the ten largest neighbourhoods by area and want to export it for use elsewhere.

```python
con.execute("""
    CREATE OR REPLACE TABLE largest_neighbourhoods AS
    SELECT *
    FROM neighbourhood_metrics
    ORDER BY area_sq_m DESC
    LIMIT 10
""")
```

Now write it to GeoJSON.

```python
con.execute("""
    COPY largest_neighbourhoods
    TO 'data/largest-neighbourhoods.geojson'
    WITH (
        FORMAT GDAL,
        DRIVER 'GeoJSON',
        SRS 'EPSG:4326'
    )
""")
```

One subtle point from the docs is that setting `SRS` in GDAL `COPY` writes CRS metadata; it does **not** reproject the geometry for you. If your table geometry is stored in a projected CRS, transform it explicitly before export if you want GeoJSON coordinates in longitude/latitude.

That is another easy place for a future shorter version of the post to teach something concrete.

## A more production-shaped version of the same workflow

If I were turning this into something closer to a reusable script rather than a post draft, I would wrap the logic in small functions:

- `get_resource_url(dataset_id, resource_name)`
- `download_file(url, path)`
- `load_neighbourhoods(con, path)`
- `build_metrics(con)`

That would make the example cleaner without changing the substance.

Something like this is a reasonable long-form draft:

```python
from pathlib import Path
import requests
import duckdb

CKAN_BASE = "https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action"
DB_PATH = "toronto-open-data.duckdb"
DATA_DIR = Path("data")
DATA_DIR.mkdir(exist_ok=True)


def get_resource_url(dataset_id: str, resource_name: str) -> str:
    package = requests.get(
        f"{CKAN_BASE}/package_show",
        params={"id": dataset_id},
        timeout=60,
    ).json()["result"]
    resource = next(r for r in package["resources"] if r["name"] == resource_name)
    return resource["url"]


def download_file(url: str, path: Path) -> Path:
    response = requests.get(url, timeout=120)
    response.raise_for_status()
    path.write_bytes(response.content)
    return path


def main() -> None:
    geojson_url = get_resource_url(
        "neighbourhoods",
        "Neighbourhoods - 4326.geojson",
    )
    geojson_path = download_file(
        geojson_url,
        DATA_DIR / "toronto-neighbourhoods.geojson",
    )

    con = duckdb.connect(DB_PATH)
    con.execute("INSTALL spatial;")
    con.execute("LOAD spatial;")

    con.execute(f"""
        CREATE OR REPLACE TABLE neighbourhoods AS
        SELECT
            AREA_NAME AS neighbourhood,
            CAST(AREA_SHORT_CODE AS INTEGER) AS neighbourhood_id,
            geom
        FROM ST_Read('{geojson_path.as_posix()}')
    """)

    con.execute("""
        CREATE OR REPLACE TABLE neighbourhood_metrics AS
        SELECT
            neighbourhood_id,
            neighbourhood,
            ST_Centroid(geom) AS centroid,
            ST_Area(
                ST_Transform(geom, 'EPSG:4326', 'EPSG:3978', always_xy := true)
            ) AS area_sq_m,
            geom
        FROM neighbourhoods
    """)

    con.sql("""
        SELECT neighbourhood, ROUND(area_sq_m / 1e6, 2) AS area_sq_km
        FROM neighbourhood_metrics
        ORDER BY area_sq_m DESC
        LIMIT 10
    """).show()


if __name__ == "__main__":
    main()
```

That is probably more code than the final blog post needs, but this draft is supposed to err on the side of too much.

## Things I would probably cut in the final edit

This section is mostly for me while drafting, but I might leave some version of it because it shows what matters.

I would likely cut or compress:

- the long explanation of the CKAN metadata lookup,
- the `ST_Drivers()` detour,
- the larger “production-shaped” script,
- some of the repeated commentary about CRS and axis order.

I would likely keep:

- `INSTALL spatial; LOAD spatial;`,
- `ST_Read()` against the Toronto neighbourhood GeoJSON,
- one centroid example,
- one area example using `ST_Transform(... always_xy := true)`,
- one point-in-polygon example,
- one short note about exporting with GDAL `COPY`.

That would get the post down to a much tighter “here is why this is cool and how to use it” shape.

## Pitfalls and notes worth mentioning

These are the small details that make a spatial tutorial feel honest instead of magical.

### 1. The first extension install needs network access

DuckDB can install extensions cleanly, but the first `INSTALL spatial` still needs access to the DuckDB extension repository.

### 2. Area and distance calculations depend on CRS

This is probably the most important warning in the whole piece. Readers coming from ordinary tabular work often assume numbers are numbers. In spatial work, units are part of the question.

### 3. GeoJSON convenience can hide projection complexity

GeoJSON is easy to work with, which is good, but it also makes it easy to forget that longitude/latitude storage is not the same thing as a good analysis CRS.

### 4. `ST_Read()` is a file-ingest tool, not your whole workflow

It is excellent for getting data in. After that, you should think like a DuckDB user again: create tables, persist derived columns, and make later queries simpler.

### 5. Spatial SQL becomes most useful when it enriches ordinary data

Boundary files are fine for demos, but the really interesting use case is usually joining point data, addresses, incidents, permits, bike stations, or other everyday tables against polygons.

That is the direction I would go in a follow-up post.

## A tighter version of the final message

If I had to summarize the whole post in a few lines, it would be this:

- DuckDB spatial turns geospatial files into queryable tables with very little ceremony.
- Toronto Open Data gives you a clean public example to work with.
- `ST_Read()` gets the geometry into DuckDB quickly.
- `ST_Centroid()`, `ST_Intersects()`, and `ST_Area()` cover a surprising amount of useful ground.
- `ST_Transform()` and CRS awareness are the difference between a neat demo and a trustworthy result.

That is what makes this a genuinely nice stack: public data, a local analytical database, and just enough spatial capability to do real work without dragging in a huge GIS pipeline.
