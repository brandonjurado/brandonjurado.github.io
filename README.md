# Brandon Jurado Portfolio

My personal portfolio at [bjurado.com](https://bjurado.com), built with React, TypeScript, Vite, and Sass.

## Stack

- **React 19** and **TypeScript** for the interface and application code.
- **Vite 8**, **Rolldown**, and **Oxc** for the development server and production builds.
- **Sass** for styles and responsive layouts.
- **Motion** and **Lottie** for animations.
- **Bun** for dependency management and running scripts.
- **tsrs** for Rust-native type checking, with the official TypeScript 7 compiler available for comparison.
- **ESLint**, **Prettier**, and **Playwright** for code checks, formatting, and browser tests.

## Local Development

Use Bun 1.4.4 and Node.js 26.12.1 or a newer 26.x release. Run `nvm install` and `nvm use` to select the version pinned in `.nvmrc`.

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

| Command                        | Purpose                                                    |
| ------------------------------ | ---------------------------------------------------------- |
| `bun run dev`                  | Start the development server.                              |
| `bun run build`                | Create a production build.                                 |
| `bun run preview`              | Preview the built site locally.                            |
| `bun run lint`                 | Check code with ESLint.                                    |
| `bun run typecheck`            | Check TypeScript types with tsrs.                          |
| `bun run typecheck:typescript` | Cross-check types with the official TypeScript 7 compiler. |
| `bun run format`               | Format source files with Prettier.                         |
| `bun run check-format`         | Check formatting without changing files.                   |
| `bun run test`                 | Run static and browser tests.                              |

Before running tests, build the site and install Playwright's Chromium browser with `bunx playwright install chromium`.

`tsrs` is experimental and pinned to a specific release. The `typescript` dependency aliases Microsoft's TypeScript 6 compatibility package because TypeScript ESLint still requires its API; `@typescript/native` provides the latest TypeScript 7 compiler. See [Microsoft's side-by-side setup](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0).

The Lighthouse CI package still pins older tooling. `package.json` overrides Lighthouse, basic-ftp, tmp, and uuid to current patched releases; keep these overrides until Lighthouse CI updates its own dependency ranges. Run `bun audit` and `bun run lhci` after changing them. The pre-commit hook uses the project's installed Prettier rather than downloading a separate version.

## Customization

Edit `src/content/portfolio.ts` to update portfolio text, experience, education, and section visibility. UI components live in `src/components/`, shared styles in `src/styles/`, and static files in `public/`.
