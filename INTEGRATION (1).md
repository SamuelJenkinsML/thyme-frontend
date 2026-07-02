# Integrating V-FINAL into thyme-frontend

Two surfaces, one brand:

- **Marketing** (landing, docs, blog) — **cream paper** + **ink-green** text. Editorial, quiet, botanical.
- **Product** (app, dashboard, monitoring) — **dark neutral** shell. Operator-dense, zero brand green on chrome. The mascot reverses to cream.

---

## 1 · Drop the new mascot in

**File:** `assets/mascot-v-final.svg` → copy to `public/mascot.svg` in `thyme-frontend`.

- Uses `stroke="currentColor"` + `fill="currentColor"` throughout — recolor it with CSS `color`.
- `viewBox="0 0 240 240"`, no background baked in.
- No gradients, no filters. Crisp from 16 → ∞.

### Replace `components/landing/mascot.tsx`

```tsx
export function Mascot({ size = 240, className = '' }: { size?: number; className?: string }) {
  return (
    <span
      className={`inline-block ${className}`}   // color inherited from parent
      style={{ width: size, height: size }}
      aria-label="Thyme"
      role="img"
    >
      <svg viewBox="0 0 240 240" width={size} height={size}>
        {/* …paste the inner <g>/<path>/<line>/<circle> contents of mascot-v-final.svg here… */}
      </svg>
    </span>
  );
}
```

Usage:

```tsx
// On marketing (cream bg) — mascot is ink-green
<span className="text-thyme-ink"><Mascot size={36} /></span>

// On product (dark shell) — mascot is cream
<span className="text-thyme-cream"><Mascot size={28} /></span>
```

### Favicons (two files)

- `public/favicon.svg` — hard-code `stroke="#2E5A1C"` + `fill="#2E5A1C"` for browser tabs (usually light).
- `public/favicon-dark.svg` — hard-code `"#f4efe2"` for OS dark-mode pinning.

```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-dark.svg" media="(prefers-color-scheme: dark)">
```

PNG fallbacks at 64/32/16 against cream (Safari pinned tabs).

---

## 2 · Two palettes, one tailwind config

```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        thyme: {
          // Marketing (cream paper / ink-green)
          ink:      '#1f3d13',                 // primary text, strokes, buttons
          'ink-2':  '#2E5A1C',                 // hover, secondary ink
          leaf:     '#6B9B37',                 // accent chips, eyebrows
          pop:      '#b5bd3d',                 // rare highlight only
          cream:    '#f4efe2',                 // page background — paper
          'cream-2':'#ebe4d1',                 // secondary surface
          rule:     'rgba(31,61,19,0.18)',     // hairlines, dividers
        },
        // Product (dark operator shell)
        app: {
          bg:       'oklch(0.16 0.01 120)',    // shell background
          surface:  'oklch(0.20 0.01 120)',    // cards, panels
          'surface-2':'oklch(0.23 0.01 120)',  // hover / raised
          fg:       'oklch(0.95 0.01 120)',    // primary text
          'fg-2':   'oklch(0.72 0.01 120)',    // secondary text
          'fg-3':   'oklch(0.55 0.01 120)',    // muted
          border:   'oklch(0.30 0.01 120)',
          'border-2':'oklch(0.38 0.01 120)',
          // Semantic (product only — never marketing)
          ok:       '#4ade80',
          warn:     '#fbbf24',
          err:      '#f87171',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],       // marketing H1/H2 only
        sans:    ['"Space Grotesk"', 'sans-serif'], // marketing nav + wordmark
        body:    ['"DM Sans"', 'sans-serif'],   // marketing body
        ui:      ['"Geist"', 'sans-serif'],     // product UI
        mono:    ['"Geist Mono"', 'monospace'], // product code / numbers
      },
    },
  },
}
```

CSS-variable mirror (if you use them elsewhere):

```css
:root {
  /* Marketing */
  --thyme-ink: #1f3d13;  --thyme-ink-2: #2E5A1C;
  --thyme-leaf: #6B9B37; --thyme-pop: #b5bd3d;
  --thyme-cream: #f4efe2; --thyme-cream-2: #ebe4d1;
  --thyme-rule: rgba(31,61,19,0.18);

  /* Product */
  --app-bg: oklch(0.16 0.01 120); --app-surface: oklch(0.20 0.01 120);
  --app-fg: oklch(0.95 0.01 120); --app-fg-2: oklch(0.72 0.01 120);
  --app-border: oklch(0.30 0.01 120);
}
```

---

## 3 · Which palette fires where

Next.js App Router route groups make this trivial — you already use them (`app/(app)` for product, `app/page.tsx` for marketing). Apply the base theme at the route-group layout level:

```tsx
// app/layout.tsx — marketing default
<html lang="en" className="bg-thyme-cream text-thyme-ink font-body">…</html>

// app/(app)/layout.tsx — product override
<body className="bg-app-bg text-app-fg font-ui">…</body>
```

### Marketing surface

| Element | Token |
|---|---|
| Page background | `bg-thyme-cream` |
| Body copy | `text-thyme-ink` |
| Display headings (Fraunces 500, `-0.02em`) | `text-thyme-ink` |
| Primary button | `bg-thyme-ink text-thyme-cream hover:bg-thyme-ink-2` |
| Secondary button | `bg-thyme-cream-2 text-thyme-ink border-thyme-rule` |
| Link | `text-thyme-ink-2` |
| Hairlines, card borders | `border-thyme-rule` |
| Eyebrows, accent chips | `text-thyme-leaf` |
| Rare highlight (underline, pull-quote bar) | `bg-thyme-pop` |

### Product surface

| Element | Token |
|---|---|
| Shell background | `bg-app-bg` |
| Cards, panels | `bg-app-surface` |
| Primary text | `text-app-fg` |
| Secondary text | `text-app-fg-2` |
| Borders | `border-app-border` |
| Primary button | `bg-app-fg text-app-bg` (inverted, not green) |
| Status dots | `app.ok / app.warn / app.err` |
| Numbers, IDs, feature names | `font-mono text-app-fg` |

**Rule:** no `--thyme-*` tokens inside `app/(app)/**`. The product is intentionally un-branded — trust comes from density and precision, not color. The mascot in the sidebar renders in `text-thyme-cream` and is the *only* cross-surface brand moment.

---

## 4 · Typography

**Marketing**
- `font-display` **Fraunces** 500, letter-spacing `-0.02em` — H1, H2, blockquotes.
- `font-sans` **Space Grotesk** 700 — wordmark & nav only.
- `font-body` **DM Sans** 400 — paragraphs, cards, everything else.

**Product**
- `font-ui` **Geist** — all UI.
- `font-mono` **Geist Mono** — code, IDs, numeric columns.

Single Google Fonts link covers both:

```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500&family=Space+Grotesk:wght@400;500;700&family=DM+Sans:wght@400;500&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
```

---

## 5 · Lockup rules (both surfaces)

- Mascot + wordmark share a baseline; mascot center aligns to wordmark x-height.
- Gap = `0.25 × mascotSize`.
- Min mascot on-screen: 24px. At 16px the flower cluster simplifies to a dot — that's intended.

```tsx
// Marketing
<div className="flex items-center gap-3 text-thyme-ink">
  <Mascot size={36} />
  <span className="font-sans font-bold text-2xl tracking-tight">thyme</span>
</div>

// Product sidebar
<div className="flex items-center gap-2 text-thyme-cream">
  <Mascot size={24} />
  <span className="font-ui font-semibold text-base">thyme</span>
</div>
```

---

## 6 · Migration checklist

**Mascot**
- [ ] `public/mascot.svg` ← `mascot-v-final.svg`
- [ ] `public/favicon.svg` + `favicon-dark.svg` regenerated
- [ ] `components/landing/mascot.tsx` rewritten to inline SVG + `currentColor`

**Marketing (`app/(marketing)` or root)**
- [ ] `html` class = `bg-thyme-cream text-thyme-ink font-body`
- [ ] Hero CTA → `bg-thyme-ink text-thyme-cream`
- [ ] All remaining lime-green / gradient backgrounds removed from landing components
- [ ] `components/landing/floating-particles.tsx` recolored to `--thyme-rule` dots
- [ ] Hero background: flat `--thyme-cream` (drop the cream→white gradient)

**Product (`app/(app)`)**
- [ ] Layout override: `body` class = `bg-app-bg text-app-fg font-ui`
- [ ] Strip all `--thyme-leaf` / `--thyme-pop` usage from product components
- [ ] Sidebar logo uses `text-thyme-cream` wrapper around `<Mascot>`
- [ ] Semantic colors (`ok/warn/err`) replace any green-for-success

**Global**
- [ ] Tailwind config extended with `thyme.*` and `app.*` scales
- [ ] Google Fonts link updated with the combined family set
- [ ] OG image regenerated: cream bg, ink mascot, Fraunces headline

---

## 7 · Things to sanity-check after deploy

1. **Contrast** — ink `#1f3d13` on cream `#f4efe2` ≈ 11:1 (AAA). ink-2 ≈ 8.5:1. App `fg` on `bg` ≈ 14:1. All safe.
2. **No bleed between surfaces** — grep the product route group for `thyme-leaf`, `thyme-pop`, any hex starting `#8B`, `#B5`, `#6B9B`. The product should not contain them.
3. **Favicon in OS dark mode** — confirm `favicon-dark.svg` kicks in on Safari pinned tabs / macOS dock.
4. **OG image** — regenerate; Slack/Twitter previews currently use the old mascot.
5. **Performance particles** — if you kept `floating-particles.tsx`, ensure it uses `--thyme-rule` (near-invisible), not the old lime. At 15% opacity on cream it reads as texture, not decoration.

---

## 8 · What *not* to do

- Don't put the mascot on lime / bright green. It was drawn for cream and ink.
- Don't introduce brand green into the product UI. The dark neutral is the brand there.
- Don't pair Fraunces with Geist. Fraunces is marketing-only; Geist is product-only. Mixing muddies both surfaces.
- Don't scale the mascot below 16px — below that, ship a separate glyph (just the T + crossbar, no flower).
