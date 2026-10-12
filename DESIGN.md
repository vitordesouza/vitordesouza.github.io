---
name: Vitor Souza — Status V extension
description: Approved personal mark and Boomich reveal within the existing portfolio system.
colors:
  bg: '#f3f2ee'
  ink: '#111111'
  muted: '#5c5c56'
  accent: '#1e7a55'
  bg-night: '#11110f'
  ink-night: '#edece6'
  muted-night: '#a3a29a'
  accent-night: '#3fae7f'
  boomich-bg: '#1a2213'
  boomich-strip: '#141b0f'
  boomich-ink: '#f0efe7'
  boomich-line: 'rgba(240,239,231,.18)'
  boomich-load: '#f2be45'
  boomich-readout: '#9fa392'
typography:
  wordmark:
    fontFamily: 'Outfit, ui-sans-serif, system-ui, sans-serif'
    fontSize: '22px'
    fontWeight: 700
    letterSpacing: '-0.03em'
  body:
    fontFamily: 'Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif'
    fontSize: '17px'
    lineHeight: 1.55
  label:
    fontFamily: 'Geist Mono, ui-monospace, monospace'
    fontSize: '12px'
    letterSpacing: '0.06em'
  boomich-readout:
    fontFamily: 'Geist Mono, ui-monospace, monospace'
    fontSize: '10px'
    letterSpacing: '0.06em'
spacing:
  mark-gap: '10px'
components:
  status-mark-nav:
    width: '28px'
    height: '28px'
  status-mark-footer:
    width: '20px'
    height: '20px'
  boomich-reveal:
    backgroundColor: '{colors.boomich-bg}'
    textColor: '{colors.boomich-ink}'
    width: '280px'
    height: '176px'
  boomich-strip:
    backgroundColor: '{colors.boomich-strip}'
    padding: '12px 16px'
---

# Design System: Vitor Souza

## Overview

This snapshot records the approved Status V and Boomich extensions to the existing portfolio. [The handoff](design/HANDOFF.md), its accepted corrections and [the addendum](design/addendum/ADDENDUM.md) retain the full visual and content contract. The original canvas and addendum boards are references; production styles live in `src/index.css`.

The personal identity continues the established page ground, ink, green accent and three fonts. The recurring status dot connects the mark, wordmark full stop and availability indicator. Boomich's fixed olive and amber appear inside its decorative hover reveal.

## Colors

The unsuffixed page tokens are day values; their `-night` counterparts apply when `html.dark` is active. The Status V circle follows `--ink`, its V and ring follow `--bg`, and its status dot follows `--accent` while job-hunting.

Boomich colors stay fixed in both site themes. The faint line draws the braced net; amber identifies only members meeting the most-displaced node and the square on that node. These colors belong to the Boomich reveal.

## Typography

Outfit remains the display family. The live wordmark uses the frontmatter's wordmark role; the Status V uses the supplied Outfit 700 outline rather than a text glyph. Schibsted Grotesk remains the body family. Geist Mono carries uppercase metadata and the tabular deflection readout. Font binaries and licenses remain in `public/fonts/`.

## Layout

The nav mark precedes the existing wordmark inside one link; the footer mark precedes the existing footer text. Both use the recorded mark gap. The nav link's accessible name is “Vitor Souza”; its SVG is decorative.

Hero metadata uses three baseline-aligned columns, with each item kept on one line. The clock is hidden at widths of 899px and below; the town remains. The incumbent mobile layout stacks the items at 767px and below.

## Shapes

The Status V uses the supplied 100-unit geometry: circle at (50, 50), radius 46; outlined V transformed by `translate(23.3 78) scale(0.075)`; status dot at (83, 83), radius 11, with a 5-unit ground ring. Preserve the approved outline and optical placement.

The Boomich reveal has 14px chamfers at the top-left and bottom-right. Its wordmark is the supplied studio asset, displayed at 15px high.

## Components

### Status V

The nav status dot uses the existing `ping` keyframes for one hover iteration on fine pointers. Reduced motion disables the ping. The footer mark is static. Original assets live in `design/addendum/brand/`; fixed-color third-party variants live in `design/brand/`. The SVG favicon follows the operating system color scheme independently of the page theme; PNG and ICO fallbacks use the supplied light mark.

### Boomich reveal

Hovering the normal Boomich link in Selected work shows the decorative, pointer-following card. It is hidden on touch, coarse pointers, widths below 768px and reduced motion. The card is `aria-hidden` and does not intercept pointer events.

A 10×5 braced net responds to a Gaussian load centered on y=64 (σ=46). The load slides opposite cursor lag, with its x position clamped to 30–250; velocity controls an amplitude capped at 26. Only the most-displaced node's adjoining members turn amber, and the readout reports maximum deflection to one decimal place in pixels.

`initPointer()` owns the pointer state and single animation frame loop. `initBoomichReveal()` allocates node arrays and connectivity at setup; frames update coordinates and SVG strings. After pointer leave, load amplitude eases to zero, and the shared loop rests once the cursor, portrait and departing net settle. Motion values and scoped Status V previews are recorded in `.impeccable/design.json`.

### Social images

The final `design/addendum/og/og-light.png` is copied to `public/og-image.png` and supplies both Open Graph and Twitter. The dark PNG maps to `public/og-image-dark.png` for manual sharing. The approved PNGs, including their supplied larger variants, are the source of truth.

## Do's and Don'ts

- **Do** preserve the supplied mark geometry, pinned assets and existing page tokens.
- **Do** keep the status dot accent green for the current job-hunting status.
- **Do** reuse the shared pointer state and animation loop for the Boomich reveal.
- **Don't** regenerate approved brand or social assets from the obsolete social-card layout.
- **Don't** introduce new fonts, palette choices or status claims through this extension.
