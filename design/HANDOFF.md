# Redesign handoff — vitordesouza.github.io

Design source of truth: `design/Main.dc.html` (exported from the Claude Design canvas). It is a **reference**, not code to ship: it uses a canvas-only template format (`<x-dc>`, `{{holes}}`, `<sc-for>`, a `DCLogic` class). Port it to this repo's stack: `index.html` + `src/index.ts` + `src/index.css`, Vite + Tailwind 3.

Work on a branch (`redesign`). Keep the deploy pipeline (`.github/workflows/deploy.yml`) as is.

## Decisions already made

- Heading/display font: **Outfit** (500/600/700). The Figtree / Funnel Display options in the source are discarded.
- Body: **Schibsted Grotesk** (400/500/600). Labels/meta: **Geist Mono** (400/500).
- Accent: **#1E7A55** (green). The source's JS fallback says `#E4572E` — ignore it; the chosen value is green.
- **Night mode is required** (spec below). The current site has one; the canvas design does not yet.
- **Drop jQuery** and `@rollup/plugin-inject`. Everything is vanilla TS.
- Old assets (`logo*.svg`, `me.png`, `boomich.png`, `footer.webp`, Archivo/Inter Tight/Roboto fonts) are no longer used — remove once the port is done.

## Translating the canvas format

| In `Main.dc.html`                           | In the repo                                                              |
| ------------------------------------------- | ------------------------------------------------------------------------ |
| `{{display}}`                               | Outfit stack: `'Outfit', ui-sans-serif, system-ui, sans-serif`           |
| `{{accent}}` / `var(--accent)`              | CSS custom property `--accent`                                           |
| `<sc-for list="{{marquee}}">`               | Static markup: the 10 tools, duplicated once (second copy `aria-hidden`) |
| `<sc-for list="{{bids}}">`                  | Static markup: 4 bid rows + first 3 repeated (seamless loop)             |
| `<sc-for list="{{emailChars}}">`            | 20 `<span class="ch" style="--i:N">` for `joaovitor@boomich.pt`          |
| `<sc-for list="{{focus}}">`                 | 5 static `<li>` rows (copy is in `renderVals()`)                         |
| `ref="{{…Ref}}"`, `onMouseEnter`, `onClick` | `querySelector` + `addEventListener` in `src/index.ts`                   |
| `/_blob/1b0136c0…`                          | `src/img/vitor-avatar.webp` (round avatar in the H1)                     |
| `/_blob/c2f83c62…`                          | `src/img/vitor-candid.webp` (floating photo on name hover)               |
| `/_blob/fcfc797d…`                          | `src/img/vitor-portrait.webp` (contact section)                          |
| `<helmet><style>`                           | `src/index.css` (keep the keyframes/classes verbatim; they are tuned)    |

Inline styles in the source can become Tailwind classes or stay as CSS — prefer Tailwind for layout/spacing, plain CSS for motion. Don't "improve" the timings: easing is `cubic-bezier(.16,1,.3,1)` almost everywhere on purpose.

## Tokens

| Token                                | Day       | Night                           |
| ------------------------------------ | --------- | ------------------------------- |
| `--bg`                               | `#F3F2EE` | `#11110F`                       |
| `--surface` (cards, stack panel)     | `#FFFFFF` | `#1B1B19`                       |
| `--surface-2` (MailToBills vignette) | `#E9E7E0` | `#24241F`                       |
| `--ink`                              | `#111111` | `#EDECE6`                       |
| `--ink-2` (body copy)                | `#2E2E2A` | `#CFCEC7`                       |
| `--muted` (labels, meta)             | `#5C5C56` | `#A3A29A`                       |
| `--line` (hairlines)                 | `#D6D4CC` | `#2E2E2B`                       |
| `--line-soft`                        | `#ECEAE4` | `#24241F`                       |
| `--marquee-idle`                     | `#B3B2AA` | `#4A4A45`                       |
| `--accent`                           | `#1E7A55` | `#3FAE7F`                       |
| dark vignettes (Bidcast, Review AI)  | `#141413` | `#0B0B0A` + 1px `--line` border |

Primary buttons invert in night mode (ink background, bg-colored text) — derive them from `--ink`/`--bg`, never hard-code. Check every text/background pair for 4.5:1 (3:1 at 24px+).

## Night mode spec

- Class strategy stays (`darkMode: 'selector'`), but put `.dark` on **`<html>`**, set by a tiny **inline script in `<head>`** before CSS paints, so there is no flash.
- Initial value: `localStorage.mode` (`"day"`/`"night"`, same keys as today) → else `prefers-color-scheme`.
- Toggle: icon-only round button (44px) in the nav, between the links and "Let's talk", `aria-label="Switch to night mode"` / `"…day mode"`, `aria-pressed`. Sun↔moon morph in SVG (rotate + mask), ~500ms.
- Transition: use the **View Transitions API** for a circular reveal expanding from the toggle button (`clip-path: circle()` on `::view-transition-new(root)`, ~600ms). Fallback: instant swap. Skip the effect under reduced motion.
- `<meta name="theme-color">` updates with the mode.
- Persist the choice only when the user clicks the toggle.

## Sections (top → bottom)

1. **Nav** — wordmark "Vitor Souza." (accent period), links Work / Experience / Stack / Contact with text-roll hover, theme toggle, "Let's talk" pill.
2. **Hero** — meta row (role · Leiria + live Lisbon clock · pulsing "Available immediately"), full-width H1 with word-rise entrance, inline avatar, name-hover floating candid photo, accent scribble under "complexity"; 3-col row: Most recently / Before that / CTAs.
3. **Marquee** — tools, 60s loop, pauses on hover, edge-masked, spinning accent asterisks.
4. **(01) Selected work** — Bidcast (full width, live campaign vignette), MailToBills (email→folder vignette), Review AI (typing terminal vignette).
5. **(02) Experience** — 5 rows, hover hairline + shift.
6. **(03) Where complexity lives** — 5 focus rows with proof lines.
7. **(04) Stack** — 4-column panel.
8. **(05) Contact** — big email with letter hop + Copy button, facts `<dl>`, social pills, portrait.
9. **Footer** — name ©, Back to top.

## Motion inventory (all must respect `prefers-reduced-motion`)

- Word rise: per-word mask, `--i * 55ms + 150ms` delay, 1.1s.
- Scribble: SVG `pathLength=1` dash draw, starts 1.15s; re-draws on hover.
- Name hover: rest of H1 fades to muted; candid photo follows pointer with lerp 0.1 and velocity tilt (±12°).
- Custom cursor: 10px dot, lerp 0.2; grows to 84px with label over `[data-cursor]` ("Visit", "Write", "PDF", "Code", "Open"). **Fine pointer only**; native cursor stays.
- Text roll on links/buttons; arrow nudges on buttons; project card lift + vignette scale + arrow rotate.
- Scroll reveal via IntersectionObserver (`data-reveal` → `data-in`), only after JS sets `data-motion="on"` on the root (no-JS = everything visible).
- Vignettes: Bidcast bid ticker (9s), funding bar fill on reveal, live dot blink; MailToBills chips → folder bump (7.5s); Review AI typed command + output (10s).
- Email: per-letter hop on hover; Copy → "Copied" for 1.8s, `aria-live`; clipboard failure falls back to `mailto:`.
- Pause the vignette/marquee animations when off-screen (IntersectionObserver toggling `animation-play-state`) to save battery.

## Code expectations

- Idiomatic TypeScript, async/await, real error handling, `console.debug('[site] …')` logging for init/observers/clipboard/theme, guarded so it's quiet in production builds if desired.
- One module per concern is fine (`theme.ts`, `cursor.ts`, `reveal.ts`, `clock.ts`, `copy.ts`) imported from `index.ts`.
- Clean up listeners/rAF on `pagehide` not needed for a static page, but no leaks on resize.
- Semantics: real `<button>`/`<a>`, `aria-hidden` on decorative vignettes and duplicated marquee/roll text.
- Meta: update `<title>`, add `description`, Open Graph image (use the portrait), canonical URL.

## Acceptance checklist

- [ ] Matches `design/Main.dc.html` at 1440px, both modes
- [ ] 390px phone: nothing overflows horizontally, hero heading wraps cleanly, cards stack, hover-only effects off
- [ ] Reduced motion: no movement, content fully visible
- [ ] No flash of wrong theme on reload
- [ ] Lighthouse ≥ 95 performance / 100 accessibility
- [ ] Links: bidcast.io, mailtobills.com, GitHub, LinkedIn, WhatsApp, CV PDF, mailto
- [ ] `src/files/vitor-cv.pdf` replaced with the current CV (Leiria, available immediately)
- [ ] jQuery and unused assets removed; `CLAUDE.md` updated to the new architecture

## Open content items

- Project statuses ("In development", "Live, early access", "v0.1, in development") — confirm.
- Review AI card links to the GitHub profile because the repo is local only; swap for the repo URL when public.
- Bidcast vignette uses illustrative campaign/backer names.

## Accepted corrections after the port

These owner corrections take precedence over the original canvas copy:

- Location: Caldas da Rainha, Leiria, Portugal, including metadata and contact details.
- Use `src/img/me.png` for the hero avatar; the supplied avatar crop cuts off the chin.
- Keep the rounded borders of dark vignettes stationary while their contents scale on hover.
- The scribble also underlines "hard problem?" in Contact. Draws complete after pointer leave without restarting the entrance or leaving a stroke fragment; reduced motion and no JavaScript keep the whole line visible.
- The focus section describes broad interests in product domains, evolving architecture, unfamiliar tools, AI integrations and multi-team coordination. Remynd-specific details belong in the experience section.
- Group tools by frontend/mobile, backend/data, delivery/tooling and quality/observability. Vue belongs with frontend tools; WebSockets with backend communication. Remove Kotlin from tool lists: one native module demonstrates learning a tool for a feature, not an ongoing specialization. The list spans current tools and past shipped stacks rather than claiming every tool is used daily.
