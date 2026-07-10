# Tomtropolis - My Blazingly Fast Personal Website

Personal website, built with Astro and deployed to Vercel.
The homepage includes a D&D 5e monster search powered by the
[D&D 5e API](https://www.dnd5eapi.co). Articles are stored in the typed Astro
content collection at `src/content/blog`.

## Project structure

```text
/
├── public/              # Static assets
├── src/
│   ├── content/blog/    # Markdown blog posts
│   ├── components/      # Shared navigation, metadata, and footer
│   ├── layouts/         # Primary and blog layouts
│   └── pages/           # Route components
└── package.json
```

## Commands

Run commands from the repository root:

| Command | Action |
| :-- | :-- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the local development server |
| `npm run build` | Build the production site |
| `npm run preview` | Preview the production build locally |

See the [Astro documentation](https://docs.astro.build) for framework details.
