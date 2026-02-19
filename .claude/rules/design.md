# Design System — Block Lotto / CaosEngine

## Global theme

Absolute dark mode. NEVER use white or light gray backgrounds.
NEVER add `dark:` variants — the app is always dark.
`darkMode` is disabled in tailwind.config.js.

## Semantic tokens (tailwind.config.js)

### Backgrounds and surfaces

| Tailwind class | Value | Usage |
|---|---|---|
| `bg-surface-base` | #07070a | Global background for all pages |
| `bg-surface-elevated` | #0e0e14 | Cards, modals, panels, sidebar |
| `bg-white/[0.03]` | — | Very subtle surfaces over base |
| `bg-white/[0.04]` | — | Hover states, inputs |
| `bg-black/75` | — | Modal backdrop overlay |

### Primary action — Amber/Gold

| Tailwind class | Value | Usage |
|---|---|---|
| `bg-action-primary` | #f59e0b | Primary CTA button |
| `bg-action-hover` | #fbbf24 | CTA hover state |
| `text-action-primary` | #f59e0b | Accent text, monetary values |
| `from-action-primary to-action-hover` | gradient | Payment buttons |
| `border-action-primary/50` | — | Input focus border |
| `focus:ring-action-primary/20` | — | Focus ring |
| `border-t-action-primary` | — | Loading spinner |
| `bg-action-primary/10` | — | Badge backgrounds |

### System accents (existing lotto-* tokens)

| Token | Color | Usage |
|---|---|---|
| `lotto-green-400` | #4ade80 | Active indicators, "Live", positive states |
| `lotto-green-500` | #22c55e | Base lotto system color |
| `lotto-green-500/10` | — | Green badge backgrounds |
| `lotto-orange-400` | #fb923c | Icons and alert/energy accents |
| `lotto-blue-500` | #06b6d4 | Exclusive use for the "B" logo block |

## Borders

| Class | Usage |
|---|---|
| `border-white/[0.04]` | Very subtle separators |
| `border-white/[0.05]` | Section borders, page dividers |
| `border-white/[0.07]` | Navbar, dialog panels |
| `border-white/10` | Input and card borders |
| `border-white/15` | Secondary button borders |

## Text (opacity scale over white)

NEVER use `text-gray-*` or `text-slate-*`.

| Class | Semantic usage |
|---|---|
| `text-white` | Main titles, important values |
| `text-white/70` | Secondary buttons (hover) |
| `text-white/45` | Cancel buttons, low-priority actions |
| `text-white/35` | Descriptions, subtitles |
| `text-white/25` | Labels, section headers |
| `text-white/20` | Metadata, secondary data |
| `text-white/15` | Decorative icons |

## Typography

Load via `useLottoDisplayFonts` hook or equivalent:

- `Cormorant Garamond` — display headings (elegant serif)
- `JetBrains Mono` — numeric data, addresses, values
- `DM Sans` — general body text

## Component patterns

### Primary CTA button

```tsx
className="rounded-xl bg-action-primary px-5 py-2.5 text-sm font-semibold text-black hover:bg-action-hover"
```

### Secondary button (Cancel)

```tsx
className="rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-white/45 hover:border-white/20 hover:text-white/70"
```

### Payment button (gradient)

```tsx
className="rounded-xl bg-gradient-to-r from-action-primary to-action-hover px-4 py-3 text-sm font-semibold text-black"
```

### Input

```tsx
className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-action-primary/50 focus:ring-1 focus:ring-action-primary/20"
```

### Card / Panel

```tsx
className="rounded-2xl border border-white/10 bg-surface-elevated p-6"
```

### Loading spinner

```tsx
className="h-8 w-8 animate-spin rounded-full border-2 border-action-primary/20 border-t-action-primary"
```

## Forbidden colors

- NO `bg-white` as page or card background
- NO `bg-gray-*`, `bg-slate-*` as main backgrounds
- NO `text-gray-*`, `text-slate-*` for text
- NO `dark:` variants of any class
- NO `blue-500` / `blue-600` as primary action color
- NO `red-*` / `orange-*` as button gradient (use amber/action-*)
- NO `bg-[#0F0F1B]` — use `bg-surface-base` (#07070a)
- NO `bg-gradient-to-br from-slate-800/50 to-slate-900/30` on cards
