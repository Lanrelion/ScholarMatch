# ScholarMatch — DESIGN.md
> Use with `/frontend-design` to generate UI components and pages.
> Every value in this file is authoritative. Do not substitute defaults.

---

## 0. Aesthetic Mandate

ScholarMatch is not a scholarship database. It is a life-direction tool.

The product should feel like:
**Spotify Discover Weekly × Airbnb Explore × Muji editorial × Kyoto atmosphere × Apple-level calm.**

Every screen must be:
- **Aspirational** — users feel they are building their future, not filling a form
- **Atmospheric** — mood, texture, and depth over flat utility
- **Cinematic** — motion that reveals rather than moves
- **Personal** — the product knows who you are and shows it

Never feel like:
- A government portal
- A SaaS admin dashboard
- A neon AI chatbot
- A startup template

---

## 1. Color System — "Kyoto Dawn / Kyoto Night"

### Light Mode — Kyoto Dawn

```css
:root {
  /* Surfaces */
  --color-bg:              #F7F4EE;   /* parchment — base */
  --color-surface:         #FBFAF7;   /* elevated — cards, panels */
  --color-surface-hover:   #F1ECE4;   /* warm hover */

  /* Ink */
  --color-ink:             #161514;   /* primary text */
  --color-ink-secondary:   #6B675F;   /* captions, metadata */
  --color-ink-tertiary:    #9C9690;   /* placeholders, disabled */

  /* Accent — Moss */
  --color-moss:            #5F6F52;   /* primary CTA, matched badges */
  --color-moss-light:      #E8EDE4;   /* moss surface / pill bg */
  --color-moss-dark:       #3F4F38;   /* moss hover */

  /* Accent — Clay */
  --color-clay:            #A67C52;   /* secondary accent */
  --color-clay-light:      #F2EAE1;   /* clay surface */

  /* Accent — Gold */
  --color-gold:            #C9A86A;   /* premium, highlights */
  --color-gold-light:      #F5EDD8;   /* gold surface */

  /* Borders */
  --color-border:          #E7E1D7;   /* mist — default border */
  --color-border-strong:   #D4CCBF;   /* stronger divider */

  /* Status */
  --color-urgent:          #B85450;   /* ≤7 days deadline */
  --color-urgent-surface:  #F9EEEE;
  --color-warning:         #A07840;   /* ≤30 days deadline */
  --color-warning-surface: #FAF2E6;
  --color-success:         #5F6F52;   /* = moss */
  --color-success-surface: #E8EDE4;   /* = moss-light */

  /* Overlays */
  --color-scrim:           rgba(22, 21, 20, 0.48);
  --color-grain-opacity:   0.035;
}
```

### Dark Mode — Kyoto Night

```css
[data-theme="dark"] {
  --color-bg:              #111111;
  --color-surface:         #171717;
  --color-surface-hover:   #1E1E1E;

  --color-ink:             #F4F1EB;
  --color-ink-secondary:   #B8B1A8;
  --color-ink-tertiary:    #6B6560;

  --color-moss:            #8DA67D;
  --color-moss-light:      #1E2B1A;
  --color-moss-dark:       #A8C096;

  --color-clay:            #C49A70;
  --color-clay-light:      #2A1E14;

  --color-gold:            #D8B97E;
  --color-gold-light:      #2A2214;

  --color-border:          #2B2B2B;
  --color-border-strong:   #363636;

  --color-urgent:          #D4706C;
  --color-urgent-surface:  #2A1515;
  --color-warning:         #C4975A;
  --color-warning-surface: #281E0E;
  --color-success:         #8DA67D;
  --color-success-surface: #1E2B1A;

  --color-scrim:           rgba(0, 0, 0, 0.72);
}
```

---

## 2. Typography System

### Font Stack

```css
/* Editorial — for heroes, headlines, pull quotes, empty states */
--font-editorial: 'Cormorant Garamond', 'Playfair Display', Georgia, serif;

/* Functional UI — for navigation, forms, body, labels, buttons */
--font-ui: 'Geist', 'DM Sans', system-ui, sans-serif;

/* Monospace — for codes, IDs, API references */
--font-mono: 'Geist Mono', 'JetBrains Mono', monospace;
```

Load via Google Fonts or self-host:
```html
<!-- Priority load — editorial + UI -->
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
```

### Type Scale

```css
/* Display — Hero, cinematic reveals */
--text-display:   clamp(3.5rem, 7vw, 6.5rem);
--text-display-weight: 300;
--text-display-leading: 0.95;
--text-display-font: var(--font-editorial);
--text-display-tracking: -0.02em;

/* Heading 1 — Page titles */
--text-h1:        clamp(2.25rem, 4vw, 3.5rem);
--text-h1-weight: 400;
--text-h1-font:   var(--font-editorial);
--text-h1-tracking: -0.015em;

/* Heading 2 — Section titles */
--text-h2:        clamp(1.5rem, 2.5vw, 2.25rem);
--text-h2-weight: 400;
--text-h2-font:   var(--font-editorial);

/* Heading 3 — Card titles, modal titles */
--text-h3:        1.25rem;   /* 20px */
--text-h3-weight: 500;
--text-h3-font:   var(--font-ui);

/* Body — Default text */
--text-body:      1rem;      /* 16px */
--text-body-font: var(--font-ui);
--text-body-weight: 400;
--text-body-leading: 1.6;

/* UI Small — Labels, captions, metadata */
--text-sm:        0.875rem;  /* 14px */
--text-xs:        0.75rem;   /* 12px */
--text-xs-tracking: 0.06em;

/* Label — uppercase section headers */
--text-label: 0.6875rem;     /* 11px */
--text-label-weight: 500;
--text-label-tracking: 0.1em;
--text-label-transform: uppercase;
```

### Typography Rules
- Editorial font (`Cormorant Garamond`): hero copy, screen headings, pull quotes, empty state messages
- UI font (`DM Sans` / `Geist`): everything interactive — nav, forms, buttons, body text, metadata
- Never mix weights heavier than 500 on editorial font
- Line breaks in display text are intentional — do not break mid-phrase
- Italics in editorial font are encouraged for emotional emphasis

---

## 3. Spacing System

Japanese-inspired whitespace: err toward too much, never too little.

```css
--space-1:   0.25rem;    /*  4px */
--space-2:   0.5rem;     /*  8px */
--space-3:   0.75rem;    /* 12px */
--space-4:   1rem;       /* 16px */
--space-5:   1.25rem;    /* 20px */
--space-6:   1.5rem;     /* 24px */
--space-8:   2rem;       /* 32px */
--space-10:  2.5rem;     /* 40px */
--space-12:  3rem;       /* 48px */
--space-16:  4rem;       /* 64px */
--space-20:  5rem;       /* 80px */
--space-24:  6rem;       /* 96px */
--space-32:  8rem;       /* 128px */

/* Layout */
--max-width-app:      1440px;
--max-width-content:  1180px;
--max-width-reading:  720px;
--sidebar-width:      240px;
--sidebar-collapsed:  64px;

/* Radii */
--radius-sm:   6px;
--radius-md:   10px;
--radius-lg:   16px;
--radius-xl:   24px;
--radius-pill: 100px;
--radius-full: 9999px;
```

### Whitespace Philosophy
- Section padding on desktop: `clamp(80px, 12vw, 160px)` vertical
- Card internal padding: `24px 28px` minimum
- Sidebar padding: `16px`
- Between headline and subtext: at least `var(--space-6)`
- Grid gaps: `24px` minimum, `40px` preferred on large layouts
- Never stack more than 4 elements without a breathing break

---

## 4. Motion System

This is the product's emotional signature. Every interaction should feel **soft, floating, atmospheric**.

### Easing Curves

```css
/* Primary — smooth deceleration (use for almost everything) */
--ease-primary: cubic-bezier(0.22, 1, 0.36, 1);

/* Reveal — elements entering screen */
--ease-reveal:  cubic-bezier(0.16, 1, 0.3, 1);

/* Exit — elements leaving */
--ease-exit:    cubic-bezier(0.4, 0, 1, 1);

/* Spring — tactile interactions (save button, toggles) */
--ease-spring:  cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Duration Scale

```css
--duration-instant:   80ms;    /* focus rings, very fast states */
--duration-fast:     180ms;    /* hover states */
--duration-base:     300ms;    /* most transitions */
--duration-moderate: 500ms;    /* page element reveals */
--duration-slow:     700ms;    /* page transitions, large reveals */
--duration-cinematic: 1200ms;  /* hero animations, onboarding reveals */
```

### Animation Patterns

**Scroll Reveal (Framer Motion)**
```jsx
// Standard reveal — apply to every section
const revealVariants = {
  hidden: { opacity: 0, y: 32, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

// Stagger container
const staggerContainer = {
  visible: {
    transition: { staggerChildren: 0.08 }
  }
}
```

**Card Float (CSS)**
```css
.card-float {
  transition:
    transform var(--duration-fast) var(--ease-primary),
    box-shadow var(--duration-fast) var(--ease-primary);
}
.card-float:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(22, 21, 20, 0.12);
}
```

**Cinematic Match Reveal (Onboarding Screen 6)**
```jsx
// Cards float in from below with staggered delay
// Compatibility percentages count up from 0
// Background dims then lifts to parchment
const cardReveal = {
  hidden: { opacity: 0, y: 60, scale: 0.95, filter: 'blur(8px)' },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
    transition: {
      delay: i * 0.15,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1]
    }
  })
}
```

**Page Transition**
```jsx
// Wrap pages — fade + slight upward drift
const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] } }
}
```

**Background Grain (Atmospheric Texture)**
```css
/* Apply to body or hero sections */
.grain-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1000;
  opacity: var(--color-grain-opacity);
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 200px;
  mix-blend-mode: multiply;
}
```

### Libraries Required
```json
{
  "framer-motion": "^11.x",
  "lenis": "^1.x",
  "@studio-freight/react-lenis": "^0.x"
}
```

Initialise Lenis for smooth scroll on all non-modal pages:
```jsx
// app/layout.tsx — wrap with ReactLenis
import { ReactLenis } from '@studio-freight/react-lenis'
```

---

## 5. Global Component System

### 5.1 Buttons

**Primary Button — Moss**
```css
.btn-primary {
  background: var(--color-moss);
  color: #FFFFFF;
  font-family: var(--font-ui);
  font-size: var(--text-sm);
  font-weight: 500;
  letter-spacing: 0.01em;
  padding: 12px 24px;
  border-radius: var(--radius-pill);
  border: none;
  cursor: pointer;
  transition:
    background var(--duration-fast) var(--ease-primary),
    transform var(--duration-fast) var(--ease-primary),
    box-shadow var(--duration-fast) var(--ease-primary);
}
.btn-primary:hover {
  background: var(--color-moss-dark);
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(95, 111, 82, 0.3);
}
.btn-primary:active {
  transform: translateY(0);
  box-shadow: none;
}
```

**Secondary Button — Clay outlined**
```css
.btn-secondary {
  background: transparent;
  color: var(--color-clay);
  border: 1px solid var(--color-clay);
  font-family: var(--font-ui);
  font-size: var(--text-sm);
  font-weight: 400;
  padding: 11px 23px;
  border-radius: var(--radius-pill);
  transition: all var(--duration-fast) var(--ease-primary);
}
.btn-secondary:hover {
  background: var(--color-clay-light);
}
```

**Ghost Button**
```css
.btn-ghost {
  background: transparent;
  color: var(--color-ink-secondary);
  border: none;
  font-family: var(--font-ui);
  font-size: var(--text-sm);
  padding: 12px 16px;
  border-radius: var(--radius-md);
  position: relative;
  transition: color var(--duration-fast) var(--ease-primary);
}
.btn-ghost::after {
  content: '';
  position: absolute;
  bottom: 6px;
  left: 16px;
  right: 16px;
  height: 1px;
  background: var(--color-ink-secondary);
  transform: scaleX(0);
  transition: transform var(--duration-fast) var(--ease-primary);
}
.btn-ghost:hover { color: var(--color-ink); }
.btn-ghost:hover::after { transform: scaleX(1); }
```

**Icon Button (Save / Bookmark)**
```css
.btn-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background var(--duration-fast) var(--ease-primary),
    transform var(--duration-fast) var(--ease-spring),
    border-color var(--duration-fast) var(--ease-primary);
}
.btn-icon:hover {
  background: var(--color-moss-light);
  border-color: var(--color-moss);
}
.btn-icon.saved {
  background: var(--color-moss-light);
  border-color: var(--color-moss);
  /* Icon color: var(--color-moss) */
}
.btn-icon:active {
  transform: scale(0.92);
}
```

---

### 5.2 Scholarship Card

The card is the product's primary interaction surface. Every pixel is intentional.

**Structure**
```
┌─────────────────────────────────┐
│  [University image — 180px h]   │  ← overflow hidden, scale on hover
│  [Country pill]   [Save button] │
├─────────────────────────────────┤
│  Scholarship title              │  ← Cormorant Garamond, 18px, 400
│  University · Country           │  ← DM Sans, 13px, secondary ink
├─────────────────────────────────┤
│  [Moss pill] [Clay pill]        │  ← Funding · Degree level
├─────────────────────────────────┤
│  Compatibility ───────────── 91%│  ← Match bar (moss fill)
│  ✓ Nigerian  ✓ Masters  ✗ GRE  │  ← Inline eligibility signals
├─────────────────────────────────┤
│  Due Mar 15          View →     │  ← Deadline + CTA
└─────────────────────────────────┘
```

**CSS**
```css
.scholarship-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition:
    transform var(--duration-fast) var(--ease-primary),
    box-shadow var(--duration-fast) var(--ease-primary),
    border-color var(--duration-fast) var(--ease-primary);
  cursor: pointer;
}
.scholarship-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 4px 8px rgba(22, 21, 20, 0.04),
    0 16px 40px rgba(22, 21, 20, 0.10);
  border-color: var(--color-border-strong);
}
.scholarship-card .card-image {
  height: 180px;
  overflow: hidden;
}
.scholarship-card .card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 600ms var(--ease-primary);
}
.scholarship-card:hover .card-image img {
  transform: scale(1.04);
}
.scholarship-card .card-body {
  padding: 20px 22px 22px;
}
.scholarship-card .card-title {
  font-family: var(--font-editorial);
  font-size: 1.125rem;
  font-weight: 400;
  color: var(--color-ink);
  line-height: 1.3;
  margin-bottom: 4px;
}
.scholarship-card .card-meta {
  font-family: var(--font-ui);
  font-size: 0.8125rem;
  color: var(--color-ink-secondary);
  margin-bottom: 14px;
}
```

**Eligibility Signals (Matching Checklist)**
This is a signature UX feature. Show inline: ✓ pass (moss) · ✗ fail (urgent red) · ◐ partial (clay).

```jsx
// Always show all failures. Show max 3 passes.
const EligibilitySignals = ({ breakdown }) => (
  <div className="eligibility-signals">
    {Object.entries(breakdown)
      .filter(([_, v]) => v.label)
      .map(([key, signal]) => (
        <span key={key} className={`signal signal--${signal.pass ? 'pass' : signal.partial ? 'partial' : 'fail'}`}>
          {signal.pass ? '✓' : signal.partial ? '◐' : '✗'} {signal.label}
        </span>
      ))}
  </div>
)
```

```css
.eligibility-signals {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 12px 0;
}
.signal {
  font-family: var(--font-ui);
  font-size: 0.75rem;
  padding: 3px 8px;
  border-radius: var(--radius-pill);
}
.signal--pass    { color: var(--color-moss);    background: var(--color-moss-light); }
.signal--partial { color: var(--color-warning);  background: var(--color-warning-surface); }
.signal--fail    { color: var(--color-urgent);   background: var(--color-urgent-surface); }
```

---

### 5.3 Form Inputs

Animated floating-label pattern. Calm, minimal, premium.

```css
.field-wrapper {
  position: relative;
  margin-bottom: var(--space-6);
}
.field-input {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--color-border);
  border-radius: 0;
  padding: 20px 0 10px;
  font-family: var(--font-ui);
  font-size: 1rem;
  color: var(--color-ink);
  transition: border-color var(--duration-fast) var(--ease-primary);
  outline: none;
}
.field-input:focus {
  border-bottom-color: var(--color-moss);
}
.field-label {
  position: absolute;
  top: 20px;
  left: 0;
  font-family: var(--font-ui);
  font-size: 1rem;
  color: var(--color-ink-tertiary);
  pointer-events: none;
  transition:
    transform var(--duration-fast) var(--ease-primary),
    font-size var(--duration-fast) var(--ease-primary),
    color var(--duration-fast) var(--ease-primary);
}
.field-input:focus + .field-label,
.field-input:not(:placeholder-shown) + .field-label {
  transform: translateY(-20px);
  font-size: 0.75rem;
  color: var(--color-moss);
  letter-spacing: 0.04em;
}
.field-line {
  position: absolute;
  bottom: 0; left: 0;
  height: 2px;
  background: var(--color-moss);
  width: 0;
  transition: width var(--duration-base) var(--ease-primary);
}
.field-input:focus ~ .field-line {
  width: 100%;
}
```

---

### 5.4 Onboarding Option Cards

Used across onboarding screens for degree, field, financial type selections.

```css
.option-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 18px 22px;
  cursor: pointer;
  transition:
    border-color var(--duration-fast) var(--ease-primary),
    background var(--duration-fast) var(--ease-primary),
    transform var(--duration-fast) var(--ease-spring);
  position: relative;
  overflow: hidden;
}
.option-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--color-moss-light);
  opacity: 0;
  transition: opacity var(--duration-fast) var(--ease-primary);
}
.option-card:hover {
  border-color: var(--color-border-strong);
  transform: translateY(-1px);
}
.option-card:hover::before { opacity: 1; }
.option-card.selected {
  border-color: var(--color-moss);
  background: var(--color-moss-light);
}
.option-card .option-icon {
  font-size: 2rem;
  margin-bottom: 10px;
}
.option-card .option-title {
  font-family: var(--font-editorial);
  font-size: 1.1rem;
  color: var(--color-ink);
}
.option-card .option-subtitle {
  font-family: var(--font-ui);
  font-size: 0.8125rem;
  color: var(--color-ink-secondary);
  margin-top: 4px;
}
```

---

### 5.5 Progress Indicators

**Onboarding Progress Bar (top)**
```css
.progress-bar-track {
  width: 100%;
  height: 2px;
  background: var(--color-border);
  border-radius: var(--radius-full);
  overflow: hidden;
}
.progress-bar-fill {
  height: 100%;
  background: var(--color-moss);
  border-radius: var(--radius-full);
  transition: width 500ms var(--ease-primary);
}
```

**Radial Readiness Score (Dashboard Card)**
```jsx
// SVG circle with stroke-dashoffset animation
// Circle radius: 28px, strokeWidth: 3px
// Colour: var(--color-moss) → var(--color-gold) → var(--color-clay) by score
const RadialScore = ({ score }) => {
  const r = 28, c = 2 * Math.PI * r
  return (
    <svg width="72" height="72" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx="36" cy="36" r={r} fill="none" stroke="var(--color-border)" strokeWidth="3" />
      <circle
        cx="36" cy="36" r={r}
        fill="none"
        stroke="var(--color-moss)"
        strokeWidth="3"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - score)}
        strokeLinecap="round"
        style={{ transition: `stroke-dashoffset 1s var(--ease-primary)` }}
      />
    </svg>
  )
}
```

---

### 5.6 Deadline Badge

```jsx
const DeadlineBadge = ({ daysLeft }) => {
  const config =
    daysLeft <= 7   ? { label: `${daysLeft}d left`, css: 'urgent' }  :
    daysLeft <= 30  ? { label: `${daysLeft}d left`, css: 'warning' } :
                     { label: formatDate(deadline),  css: 'neutral' }
  return (
    <span className={`deadline-badge deadline-badge--${config.css}`}>
      {config.label}
    </span>
  )
}
```

```css
.deadline-badge {
  font-family: var(--font-ui);
  font-size: 0.75rem;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: var(--radius-pill);
}
.deadline-badge--urgent  { color: var(--color-urgent);  background: var(--color-urgent-surface); }
.deadline-badge--warning { color: var(--color-warning); background: var(--color-warning-surface); }
.deadline-badge--neutral { color: var(--color-ink-secondary); background: var(--color-surface-hover); }
```

---

### 5.7 Navigation — Sidebar (Desktop)

```
┌──────────┐
│   SM     │  ← Logo mark (24px moss square, SM white)
│          │
│  ≡       │  ← Discover
│  ♡       │  ← Saved
│  ⏰       │  ← Deadlines
│  ✉        │  ← Applications
│          │
│  ○       │  ← Profile avatar (bottom)
└──────────┘
```

```css
.sidebar {
  width: var(--sidebar-width);
  height: 100vh;
  position: fixed;
  left: 0; top: 0;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  transition: width 300ms var(--ease-primary);
  z-index: 100;
}
.sidebar-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  font-family: var(--font-ui);
  font-size: 0.875rem;
  color: var(--color-ink-secondary);
  transition:
    background var(--duration-fast) var(--ease-primary),
    color var(--duration-fast) var(--ease-primary);
  text-decoration: none;
}
.sidebar-nav-item:hover,
.sidebar-nav-item.active {
  background: var(--color-moss-light);
  color: var(--color-moss);
}
```

### Bottom Navigation (Mobile)

```css
.bottom-nav {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  height: 64px;
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  padding: 0 8px;
  padding-bottom: env(safe-area-inset-bottom);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 100;
}
.bottom-nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 8px 4px;
  border-radius: var(--radius-md);
  font-family: var(--font-ui);
  font-size: 0.625rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--color-ink-tertiary);
  transition: color var(--duration-fast) var(--ease-primary);
  text-decoration: none;
}
.bottom-nav-item.active {
  color: var(--color-moss);
}
```

---

### 5.8 Loading System — Scholarship Matching

Replace all spinners. ScholarMatch uses atmospheric skeleton loading.

**Discovery Feed Skeleton**
```jsx
// Three skeleton cards with staggered pulse
const SkeletonCard = ({ delay = 0 }) => (
  <div className="skeleton-card" style={{ animationDelay: `${delay}ms` }}>
    <div className="skeleton-image" />    {/* 180px height */}
    <div className="skeleton-body">
      <div className="skeleton-line long" />   {/* title */}
      <div className="skeleton-line medium" /> {/* meta */}
      <div className="skeleton-line short" />  {/* pill */}
      <div className="skeleton-bar" />         {/* match bar */}
    </div>
  </div>
)
```

```css
@keyframes skeleton-shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
.skeleton-card,
.skeleton-line,
.skeleton-image,
.skeleton-bar {
  background: linear-gradient(
    90deg,
    var(--color-surface-hover) 25%,
    var(--color-border) 37%,
    var(--color-surface-hover) 63%
  );
  background-size: 800px 100%;
  animation: skeleton-shimmer 1.4s ease infinite;
  border-radius: var(--radius-md);
}
```

**Cinematic Matching State (initial AI processing)**
```jsx
// When first loading matches: full-screen atmospheric reveal
// 1. Background dims to dark scrim
// 2. Centered text: "Finding your matches..." (Cormorant Garamond, 32px, italic)
// 3. Subtle dot animation beneath
// 4. Cards float in once ready
const MatchingReveal = () => (
  <motion.div
    className="matching-overlay"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.p
      className="matching-text"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.8 } }}
    >
      Finding your matches...
    </motion.p>
  </motion.div>
)
```

---

## 6. Page Specifications

### 6.1 Landing Page

**Vibe**: Kyoto luxury editorial meets Airbnb Explore. Cinematic. Unhurried.

**Hero Section** — asymmetric split grid
```
Desktop layout (1440px):
Left 55%:
  - Oversized section label: "SCHOLARSHIP DISCOVERY" (11px, moss, uppercase, tracking)
  - Giant display headline (Cormorant, 6.5rem, 300 weight):
    "Your next chapter
     begins somewhere
     unexpected."
  - Subtext (DM Sans, 18px, secondary ink):
    "Discover scholarships curated around your
     ambitions, background, and future."
  - Two CTAs: [Start matching →] (primary) + [Watch how it works] (ghost)
  - Floating proof strip: "4M+ African students · 500+ scholarships · Free forever"

Right 45%:
  - 3 floating ScholarshipCards (stacked, layered depth)
  - Cards offset vertically — parallax on scroll
  - Subtle ambient glow behind cards (moss + gold radial gradient, 20% opacity)
```

**Scroll Sections**
1. **"How it works"** — numbered editorial steps with cinematic illustrations
   - Step 1: Create your profile
   - Step 2: Get matched instantly
   - Step 3: Track and apply
2. **"Featured Scholarships"** — horizontal scrolling card row
3. **"Global Opportunities"** — interactive destination map (hover country → scholarship count preview)
4. **Student Stories** — full-width editorial quote cards (Cormorant, large, centered)
5. **Final CTA** — atmospheric full-bleed section with moss background, white text

**Motion**:
- On page load: grain fades in → headline reveals line by line → cards drift up
- Scroll: parallax on hero image, cards drift, background grain shifts
- All sections: fade + translate reveal on scroll enter

---

### 6.2 Authentication Pages

**Vibe**: Quiet luxury onboarding. The entry point to a new chapter.

**Layout** — 50/50 split on desktop, full-screen card on mobile
```
Left panel (50%):
  - Background: atmospheric photography overlay
    (library, corridor, campus, minimal architecture)
  - Grain texture over image
  - Soft dark gradient from left edge
  - One editorial pull quote:
    "The right funding changes everything."
  - ScholarMatch wordmark, bottom-left

Right panel (50%):
  - Background: var(--color-bg)
  - Centered floating card (max-width 420px)
  - Logo mark at top
  - Headline: "Continue your journey" (Cormorant, 28px)
  - Subtext: "Sign in or create your account to discover scholarships matched to you."
  - Clerk auth form, styled to match our system
  - Inputs: floating label pattern (see 5.3)
```

---

### 6.3 Onboarding Flow (6 Screens)

Full-screen experience. This must feel like **creating your future**, not filling a form.

**Shell** — persistent across all 6 screens:
```
Top bar:
  - Left: ScholarMatch mark
  - Center: "Step N of 6" (DM Sans, 12px, secondary)
  - Right: Progress bar (fills moss, 2px height, full width below top bar)

Content area:
  - Max width: 560px, centered
  - Generous vertical centering with offset (40% from top)

Bottom:
  - Back button (ghost, left) + Continue button (primary, right)
  - Fixed, not sticky — always visible
```

**Screen 1 — Dreams & Ambitions**
```
Headline (Cormorant, 40px):
  "What are you hoping
   to become?"

Subtext:
  "This shapes everything we recommend for you."

Option cards (2-column grid, large):
  🔬 Researcher     🚀 Founder
  ⚙️ Engineer        🩺 Doctor
  🎨 Creative        ⚖️ Policymaker

Each card: editorial name + 1-line description
Selected: moss border, moss surface, check icon top-right
```

**Screen 2 — Countries of Interest**
```
Headline:
  "Where do you imagine yourself?"

Subtext:
  "Tap the countries you're open to. Or explore — no commitment yet."

UI: Interactive world map with atmospheric gradients
  - Country hover: name + "X scholarships available" tooltip
  - Selected: moss fill
  - Fallback: searchable pill list of 20 most popular destinations

Quick chips below map:
  🇬🇧 UK  🇩🇪 Germany  🇸🇪 Sweden  🇳🇱 Netherlands  🇨🇦 Canada
  🇫🇷 France  🇺🇸 USA  🇦🇺 Australia
```

**Screen 3 — Academic Profile**
```
Headline:
  "Tell us about your studies."

Left side: form fields
  - Degree level (3 option cards: BSc · Masters · PhD)
  - Field of study (searchable with suggestion chips)
  - GPA + scale selector

Right side: animated profile completion ring
  - Radial progress fills as fields are completed
  - Label: "Profile {N}% complete"
  - This visual creates urgency to complete
```

**Screen 4 — Financial Needs**
```
Headline:
  "What kind of support matters most?"

Subtext:
  "We'll prioritise scholarships that match your needs."

Elegant multi-select:
  - Fully funded (tuition + living)
  - Tuition only
  - Living stipend
  - Research funding
  - Partial support also welcome

Visual: Elegant pill-style multi-select, not checkboxes
```

**Screen 5 — Personality Matching**
```
Headline:
  "Help us understand how you work."

Subtext:
  "This lets us find programmes that fit your style, not just your grades."

Spotify-inspired preference sliders:
  Research-heavy ←────●────→ Practical
  Structured     ←────●────→ Flexible
  Urban campus   ←────●────→ Quiet setting
  Competitive    ←────●────→ Collaborative

Small copy under each: context about what this means
```

**Screen 6 — Cinematic Match Reveal**
```
This is the product's most important moment.

Sequence:
  1. Screen goes dark (smooth fade, 600ms)
  2. Centered text appears: "Searching across 500+ scholarships..."
     (Cormorant, 28px, italic, white, center)
  3. 2-second atmospheric pause with subtle dot pulse
  4. Background lifts to parchment (var(--color-bg))
  5. Headline reveals:
     "We found [N] scholarships aligned with your future."
     (Cormorant, 40px, ink)
  6. Cards float in with stagger (4 visible, suggest more behind)
  7. Each card's compatibility % counts up from 0

DO NOT skip this animation sequence. This is the product's emotional climax.
```

---

### 6.4 Dashboard

**Vibe**: Spotify Discover Weekly + Linear precision. Calm intelligence.

**Layout** — sidebar + main content
```
Desktop:
  [240px sidebar] [calc(100vw - 240px) main]

Mobile:
  [Full width] + [Fixed 64px bottom nav]
```

**Top Bar**
```
Left:
  - Ambient greeting: "Good evening, Lanre." (Cormorant, 22px)
  - Subtext: "12 new matches since yesterday." (DM Sans, 13px, secondary)

Right:
  - Search icon (ghost button)
  - Notification bell + badge
  - Profile avatar (32px circle)
```

**Feed Layout** — editorial rhythm, NOT uniform rows
```
Row 1: "Best Matches" — horizontal scroll row (3.5 cards visible)
Row 2: Section break + editorial label "Hidden Gems"
Row 3: 2-column grid of cards
Row 4: Full-width featured scholarship (cinematic treatment)
Row 5: "Deadlines This Week" — compact urgency cards
Row 6: Load more
```

**Filter Pills** (horizontal scroll, no wrap)
```
All matches · Fully funded · University-specific · Masters · My destination
```
Active: moss pill. Inactive: border pill. Smooth pill transition.

**Empty State**
```
Icon: Atmospheric SVG illustration (not a generic icon)
Headline (Cormorant, 28px, italic): "Your next opportunity hasn't been discovered yet."
Subtext: "Complete your profile to unlock personalised matches."
CTA: [Complete profile →]
```

---

### 6.5 Saved Page

**Vibe**: Pinterest board meets calm productivity.

**Layout**: Masonry grid (2 cols mobile, 3 cols desktop)

**Collection Headers**:
```
User-created collections: "Canada Masters" · "Europe Funded" · "AI Research"
+ [Create collection] button — moss ghost style
```

**Saved Item States**:
- Normal: standard card
- Deadline approaching (≤7 days): amber accent, pulsing deadline indicator
- Changed/updated: clay left border, "Updated" chip
- Closed: muted opacity (0.5), "Closed" chip, strike-through deadline

---

### 6.6 Scholarship Detail Page

**Vibe**: Calm editorial magazine article.

```
Hero: university/funder image, full-bleed, 280px height
  - Grain overlay
  - Back button (white ghost, top-left)
  - Save + Share floating actions (top-right)

Content (max-width 720px, centered, generous padding):
  - Section label: "FULLY FUNDED · MASTERS" (11px, moss, uppercase)
  - Title (Cormorant, 36px, 400): Full scholarship name
  - Funder (DM Sans, 14px, secondary)

  - 2×2 Stats grid: Funding · Deadline · Level · Application type

  - Match score section:
    - Large compatibility % (Cormorant, 48px, moss)
    - Radial progress circle
    - Full eligibility breakdown (all signals, expanded)
    - Original eligibility text (collapsible, bordered block)

  - About section (editorial prose)
  - Fields covered (chips)

Sticky bottom CTA:
  [Save] icon btn  +  [Apply now →] primary  +  [Share] icon btn
```

---

### 6.7 Error States

All error states use editorial voice. Never generic.

| Error | Headline | Subtext | Action |
|---|---|---|---|
| No matches found | "No matches yet — but that can change." | "Try adjusting your profile or broadening your field." | [Edit profile] |
| Network/offline | "You're offline right now." | "Saved scholarships are still available below." | [View saved] |
| API error | "Something unexpected happened." | "We're looking into it. Try refreshing in a moment." | [Retry] |
| Rate limited | "Give us just a moment." | "You've been busy — we appreciate the enthusiasm." | [Wait then retry] |
| 404 scholarship | "This scholarship may have closed." | "It happens. Here are similar ones we found for you." | [See similar] |
| Empty saved page | "Nothing saved yet." | "Start exploring to find scholarships worth saving." | [Discover] |
| Session expired | "Your session has ended." | "Sign back in to continue where you left off." | [Sign in] |

All error states use:
- Cormorant Garamond for headline
- DM Sans for subtext
- Atmospheric SVG illustration (not a generic emoji or icon)
- Generous vertical whitespace

---

## 7. Atmospheric Background System

Dynamic background tones shift by time-of-day. Implemented via CSS variables updated by a client-side hook.

```typescript
// hooks/useAtmosphericTheme.ts
const getAtmosphericTone = (hour: number) => {
  if (hour >= 5  && hour < 9)  return 'dawn'      // soft gold warmth
  if (hour >= 9  && hour < 17) return 'midday'    // neutral parchment
  if (hour >= 17 && hour < 20) return 'dusk'      // warm clay
  return 'night'                                    // cool dark
}
```

```css
[data-atmosphere="dawn"]   { --color-bg: #F5F0E8; }
[data-atmosphere="midday"] { --color-bg: #F7F4EE; }
[data-atmosphere="dusk"]   { --color-bg: #F4EDE0; }
[data-atmosphere="night"]  { --color-bg: #111111; --color-surface: #171717; /* full dark mode */ }
```

---

## 8. Implementation Stack

```json
{
  "required": {
    "framework": "Next.js 16 App Router",
    "styling": "Tailwind CSS 4 + CSS custom properties",
    "animation": "Framer Motion 11",
    "smooth-scroll": "Lenis + @studio-freight/react-lenis",
    "icons": "Phosphor Icons (phosphor-react)",
    "fonts": "Cormorant Garamond (Google Fonts) + DM Sans (Google Fonts)"
  },
  "optional-enhancements": {
    "map": "react-simple-maps OR @react-three/fiber globe",
    "charts": "Recharts (already installed)",
    "texture": "SVG grain filter (inline, no package)"
  },
  "avoid": [
    "Inter or Roboto as primary font",
    "Purple gradient color schemes",
    "shadcn default themes without customisation",
    "Generic spinner loading states",
    "Glassmorphism overuse",
    "Bouncing or elastic animations"
  ]
}
```

---

## 9. Responsive Breakpoints

```css
/* Mobile first */
@media (min-width: 640px)  { /* sm  — large phones */ }
@media (min-width: 768px)  { /* md  — tablets */ }
@media (min-width: 1024px) { /* lg  — desktop (sidebar appears) */ }
@media (min-width: 1280px) { /* xl  — large desktop */ }
@media (min-width: 1440px) { /* 2xl — wide desktop (max-width cap) */ }

/* Mobile-specific */
@media (max-width: 1023px) {
  /* Bottom nav replaces sidebar */
  /* Single column layouts */
  /* Reduced animation complexity */
}
```

---

## 10. Accessibility

- All interactive elements: minimum 44×44px touch target
- Focus rings: 2px solid var(--color-moss), 2px offset — never removed
- Colour contrast: all text meets WCAG AA (4.5:1 for body, 3:1 for large text)
- Reduced motion: all animations respect `prefers-reduced-motion`
- Screen reader: all icon-only buttons have `aria-label`
- Skeleton loading: `aria-busy="true"` on containers while loading

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  .grain-overlay { display: none; }
}
```

---

*End of DESIGN.md*
*Use `/frontend-design` and reference this file for all ScholarMatch UI work.*
*Every colour, spacing, and motion value in this document is authoritative.*
