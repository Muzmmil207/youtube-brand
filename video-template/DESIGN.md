# Learn Shopify Today — Video Design System

**Bento Editorial** is the visual and motion system for every Learn Shopify Today
video. It is a HyperFrames project: open `video-template/` and you have tokens,
components, nine scene templates and a rendered showcase.

Reference image: `brand/bento-grid-2.png`. Brand source: `brand/brand.css`.

---

## Mandatory Instructions for AI Scene Authors

Read this section before writing a single line of HTML.

1. **Use the tokens. Never hard-code a colour, font or radius.** All values live
   in `styles/tokens.css`. A raw hex colour, a `font-family` declaration or a
   one-off radius in a scene is a bug, and `npm run audit` fails on it. Never
   edit `tokens.css` to make one scene fit: if a value is genuinely missing, add
   it as a documented token and update this file.
2. **Compose existing components. Do not invent a new one.** Check the component
   catalogue below first. If a card, list, metric, step, chart or window already
   exists, use it with its documented classes. Start from the closest template in
   `compositions/templates/` rather than an empty file.
3. **One scene = one idea.** A scene is 5–10 seconds. If you need two ideas,
   write two scenes.
4. **Keep the title readable at frame 0.** The first frame is the thumbnail.
   Never animate the whole scene in from nothing; leave the header static and
   animate the supporting content.
5. **One internal beat per scene.** A highlight, a counter, a step activation or
   a line draw. Not three.
6. **Motion only through `data-anim`.** No CSS `transition`, no CSS `animation`,
   no GSAP written inside a scene, no `Math.random`, no `Date.now`, no
   `requestAnimationFrame`. Renders must be seekable.
7. **Stay above the type floor.** Reading text is at least 28 px at 1920×1080.
   If the copy does not fit, cut copy. Do not shrink the type.
8. **Respect the safe area.** 96 px side margins, 76 px top, 68 px bottom.
   Nothing important touches the frame edge.
9. **Use the icon sprite, not emoji.** `<svg class="hf-icon"><use href="assets/icons.svg#bag" /></svg>`.
10. **Validate before you ship.** `npm run audit && npm run lint && npm run check`.
    Fix every error. The only accepted warning is `film_silent` when the video
    intentionally has no audio.
11. **Never copy a real Shopify admin screenshot or the Shopify logo.** The admin
    and storefront components are illustrative, built from tokens.
12. **Leave the system better documented.** New component or new pattern: add it
    to this file and to the showcase in the same change.
13. **Sound comes from `assets/sfx/` only.** Use the existing cues, one per beat,
    on the rules in §14. No music, no chimes, no downloaded stingers.

---

## 1. What this project is

- **Format:** 1920×1080 landscape, 30 fps, YouTube tutorials.
- **Look:** near-black bento surfaces, 1 px white/7 % hairlines, 20 px radii,
  generous whitespace, one lime accent, Inter.
- **Tone:** calm, precise, practical. A senior operator explaining, not a
  hype reel.
- **Runtime:** HyperFrames 0.9.70, GSAP 3.15.0 (CDN), no other runtime deps.

The default `index.html` is a **design-system showcase** (144 s): nine component
chapters followed by the nine scene templates. It is a demo, not a tutorial.
For a real video, replace the mounts in `index.html` with your own scenes.

---

## 2. Quick start

```bash
cd video-template
npm run dev        # HyperFrames preview
npm run audit      # design guard: tokens, motion, forbidden APIs
npm run lint       # HyperFrames static lint
npm run check      # runtime, layout, motion, contrast, craft
npm run snapshot   # frames at scene starts/mids + contact sheets
npm run render     # final MP4
```

`check` needs a headless Chrome; `render` also needs FFmpeg. Both are handled by
the HyperFrames CLI.

---

## 3. Architecture

```
video-template/
  index.html                     root composition, mounts every clip
  hyperframes.json               project paths
  meta.json
  package.json                   pinned CLI scripts
  DESIGN.md                      this file
  styles/
    tokens.css                   colour, type, space, radius, motion
    base.css                     reset, scene shell, type, layout, card
    components.css               the component library
  scripts/
    hf-motion.js                 data-attribute → GSAP timeline
    audit-design.mjs             design guard
  assets/
    fonts/inter-var.woff2        bundled Inter variable font
    icons.svg                    line icon sprite
  compositions/
    showcase/01…09-*.html        component chapters
    templates/01…09-*.html       copy-ready scene templates
```

### How a scene is loaded

The root file owns the film timeline. Each scene is a separate HTML file loaded
as a sub-composition:

```html
<div
  id="my-scene"
  class="clip"
  data-composition-id="my-scene"
  data-composition-src="compositions/templates/01-intro.html"
  data-start="12"
  data-duration="6"
  data-track-index="0"
></div>
```

Rules that matter:

- The root has `data-no-timeline` and no animated content of its own.
- A sub-composition is a `<template>` containing `#root` and one scene.
- `#root` is styled with the ID selector, never a class.
- Paths inside a composition resolve from the **project root**
  (`styles/base.css`, `assets/icons.svg`), not from the composition folder.
- Every scene registers exactly one timeline:

```html
<script src="scripts/hf-motion.js"></script>
<script>HF.register("my-scene");</script>
```

`HF.register` builds the paused GSAP timeline from `data-anim` attributes, puts
it on `window.__timelines[id]` and seeks to 0.

### Scene skeleton

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="styles/tokens.css" />
    <link rel="stylesheet" href="styles/base.css" />
    <link rel="stylesheet" href="styles/components.css" />
  </head>
  <body>
    <template>
      <style>
        #root {
          position: absolute;
          inset: 0;
          width: 1920px;
          height: 1080px;
          overflow: hidden;
        }
        /* scene-only layout goes here, tokens only */
      </style>

      <div id="root" data-composition-id="my-scene"
           data-width="1920" data-height="1080" data-duration="6">
        <div class="hf-scene">
          <div class="hf-dots"></div>
          <header class="hf-header">…</header>
          <div class="hf-main">…</div>
          <footer class="hf-footer">…</footer>
        </div>
      </div>

      <script src="scripts/hf-motion.js"></script>
      <script>HF.register("my-scene");</script>
    </template>
  </body>
</html>
```

---

## 4. Tokens

### Colour

| Token | Value | Use |
|---|---|---|
| `--hf-ink` | `#08090A` | scene background |
| `--hf-surface` | `#0F1113` | cards, windows |
| `--hf-surface-2` | `#15181B` | raised cards, bars |
| `--hf-surface-3` | `#1A1D20` | controls, mock fills |
| `--hf-line` | `white / 7 %` | hairlines, dividers |
| `--hf-line-strong` | `white / 13 %` | borders that need weight |
| `--hf-text` | `#F4F5F6` | headings and primary text |
| `--hf-muted` | `#9BA1A8` | body and secondary text (7.6:1) |
| `--hf-dim` | `#6B7278` | decoration only — **never text** |
| `--hf-lime` | `#95BF47` | the single system accent |
| `--hf-lime-soft` | `#BBDD82` | accent text on dark tints |
| `--hf-lime-deep` | `#4E7A33` | gradient end |
| `--hf-glow` | `lime / 16 %` | radial glows |
| `--hf-tip` / `--hf-warning` / `--hf-info` / `--hf-danger` | lime / amber / slate blue / muted red | callout tones |

Rules:

- One accent per scene. Lime is for the one thing the viewer should look at.
- Amber, blue and red are semantic only (warning, info, negative). Never
  decorative.
- Never use `--hf-dim` for text; it fails AA.
- Body text uses `--hf-muted` or `--hf-text`, never a raw grey.

### Type

Inter variable, bundled locally. No second family.

| Role | Class | Size | Weight | Tracking |
|---|---|---|---|---|
| Display | `.hf-display` | 104 | 600 | −0.045em |
| H1 | `.hf-h1` | 76 | 600 | −0.04em |
| H2 | `.hf-h2` | 56 | 600 | −0.035em |
| H3 | `.hf-h3` | 40 | 600 | −0.025em |
| H4 | `.hf-h4` | 30 | 600 | −0.02em |
| Lead | `.hf-body-lg` | 32 | 400 | 0 |
| Body | `.hf-body` | 28 | 400 | 0 |
| Small | `.hf-small` | 28 | 400 | 0 |
| Label | `.hf-label` | 28 | 600 | +0.12em, uppercase |

- **28 px is the floor.** The HyperFrames `text_below_floor` check fails
  anything smaller that stays on screen.
- Numbers use `.hf-num` (`tabular-nums`) so counters do not jitter.
- `--hf-muted` for supporting copy; `--hf-text` for the sentence that matters.

### Space

`4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128` (`--hf-s1` … `--hf-s10`).

| Layout token | Value |
|---|---|
| `--hf-safe-x` | 96 px |
| `--hf-safe-top` | 76 px |
| `--hf-safe-bottom` | 68 px |
| `--hf-gap` | 24 px |
| `--hf-gap-lg` | 32 px |
| `--hf-card-pad` | 40 px |

### Radius

`8 / 12 / 16 / 20 / 24 / pill` — `--hf-r-sm` … `--hf-r-pill`.
Cards and windows use 20 or 24. Controls use 12. Chips and buttons are pills.

### Motion

| Token | Value |
|---|---|
| `--hf-fast` | 0.24 s |
| `--hf-base` | 0.42 s |
| `--hf-slow` | 0.72 s |
| `--hf-stagger` | 0.08 s |

---

## 5. Layout rules

The scene is a three-part flex column: **header → main → footer**, with a 48 px
gap. The header is static and readable at frame 0.

- **Header:** label (optional), one H1, one lead line. No paragraph under the
  header — put it in the body.
- **Main:** the content. Use `hf-split`, `hf-grid`, `hf-bento`, or `hf-stack`.
- **Footer:** channel name left, scene name / number right. 28 px muted.

Density limits:

- Maximum 4 cards per row, 6 list items, 3 lines per card body.
- One primary visual per scene. Everything else supports it.
- 40–60 % of the frame is content; the rest is air.
- If a line needs more than 3 lines of body, it is a second scene.

Standard compositions:

| Need | Use |
|---|---|
| Explain with a visual | `.hf-split` (1 : 1) |
| Visual is the hero | `.hf-split--wide-left` |
| Text is the hero | `.hf-split--wide-right` |
| 2–4 equal items | `.hf-grid--2/3/4` |
| Mixed sizes | `.hf-bento` + `.hf-span-2/3/4`, `.hf-tall` |
| One column of blocks | `.hf-stack` |
| Centred statement | `.hf-scene--center` (intro / outro only) |

---

## 6. Motion system

All motion is declared in HTML and built by `scripts/hf-motion.js`.

### Single element

```html
<div class="hf-card" data-anim="fade-up" data-anim-at="0.3">…</div>
```

| Attribute | Meaning | Default |
|---|---|---|
| `data-anim` | animation type | required |
| `data-anim-at` | absolute start time (s) | `0.2 + 0.06 × order` |
| `data-anim-dur` | duration (s) | per type |

### Group (best for grids and lists)

```html
<div class="hf-grid hf-grid--3" data-anim-group="fade-up"
     data-anim-at="0.3" data-stagger="0.08">…</div>
```

The group animates its **direct children** in DOM order. Children with their own
`data-anim` inside the group are ignored by the group and run independently.

### Types

| `data-anim` | Effect | Default |
|---|---|---|
| `fade` | opacity 0 → 1 | 0.40 s |
| `fade-up` | +28 px up | 0.50 s |
| `fade-down` | −24 px down | 0.50 s |
| `slide-left` | enters from the left (−48 px) | 0.55 s |
| `slide-right` | enters from the right (+48 px) | 0.55 s |
| `scale-in` | 0.94 → 1 | 0.50 s |
| `grow-x` | scaleX 0 → 1, origin left | 0.60 s |
| `grow-y` | scaleY 0 → 1, origin bottom | 0.60 s |
| `draw` | SVG stroke draw (`pathLength=100`) | 0.80 s |
| `count` | number counts from 0 | 1.20 s |
| `highlight` | ring fades and scales in | 0.50 s |
| `pulse` | one double beat, then still | 0.80 s |
| `cursor` | pointer slides in from an offset | 0.70 s |

### Counter

```html
<span class="hf-metric__value hf-count"
      data-anim="count" data-to="12480" data-prefix="$"
      data-anim-at="0.4">$12,480</span>
```

`data-to` (number), `data-decimals`, `data-prefix`, `data-suffix`. The final text
is written in the markup so the static frame is correct.

### Cursor

```html
<svg class="hf-cursor" viewBox="0 0 24 24"
     data-anim="cursor" data-from-x="-40" data-from-y="30">
  <path d="M5 3l14 8-6.2 1.4L10 19 5 3Z" />
</svg>
```

### Motion rules

- Header/title visible at 0 s. Animate supporting content from 0.15 s.
- One beat per scene; the beat lands before the halfway point.
- Nothing loops. `pulse` is one finite double beat.
- No camera moves, parallax, glitch, confetti or bouncy entrances.
- `power3.out` for entrances, `power2.inOut` for draws, `back.out(1.6)` only for
  tiny pops (never a full card).
- Respect `prefers-reduced-motion`? Not needed for a rendered film; the final
  timeline is the artefact.

---

## 7. Component catalogue

Every component is HTML + CSS classes. No JavaScript builds markup, so scenes
stay editable in the HyperFrames editor.

### 7.1 Layout

#### SceneContainer — `.hf-scene`

```html
<div class="hf-scene">
  <div class="hf-dots"></div>
  <div class="hf-glow" data-layout-ignore style="width:700px;height:700px;right:-160px;top:-240px"></div>
  <header class="hf-header">…</header>
  <div class="hf-main">…</div>
  <footer class="hf-footer">…</footer>
</div>
```

`.hf-scene--center` for intro/outro. `.hf-dots` and `.hf-glow` are decoration —
mark them `data-layout-ignore`.

#### SectionHeader — `.hf-header`

```html
<header class="hf-header">
  <p class="hf-label">Tutorial · Step by step</p>
  <h1 class="hf-h1">Add your first product</h1>
  <p class="hf-body-lg hf-muted hf-header__sub">Three screens, about four minutes.</p>
</header>
```

#### ContentCard — `.hf-card`

```html
<div class="hf-card">
  <span class="hf-label">Do</span>
  <h3 class="hf-h4">One accent per scene</h3>
  <p class="hf-card__body">…</p>
</div>
```

Modifiers: `--flat` (no gradient), `--ghost` (transparent), `--accent` (lime
border + glow, one per scene), `--flush` (no padding, clipped), `--tight`
(28/32 padding for small spec cards).

#### SplitLayout — `.hf-split`

```html
<div class="hf-split hf-split--wide-left hf-split--stretch hf-fill">
  <div class="hf-stack">…</div>
  <div class="hf-card">…</div>
</div>
```

Modifiers: `--wide-left`, `--wide-right`, `--stretch` (equal heights), `--top`.
Add `hf-fill` to take the remaining scene height.

#### GridLayout — `.hf-grid`

```html
<div class="hf-grid hf-grid--3">…</div>
```

`--2`, `--3`, `--4`, `--5`. Gap is `--hf-gap`.

#### Bento — `.hf-bento`

A four-column bed. Children opt into spans.

```html
<div class="hf-bento hf-fill">
  <div class="hf-card hf-span-2 hf-tall">…</div>
  <div class="hf-card hf-span-2">…</div>
  <div class="hf-card">…</div>
  <div class="hf-card">…</div>
</div>
```

`.hf-span-2/3/4`, `.hf-tall` (two rows).

#### Utilities

`.hf-main`, `.hf-stack` (`--tight`, `--loose`), `.hf-row` (`--between`,
`--baseline`), `.hf-fill`, `.hf-center`, `.hf-rule`, `.hf-measure`, `.hf-mock`
(`--lime`) for wireframe filler.

---

### 7.2 Education

#### StepIndicator — `.hf-steps`

```html
<ol class="hf-steps">
  <li class="hf-step" data-state="done">
    <span class="hf-step__num">1</span>
    <span class="hf-step__text"><span class="hf-step__label">Choose theme</span></span>
  </li>
  <li class="hf-step" data-state="active">…</li>
  <li class="hf-step">…</li>
</ol>
```

`data-state`: `active` (lime), `done` (lime tint), omitted (muted). Keep labels
to one line so the connectors stay level.

#### NumberedSteps — `.hf-numsteps`

```html
<ol class="hf-numsteps">
  <li class="hf-numstep" data-state="active">
    <span class="hf-numstep__num">1</span>
    <h4 class="hf-h4">Add the photos</h4>
    <p class="hf-numstep__body">Use a clean background and at least three angles.</p>
  </li>
</ol>
```

Vertical rail with circles. 3–4 items maximum.

#### Comparison — `.hf-compare`

```html
<div class="hf-compare">
  <div class="hf-compare__side" data-tone="bad">
    <span class="hf-compare__title">Today</span>
    <ul class="hf-list" data-marker="cross">…</ul>
  </div>
  <div class="hf-compare__vs">vs</div>
  <div class="hf-compare__side" data-tone="good">
    <span class="hf-compare__title">With order tags</span>
    <ul class="hf-list" data-marker="check">…</ul>
  </div>
</div>
```

Text comparison. Use `BeforeAfter` when the comparison is visual.

#### BeforeAfter — `.hf-ba`

```html
<div class="hf-ba hf-fill">
  <div class="hf-ba__panel" data-tone="before">
    <span class="hf-ba__tag">Before</span>
    …visual…
  </div>
  <div class="hf-ba__panel" data-tone="after">
    <span class="hf-ba__tag">After</span>
    …visual…
  </div>
</div>
```

Two full-height panels separated by a 2 px hairline. Put a real visual in each,
not just text.

#### ProcessFlow — `.hf-flow`

```html
<div class="hf-flow">
  <div class="hf-flow__node">
    <span class="hf-icon-badge hf-icon-badge--sm"><svg class="hf-icon"><use href="assets/icons.svg#plus" /></svg></span>
    <span class="hf-flow__label">Draft</span>
    <span class="hf-flow__meta">Step 1</span>
  </div>
  <span class="hf-flow__link" data-anim="grow-x" data-anim-at="0.4"></span>
  …more nodes…
</div>
```

3–4 nodes. Animate the links with `grow-x` after the nodes appear.

#### Timeline — `.hf-timeline`

```html
<ol class="hf-timeline">
  <li class="hf-timeline__item" data-state="active">
    <span class="hf-timeline__dot"></span>
    <h4 class="hf-h4">Day 1 · Build</h4>
    <p class="hf-timeline__body">Add the product and finish the copy.</p>
  </li>
</ol>
```

Vertical, 3–4 items.

#### Callouts — Tip / Warning / InfoCallout

One component, three tones.

```html
<div class="hf-callout" data-tone="tip">
  <span class="hf-callout__label">Tip</span>
  <p class="hf-callout__text">If the text needs to shrink, cut content instead.</p>
</div>
```

`data-tone="tip"` (default), `"warning"`, `"info"`. One callout per scene is
usually enough.

#### BulletList / Checklist — `.hf-list`

```html
<ul class="hf-list" data-marker="check">
  <li>One accent per scene</li>
  <li><strong>Bold</strong> the phrase that matters</li>
</ul>
```

`data-marker`: omitted (lime dot), `check`, `cross`, `number`. Add
`.hf-list--sm` for tighter spacing. Maximum 6 items.

---

### 7.3 Data

#### MetricCard — `.hf-metric`

```html
<div class="hf-card">
  <span class="hf-label">Revenue</span>
  <div class="hf-metric">
    <span class="hf-metric__value hf-count" data-anim="count" data-to="12480" data-prefix="$">$12,480</span>
    <span class="hf-metric__delta" data-tone="up">+18.2% vs last month</span>
  </div>
</div>
```

`data-tone="up"` (lime), `"down"` (danger), omitted (muted). `.hf-metric--lg`
for the hero number.

#### BarChart — `.hf-chart`

```html
<div class="hf-chart hf-fill">
  <div class="hf-chart__plot">
    <div class="hf-chart__col">
      <div class="hf-chart__track">
        <div class="hf-chart__bar" style="--v: 0.68" data-anim="grow-y" data-anim-at="0.5"></div>
      </div>
      <span class="hf-chart__x">Thu</span>
    </div>
  </div>
</div>
```

`--v` is 0–1. Add `.is-peak` to the one bar that carries the point. 5–7 bars.

#### ProgressBar — `.hf-progress`

```html
<div class="hf-progress" style="--v: 0.72">
  <span class="hf-progress__fill" data-anim="grow-x" data-anim-at="0.5"></span>
</div>
```

`.hf-progress--thick` for 20 px. Always pair with a label row above.

#### StatComparison — `.hf-statcompare`

```html
<div class="hf-statcompare">
  <div class="hf-statcompare__item">
    <span class="hf-label">Manual</span>
    <span class="hf-statcompare__value hf-num">6 hrs</span>
  </div>
  <div class="hf-statcompare__arrow">→</div>
  <div class="hf-statcompare__item" data-tone="good">
    <span class="hf-label">Automated</span>
    <span class="hf-statcompare__value hf-num">12 min</span>
  </div>
</div>
```

#### GrowthIndicator — `.hf-growth`

```html
<div class="hf-growth">
  <svg class="hf-growth__spark" viewBox="0 0 300 88" preserveAspectRatio="none">
    <path d="M0 74 C 40 70, 58 44, 92 50 S 142 72, 176 46 S 232 18, 300 8"
          data-anim="draw" data-anim-at="0.6" />
  </svg>
  <span class="hf-h4 hf-num">+38%</span>
  <span class="hf-small hf-muted">search traffic in 30 days</span>
</div>
```

#### AnimatedCounter

`.hf-count` plus `data-anim="count"` and `data-to`. See §6.

---

### 7.4 Shopify UI

All of these are **illustrative**. No Shopify logo, no copied screenshot.

#### BrowserWindow / DashboardWindow — `.hf-window`

```html
<div class="hf-window">
  <div class="hf-window__bar">
    <span class="hf-window__dots"><i></i><i></i><i></i></span>
    <span class="hf-window__url">admin.shopify.com</span>
    <span class="hf-chip hf-chip--lime"><span class="hf-chip__dot"></span>Live</span>
  </div>
  <div class="hf-window__body">…</div>
</div>
```

One component. A browser window shows the URL bar; a dashboard window puts a
title in the same bar and an admin layout in the body.

#### ShopifyStyleDashboard — `.hf-admin`

```html
<div class="hf-admin">
  <aside class="hf-admin__nav">
    <span class="hf-admin__brand">…</span>
    <nav class="hf-menu">…</nav>
  </aside>
  <div class="hf-admin__main">
    <div class="hf-admin__top">
      <span class="hf-admin__title">Home</span>
      <span class="hf-chip">Last 30 days</span>
    </div>
    <div class="hf-admin__content">
      <div class="hf-admin__stats">…panels…</div>
      <div class="hf-admin__panel hf-fill">…</div>
    </div>
  </div>
</div>
```

`.hf-admin__panel`, `.hf-admin__label`, `.hf-admin__value` for the inner cards.

#### ProductCard — `.hf-product`

```html
<div class="hf-product">
  <div class="hf-product__media">
    <svg class="hf-icon"><use href="assets/icons.svg#tag" /></svg>
  </div>
  <div class="hf-product__row">
    <span class="hf-product__name">Linen shirt</span>
    <span class="hf-product__price hf-num">$68</span>
  </div>
</div>
```

`.hf-product--wide` swaps the 4:3 media for 16:10, for product rows in a
half-width panel.

#### ProductGrid — `.hf-product-grid`

3 columns by default, `--4` for four. Override `grid-template-columns` inline
for 2.

#### OrderCard — `.hf-order`

```html
<div class="hf-card">
  <div class="hf-card__head">
    <h4 class="hf-h4">Order #1042</h4>
    <span class="hf-chip hf-chip--lime">Paid</span>
  </div>
  <div class="hf-order">
    <div class="hf-order__rows">
      <div class="hf-order__row"><span>Linen shirt × 1</span><span>$68.00</span></div>
    </div>
    <div class="hf-order__total"><span>Total</span><strong>$76.00</strong></div>
  </div>
</div>
```

#### SettingsPanel — `.hf-settings`

```html
<div class="hf-settings">
  <div class="hf-settings__row">
    <div>
      <span class="hf-settings__name">Store availability</span>
      <span class="hf-settings__hint">Show stock on product pages</span>
    </div>
    <span class="hf-toggle" data-on></span>
  </div>
</div>
```

`data-on` on `.hf-toggle` for the enabled state.

#### NavigationMenu — `.hf-menu`

```html
<nav class="hf-menu">
  <span class="hf-menu__item is-active">Home</span>
  <span class="hf-menu__item">Products</span>
  <span class="hf-menu__item">Contact</span>
</nav>
```

Vertical. Used inside the admin sidebar and in storefront cards.

#### AppIntegrationCard — `.hf-app`

```html
<div class="hf-app">
  <span class="hf-icon-badge hf-icon-badge--sm"><svg class="hf-icon"><use href="assets/icons.svg#mail" /></svg></span>
  <div class="hf-stack hf-stack--tight hf-fill">
    <span class="hf-app__name">Klaviyo</span>
    <span class="hf-small hf-muted">Email marketing</span>
  </div>
  <span class="hf-chip hf-chip--lime"><span class="hf-chip__dot"></span>Connected</span>
</div>
```

#### StorefrontPreview — `.hf-storefront`

```html
<div class="hf-storefront">
  <div class="hf-storefront__bar">
    <span class="hf-storefront__brand">North &amp; Pine</span>
    <span class="hf-storefront__nav"><span>Shop</span><span>About</span></span>
    <span class="hf-chip">Cart · 0</span>
  </div>
  <div class="hf-storefront__hero">
    <span class="hf-label">New season</span>
    <h3 class="hf-h3">Made for slow mornings</h3>
    <span class="hf-btn">Shop the collection</span>
  </div>
  <div class="hf-storefront__grid">
    <div class="hf-storefront__tile">…</div>
  </div>
</div>
```

---

### 7.5 Motion and decoration

#### AnimatedArrow — `.hf-arrow`

```html
<svg class="hf-arrow" width="72" height="24" viewBox="0 0 72 24">
  <path d="M2 12h62m-9-7 9 7-9 7" data-anim="draw" data-anim-at="0.5" />
</svg>
```

`.hf-arrow--muted` for a quiet connector.

#### PointerHighlight — `.hf-highlight`

```html
<span style="position: relative">
  <span class="hf-h3 hf-num">$68</span>
  <span class="hf-highlight" style="inset: -16px -22px" data-anim="highlight" data-anim-at="0.6">
    <span class="hf-highlight__tag" data-layout-allow-overflow>New price</span>
  </span>
</span>
```

The parent must be `position: relative`. Keep the ring inside the card padding
or the card will clip it.

#### Spotlight — `.hf-spotlight`

```html
<div class="hf-card" style="overflow: hidden">
  <div class="hf-spotlight" data-anim="fade" data-anim-at="0.4"></div>
  …
</div>
```

A soft lime wash. One per scene.

#### ConnectorLine — `.hf-connector`

```html
<span class="hf-connector hf-connector--h" data-anim="grow-x" data-anim-at="0.4"></span>
<span class="hf-connector hf-connector--v" data-anim="grow-y" data-anim-at="0.4"></span>
```

`--h` grows from the left, `--v` from the top.

#### PulsingIndicator — `.hf-pulse`

```html
<span class="hf-pulse" data-anim="pulse" data-anim-at="0.8"><i class="hf-pulse__ring"></i></span>
```

One finite double beat. Never loop it.

#### CursorAnimation — `.hf-cursor`

```html
<svg class="hf-cursor" style="right: -20px; bottom: -28px" viewBox="0 0 24 24"
     data-anim="cursor" data-anim-at="0.7">
  <path d="M5 3l14 8-6.2 1.4L10 19 5 3Z" />
</svg>
```

Blue pointer with a white outline, as in the reference image.

#### IconBadge — `.hf-icon-badge`

```html
<span class="hf-icon-badge hf-icon-badge--sm">
  <svg class="hf-icon"><use href="assets/icons.svg#bag" /></svg>
</span>
```

Sizes: default 72, `--sm` 56, `--lg` 88. `--accent` adds a lime tint and glow.
Icons come from `assets/icons.svg`; add a `<symbol>` there rather than inlining
a new path in a scene.

#### Chips, buttons, swatches

- `.hf-chip` (`--lime`, `--warning`, `--danger`) for status and tags.
- `.hf-btn` (`--ghost`) for a storefront call to action.
- `.hf-swatch` / `.hf-spec` / `.hf-typescale` for design-system scenes.

---

## 8. Scene templates

Nine copy-ready scenes in `compositions/templates/`. Duplicate a file, change
the composition id and the copy, mount it in `index.html`.

| # | File | Use when | Key components |
|---|---|---|---|
| 01 | `01-intro.html` | Open a lesson or a section | SceneContainer centre, IconBadge, chips |
| 02 | `02-concept.html` | Explain one idea with a diagram | Split, Callout, List, IconBadge |
| 03 | `03-steps.html` | Teach a procedure | StepIndicator, ContentCard, mocks |
| 04 | `04-problem-solution.html` | Name a pain and the fix | Comparison, List |
| 05 | `05-features.html` | Break down 3 features | Grid, IconBadge, ProgressBar |
| 06 | `06-comparison.html` | Show a visual before/after | BeforeAfter, ProductGrid, ContentCard |
| 07 | `07-workflow.html` | Show states or stages | ProcessFlow, ContentCard |
| 08 | `08-stats.html` | Lead with numbers | MetricCard, BarChart, GrowthIndicator |
| 09 | `09-summary.html` | Close with takeaways | Grid, Callout, chips |

Durations are 6 s. A real lesson usually runs 5–10 s per scene; keep the header
and the one beat, add copy as needed.

### Showcase chapters

`compositions/showcase/` is the live reference: every component appears there in
the composition it was designed for. When the catalogue above is ambiguous, copy
the markup from these files.

| # | File | Demonstrates |
|---|---|---|
| 01 | `01-foundations.html` | palette, type scale, radius, grid, motion tokens |
| 02 | `02-layout.html` | split, bento, stack, grid and mock fills |
| 03 | `03-education.html` | step indicator, callouts, lists, chips |
| 04 | `04-flows.html` | process flow, numbered steps, timeline |
| 05 | `05-compare.html` | text comparison, before/after panels |
| 06 | `06-data.html` | metric cards, bar chart, stat comparison |
| 07 | `07-admin.html` | dashboard window, menu, product grid, order card |
| 08 | `08-storefront.html` | storefront preview, app card, settings, toggles |
| 09 | `09-motion.html` | pointer highlight, connectors, pulse, draw, growth |

---

## 9. Adding a new scene

1. Copy the closest template.
2. Change `data-composition-id` on `#root` and in `HF.register("…")`.
3. Set `data-duration`.
4. Write the header first and check it at frame 0.
5. Compose the body from existing components.
6. Add one `data-anim` beat. Do not animate the header.
7. Mount it in `index.html` with a `data-start` and `data-duration` that do not
   overlap the previous clip.
8. Run `npm run audit && npm run lint && npm run check`.
9. Snapshot the scene at its start and midpoint and look at both frames.

---

## 10. Dos and Don'ts

### Colour

```html
<!-- good -->
<span class="hf-lime">$12,480</span>

<!-- bad: raw hex, fails the audit -->
<span style="color:#95BF47">$12,480</span>
```

### Type

```html
<!-- good -->
<p class="hf-body hf-muted">Products stay the same when you switch themes.</p>

<!-- bad: below the floor, and a second font -->
<p style="font-family:Georgia;font-size:20px">Products stay the same…</p>
```

### Motion

```html
<!-- good: one beat, declared in HTML -->
<div class="hf-grid hf-grid--3" data-anim-group="fade-up" data-anim-at="0.3">…</div>

<!-- bad: CSS transition, unbounded loop -->
<style>.card { transition: all .3s; animation: pulse 2s infinite; }</style>
```

### Cards

```html
<!-- good: one accent card carries the point -->
<div class="hf-card hf-card--accent">…</div>

<!-- bad: every card glows, so nothing does -->
<div class="hf-card hf-card--accent">…</div>
<div class="hf-card hf-card--accent">…</div>
```

### Copy

- Good: “Add your first product.” / “Three screens, about four minutes.”
- Bad: “In this video we are going to be taking a look at how you can…”
- Good: one sentence per card, verb first.
- Bad: a paragraph inside a card.

---

## 11. Validation

### The audit (`npm run audit`)

Fails on:

- raw hex colours in any composition
- `font-family` in a scene
- CSS `transition` or `animation`
- `Math.random`, `Date.now`, `requestAnimationFrame`
- unknown `data-anim` values
- a missing `data-composition-id`
- references to the retired `signal-editorial.css`

### HyperFrames checks

`npm run lint` — static rules: template structure, timeline registration, banned
APIs.

`npm run check` — runtime errors, layout overflow/overlap, motion, contrast,
craft. It samples the whole film and reports:

- `container_overflow` / `canvas_overflow` — content outside its box.
  Fix the layout. Use `data-layout-allow-overflow` only for intentional
  decoration.
- `text_box_overflow` — a text block too tall for its container. Cut copy or
  give it room.
- `text_occluded` — text under an opaque element. Raise the stacking order or
  move it.
- `content_overlap` — two text blocks collide.
- `text_below_floor` — text under 28 px. Raise it, or mark real decoration with
  `data-layout-ignore`.
- `film_silent` — expected for a silent template. Add audio in the real edit.

### Snapshots

`npm run snapshot` writes start/mid frames and contact sheets. Read the contact
sheet first, then open the frames that look crowded.

### Render

`npm run render` produces the MP4. Check duration, the first frame, and one
frame per scene. A draft render is enough to catch missing fonts, invisible
text and timing errors.

---

## 12. Extending the system

Before adding anything, answer these:

1. Is there an existing component that already does this? Use it.
2. Is this a variant of an existing component? Add a modifier or a `data-*`
   value, not a new class.
3. Is it used in at least two scenes? If not, keep it inline in the scene.
4. Does it need a token that does not exist? Add the token to `tokens.css` first,
   then use it.

A new component needs:

- CSS in `styles/components.css`, built only from tokens
- a demo in the relevant showcase chapter
- a row in the catalogue above
- no JavaScript; if it animates, it uses `data-anim`

### Adding an icon

Add a `<symbol id="…" viewBox="0 0 24 24" fill="none" stroke="currentColor"
stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">` to
`assets/icons.svg`, then reference it with `<use>`. Keep the 24 px grid and the
1.6 stroke.

### Adding a scene template

Add `compositions/templates/NN-name.html`, mount it in `index.html`, add a row
to the template table, and add it to the showcase run. A template that is not
rendered is not finished.

---

## 13. Brand notes

- Wordmark: “Learn Shopify **Today**”, with *Today* in lime.
- Logo mark: the bag outline from `assets/icons.svg#bag` inside a lime-tinted
  rounded tile.
- Voice: direct, second person, no hype. “Add your first product”, not “Unlock
  the power of commerce”.
- Reference image: `brand/bento-grid-2.png`.
- Brand tokens: `brand/brand.css`.
- Shopify disclaimer: this is an independent educational channel. The admin and
  storefront components are illustrative and must not be presented as official
  Shopify UI.

---

## 14. Sound effects

The sound library lives in `assets/sfx/` and is built from Wyzowl's SFX Kit
(v1.0.0, CC0 1.0): 320 original, synthesised sounds licensed for any use,
commercial or not, with no credit required. Only the 11 cues below are bundled
(about 716 KB), not the whole 67 MB kit. Their exact source files, durations,
sync points and levels are recorded in `assets/sfx/registry.json`.

| File | Source (SFX Kit) | Use it for | Length | Sync point | Recommended volume |
|---|---|---|---|---|---|
| `click.wav` | `click-mouse-medium` | A cursor presses a link, button or menu item in a software demo | 92 ms | 9 ms (instant: the press) | 1.0 |
| `tap.wav` | `click-tap-medium` | A touchscreen button, card or tile is pressed | 22 ms | 9 ms (instant: the press lands) | 1.0 |
| `toggle.wav` | `click-toggle-medium` | A setting, checkbox or switch changes state | 42 ms | 31 ms (instant: the snap home) | 1.0 |
| `pop.wav` | `pop-medium-in` | A chip, badge, card, icon or number reaches full size | 60 ms | 11 ms (instant: full size) | 1.0 |
| `tick.wav` | `click-hover-medium` | A line of text or a highlight steps to the next item | 14 ms | 8 ms (instant) | 1.0 |
| `tick-soft.wav` | `click-hover-soft` | A secondary line or quieter highlight step; rotate with `tick` | 14 ms | 7 ms (instant) | 1.0 |
| `swipe.wav` | `swipe-medium-firm` | A finger or card swipes across the screen | 279 ms | 0 ms (action-start: as it starts) | 1.0 |
| `thud.wav` | `impact-medium-soft` | A card, panel or window lands and settles | 210 ms | 13 ms (instant: contact) | 0.9 |
| `draw.wav` | `writing-marker-draw` | A line, connector, arrow or chart path starts drawing | 1063 ms | 0 ms (action-start: as it starts) | 1.0 |
| `whoosh-short.wav` | `whoosh-medium-soft` | A scene cut, or a panel sliding in | 543 ms | 229 ms (move-peak) | 1.0 |
| `whoosh-long.wav` | `whoosh-slow-medium` | A large panel, map, or a long transition | 1002 ms | 438 ms (move-peak) | 0.8 |

### Mounting a cue

```html
<audio
  id="sfx-click-1"
  class="clip"
  src="assets/sfx/click.wav"
  data-start="2.391"
  data-duration="0.092"
  data-track-index="1"
  data-volume="1.00"
></audio>
```

- Effects go on `data-track-index="1"`; picture clips stay on `0`.
- `data-start` is local to the composition, like every other clip. A cue
  belongs to the scene that causes it, not to the root film.
- Every `<audio>` needs a unique `id`.
- Mount the sync point on the event: `data-start = eventTime − sync.at`.
  The sync point is the part of the file that meets the action (its loudest
  moment for hits/pops/clicks/whooshes; the very start for gestures like draws
  and swipes). `assets/sfx/registry.json` gives each cue's `sync.at`.
- For gestures whose length matches the file (`draw`, `swipe`, `whoosh-short`,
  `whoosh-long`), start the file at the moment the action starts (`sync.at = 0`
  or its move-peak placed at the move's fastest point).
- `npx hyperframes audio <file> --json` reports each file's peak, loudness and
  onset. Files peak at or under −3 dBTP and sit near −20 to −32 LUFS integrated;
  `data-volume` 0.5–1.0 is the working range for one-shots.
- When a cue's body overlaps a voiceover, lower it by its
  `under_voiceover_db` from `registry.json` so the voice stays clear.

### Reusable helpers

`scripts/sfx.js` exports `cue(name, eventTime)`, which returns the `<audio>`
attributes for any cue name mounted at an event time, using the registry's sync
point so you never have to compute `data-start` by hand:

```html
<script type="module" src="scripts/sfx.js"></script>
<script>
  import { cue } from "scripts/sfx.js";
  document.write(`<audio ${cue("pop", 2.3).attr()}></audio>`);
</script>
```

`cue(name)` returns `{ attr, start, duration, syncAt, cue }`; `cue(name).attr()`
renders the HTML attribute string including `id`, `src`, `data-start`,
`data-duration`, `data-track-index="1"`, `data-volume` and `data-source-id`.

### When to use one

- One cue per beat. Three in a 10 s scene is already busy.
- Only on a visible action: a click, a cut, a card landing, a number finishing.
- Rotate `tick` and `tick-soft` so repeated hits do not sound copied.
- No music bed ships with the template. Add one in the edit and keep hits
  3–6 dB over it; `npm run check` reports `film_silent` until a bed exists.
- No chimes, dings or melodic stingers. If you can hum the pitch, it does not
  belong in this system.

---

## 15. Sound design guidelines

These rules make every AI-generated scene use the same sound design, so the
channel's tutorials sound consistent across lessons and authors.

### Available sound effects

11 cues in `assets/sfx/`, each documented in `assets/sfx/registry.json`:

| Sound | Trigger (animation event) | Sync rule | Volume |
|---|---|---|---|
| `click.wav` | cursor reaches its target; button/link pressed | `eventTime − 0.009` | 1.0 |
| `tap.wav` | touchscreen tap target pressed | `eventTime − 0.009` | 1.0 |
| `toggle.wav` | toggle/switch flips | `eventTime − 0.031` | 1.0 |
| `pop.wav` | `scale-in` lands; chip/badge/icon reaches full size | `eventTime − 0.011` | 1.0 |
| `tick.wav` | each list item / text line appears; highlight steps | `eventTime − 0.008` | 1.0 |
| `tick-soft.wav` | secondary labels appear; rotate with `tick` | `eventTime − 0.007` | 1.0 |
| `swipe.wav` | card/tab swipe begins; `slide-left`/`slide-right` starts | file start at action start | 1.0 |
| `thud.wav` | card/panel/window lands and settles | `eventTime − 0.013` | 0.9 |
| `draw.wav` | `draw` / `grow-x` starts | file start at action start | 1.0 |
| `whoosh-short.wav` | scene cut; panel slides in | `eventTime − 0.229` | 1.0 |
| `whoosh-long.wav` | large panel/map slides; long transition | `eventTime − 0.438` | 0.8 |

### When to use each sound

- **UI interactions:** `click` (mouse), `tap` (touch), `toggle` (switch),
  `pop` (appearing chip/badge), `tick`/`tick-soft` (stepping highlight).
- **Motion:** `swipe` (a card or finger moving across glass), `whoosh-short`
  (a panel sliding in or a scene cut), `whoosh-long` (a large panel/map or
  long transition).
- **Weight:** `thud` (a card, panel or window landing), `pop` (something
  reaching full size).
- **Drawing:** `draw` (a line, connector, arrow or chart path being drawn).

Only `draw` and `swipe` start at the action's first frame (`sync.at = 0`).
Everything else starts at `eventTime − sync.at` so its sync point lands on the
event. Use `scripts/sfx.js` `cue(name, eventTime)` to compute `data-start`
automatically.

### Animation events that should trigger each effect

- `data-anim="draw"` starts → `draw.wav` (volume 1.0, overlaps voiceover by −1 dB)
- `data-anim="scale-in"` lands → `pop.wav`
- `data-anim="fade-up"` lands on a chip or badge → `pop.wav`
- cursor animation reaches target / button pressed → `click.wav`
- touchscreen target pressed / step becomes active → `tap.wav`
- toggle flips / settings row activates → `toggle.wav`
- `slide-left`/`slide-right` starts → `swipe.wav`
- card/panel finishes `fade-up` / window lands → `thud.wav`
- each list item or text line appears / highlight steps → `tick.wav`, rotated
  with `tick-soft.wav`
- large panel/map slides / long transition → `whoosh-long.wav` (0.8)
- scene cut / panel slides in / card crosses frame → `whoosh-short.wav`

### Sound synchronization rules

1. `data-start = eventTime − sync.at` — the sync point meets the event. Read
   `sync.at` from `assets/sfx/registry.json`, never guess it.
2. For `draw`/`swipe`/`whoosh-*`, the file runs with the action: start it at
   the action's first frame (`sync.at = 0`) or place its move-peak at the
   move's fastest point (about a quarter into an ease-out, three quarters into
   an ease-in).
3. A whoosh that suits the move's length dies away just before the landing,
   leaving the landing clear for `thud` or `pop`.
4. Cue durations are fixed; `data-duration` must equal the file's duration from
   `registry.json`. Do not stretch a cue with `data-playback-rate` beyond its
   `adapt.rate` range (recorded in `registry.json`; changes pitch with rate).
5. Trims need a short fade (10–50 ms) to avoid clicks; files start and end on
   silence already.

### Volume and mixing guidelines

- `data-volume = 1` is 0 dB, played as shipped. The kit is loudness-matched as
  a set; do not change levels for consistency between cues.
- Recommended volumes: 1.0 for every cue except `thud` (0.9) and
  `whoosh-long` (0.8).
- Where a cue's body overlaps a voiceover, lower it by its
  `under_voiceover_db` from `registry.json` (typically −1 to −3 dB) so the
  voice stays clear.
- Effects live on `data-track-index="1"`; picture stays on track 0.
- One cue per beat; three cues in a 10 s scene is already busy.
- No music bed ships with the template. Add one in the edit and keep hits
  3–6 dB over it. `npm run check` reports `film_silent` until a bed exists.

### How to introduce additional sound effects

1. Pick a sound from the SFX Kit (or another CC0 source) and copy only that
   file into `assets/sfx/` with its final project filename.
2. Add a row to `assets/sfx/registry.json`: source id/source file/source URL,
   duration, channels, sync point, timing, levels, `under_voiceover_db`,
   recommended volume, use/avoid, trigger, animation events and sha256.
3. Add a row to the table in §14 and a row to this section's table.
4. Verify with `npx hyperframes audio assets/sfx/<file>.wav --json` and confirm
   the sha256 matches `sounds.json` in the SFX Kit source.

### Rules against excessive or repetitive sound effects

- **One cue per beat.** Do not layer sounds on every element.
- **Only on visible actions.** No sound for a static card, a hover that goes
  unnoticed, or decoration that does not move.
- **Rotate `tick` and `tick-soft`** so repeated hits do not sound copied.
- **No music, chimes, dings or melodic stingers.** If you can hum the pitch,
  it does not belong in this system.
- **No "whoosh" on every entrance.** Reserve `whoosh-short`/`whoosh-long` for
  real transitions and large moves; small UI moves use `tick`/`pop`.
- **No looping cues.** `draw`/`swipe`/`whoosh` run once with their action.
  Never loop a sound effect.
- **Keep it quiet.** Calm, precise, practical — match the brand voice. A senior
  operator explaining, not a hype reel.
