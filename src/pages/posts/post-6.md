---
title: 'Save Your Brain Working with SQL'
subtitle: 'Applying Gestalt Principles to SQL'
date: 2026-01-09
author: 'Thomas Lillo'
tags: ["astro", "blogging", "learning in public", "sql"]
layout: ../../layouts/BlogLayout.astro
---

## What Are Gestalt Principles

Gestalt principles are rules of visual perception explaining how the human brain groups elements into unified wholes, seeing patterns and complete forms rather than just individual parts, with key laws including Similarity (grouping similar items), Proximity (grouping close items), Closure (seeing incomplete shapes as complete), Continuity (following smooth paths), and Figure/Ground (distinguishing foreground from background). Developed by German psychologists, these principles help designers create intuitive, organized, and user-friendly interfaces. 

### Key Gestalt Principles:

- **Similarity:** Elements that look alike (shape, color, size) are perceived as a group.
- **Proximity:** Objects close to each other are seen as related or a unit.
- **Closure:** The mind fills in gaps to perceive incomplete shapes as whole.
- **Continuity (Continuation):** The eye follows smooth paths and lines, preferring continuous figures over disjointed ones.
- **Figure/Ground:** We separate a visual field into a main object (figure) and its background (ground).
- **Symmetry & Order** (Prägnanz): We perceive complex images in the simplest, most stable way possible (the Law of Prägnanz).
- **Common Fate:** Elements moving in the same direction are perceived as a single group. 

## Apply Them To SQL

A lot of bugs come from queries people dont understand our brains are not that good are processing dense information. 

You can save your brain important power needed to actually reason about the SQL you are working with by making it visually accessible to your eye.

Gestalt principles can be applied to SQL by focusing on readability and structure, making complex queries more intuitive and easier to understand for developers. 

The goal is to reduce cognitive load by organizing the code in a way that aligns with natural human perception, similar to how these principles are used in data visualization and UI design. 
Here's how specific Gestalt principles can be applied to SQL coding style:

---

### Proximity

The principle of proximity states that elements close to each other are perceived as a single group. 
Grouping related clauses: Place related parts of the SQL query near each other. For example, the FROM and JOIN clauses should be together, and WHERE conditions should be clearly separated from SELECT columns.
Indentation and white space: Use consistent indentation and line breaks to visually group clauses and sub-queries, creating a clear visual hierarchy.

```sql
-- Good use of proximity
SELECT
    p.product_name,
    o.order_date
FROM
    Products p
JOIN
    Orders o ON p.product_id = o.product_id
WHERE
    o.order_date >= '2025-01-01';

-- Poor use of proximity (harder to read the relationships)
SELECT p.product_name, o.order_date FROM Products p JOIN Orders o ON p.product_id = o.product_id WHERE o.order_date >= '2025-01-01';
 ```

---

### Similarity

Elements with similar visual characteristics (color, shape, size) are perceived as related. 
- Consistent naming conventions: Use consistent prefixes or suffixes for related tables, columns, or aliases (e.g., tbl_, col_, _id).
- Formatting consistency: Maintain consistent capitalization for SQL keywords (SELECT, FROM, WHERE) to differentiate them from table and column names. This makes keywords visually similar across the entire codebase. 

---

### Continuity

The human eye tends to follow continuous lines and paths. 
- Vertical alignment: Align the keywords and column names vertically. This creates a natural flow that guides the eye through the query structure, rather than forcing the reader to jump around the screen.

```sql
-- Good vertical alignment for continuity
SELECT
    column_one,
    column_two,
    column_three
FROM
    my_table;
 ```

---

### Closure

The mind tends to perceive incomplete shapes as complete figures. 
- Concise code (minimizing noise): By using consistent formatting, you can sometimes omit unnecessary comments or visual clutter, as the structure itself implies completeness and organization. For instance, a well-structured query can often do without excessive section-header comments. 

---

### Connection

Elements that are connected by lines or links are perceived as a single group. 
- Visualizing JOINs (mentally or physically): For complex queries, you can mentally (or on a whiteboard) draw boxes for tables and lines for join conditions, creating a clear visual map of the data relationships. 

---

By applying these principles, you can transform complex, monolithic SQL queries into structured, readable, and maintainable code that reduces the cognitive load on anyone who needs to read or debug it.
