## Error Type
Runtime TypeError

## Error Message
Cannot read properties of undefined (reading 'call')


    at DashboardPage (app\dashboard\page.tsx:27:7)

## Code Frame
  25 |   return (
  26 |     <div className="min-h-screen bg-white flex flex-col">
> 27 |       <DashboardHeader firstName={profile.firstName} />
     |       ^
  28 |       <ProfileSummaryCard 
  29 |         nationality={profile.nationality}
  30 |         degreeLevel={profile.currentDegree}

Next.js version: 15.5.18 (Webpack)
# ScholarMatch Frontend Skill
**Version:** 1.0  
**Project:** ScholarMatch PWA — AI-powered scholarship matching for African students  
**Stack:** Next.js 16 · React 19 · Tailwind 4 · TypeScript 5  
**Base path:** `c:\Users\LENOVO\Downloads\ProjectPort\clerk-nextjs\`

---

## 1. Design Philosophy

ScholarMatch is not a database with filters. It is a **trusted friend who knows the system**. Every interface decision should reinforce three emotional states:

- **Clarity** — the student immediately understands what they qualify for and why
- **Momentum** — the product keeps moving, never blocks, never dead-ends
- **Trust** — every claim is sourced, every score is explained, nothing is hidden

The visual register is **warm professionalism** — teal as the anchor, never cold blue. Cards feel touchable. Typography feels readable on a 5-inch screen in Lagos at 2G speeds. Animations serve function, never distract.

---

## 2. Design Tokens (Source of Truth)

All components must use these exact values. Never hardcode hex values outside this reference.

### Colour

```css
/* Primary — teal */
--color-primary:         #1D9E75;
--color-primary-dark:    #0F6E56;
--color-primary-mid:     #5DCAA5;
--color-primary-surface: #E1F5EE;
--color-primary-border:  #A8DFC9;

/* Deadline urgency — amber */
--color-amber:           #EF9F27;
--color-amber-dark:      #854F0B;
--color-amber-surface:   #FAEEDA;

/* Error / closed — red */
--color-red:             #E24B4A;
--color-red-dark:        #A32D2D;
--color-red-surface:     #FCEBEB;

/* Success / matched — green */
--color-green:           #639922;
--color-green-dark:      #3B6D11;
--color-green-surface:   #EAF3DE;

/* Info — blue */
--color-blue:            #185FA5;
--color-blue-surface:    #E6F1FB;

/* Neutral */
--color-text-primary:    #111827;
--color-text-secondary:  #6B7280;
--color-text-tertiary:   #9CA3AF;
--color-border:          #E5E7EB;
--color-border-strong:   #D1D5DB;
--color-surface:         #F9FAFB;
--color-white:           #FFFFFF;
```

### Typography

```css
/* Font stack — system fonts only, no Google Fonts import needed */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont,
             'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* Scale */
--text-xs:   11px / 1.4;
--text-sm:   13px / 1.5;
--text-base: 14px / 1.6;
--text-md:   16px / 1.4;
--text-lg:   18px / 1.3;
--text-xl:   22px / 1.2;
--text-2xl:  28px / 1.15;
--text-3xl:  36px / 1.1;

/* Weights: 400 body, 500 headings — never 600 or 700 in app UI */
/* Landing page exception: 600–700 allowed for hero headlines only */
```

### Spacing & Radius

```css
/* Spacing — 4px base grid */
--space-1:  4px;
--space-2:  8px;
--space-3:  12px;
--space-4:  16px;
--space-5:  20px;
--space-6:  24px;
--space-8:  32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;

/* Radius */
--radius-sm:  8px;
--radius-md:  12px;   /* default card */
--radius-lg:  16px;   /* large card, modal */
--radius-xl:  20px;   /* pill button */
--radius-full: 9999px; /* chip/badge */

/* Touch targets */
--touch-min: 44px;    /* MINIMUM for all interactive elements */
```

### Shadows

```css
--shadow-card:   0 1px 3px rgba(0,0,0,0.06), 
                 0 1px 2px rgba(0,0,0,0.04);
--shadow-raised: 0 4px 12px rgba(0,0,0,0.08), 
                 0 2px 4px rgba(0,0,0,0.04);
--shadow-modal:  0 20px 60px rgba(0,0,0,0.12), 
                 0 8px 24px rgba(0,0,0,0.06);
```

---

## 3. Landing Page

The landing page is the product's first impression for students who arrive via a WhatsApp share link. It must:
- Load meaningful content in under 1.5s on 3G
- Communicate the value proposition without scrolling
- Convert to signup in one tap

### Hero Section

**Emotional hook:** the student's frustration, not the product's features.

```tsx
// Layout: full viewport height, centred
// Background: subtle animated gradient mesh

// Eyebrow label (small, teal)
"For African students"

// Headline — large, bold, two lines maximum
"Stop searching.
Get matched."

// Subtext — one sentence
"Tell us who you are. We surface every scholarship 
you qualify for — from Chevening to Uppsala's 
biology department."

// Primary CTA
<Button variant="primary" size="lg">
  Find my scholarships →
</Button>

// Social proof line (below CTA, small text)
"Join 5,000+ students across 54 African countries"
```

**Background treatment:**
```css
/* Animated gradient mesh — teal to white */
background: 
  radial-gradient(ellipse 80% 60% at 20% -10%, 
    rgba(29, 158, 117, 0.12) 0%, 
    transparent 60%),
  radial-gradient(ellipse 60% 40% at 80% 110%, 
    rgba(29, 158, 117, 0.08) 0%, 
    transparent 60%),
  #ffffff;

/* Subtle animated shift */
@keyframes meshShift {
  0%, 100% { background-position: 0% 0%; }
  50%       { background-position: 5% 5%; }
}
animation: meshShift 8s ease-in-out infinite;
```

### How It Works Section

Three steps, horizontal on desktop, vertical on mobile:

```
Step 1                Step 2               Step 3
──────────────        ─────────────────    ──────────────────
[Icon: person]        [Icon: sparkles]     [Icon: bookmark]
"Tell us about        "We match you"       "Save and track"
 yourself"
Build your profile    AI scores every      Save scholarships.
in under 3 minutes.   scholarship against  Get deadline
Nationality, degree,  your profile.        reminders 30, 7,
field, GPA.           See exactly why      and 1 day before
                      you qualify.         closing.
```

Step connector: a dashed teal line on desktop (hidden on mobile).

### Featured Scholarships Preview

Show 3 scholarship cards in a horizontal scroll on mobile, 3-column grid on desktop. Cards are non-interactive (no save button) — they exist to demonstrate the product.

Use real seeded data. Fetch 3 top scholarships server-side:

```tsx
// Server component fetch — no auth needed
const featured = await db.scholarship.findMany({
  where: { isActive: true, verified: true },
  take: 3,
  orderBy: { savedBy: { _count: 'desc' } },
  select: {
    id: true, title: true, funder: true,
    deadline: true, eligibleDegrees: true,
    eligibilityParsed: true
  }
})
```

Each preview card shows: title, funder, degree level pill, "Fully funded" pill, deadline. Tapping opens a signup prompt (not the detail page).

### Stats Bar

Full-width strip between hero and how-it-works:

```
[12,000+]              [54]              [$2.3M+]
Scholarships indexed   African countries  In matched funding
```

Numbers animate up from zero on scroll into view (Intersection Observer + CSS counter animation).

### Footer

Minimal: ScholarMatch logo + "Built for African students" + Privacy Policy link.

---

## 4. Loading System

### Principle
Never show a blank screen. Never block the user. Show something meaningful immediately, then refine.

### Match Calculation Animation

When the discovery feed is loading matched scholarships, show an animated matching indicator at the top of the feed — not a spinner:

```tsx
// components/ui/MatchingIndicator.tsx
// Shows for 1.5–3 seconds during initial feed load

<div className="matching-indicator">
  <div className="matching-dots">
    {/* Three teal dots pulsing in sequence */}
    <span />
    <span />
    <span />
  </div>
  <p className="matching-text">
    Finding scholarships for you...
  </p>
</div>
```

```css
.matching-dots span {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #1D9E75;
  display: inline-block;
  margin: 0 3px;
  animation: matchPulse 1.2s ease-in-out infinite;
}
.matching-dots span:nth-child(2) { animation-delay: 0.2s; }
.matching-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes matchPulse {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40%           { transform: scale(1.0); opacity: 1.0; }
}
```

Transition: fade out the indicator and stagger in the scholarship cards (200ms delay between each card, translateY from 12px to 0).

### Skeleton Cards

Shown during data fetch. Always render exactly 3 skeletons — not 1, not 10.

```tsx
// components/ui/ScholarshipCardSkeleton.tsx
export function ScholarshipCardSkeleton() {
  return (
    <div className="skeleton-card">
      {/* Title lines */}
      <div className="skeleton-line w-3/4 h-4 mb-2" />
      <div className="skeleton-line w-1/2 h-3 mb-4" />
      {/* Pills */}
      <div className="flex gap-2 mb-4">
        <div className="skeleton-pill w-20 h-5" />
        <div className="skeleton-pill w-16 h-5" />
        <div className="skeleton-pill w-14 h-5" />
      </div>
      {/* Match bar */}
      <div className="skeleton-line w-full h-1 mb-3" />
      {/* Eligibility lines */}
      <div className="skeleton-line w-2/3 h-3 mb-2" />
      <div className="skeleton-line w-3/4 h-3 mb-2" />
      {/* CTA */}
      <div className="skeleton-line w-full h-10 mt-3" />
    </div>
  )
}
```

```css
.skeleton-card {
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
}

.skeleton-line, .skeleton-pill {
  background: linear-gradient(
    90deg, 
    #F3F4F6 25%, 
    #E9EAEC 50%, 
    #F3F4F6 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 4px;
}

.skeleton-pill { border-radius: 9999px; }

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### Button Loading States

All async buttons follow this pattern:

```tsx
// Three visual states: idle → loading → success/error
// Never disable without visual feedback

// Idle:
<button className="btn-primary">Save scholarship</button>

// Loading (spinner replaces text):
<button className="btn-primary" disabled>
  <Spinner size={16} className="animate-spin mr-2" />
  Saving...
</button>

// Success (2 seconds, then revert):
<button className="btn-success">
  <CheckCircle size={16} className="mr-2" />
  Saved!
</button>

// Error (inline, below button):
<button className="btn-primary">Save scholarship</button>
<p className="text-red-500 text-xs mt-1">
  Could not save. Try again.
</p>
```

### Page Transitions

Use CSS transitions between route changes via Next.js `<Link>` navigation:

```css
/* Wrap page content in a div with this class */
.page-enter {
  opacity: 0;
  transform: translateY(8px);
}
.page-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 200ms ease, transform 200ms ease;
}
```

Never use full-page slide animations on mobile — they cause layout shift and feel wrong on PWA. Fade + subtle rise is the correct pattern.

### Offline State

When the service worker detects no connection:

```tsx
// Shown at the top of any page that requires live data
// (not on /saved — that uses cached data)

<div className="offline-banner">
  <WifiOff size={14} className="text-amber-600" />
  <span>
    You're offline. Showing your last saved results.
  </span>
</div>
```

```css
.offline-banner {
  background: #FAEEDA;
  color: #854F0B;
  font-size: 13px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}
```

---

## 5. Navigation System

### Bottom Navigation

The tab bar is the primary navigation surface. It is always visible on authenticated pages. It never disappears on scroll.

```tsx
// components/layout/BottomNav.tsx
// 4 tabs: Discover | Saved | Alerts | Profile

// Dimensions:
height: 60px
border-top: 1px solid #E5E7EB
background: rgba(255, 255, 255, 0.95)
backdrop-filter: blur(8px)    /* frosted glass on supported devices */
padding-bottom: env(safe-area-inset-bottom)  /* iOS safe area */

// Tab item:
width: 25%
display: flex
flex-direction: column
align-items: center
gap: 3px
padding: 8px 4px 6px

// Icon size: 20px
// Label size: 10px
// Inactive: text-gray-400
// Active: text-[#1D9E75]

// Active indicator: small teal dot above icon
// (not a full underline — subtle and elegant)
::before {
  content: '';
  width: 4px; height: 4px;
  border-radius: 50%;
  background: #1D9E75;
  position: absolute;
  top: -2px;
}
```

**Badge on Saved tab:**
```tsx
// Shows when savedCount > 0
// Position: absolute, -top-1 -right-1
// Size: 16×16px, rounded-full
// Background: #1D9E75, text: white, font-size: 10px
// Animate in: scale from 0 to 1 (spring)
```

**Tab transitions:**
- Do not animate page content on tab switch
- Only animate the active indicator (200ms ease)
- The icon does not scale or bounce on tap

### Back Navigation

Every inner page has a back button. It is always top-left, always text — never just an icon without a label on desktop.

```tsx
// components/ui/BackButton.tsx
export function BackButton({ label = "Back" }) {
  const router = useRouter()
  
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/dashboard')
    }
  }
  
  return (
    <button 
      onClick={handleBack}
      className="flex items-center gap-1 text-gray-500 
                 text-sm py-2 pr-4 -ml-1"
      style={{ minHeight: '44px' }}
    >
      <ChevronLeft size={16} />
      {label}
    </button>
  )
}
```

### Page Headers

Every page has a consistent header pattern:

```tsx
// Pattern A — Primary page (no back button):
<header className="px-4 pt-4 pb-2 
                   flex items-start justify-between">
  <div>
    <h1 className="text-lg font-medium">
      {title}
    </h1>
    <p className="text-sm text-gray-500 mt-0.5">
      {subtitle}
    </p>
  </div>
  <div className="flex gap-2">
    {/* Right actions: search, bell, etc. */}
  </div>
</header>

// Pattern B — Secondary page (with back button):
<header className="px-4 pt-2 pb-3 
                   flex items-center justify-between">
  <BackButton />
  <h1 className="text-base font-medium absolute 
                 left-1/2 -translate-x-1/2">
    {title}
  </h1>
  <div>{/* Optional right action */}</div>
</header>
```

### Filter Pills

Horizontal scrolling pill row used on the discovery feed and admin panel:

```tsx
// Outer container:
overflow-x: auto
scrollbar-width: none  /* hide scrollbar */
display: flex
gap: 8px
padding: 0 16px 8px
/* Fade edges on desktop */
mask-image: linear-gradient(
  to right, transparent 0, black 16px, 
  black calc(100% - 16px), transparent 100%
)

// Pill base:
border: 1px solid #E5E7EB
border-radius: 9999px
padding: 6px 14px
font-size: 13px
white-space: nowrap
cursor: pointer
min-height: 34px
transition: all 150ms ease

// Active pill:
background: #1D9E75
border-color: #1D9E75
color: white
font-weight: 500

// Inactive pill:
background: white
color: #374151
```

---

## 6. Component Specifications

### ScholarshipCard

The most important component in the app. Every pixel matters.

```
┌─────────────────────────────────────────┐
│  Swedish Institute Scholarships       📑 │  ← title (max 2 lines) + bookmark btn
│  Swedish Institute · si.se               │  ← funder + verified timestamp
│                                          │
│  [Fully funded] [Due Mar 15] [Masters]   │  ← pills
│                                          │
│  Match ████████████████░░░░  91%        │  ← match bar
│                                          │
│  ✓ Nigerian nationality eligible         │
│  ✓ Masters degree matches               │  ← eligibility signals (max 4)
│  ⚠ GPA: requires 3.5, yours is 3.4     │
│                                          │
│  [  View details  ] [↗]                  │  ← CTAs
└─────────────────────────────────────────┘
```

**Card states:**
- Default: white bg, gray-200 border, shadow-card
- Hover (desktop): shadow-raised, border-color transitions to #A8DFC9
- Saved: bookmark icon fills with teal
- Closed: opacity 0.6, "Closed" red badge replaces deadline pill

**Match bar colours:**
```
>= 80% : #1D9E75 (teal — strong match)
>= 50% : #EF9F27 (amber — partial match)
<  50% : #E5E7EB (gray — weak match, still show)
```

**Pill urgency colours:**
```
Deadline <= 7 days  : bg-[#FCEBEB] text-[#A32D2D]  ← red
Deadline <= 30 days : bg-[#FAEEDA] text-[#854F0B]  ← amber
Deadline > 30 days  : bg-[#F3F4F6] text-[#6B7280]  ← gray
```

**Eligibility signal icons:**
```
Pass    : ti-circle-check  #1D9E75  ← teal check
Fail    : ti-circle-x      #E24B4A  ← red cross
Partial : ti-alert-circle  #EF9F27  ← amber warning
Info    : ti-info-circle   #185FA5  ← blue info
```

### Scholarship Detail — Sticky CTA Bar

```
┌──────────────────────────────────────────────┐  ← fixed bottom
│  [📑]     [    Apply now    ]     [↗]        │
│  save      primary action         share       │
└──────────────────────────────────────────────┘

Height: 60px + safe area inset
bg: white, border-top: 1px solid #E5E7EB
Buttons: 48px height, rounded-xl
Save/Share: 48×48px square
Apply: flex-1, bg-[#1D9E75]
```

### Profile Summary Card (Dashboard)

```
┌──────────────────────────────────────────┐
│  [NG] Masters  [Microbiology]      Edit→ │
└──────────────────────────────────────────┘

bg: #F9FAFB, border: 1px solid #E5E7EB
border-radius: 12px, padding: 10px 14px
Entire row is tappable → /profile
"Edit" text: text-[#1D9E75] text-xs
```

### Review Prompt Card

```
┌──────────────────────────────────────────┐
│  Chevening Scholarships           [✕]    │
│                                          │
│  Was this a good match for you?          │
│                                          │
│     ☆   ☆   ☆   ☆   ☆                 │  ← 5 stars, 40×40px each
│                                          │
│     [Submit]              [Skip]         │
└──────────────────────────────────────────┘
```

### Onboarding Steps

```
Progress bar: 5 dots, h-1 (4px), full width, gap-1.5
Done:    bg-[#1D9E75]
Current: bg-[#5DCAA5]  ← lighter teal
Todo:    bg-gray-200

Option card (degree level etc.):
  Default:  border-gray-200 bg-white
  Selected: border-[#1D9E75] bg-[#E1F5EE]
  
  Check icon (right side):
    Selected:   ti-circle-check text-[#1D9E75] text-base
    Unselected: ti-circle text-gray-300 text-base

Continue button:
  Full width, bg-[#1D9E75], text-white
  border-radius: 12px, padding: 14px
  font-size: 15px, font-weight: 500
  Disabled: opacity-50, cursor-not-allowed
```

---

## 7. Error States

### Principle
Never show a blank screen. Never show a raw error message. Always offer a next action.

### Error State Component

```tsx
// components/ui/ErrorState.tsx
// Reusable across all pages

type ErrorStateProps = {
  icon?: string          // Tabler icon name
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
}
```

**Visual treatment:**
```
Icon:        32px, text-gray-300, centered
Title:       text-base font-medium text-gray-700, mt-3
Description: text-sm text-gray-500, mt-1, max-width 280px, centered
Action btn:  mt-5, full-width, rounded-xl, bg-[#1D9E75] text-white
Secondary:   mt-2, text-sm text-gray-500, underline
```

### Specific Error Scenarios

```
SCENARIO                    ICON              TITLE
─────────────────────────────────────────────────────────────
No internet                 ti-wifi-off       "You're offline"
                                              "Your saved scholarships 
                                               are still available."
                                              [View saved] [Retry]

No matches found            ti-search-off     "No exact matches"
                                              "Try broadening your field 
                                               or degree level."
                                              [Adjust filters] 
                                              [See near-matches]

Save failed                 ti-bookmark-off   "Could not save"
                                              "Check your connection 
                                               and try again."
                                              [Try again]

Profile incomplete          ti-user-question  "Complete your profile"
                                              "Add your field of study 
                                               to unlock more matches."
                                              [Update profile]

Session expired             ti-lock           "You've been signed out"
                                              "Sign in again to access 
                                               your scholarships."
                                              [Sign in]

Scholarship not found       ti-file-off       "Scholarship unavailable"
                                              "This scholarship may have 
                                               closed or been removed."
                                              [Find similar] 
                                              [Go to dashboard]

Freshness alert             ti-alert-triangle "Scholarship updated"
                                              "{Title} has changed since 
                                               you saved it."
                                              [View changes]
                                              amber background (#FAEEDA)

Rate limited (429)          ti-clock          "Too many requests"
                                              "Please wait a moment 
                                               before trying again."
                                              Auto-retry after 30s

Server error (500)          ti-server-off     "Something went wrong"
                                              "We're looking into it. 
                                               Your data is safe."
                                              [Try again] [Go home]
```

### Empty States

Different from errors — shown when data exists but the view is empty.

```
SCENARIO                    MESSAGE
──────────────────────────────────────────────────
No saved scholarships       ti-bookmark (32px, gray-300)
                            "No saved scholarships yet"
                            "Tap the bookmark on any 
                             scholarship to save it here"
                            [Find scholarships →]

No pending reviews          ti-star (32px, gray-300)
                            "No reviews pending"
                            "Rate matches after visiting 
                             their pages"

No pending admin items      ti-check-circle (32px, gray-300)
                            "All caught up"
                            "No scholarships pending review"

Filter returns zero         (never show empty state)
                            Show top 3 unfiltered results
                            with label "Showing all matches"
```

### Form Validation

```tsx
// Inline error below each field — not a toast

// Field error state:
<div className="field-error">
  <AlertCircle size={12} className="text-red-500" />
  <span className="text-xs text-red-500 ml-1">
    {errorMessage}
  </span>
</div>

// Field border when error:
border-color: #E24B4A
focus:ring-color: #E24B4A

// Show errors ONLY after first submit attempt
// Not on every keystroke
```

---

## 8. Animation Guidelines

### What Animates (and Why)

```
ELEMENT                  ANIMATION           REASON
──────────────────────────────────────────────────────
Scholarship cards load   staggerFadeUp       Content arrival
Match bar fill           width transition    Score reveal
Bookmark save            scale + color       Confirmation
Review stars             scale on hover      Affordance
Onboarding step change   slideFade           Progress flow
Skeleton → content       crossFade           Smooth load
Save count badge         scaleIn             Attention
Alert banners            slideDown           Urgency
Page entry               fadeUp (subtle)     Orientation
```

### What Does NOT Animate

```
- Tab bar icons (no bounce, no scale)
- Navigation between tabs (no slide)
- Dropdown menus (instant show/hide)
- Error states (immediate — urgency)
- Disabled buttons (no animation)
- Loading skeletons (shimmer only, no other motion)
```

### Timing Tokens

```css
--duration-instant:  80ms;   /* micro interactions */
--duration-fast:    150ms;   /* hover states */
--duration-normal:  200ms;   /* most transitions */
--duration-slow:    300ms;   /* page transitions */
--duration-deliberate: 500ms; /* match bar fill */

--ease-standard:  cubic-bezier(0.4, 0, 0.2, 1);
--ease-enter:     cubic-bezier(0, 0, 0.2, 1);
--ease-exit:      cubic-bezier(0.4, 0, 1, 1);
--ease-spring:    cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Core Animation Classes

```css
/* Page / card entry */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Stagger children */
.stagger-children > * {
  animation: fadeUp var(--duration-slow) 
             var(--ease-enter) both;
}
.stagger-children > *:nth-child(1) { animation-delay: 0ms;   }
.stagger-children > *:nth-child(2) { animation-delay: 60ms;  }
.stagger-children > *:nth-child(3) { animation-delay: 120ms; }
.stagger-children > *:nth-child(4) { animation-delay: 180ms; }
.stagger-children > *:nth-child(5) { animation-delay: 240ms; }

/* Badge pop */
@keyframes scaleIn {
  from { transform: scale(0); }
  to   { transform: scale(1); }
}

/* Alert slide down */
@keyframes slideDown {
  from { transform: translateY(-8px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}

/* Match bar fill — triggered when card enters viewport */
.match-bar-fill {
  transition: width var(--duration-deliberate) 
              var(--ease-enter);
  width: 0;  /* start at 0 */
}
.match-bar-fill.animate {
  width: var(--match-width);  /* CSS custom property set inline */
}
```

---

## 9. Responsive Breakpoints

ScholarMatch is mobile-first. Every component is designed for 375px first, then enhanced upward.

```css
/* Breakpoints */
--bp-sm:  480px;   /* large phones */
--bp-md:  768px;   /* tablet */
--bp-lg:  1024px;  /* small desktop */
--bp-xl:  1280px;  /* large desktop */

/* Mobile-first Tailwind equivalents */
/* Default (< 480px): mobile layout */
/* sm: (≥ 480px):     large phone adjustments */
/* md: (≥ 768px):     tablet — 2 column grids */
/* lg: (≥ 1024px):    desktop — centre content, 
                      max-width 480px for main column */
```

### Layout Rules by Breakpoint

```
Mobile (default)
  max-width:    100%
  padding:      0 16px
  bottom nav:   fixed, visible
  cards:        full width, stacked

Tablet (md)
  max-width:    680px, centred
  padding:      0 24px
  bottom nav:   fixed, visible
  cards:        full width, stacked

Desktop (lg)
  max-width:    480px, centred (app column)
  padding:      0
  bottom nav:   visible (PWA feel maintained)
  cards:        full width within column
  landing page: full width, 2-3 column sections
```

### No horizontal scroll on mobile

Every component must be tested at 320px (minimum supported width). If a component causes horizontal scroll, it is broken.

---

## 10. Accessibility Requirements

```
Colour contrast:
  Normal text:  minimum 4.5:1 against background
  Large text:   minimum 3:1
  #1D9E75 on white = 3.9:1 (large text only)
  #0F6E56 on white = 5.7:1 (passes all sizes)
  → Use #0F6E56 for body text on teal surfaces

Touch targets:
  Minimum 44×44px on ALL interactive elements
  No exceptions — icon-only buttons need padding

Focus states:
  All interactive elements must have visible focus ring
  Use: focus-visible:ring-2 focus-visible:ring-[#1D9E75]
  Never: outline: none without a replacement

Screen readers:
  All icon-only buttons need aria-label
  Cards that are fully clickable: role="button" or <a>
  Match score: aria-label="91 percent match"
  Skeleton loading: aria-busy="true" aria-label="Loading"

Reduced motion:
  @media (prefers-reduced-motion: reduce) {
    * { animation-duration: 0.01ms !important; }
  }
```

---

## 11. Specific Page Implementation Notes

### Landing Page (app/page.tsx)

- Server component — no client-side JS for hero render
- Clerk auth check server-side: if signed in → redirect to /dashboard
- Stats counter animation: client island using Intersection Observer
- Featured scholarships: server-fetched, rendered as static HTML
- Install prompt: client island, shown after 3 seconds on mobile

### Dashboard (app/dashboard/page.tsx)

- Profile summary card animates in with fadeUp on first render
- Match count updates when filter changes (client-side, no refetch)
- "New matches" badge on Discover tab: check localStorage for last visit timestamp
- Infinite scroll: 20 results initially, 20 more on "Load more" tap
- Match bars: animate fill when card enters viewport (Intersection Observer)

### Scholarship Detail (app/scholarship/[id]/page.tsx)

- Eligibility breakdown: each signal rows animates in sequentially (60ms stagger)
- Match score bar: fills from 0 after 300ms page load delay (feels deliberate)
- Sticky CTA: does not show on the first 100px of scroll (gives content space)
- "Apply now": confirmation toast appears: "Opening scholarship page..."
- Source URL disclaimer: "We link to the original source. Always verify details."

### Saved Page (app/saved/page.tsx)

- Group headers ("Upcoming deadlines" / "Open deadline") are sticky within scroll
- Items sort by deadline proximity — most urgent at top
- Swipe-to-delete on mobile (touch events, threshold 80px, red reveal underneath)
- Empty state: large bookmark icon, gentle bounce animation on first render

### Onboarding (app/onboarding/step/[step]/page.tsx)

- Step transitions: fade out current → fade in next (crossFade 200ms)
- Back button: slides previous step back in from left
- GPA converter tooltip: appears on focus of GPA field
- Final step: "Find my scholarships" button has a shimmer animation while submitting

### Admin Panel (app/admin/page.tsx)

- Functional aesthetics only — no animations
- Table rows: hover bg-gray-50
- Status badges: same pill system as student-facing UI
- Pending review items: left border 3px #EF9F27 (amber) to signal attention needed

---

## 12. Agent Instructions

When implementing any ScholarMatch frontend work:

1. **Check this skill first** — all design decisions flow from the tokens defined in Section 2
2. **Test at 375px first** — if it works on mobile, scale up
3. **Never introduce new colours** — use the token palette exclusively
4. **Font weights: 400 body, 500 headings** — only deviate for landing page hero
5. **Every loading state must show skeletons** — no empty flicker
6. **Every error state must offer a next action** — no dead ends
7. **All touch targets ≥ 44px** — verify with browser developer tools
8. **Animations: if in doubt, don't** — static is better than wrong motion
9. **Match bar fill: always animate** — it's the product's signature interaction
10. **Run `tsc --noEmit` after every component** — type safety is non-negotiable
