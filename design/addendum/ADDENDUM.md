# Addendum: personal mark, Open Graph images, Boomich hover reveal

This follows `design/HANDOFF.md`. The assets are final and live in `design/addendum/`. Reference boards (canvas format, not code) are in `design/addendum/canvas/`. Work on a branch: `brand/status-v`.

## 1. Personal mark: the Status V (approved)

An ink circle holding an Outfit-700 **V** in the page ground colour, plus an accent **status dot** at the bottom right with a ground-coloured ring. The dot is the brand's one recurring element: the same green as the full stop in "Vitor Souza." and the pulsing "Available immediately" dot. It is meant to change with status. While job-hunting it stays accent green. After you are hired it can go neutral (`--muted`) without touching the mark's shape.

Geometry (100-unit grid): circle `r=46` at 50,50 · V = Outfit 700 outline, `translate(23.3 78) scale(0.075)` (optically lowered 1.5 units, because a V's mass sits high) · dot `r=11` at 83,83 with a 5-unit ground stroke.

| File                                                                     | Use                                                                                        | Goes to                                                            |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `brand/mark.svg`                                                         | Theme-aware mark. Circle = `currentColor`, V and ring = `var(--bg)`, dot = `var(--accent)` | Inline it in the nav (see §2)                                      |
| `brand/mark-light.svg`, `mark-dark.svg`                                  | Fixed-colour versions for third parties                                                    | `design/brand/`                                                    |
| `brand/wordmark-light.svg`, `wordmark-dark.svg`                          | "Vitor Souza." outlined in Outfit 700, −0.03em, accent full stop                           | `design/brand/`                                                    |
| `brand/lockup-light.svg`, `lockup-dark.svg`                              | Mark + wordmark. Mark height = 1.3× cap height, gap = 0.35× mark                           | `design/brand/`                                                    |
| `brand/favicon.svg`                                                      | Mark with a `prefers-color-scheme` swap                                                    | replace `public/favicon.svg`                                       |
| `brand/favicon-16x16.png`, `favicon-32x32.png`, `favicon.ico` (16/32/48) | Light mark, transparent background                                                         | replace the files in `public/`                                     |
| `brand/apple-touch-icon.png`, `icon-192.png`, `icon-512.png`             | Light ground, full bleed, mark at 72%                                                      | replace the files in `public/`. `site.webmanifest` needs no change |

## 2. Site changes

- **Nav wordmark:** put the inline `mark.svg` (28px) before the existing text wordmark, 10px gap, both inside the same `<a class="wordmark">`. The mark is `aria-hidden`. The link's accessible name stays "Vitor Souza".
- **Hover detail (small and dry):** on `.wordmark:hover` the status dot pulses once, using the same `ping` keyframes as the hero availability dot, a single iteration. It is disabled under reduced motion.
- **Footer:** swap "Vitor Souza — Senior TypeScript Engineer · ©2026" for the 20px mark + that text.

## 3. Copy updates (location and work mode)

Location is **Caldas da Rainha, Leiria**. Work mode is **remote or hybrid**.

- **Hero meta (fixes a wrap bug):** at about 1000px the middle column currently breaks "Lisbon" onto a second line and pushes the availability column off its baseline (see the screenshot in the conversation). Change it to `Caldas da Rainha, Leiria · <clock>` and drop the "PT" and the trailing "Lisbon". Give it `white-space: nowrap`, and hide the clock below 900px (keep the town). Every column needs `align-items: baseline` so the three always share one line.
- **Contact `<dl>`:** "Based in" becomes `Caldas da Rainha, Leiria · UTC/UTC+1`. Add a row "Work mode": `Remote or hybrid`.
- **Focus intro:** "Senior and staff-level remote roles…" becomes "Senior and staff-level roles, remote or hybrid, where I contribute at the system level, not just feature delivery."
- **Meta / OG / Twitter descriptions:** replace "Based in Caldas da Rainha, Leiria, Portugal; available immediately." with "Based in Caldas da Rainha, Leiria, Portugal. Remote or hybrid; available immediately."

## 4. Open Graph images

`og/og-light.png` (1200×630) is the shipped `og:image`. Platforms do not switch the image by colour scheme, so only one can be live. The light one matches the site's default theme and reads in both light and dark feeds. `og-dark.png` is for places you post the image yourself (LinkedIn featured section, slides). Use the `@2x` versions where a platform accepts larger images.

- Replace `public/og-image.png` with `og/og-light.png`. Keep the filename so existing links resolve. Add `public/og-image-dark.png` from `og/og-dark.png` (not referenced in meta).
- `og:image:alt` / `twitter:image:alt`: "I'm Vitor Souza, a senior engineer who works where complexity is the product."
- `design/social-card.html` is now outdated. Update it to match `og/og-light.png` (layout: meta row → lead line with avatar → 104px two-line headline with the scribble → stack marquee strip → lockup + URL), or delete it and keep the PNGs as the source of truth.

## 5. Boomich hover reveal

Reference: `canvas/BoomichHover.dc.html` (press Play on the canvas to feel it). Port it as `initBoomichReveal()` in `src/index.ts`, next to the existing name-hover photo logic, and reuse the same pointer state and rAF loop rather than adding a second loop.

- **Trigger:** the `Boomich` inline link in the Selected work intro (`index.html`, the `inline-link` to boomich.pt). Mouse enter/leave toggles `data-on` on a fixed card. Fine pointers only; nothing under reduced motion or on touch.
- **Card:** 280×176. Boomich ground `#1A2213`. 14px chamfer on the top-left and bottom-right (`clip-path`). It follows the cursor with lerp 0.12, offset `translate(-50%, -118%)`, and tilts with cursor lag (±10°, base −3°). Enter: opacity 0→1 with scale .7→1 (`cubic-bezier(.16,1,.3,1)`, 0.5s).
- **Content:** a 10×5 braced net (Line `rgba(240,239,231,.18)`, 1px). A gaussian load (σ 46) sits on the row at y=64 and slides opposite to the cursor's motion (`x = 140 − lag × 0.9`, clamped to 30–250). Amplitude `min(26, 6 + |vx| × 1.4)`, so faster movement means more load, eased at 0.15. Only the members meeting the most-displaced node are amber `#F2BE45`, plus a 6px amber square on that node. The bottom strip (`#141B0F`) holds the Boomich `wordmark.svg` (15px tall, from the boomich repo's `design/logo/`) and a live readout `n.n px` = max deflection.
- **Settle:** after leave, amplitude eases to 0, then the loop stops. No allocation per frame beyond the path strings. Add `console.debug('[site] boomich reveal …')` on enable and the first show.
- The card is decorative: `aria-hidden="true"`. The link stays a normal link.

## 6. Acceptance

- [ ] Favicon shows the Status V in both OS themes. The tab icon is legible at 16px.
- [ ] Hero meta stays on one line from 1440 down to 900. Below 900 the clock hides and nothing wraps.
- [ ] `og:image` serves the new light image. Check it with a card validator (LinkedIn Post Inspector, opengraph.xyz).
- [ ] The Boomich card works in light and dark site themes. It is olive in both, by design.
- [ ] Reduced motion: no card, no wordmark ping. Touch: no card.
- [ ] No "Leiria, PT · … Lisbon" left anywhere, and no "remote roles" without "hybrid".
