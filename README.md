# priangshu17.github.io

Personal portfolio — a quiet, evidence-first experiment log. Built with
[Astro](https://astro.build/), plain CSS and a small set of design tokens.
Static output, deployed to GitHub Pages.

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to ./dist
npm run preview  # preview the production build
```

## How it's organised

| Path | What it is |
| --- | --- |
| `src/consts.ts` | Site name, tagline and **contact links** — edit these first. |
| `src/styles/tokens.css` | Palette, type and layout tokens (the whole visual system). |
| `src/content/projects/*.md` | One case study per file; all content lives in the frontmatter. |
| `src/content/config.ts` | The case-study content model (schema). |
| `src/pages/` | `index` (home), `work/`, `about`, `404`. |
| `src/components/` | Header, Footer, SectionHeading, ProjectRow, Figure, SetupTable, LimitationCallout. |
| `public/figures/` | Plot images, copied from the source repositories. |

## Editing a case study

Everything a project page shows comes from the frontmatter of its Markdown
file in `src/content/projects/`. Change the words there — the layout stays put.
Figures live under `public/figures/<project>/` and are referenced by path.

## Before publishing

- Set your real `email`, `linkedin` and optional `resume` in `src/consts.ts`.
- Re-read each case study for claims you're willing to stand behind.
- The `/notes` page is intentionally omitted until there's something to write.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds with Astro
and publishes to GitHub Pages. In the repo, set **Settings → Pages → Build and
deployment → Source = GitHub Actions**.
