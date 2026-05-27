# ScholarMatch — Dashboard Design Spec
> Use with `/frontend-design` to build the dashboard.
> Inspiration: Linear · Arc · Netflix · Spotify · Readwise Reader · Pinterest

---

## Design Mandate

The dashboard must feel **intelligent, alive, premium, and personal.**

The student should feel like they opened something that was built
specifically for them — not a generic scholarship database, not
an admin panel, not a filtered table.

Think: **Readwise Reader's calm focus × Spotify's personalized discovery
× Linear's precision × Netflix's featured content.**

NOT:
- Airtable clone
- Admin dashboard
- SaaS table with filters
- Government portal with search bar

---

## File Targets

```
app/dashboard/page.tsx                    ← server component, data fetch
app/dashboard/layout.tsx                  ← sidebar + bottom nav shell

components/dashboard/
  DashboardHeader.tsx                     ← greeting + search + nav
  TopMatch.tsx                            ← Netflix-style featured card
  DiscoveryFeed.tsx                       ← editorial card feed
  ScholarshipCard.tsx                     ← individual card component
  FilterBar.tsx                           ← floating filter chips
  SearchOverlay.tsx                       ← full-screen search
  SectionLabel.tsx                        ← reusable section header
```

---

## 0. Layout Architecture

### Desktop (1024px+)

```
┌─────────────────────────────────────────────────────────┐
│  NAVBAR (64px, sticky)                                  │
├────────────┬────────────────────────────────────────────┤
│            │                                            │
│  SIDEBAR   │  MAIN CONTENT                             │
│  240px     │  scroll independently                     │
│  fixed     │                                            │
│            │  ┌──────────────────────────────────────┐ │
│  Discover  │  │  GREETING HEADER                     │ │
│  Saved     │  │  TOP MATCH (featured)                │ │
│  Deadlines │  │  FILTER BAR                          │ │
│  Alerts    │  │  DISCOVERY FEED                      │ │
│  Profile   │  └──────────────────────────────────────┘ │
│            │                                            │
└────────────┴────────────────────────────────────────────┘
```

### Mobile (below 1024px)

```
┌─────────────────────────────┐
│  GREETING HEADER            │
│  TOP MATCH                  │
│  FILTER PILLS (scroll)      │
│  DISCOVERY FEED             │
│  [cards stack vertically]   │
├─────────────────────────────┤
│  BOTTOM NAV (64px, fixed)   │
│  Discover · Saved · Alerts  │
│  Deadlines · Profile        │
└─────────────────────────────┘
```

---

## 1. SIDEBAR (Desktop Only)

**Vibe**: Linear sidebar — calm, minimal, purposeful. Nothing decorative.

```css
.sidebar {
  width: 240px;
  height: 100vh;
  position: fixed;
  left: 0; top: 0;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  padding: 0;
  z-index: 40;
}
```

### Sidebar Structure

```
┌──────────────────────────┐
│  [SM]  ScholarMatch      │  ← Logo + wordmark, 64px height, border-bottom
├──────────────────────────┤
│                          │
│  ○  Discover             │  ← active: moss left border + moss bg
│  ♡  Saved           [4] │  ← badge: count of saved
│  ⏰  Deadlines            │
│  ⚡  Alerts          [2] │  ← badge: urgent alerts
│                          │
├──────────────────────────┤
│  ────────── (divider)    │
│                          │
│  ⚙  Profile              │  ← bottom section
│  [Avatar] Lanre          │  ← user identity, very bottom
└──────────────────────────┘
```

### Sidebar Nav Item Styles

```css
/* Base */
.sidebar-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  margin: 2px 8px;
  border-radius: var(--radius-md);
  font-family: var(--font-ui);
  font-size: 14px;
  font-weight: 400;
  color: var(--color-ink-secondary);
  cursor: pointer;
  text-decoration: none;
  transition: all 180ms var(--ease-primary);
  position: relative;
}

/* Hover */
.sidebar-item:hover {
  background: var(--color-surface-hover);
  color: var(--color-ink);
}

/* Active */
.sidebar-item.active {
  background: var(--color-moss-light);
  color: var(--color-moss);
  font-weight: 500;
}

/* Active: left accent bar */
.sidebar-item.active::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 18px;
  background: var(--color-moss);
  border-radius: 2px;
}

/* Badge */
.sidebar-badge {
  margin-left: auto;
  background: var(--color-moss);
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: var(--radius-pill);
  min-width: 20px;
  text-align: center;
}
```

---

## 2. GREETING HEADER

**Vibe**: Arc Browser's personal greeting — warm, specific, contextual.

```
Layout: flex, space-between, align-items flex-start
Padding: 28px 32px 0
Background: var(--color-bg)

LEFT BLOCK:
  Greeting (Cormorant Garamond, 28px, weight 300, ink):
    Time-aware:
      5am–11am:  "Good morning, [firstName]."
      12pm–4pm:  "Good afternoon, [firstName]."
      5pm–8pm:   "Good evening, [firstName]."
      9pm–4am:   "Late night, [firstName]."

  Sub-line (DM Sans, 14px, secondary ink, margin-top 4px):
    Dynamic based on data:
      If new matches since last visit:
        "[N] new scholarships match your profile."
      If deadline approaching:
        "One of your saved scholarships closes in [N] days."
      If nothing urgent:
        "You have [total] scholarships waiting to be explored."

RIGHT BLOCK:
  Search trigger button:
    Background: var(--color-surface)
    Border: 1px solid var(--color-border)
    Border-radius: var(--radius-pill)
    Padding: 10px 16px
    Width: 220px (desktop) / icon only (mobile)
    
    Content: flex row
      MagnifyingGlass icon (Phosphor, 15px, tertiary ink)
      "Search scholarships..." (DM Sans, 14px, tertiary ink)
      Keyboard shortcut: "⌘K" (DM Sans, 11px, border color, right)
    
    onClick: open SearchOverlay (see section 5)
    Hover: border-color var(--color-border-strong)

  Notification bell (right of search):
    Bell icon (Phosphor, 20px)
    Dot badge if unread alerts
    onClick: router.push('/alerts')
```

---

## 3. TOP MATCH — Featured Card

**Vibe**: Netflix Featured Banner × Spotify Daily Mix cover.
The top match is **prestigious, exciting, rare.**
It should feel like the system found something special just for this person.

```
Margin: 24px 32px 0
Border-radius: var(--radius-xl)  ← 24px
Overflow: hidden
Min-height: 280px (desktop) / 220px (mobile)
Position: relative
Cursor: pointer
onClick: router.push('/scholarship/[id]')
```

### Background

```css
.top-match {
  background:
    linear-gradient(
      135deg,
      #0A2818 0%,    /* deep forest */
      #1A3A24 40%,   /* mid moss */
      #2C4A1E 70%,   /* lighter moss */
      #3D5A2E 100%   /* warm edge */
    );
  position: relative;
  overflow: hidden;
}

/* Grain overlay */
.top-match::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,..."); /* grain */
  pointer-events: none;
  z-index: 1;
}

/* Ambient glow (top-right) */
.top-match::after {
  content: '';
  position: absolute;
  top: -40px;
  right: -40px;
  width: 300px;
  height: 300px;
  background: radial-gradient(
    circle,
    rgba(201,168,106,0.15) 0%,
    transparent 70%
  );
  pointer-events: none;
  z-index: 1;
}
```

### Content Layout (z-index: 2)

```
DESKTOP: two-column flex
  Left: text content (flex 1)
  Right: floating UI preview (340px)

MOBILE: single column

LEFT COLUMN (padding: 36px 32px):

  TOP BADGES ROW (flex, gap 8px, margin-bottom 20px):
    Badge 1: "YOUR TOP MATCH"
      Background: rgba(255,255,255,0.12)
      Color: rgba(255,255,255,0.9)
      Border: 1px solid rgba(255,255,255,0.2)
      Font: DM Sans, 11px, weight 500, uppercase, tracking 0.1em
      Padding: 4px 12px, border-radius pill

    Badge 2: "[match%]% Match"
      Background: var(--color-moss)
      Color: white
      Same font/padding as badge 1

  TITLE (Cormorant Garamond):
    Size: clamp(1.5rem, 2.5vw, 2.25rem)
    Weight: 400
    Color: #F4F1EB  ← warm white
    Line-height: 1.2
    Max-width: 460px
    Margin-bottom: 12px

  FUNDER (DM Sans, 15px, rgba(255,255,255,0.65)):
    "{funder} · {country flag} {country}"
    Margin-bottom: 24px

  ELIGIBILITY STRIP (flex row, gap 12px, flex-wrap):
    Each passing criterion as a mini chip:
      Background: rgba(255,255,255,0.1)
      Border: 1px solid rgba(255,255,255,0.15)
      Color: rgba(255,255,255,0.8)
      Font: DM Sans, 12px
      Padding: 4px 10px, border-radius pill
      
      Show: ✓ [nationality] · ✓ [degree] · ✓ [field]
      Max 3 chips visible, "+N more" if needed

  CTA ROW (margin-top: 28px, flex, gap 12px):
    Button 1 — "View scholarship →"
      Background: white
      Color: var(--color-moss-dark)
      Padding: 12px 24px, border-radius pill
      Font: DM Sans, 14px, weight 500
      Hover: background rgba(255,255,255,0.9), translateY(-1px)
      onClick: router.push('/scholarship/[id]')

    Button 2 — Save (icon only):
      Width: 44px, height: 44px
      Background: rgba(255,255,255,0.1)
      Border: 1px solid rgba(255,255,255,0.2)
      Border-radius: full
      Icon: BookmarkSimple (white, 18px)
      Hover: background rgba(255,255,255,0.2)
      onClick: save scholarship

  DEADLINE INDICATOR (below CTA):
    DM Sans, 13px, rgba(255,255,255,0.5)
    "Closes [deadline formatted] · [N days away]"
    If ≤30 days: color rgba(255,180,50,0.9) — warm amber

RIGHT COLUMN (desktop only):
  Floating card preview:
    Actual ScholarshipCard component
    Transformed: scale(0.88), slight right rotation (2deg)
    Box-shadow: 0 32px 64px rgba(0,0,0,0.4)
    Pointer-events: none (decorative)
    Opacity: 0.9
```

### Top Match Hover Animation

```css
.top-match:hover {
  /* Subtle background shift */
}
.top-match:hover .top-match-glow {
  transform: scale(1.1);
  transition: transform 600ms ease;
}
.top-match:hover .top-match-card-preview {
  transform: scale(0.9) rotate(1deg) translateY(-4px);
  transition: transform 400ms var(--ease-primary);
}
```

### Framer Motion Entry

```tsx
initial: { opacity: 0, y: 24, scale: 0.98 }
animate: { opacity: 1, y: 0, scale: 1 }
transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
```

---

## 4. FILTER BAR

**Vibe**: Airbnb category filters × Spotify mood filters.
Floating, scannable, instant.

```
Layout:
  Horizontal scroll row
  Overflow-x: auto, scroll-snap-type: x mandatory
  Hide scrollbar: scrollbar-width none / ::-webkit-scrollbar display none
  Padding: 16px 32px
  Gap: 8px

FILTER CHIPS:

Default state:
  Background: var(--color-surface)
  Border: 1px solid var(--color-border)
  Color: var(--color-ink-secondary)
  Font: DM Sans, 13px, weight 400
  Padding: 8px 16px
  Border-radius: var(--radius-pill)
  White-space: nowrap
  Cursor: pointer
  Transition: all 180ms var(--ease-primary)
  scroll-snap-align: start

Active state:
  Background: var(--color-ink)
  Border-color: var(--color-ink)
  Color: var(--color-bg)
  Font-weight: 500

Hover (inactive):
  Background: var(--color-surface-hover)
  Border-color: var(--color-border-strong)

CHIPS (in order):
  "All matches"         ← default active
  "Fully funded"
  "University-specific"
  "Masters"
  "My destination"      ← only shows if targetCountryOfStudy set
  "Closing soon"        ← scholarships with deadline ≤30 days
  "New this week"       ← scholarships added in last 7 days

SORT CONTROL (right side, after chips):
  Separator: 1px vertical line, var(--color-border), height 24px
  "Sort: Best match ↓" (DM Sans, 13px, secondary)
  Dropdown on click:
    Best match
    Deadline (soonest)
    Recently added
    Funding amount

CLIENT-SIDE FILTERING:
  Filtering happens instantly on the already-fetched data.
  No re-fetch on filter change.
  Smooth transition: cards fade out → new cards fade in
  Use AnimatePresence with layout animation

MOBILE: same horizontal scroll, same behavior
```

---

## 5. SEARCH OVERLAY

**Vibe**: Linear command palette × Algolia instant search.
Full-screen takeover. Instant results.

```
TRIGGER: Click search bar OR press ⌘K / Ctrl+K

OVERLAY:
  Position: fixed, inset 0
  Background: rgba(22, 21, 20, 0.72), backdrop-blur: 8px
  z-index: 100
  onClick backdrop: close overlay

SEARCH PANEL:
  Position: absolute
  Top: 15% of viewport
  Left: 50%, transform: translateX(-50%)
  Width: min(640px, 92vw)
  Background: var(--color-surface)
  Border: 1px solid var(--color-border)
  Border-radius: var(--radius-xl)
  Box-shadow: 0 32px 80px rgba(22,21,20,0.2)
  Overflow: hidden

  Framer Motion:
    initial: { opacity: 0, scale: 0.97, y: -10 }
    animate: { opacity: 1, scale: 1, y: 0 }
    transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] }

SEARCH INPUT ROW:
  Padding: 18px 20px
  Flex row, gap 12px, align-items center
  Border-bottom: 1px solid var(--color-border)

  Icon: MagnifyingGlass (Phosphor, 20px, secondary ink, flex-shrink 0)
  Input:
    Font: DM Sans, 16px, ink
    Placeholder: "Search by scholarship, country, field..."
    Background: transparent, border: none, outline: none
    Flex: 1
    Auto-focused when overlay opens
  ESC label: "esc" chip (11px, border, tertiary), flex-shrink 0

RESULTS AREA:
  Max-height: 420px
  Overflow-y: auto
  Padding: 8px

  IF EMPTY (no query yet):
    Show SUGGESTED SEARCHES:
      Label: "POPULAR SEARCHES" (11px, uppercase, tertiary, padding 10px 12px)
      List of chips: "Chevening" · "Fully funded Masters" ·
                     "DAAD Germany" · "Swedish scholarships" ·
                     "No GPA requirement" · "Commonwealth"
      Each chip: same filter chip style, small
      onClick: fill search input + filter

  IF TYPING (results):
    Real-time filter of scholarships
    Debounce: 200ms
    Match against: title, funder, fields[], country

    Each result row:
      Padding: 10px 12px
      Border-radius: var(--radius-md)
      Flex row, gap 12px, align-items center
      Cursor: pointer
      Hover: background var(--color-surface-hover)

      Left:
        Match score badge (32×32px circle, moss bg if >80%, else surface)
        Score: DM Sans, 11px, weight 600
      
      Middle:
        Title: DM Sans, 14px, 500, ink
        Meta: DM Sans, 12px, secondary — "{funder} · {country}"
      
      Right:
        Deadline badge (from DeadlineBadge component)
      
      onClick: close overlay + router.push('/scholarship/[id]')

    MATCH HIGHLIGHTING:
      Matching characters in title shown in moss color
      e.g. searching "cheven" → "Cheven-ing Scholarships"

  IF NO RESULTS:
    Center text:
      "No scholarships found for '{query}'"
      DM Sans, 14px, secondary
    Suggestion: "Try 'funded Masters' or search by country"
```

---

## 6. DISCOVERY FEED

**Vibe**: Readwise Reader's editorial calm × Pinterest's visual rhythm.
NOT a table. NOT a list. An editorial discovery experience.

```
Padding: 24px 32px 80px  ← bottom padding for mobile nav
Max-width: var(--content-width) on very large screens
```

### Feed Structure

```
┌─────────────────────────────────────────────────────┐
│  TOP MATCH (section 3 — full width)                 │
├─────────────────────────────────────────────────────┤
│  FILTER BAR (horizontal scroll)                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  "Best matches" [label]                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐             │
│  │  Card   │  │  Card   │  │  Card   │  →           │  ← horizontal scroll
│  └─────────┘  └─────────┘  └─────────┘             │
│                                                     │
│  "Closing soon" [label]  — urgency section          │
│  ┌──────────────────┐  ┌──────────────────┐         │
│  │  Full-width-ish  │  │  Full-width-ish  │         │  ← 2-column grid
│  └──────────────────┘  └──────────────────┘         │
│                                                     │
│  "University-specific" [label]                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │  Card    │  │  Card    │  │  Card    │           │  ← 3-column grid
│  └──────────┘  └──────────┘  └──────────┘          │
│                                                     │
│  "More matches"                                     │
│  [continues in masonry or 2-col grid]               │
│                                                     │
│  [Load more] button                                 │
└─────────────────────────────────────────────────────┘
```

### Section Labels

```tsx
// Reusable SectionLabel component
<SectionLabel
  label="Best matches"
  count={12}
  action={{ text: "See all", href: "..." }}
/>

// Style:
// Label: Cormorant Garamond, 22px, weight 400, ink
// Count: DM Sans, 13px, secondary, margin-left 8px
// Action link: DM Sans, 13px, moss, margin-left auto
```

### "Best Matches" Row — Horizontal Scroll

```
Overflow-x: auto, scroll-snap-type: x mandatory
Display: flex, gap: 16px
Padding-bottom: 8px (for card shadow clearance)
Hide scrollbar

Each card:
  Width: 300px (desktop) / 280px (mobile)
  Flex-shrink: 0
  scroll-snap-align: start
```

### "Closing Soon" Row — Urgency Grid

```
2-column grid (desktop) / 1-column (mobile)
Cards here have:
  Red left border: 3px solid var(--color-urgent)
  Background: var(--color-urgent-surface) subtle tint
  Deadline badge: prominent, red

Section label shows: "⚠ Closing soon"
  Icon: WarningCircle (Phosphor, 14px, urgent red)
  Label color: var(--color-urgent)
```

### Empty State Between Filters

```
Never a blank white space.
If a filter returns 0 results:
  Show message inline where cards would be:
  "No scholarships match this filter."
  Below: 2-3 alternative cards from the unfiltered set
  Label: "You might also like"
```

---

## 7. SCHOLARSHIP CARD

**Vibe**: Pinterest editorial card × Cosmos app depth.
Every card should feel worth tapping into.

### Card Anatomy

```
┌───────────────────────────────────┐
│  [University/funder image — 160px]│  ← aspect-ratio 16/9, overflow hidden
│  [Country flag]  [Save ♡]         │  ← overlaid on image
├───────────────────────────────────┤
│  Scholarship title                │  ← Cormorant, 17px, 400
│  Funder · Country                 │  ← DM Sans, 13px, secondary
├───────────────────────────────────┤
│  [Funded] [Masters] [Close]       │  ← pills: funding · degree · urgency
├───────────────────────────────────┤
│  Match  ──────────────────── 91%  │  ← progress bar, moss fill
│  ✓ Nigerian  ✓ Masters  ✗ GRE    │  ← eligibility signals
├───────────────────────────────────┤
│  View details →    [Share ↗]     │  ← CTA row
└───────────────────────────────────┘
```

### Card CSS

```css
.scholarship-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 200ms var(--ease-primary),
    box-shadow 200ms var(--ease-primary),
    border-color 200ms var(--ease-primary);
  position: relative;
}

.scholarship-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 4px 12px rgba(22,21,20,0.04),
    0 20px 48px rgba(22,21,20,0.10);
  border-color: var(--color-border-strong);
}
```

### Card Image Area

```css
.card-image {
  height: 160px;
  overflow: hidden;
  position: relative;
}
.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 600ms var(--ease-primary);
}
.scholarship-card:hover .card-image img {
  transform: scale(1.05);
}

/* Gradient overlay on image for readability */
.card-image::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 40%,
    rgba(22,21,20,0.3) 100%
  );
}
```

If no image available, use a gradient based on universityCountry
or funder name (deterministic color from string hash):

```tsx
const getFallbackGradient = (seed: string) => {
  const gradients = [
    'linear-gradient(135deg, #1a3a4a, #2d5a6e)',  // ocean
    'linear-gradient(135deg, #2d1b69, #5f6f52)',  // twilight
    'linear-gradient(135deg, #1a2a1a, #3d5a2e)',  // forest
    'linear-gradient(135deg, #4a1a1a, #6e3a2d)',  // terracotta
    'linear-gradient(135deg, #1a1a3a, #2d3a6e)',  // midnight
  ]
  const index = seed.charCodeAt(0) % gradients.length
  return gradients[index]
}
```

### Overlaid Actions (on image)

```
Country flag (bottom-left of image, above gradient):
  Position: absolute, bottom 10px, left 12px, z-index 2
  Flag emoji + country name
  Background: rgba(0,0,0,0.4), backdrop-blur: 4px
  Color: white
  Font: DM Sans, 12px, weight 500
  Padding: 4px 8px, border-radius var(--radius-md)

Save button (top-right of image):
  Position: absolute, top 10px, right 10px, z-index 2
  Width: 36px, height: 36px
  Background: rgba(255,255,255,0.15), backdrop-blur: 8px
  Border: 1px solid rgba(255,255,255,0.25)
  Border-radius: full
  Icon: BookmarkSimple (white, 16px)
  
  SAVED STATE:
    Background: var(--color-moss)
    Icon: BookmarkSimpleFill (white)
    Spring scale animation on toggle: scale 0.85 → 1.15 → 1.0
  
  onClick: stopPropagation + toggle save
```

### Card Body

```
Padding: 16px 18px 18px

TITLE (Cormorant Garamond):
  Size: 17px, weight 400
  Color: var(--color-ink)
  Line-height: 1.3
  Max 2 lines, ellipsis after
  Margin-bottom: 4px

META (DM Sans, 13px, secondary ink):
  "{funder} · {country}"
  Margin-bottom: 12px

PILLS ROW (flex, flex-wrap, gap 6px, margin-bottom 12px):
  Funding pill:
    "Fully funded" → bg moss-light, color moss
    "Partial" → bg surface-hover, color secondary
  
  Degree pill:
    "Masters" / "PhD" / "BSc"
    bg surface-hover, color secondary, border border
  
  Deadline pill (from DeadlineBadge component):
    Urgency-aware colors
  
  Each pill: DM Sans, 11px, weight 500, px-2 py-0.5, radius pill

MATCH BAR ROW (flex, align-items center, gap 8px):
  Label: "Match" (DM Sans, 11px, tertiary, flex-shrink 0)
  Track: flex-1, height 3px, bg border, radius full, overflow hidden
  Fill: height 3px, bg moss, radius full
        Width: {matchScore * 100}%
        Animate on mount: 0% → {matchScore * 100}%
        Transition: 800ms cubic-bezier(0.22, 1, 0.36, 1) 200ms delay
  Pct: DM Sans, 12px, weight 600, moss, flex-shrink 0

ELIGIBILITY SIGNALS (margin-top 8px):
  From EligibilitySignals component
  Show max 3 signals (mix pass + fail)
  Always show failures first

CTA ROW (flex, align-items center, margin-top 14px, padding-top 14px,
         border-top 1px solid var(--color-border)):
  "View details →" (DM Sans, 13px, moss, weight 500)
  flex: 1
  
  Share icon button (right):
    Width: 30px, height: 30px
    Icon: ShareNetwork (Phosphor, 14px, secondary)
    Hover: color moss, background moss-light, border-radius full
    onClick: stopPropagation + Web Share API
```

### Card Hover Expansion (Desktop)

```
On hover, the card can show a quick-preview tooltip
that floats to the right of the card (if space permits):

.card-preview-tooltip:
  Position: absolute
  Left: calc(100% + 12px)
  Top: 0
  Width: 280px
  Background: var(--color-surface)
  Border: 1px solid var(--color-border)
  Border-radius: var(--radius-xl)
  Box-shadow: 0 8px 32px rgba(22,21,20,0.12)
  Padding: 16px
  z-index: 20
  
  Shows: full eligibility breakdown, description snippet,
         university name if university-specific
  
  Framer Motion:
    initial: { opacity: 0, x: -8, scale: 0.97 }
    animate: { opacity: 1, x: 0, scale: 1 }
    Duration: 150ms

  Only show if card is not on the rightmost column
  (prevent overflow off-screen)
```

---

## 8. SKELETON LOADING SYSTEM

Replace all spinners entirely.

```
On initial dashboard load:
  Show TopMatch skeleton + 6 card skeletons
  Stagger their appearance: each appears 80ms after previous

TopMatch skeleton:
  Same dimensions as TopMatch card
  Background: linear-gradient shimmer (see below)
  Border-radius: var(--radius-xl)

Card skeleton:
  Image area: h-[160px], shimmer
  Title: h-4, w-3/4, shimmer, margin-top 16px
  Meta: h-3, w-1/2, shimmer, margin-top 8px
  Pills: flex row, 3 × h-5 w-16, shimmer, margin-top 12px
  Match bar: h-2 full-width, shimmer, margin-top 12px

Shimmer animation:
```
```css
@keyframes shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-surface) 25%,
    var(--color-surface-hover) 37%,
    var(--color-surface) 63%
  );
  background-size: 800px 100%;
  animation: shimmer 1.6s ease infinite;
  border-radius: var(--radius-md);
}
```

---

## 9. ANIMATIONS

### Feed Entry (Framer Motion)

```tsx
// Container — stagger children
const feedVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 }
  }
}

// Each card
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 24,
    filter: 'blur(4px)'
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}
```

### Filter Change Transition

```tsx
// When active filter changes:
// Cards that are leaving: opacity → 0, scale → 0.96 (150ms)
// Cards that are entering: opacity → 1, y: 12 → 0 (250ms)
// Use Framer Motion AnimatePresence with layout prop
<motion.div layout layoutId={scholarship.id}>
```

### Match Bar Fill

```tsx
// Animate match bar on card mount
const MatchBar = ({ score }) => {
  const [width, setWidth] = useState(0)
  
  useEffect(() => {
    const timer = setTimeout(() => setWidth(score * 100), 200)
    return () => clearTimeout(timer)
  }, [score])
  
  return (
    <div className="match-bar-fill"
         style={{
           width: `${width}%`,
           transition: 'width 800ms cubic-bezier(0.22, 1, 0.36, 1)'
         }} />
  )
}
```

---

## 10. Responsive Behaviour

```
Desktop (1280px+):
  - 3-column card grid in main sections
  - Horizontal scroll row for "Best matches"
  - Search bar visible in header
  - Card hover expansion tooltip active
  - Sidebar 240px fixed

Tablet (768px–1023px):
  - No sidebar (bottom nav instead)
  - 2-column card grid
  - Search bar in header (smaller)
  - No hover tooltip (tap behavior only)

Mobile (<768px):
  - Single column
  - TopMatch: 220px height, simplified layout
  - Horizontal scroll rows: 2.5 cards visible
  - Filter pills: horizontal scroll
  - Search: icon only in header
  - Bottom nav: 64px fixed
  - Cards: full width
```

---

## 11. Verification Checklist

```
□ TopMatch card: gradient background renders correctly
□ TopMatch: match percentage badge shows correct value
□ TopMatch: hover — floating card preview shifts
□ Filter bar: all chips render, active state is ink-filled
□ Filter bar: switching filters animates cards out/in
□ ⌘K / Ctrl+K opens search overlay
□ Search overlay: results appear within 200ms of typing
□ Search: ESC closes overlay
□ Card image: fallback gradient when no image URL
□ Card: save button toggles bookmark with spring animation
□ Card: match bar animates on mount (not instant)
□ Card: eligibility signals render pass/partial/fail correctly
□ Card hover (desktop): tooltip appears to the right
□ Skeleton: shows while data loads, disappears smoothly
□ Empty filter state: shows near-matches, not blank
□ Responsive: 3-col desktop, 2-col tablet, 1-col mobile
□ tsc --noEmit: 0 errors
```

---

*End of Dashboard Design Spec*
*File: DASHBOARD_DESIGN.md*
*The dashboard is where students spend the most time.*
*Every interaction should feel earned, not accidental.*
