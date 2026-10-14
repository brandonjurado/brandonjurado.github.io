# Brandon Jurado Portfolio

My personal portfolio at [bjurado.com](https://bjurado.com), built with React, TypeScript, Vite, and Sass.

## Stack

- **React 19** and **TypeScript** for the interface and application code.
- **Vite** for the development server and production builds.
- **Sass** for styles and responsive layouts.
- **Motion** and **Lottie** for animations.
- **Bun** for dependency management and running scripts.
- **ESLint**, **Prettier**, and **Playwright** for code checks, formatting, and browser tests.

## Local Development

Use Bun 1.3.6 and Node.js 22.12 or newer.

```bash
git clone https://github.com/brandonjurado/brandonjurado.github.io.git
cd brandonjurado.github.io
bun install
bun run dev
```

Open the local URL printed in the terminal. Changes to the source update the page as you work.

## Build

```bash
bun run build
bun run preview
```

The build writes to `dist/`. The preview server runs at `http://127.0.0.1:4173` by default.

## Common Commands

| Command | Purpose |
| --- | --- |
| `bun run dev` | Start the development server. |
| `bun run build` | Create a production build. |
| `bun run preview` | Preview the built site locally. |
| `bun run lint` | Check code with ESLint. |
| `bun run typecheck` | Check TypeScript types. |
| `bun run format` | Format source files with Prettier. |
| `bun run check-format` | Check formatting without changing files. |
| `bun run test` | Run static and browser tests. |

Before running tests, build the site and install Playwright's Chromium browser with `bunx playwright install chromium`.

## Customization

Edit `src/content/portfolio.ts` to update portfolio text, experience, education, and section visibility. UI components live in `src/components/`, shared styles in `src/styles/`, and static files in `public/`.
