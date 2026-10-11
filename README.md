# Vitor Souza — portfolio

A static portfolio for João Vitor de Souza, Senior TypeScript Engineer, based in Caldas da Rainha, Leiria, Portugal.

Built with semantic HTML, vanilla TypeScript, Tailwind CSS 3 and Vite. The site includes day/night themes, reduced-motion support, project vignettes, experience, engineering interests and contact links.

## Local development

Use Node.js 20 and pnpm 8, matching the GitHub Pages workflow.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

```sh
pnpm build
pnpm preview
```

## Design and assets

Read both `AGENTS.md` and `CLAUDE.md` before working in the repository. `design/HANDOFF.md` records the original canvas handoff and the accepted corrections made during implementation.

The fonts are self-hosted under `public/fonts/` with their Open Font Licenses. The sharing card source is `design/social-card.html`, rendered at 1200 × 630 to `public/og-image.png`. The favicon source is `public/favicon.svg`; PNG and ICO fallbacks support older browsers and home-screen shortcuts.

## Deployment

Merging into `main` triggers `.github/workflows/deploy.yml`, which builds `dist/` and deploys it to GitHub Pages.

Live site: [vitordesouza.github.io](https://vitordesouza.github.io/)
