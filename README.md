# Vitor Souza — portfolio

A static portfolio for João Vitor de Souza, Senior TypeScript Engineer, based in Caldas da Rainha, Leiria, Portugal.

Built with semantic HTML, vanilla TypeScript, Tailwind CSS 3 and Vite. The site includes day/night themes, reduced-motion support, project vignettes, experience, engineering interests and contact links.

## Local development

Use Node.js 20.19+ or 22.12+, and pnpm 8. The package manager is pinned in `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

```sh
pnpm check
pnpm format:check
pnpm build
pnpm preview
```

`build` runs the strict TypeScript check before bundling. Use `pnpm format` to apply the shared formatting.
Pull requests run the formatting and build checks in GitHub Actions with a frozen install.

## Source

- `index.html` holds the page content and semantic structure. Editing content does not require JavaScript.
- `src/index.css` holds theme tokens, shared component styles, responsive layout and motion.
- `src/index.ts` progressively adds theme switching, the Lisbon clock, scroll reveals, scribbles, pointer effects and email copying. Each behavior has one initialization function; the cursor, portrait and Boomich reveal share one animation loop.
- `public/` contains files that need stable public URLs: fonts, sharing assets and the CV.

## Design and assets

Read both `AGENTS.md` and `CLAUDE.md` before working in the repository. `design/HANDOFF.md` records the original canvas handoff and accepted corrections; `design/addendum/ADDENDUM.md` specifies the Status V mark, social images and Boomich reveal.

`DESIGN.md` records the approved extension's tokens and component rules; `.impeccable/design.json` carries its motion, breakpoints and scoped mark previews. The full portfolio contract remains in the handoff and addendum.

The fonts are self-hosted under `public/fonts/` with their Open Font Licenses. The approved social images in `design/addendum/og/` map to `public/og-image.png` (light, used by metadata) and `public/og-image-dark.png` (for manual sharing). Original brand assets are in `design/addendum/brand/`, with fixed-color SVGs in `design/brand/` for third-party use. `public/favicon.svg` adapts to the operating system theme; PNG and ICO fallbacks support older browsers and home-screen shortcuts.

## Deployment

Merging into `main` triggers `.github/workflows/deploy.yml`, which builds `dist/` and deploys it to GitHub Pages.

Live site: [vitordesouza.github.io](https://vitordesouza.github.io/)
