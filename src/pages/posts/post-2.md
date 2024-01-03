---
title: 'My Top 3 Databases/Backends of 2023'
subtitle: "I'm a sucker for hype, but these three met my expectations"
date: 2024-01-02
author: 'Thomas Lillo'
tags: ["supabase","sqlite","xata","learning in public","backends","sql","data"]
layout: ../../layouts/BlogLayout.astro
---

# My Top 3 Backends of 2023

One of the most pleasurable experiences is coming up with a new side project idea, creating requirements in your head for it once it’s visited by thousands of users a day, and then researching on twitter and hacker news which n^n combo of database and cloud tools you could use to accomplish your objectives.

Over the course of the year 2023, I setup, injected data into, and queried dozens of different databases and data services. This is a list of the three that left me most satisfied.

## 1. SQLite 

This database shines in scenarios where simplicity and efficiency are key. It's a lightweight, disk-based database that doesn't require a separate server process, making it perfect for embedded applications, small to medium-sized websites, and desktop applications. SQLite is renowned for its reliability, ease of setup, and minimal configuration, making it an ideal choice for projects where a full-scale database system might be overkill.

SQLite is so firkin fast, it’s embedded so there’s no networking bs and when you query it, you’re basically just making C based function calls to a file on disk. It’s also been part of Python since 2006!

SQLite is so damn good, the library of congress has said it’s a valid format for them to store data, and keeps a few files in its collection. https://www.loc.gov/preservation/digital/formats/fdd/fdd000461.shtml

On top of this, and the reason I fell in love, was my discovery of Datasette, an incredible tool for data analysis and exploration. I encourage everyone to check it out.

https://datasette.io/tutorials/data-analysis

## 2. Supabase

This is essentially PostgreSQL, but with a twist. Supabase a lot of capabilities on top like auth and a restful API, making it a great option for web and mobile applications requiring real-time data updates.

https://supabase.com/ 

It's particularly useful for collaborative applications, like online editors and chat applications, where immediate data sync is crucial. Additionally, it inherits the robustness and versatility of PostgreSQL. The fact that you have all of this stuff on top of Postgres, and can use it’s big network of documentation and plugins, is super awesome. I’ve recommended this as an open-source alternative to things like Firebase (look at me acting as a mouthpiece for Fireship.io) and the friend that actually took my advice for their startup has had a wonderful experience despite only having front-end experience. 

I’ve personally used it for a few of my LLM based experiments, using it as the vector store and “memory” of my little projects and experiments.
People love to use supabase, a cool example I saw recently here: https://euclideanai.substack.com/p/fastapi-supabase-template-for-llm

There is also a really good company behind it that does a good job with their documentation and the product is still new enough that Product Managers haven’t had a chance to overcrowd the web UI in their efforts to secure promotions. 

## 3. Xata

Following the backend-as-a-service trend, I’ve also been able to play around in a more limited way with Xata. The Xata team is full of heavy hitters and it shows, right down to the quality of life things like the auto-generation of sample data when you create a table, you can tell these people know what they’re doing. 

The official line is that Xata is best suited for serverless architectures and applications that require a scalable, cloud-native database. It offers real-time updates and is designed to handle complex queries with ease, making it an excellent choice for dynamic web applications, real-time analytics, and situations where high scalability and low maintenance are crucial.

But really all you need to know is that PostgresSQL and ElasticSearch had a baby and its serverless. 

https://xata.io/docs/concepts/how-it-works

This magnificent service is both affordable and easy to use. It is incredible how many bases are covered with this combo of tools. My only issue is that it’s a little tricky to insert large amounts of data into in a nice way, which made my big data project a little tricky, but I’m sure in the future as it is developed more this will change.

## Honorable Mention: Delta Lake on top of S3

Delta Lake on AWS deserves a special mention for its role in managing and processing large-scale data workloads. As an open-source storage layer that brings reliability to Data Lakes, Delta Lake stands out for its ability to handle massive quantities of data while providing ACID transactions, scalable metadata handling, and unifying streaming and batch data processing.

It’s not complicated to setup and make working with alternative data sources, or in my case, a ton of structured and semi-structured data without any clear purpose yet, delta lake provides the ideal platform.

Since its something people talk about a lot when working with the Databricks family tools, I’ve also used Snowflake a lot through my job and can safely throw my hat onto the Databricks side of the ring. When I was just a data scientist, I loved Snowflake, but now as a developer and with my growing technical knowledge, Databricks has grown with me in ways where Snowflake has held me back.

https://docs.delta.io/latest/delta-intro.html