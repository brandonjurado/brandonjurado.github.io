# Brandon Jurado Portfolio

Personal portfolio site for [bjurado.com](https://bjurado.com), built with React and Vite and now configured to run with Bun by default.

## Stack

- Bun for package management and task execution
- Vite for local development and production builds
- React 19 for the UI
- Sass for component styling

## Quick Start

```bash
git clone https://github.com/brandonjurado/brandonjurado.github.io.git
cd brandonjurado.github.io
bun install
bun run dev
```

The app runs at the Vite default local URL shown in the terminal.

## Available Commands

```bash
bun run dev
bun run build
bun run preview
bun run format
bun run check-format
bun run test
```

## GitHub Profile Sync

If you want the site to fetch live GitHub profile data during development or production builds:

```bash
cp env.example .env
```

Set the following values in `.env`:

```env
GITHUB_TOKEN="your-token"
GITHUB_USERNAME="your-username"
USE_GITHUB_DATA="true"
```

If `USE_GITHUB_DATA` is not set to `"true"`, the fetch step is skipped and the site falls back to the static contact section.

## Performance Notes

This repo is tuned to keep first paint responsive without changing the visual design:

- Bun is the primary runtime for installs and scripts.
- GitHub profile generation runs through a native `fetch`-based script.
- Below-the-fold sections are revealed progressively after the hero loads.
- Splash animation only runs once per session and respects reduced-motion preferences.
- Lottie animations are lazy loaded and use a lighter player build.
- Experience card banner colors are static, so the app no longer computes image colors in the browser.

## Deployment

### GitHub Pages

The included GitHub Actions workflow installs dependencies with Bun, builds the site, and deploys `dist/` to `gh-pages`.

Required repository secrets and env:

- `GITHUB_TOKEN`
- `GITHUB_USERNAME`
- `USE_GITHUB_DATA=true` if you want profile data generated during deploy

### Docker

```bash
docker build -t portfolio:latest .
docker run -p 3000:3000 portfolio:latest
```

## Customization

Portfolio content lives in [`src/portfolio.js`](/Users/mac/Development/Personal/web-portfolio/brandonjurado.github.io/src/portfolio.js). Update that file to change copy, links, employers, achievements, and section visibility.
