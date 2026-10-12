# Shared repository guidance

Before working in this repository, read both `AGENTS.md` and `CLAUDE.md`. This guidance applies to all agents, including Claude Code and Codex.

## Architecture

For frontend changes, read `DESIGN.md`, `design/HANDOFF.md` and `design/addendum/ADDENDUM.md`; inspect `design/Main.dc.html` and the relevant boards in `design/addendum/canvas/`. Canvas files use a custom template format, not a production entry point. The handoff's accepted corrections and approved addendum resolve reference differences. Preserve supplied copy, fonts, tokens and tuned easing/timings. `DESIGN.md` and `.impeccable/design.json` capture the approved Status V extension.

## Theme and motion

Dark mode uses Tailwind's `selector` strategy with `.dark` on `<html>`. The inline head script reads `localStorage.mode` (`day` or `night`), falling back to the system preference, before CSS paints. Only clicking the theme button persists a preference. Keep its accessible label, pressed state, and theme-color metadata synchronized.

The theme reveal uses the View Transitions API when supported, with an instant fallback. All motion respects `prefers-reduced-motion`, including changes to that preference while the page is open. Pointer effects require a viewport at least 768px wide, a fine pointer, and hover capability; the native cursor stays visible.

Reveal content is visible without JavaScript. The script sets `data-motion="on"` on the root and IntersectionObserver adds `data-in` once each target enters view. A separate observer sets `data-active` on marquee and vignette loops to pause them off-screen.

Use real buttons and links, keep decorative vignettes and repeated text hidden from assistive technology, and retain visible keyboard focus. Copy feedback lasts 1.8 seconds and is announced through `aria-live`; clipboard failure opens the mail client.

## Assets and verification

The three selected fonts are self-hosted in `public/fonts/` with their Open Font Licenses. `src/index.css` defines their weight ranges, and the head preloads them for the first viewport. Preserve these font files when changing delivery or caching.

Photos are in `src/img/`, and the downloadable CV is `src/files/vitor-cv.pdf`. `public/vitor-portrait.webp` supplies the stable profile image URL for structured data; keep it synchronized with the contact portrait. `public/vitor-cv.pdf` is the served download; keep it synchronized with `src/files/vitor-cv.pdf`. Static public URLs keep downloads working without JavaScript.

The approved PNGs in `design/addendum/og/` are the social-image source of truth: light maps to `public/og-image.png`, dark to `public/og-image-dark.png`. Open Graph and Twitter share the light image. Status V originals are in `design/addendum/brand/`, fixed third-party variants in `design/brand/`; preserve the geometry and theme colors when updating the inline marks and public icons. The status dot uses `--accent` while job-hunting.

The lockfile must remain compatible with pnpm 8, used by the unchanged Pages workflow. This is a single package; no workspace configuration is needed. Validate a frozen clean install before release; a lockfile produced by a newer pnpm major can build locally and still fail in CI.

## Source maintenance

Keep page content in static HTML and reusable presentation in named CSS classes. Inline styles carry per-element animation variables. Preserve the approved rendering and motion when refactoring. Initialization functions in `src/index.ts` share one module; split a concern when its size or reuse warrants it. `initPointer()` owns the shared pointer state and frame loop, including `initBoomichReveal()`. Its grid storage is allocated at setup, and the loop rests after the cursor, portrait and departing net settle.

`pnpm build` includes strict TypeScript checking; `pnpm format:check` verifies shared formatting. Formatting excludes the original canvas and unchanged deployment workflow. After a layout refactor, compare the rendered page at both required sizes and themes.

Before reporting visible work complete, run the dev server and inspect 1440px and 390px in both day and night modes. Work through the acceptance checklist in `design/HANDOFF.md` and report unresolved items accurately. Do not invent a replacement CV or project status.

Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds and deploys `dist/` to GitHub Pages. Keep that deployment pipeline unchanged for the redesign.
