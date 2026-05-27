# ScholarMatch — Landing Page Design Spec
> Replaces the HERO section of DESIGN.md section 6.1
> Use with `/frontend-design` to build the landing page.
> Inspiration: Apple · Linear · Arc · Stripe Atlas · Raycast · Airbnb

---

## Design Mandate

**Vibe**: Cinematic study-abroad dream meets precision tool.

The user should feel like they just opened something that was made
specifically for their ambition. Not a scholarship database. Not a
government portal. A life-direction tool that already knows what
they're looking for.

Dark opening → light revelation → editorial depth → emotional close.

---

## File Targets

```
app/page.tsx                           ← root — compose all sections
components/landing/Navbar.tsx          ← sticky transparent nav
components/landing/Hero.tsx            ← dark cinematic hero
components/landing/TrustBar.tsx        ← scholarship logos
components/landing/HowItWorks.tsx      ← Stripe-style scroll story
components/landing/BentoFeatures.tsx   ← Raycast bento grid
components/landing/StudentStories.tsx  ← Airbnb editorial stories
components/landing/FinalCTA.tsx        ← moss full-bleed CTA
components/landing/Footer.tsx          ← Vercel-minimal footer
```

---

## 0. Global Landing Page Rules

```css
/* Override body background for landing only */
/* Hero is dark. Rest of page is parchment. */
/* Use data-section attribute to control background */

[data-section="dark"]  { background: #0A0A0A; }
[data-section="light"] { background: var(--color-bg); }   /* #F7F4EE */
[data-section="moss"]  { background: var(--color-moss); }

/* Section vertical padding */
--section-padding: clamp(80px, 12vw, 160px);

/* Max content width */
--content-width: 1180px;
```

**Do not use `var(--color-bg)` on the hero.**
The hero MUST be dark (`#0A0A0A` or `#080808`).
The page transitions from dark → parchment after the hero scroll.

---

## 1. NAVBAR

**Behavior**: Transparent over the hero. Frosted on scroll.

```tsx
// State: scrolled (boolean) — true when window.scrollY > 60

// Not scrolled (over hero):
// background: transparent
// border: none
// logo color: white
// link color: rgba(255,255,255,0.7)
// CTA button: white border, white text

// Scrolled (over rest of page):
// background: rgba(247, 244, 238, 0.92)  ← parchment frosted
// backdrop-filter: blur(16px)
// border-bottom: 1px solid var(--color-border)
// logo color: var(--color-ink)
// link color: var(--color-ink-secondary)
// CTA button: moss primary
```

**Layout** (height: 64px):
```
[ScholarMatch wordmark]              [How it works] [Sign in]  [Get started →]
```

**ScholarMatch wordmark**:
- Font: Cormorant Garamond, 20px, weight 400
- Over hero: white
- On scroll: var(--color-ink)

**Nav links** (desktop only, hidden mobile):
- Font: DM Sans, 14px, weight 400
- Gap: 32px between links

**CTA Button** ("Get started →"):
- Over hero: border 1px solid rgba(255,255,255,0.5), white text, transparent bg
  Hover: bg rgba(255,255,255,0.1)
- On scroll: primary moss pill button

**Mobile** (below lg breakpoint):
- Show only wordmark + "Get started" CTA
- No hamburger menu needed at MVP stage

---

## 2. HERO SECTION

**Vibe**: Linear homepage × Apple keynote × Netflix title card.

Dark. Cinematic. Massive. Breathing.

### Background

```css
.hero {
  background: #080808;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120px 24px 80px;  /* top padding for navbar */
}

/* Ambient gradient mesh — subtle, not gimmicky */
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 20% 40%, rgba(95,111,82,0.12) 0%, transparent 60%),
    radial-gradient(ellipse 60% 50% at 80% 60%, rgba(201,168,106,0.08) 0%, transparent 60%);
  pointer-events: none;
}

/* Grain texture on hero */
.hero::after {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,...");  /* grain SVG */
  pointer-events: none;
}
```

### Content — Center Column Layout

Max-width: 900px, centered horizontally.
Text-align: center.

**STEP 1 — Eyebrow label** (first to appear, 0.3s delay):
```
Font:      DM Sans, 12px, weight 500
Color:     rgba(255,255,255,0.45)
Tracking:  0.14em
Transform: uppercase
Text:      "AI-POWERED SCHOLARSHIP MATCHING FOR AFRICAN STUDENTS"
Margin-bottom: 28px

Animation:
  initial: { opacity: 0, y: 8 }
  animate: { opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.6 } }
```

**STEP 2 — Display headline** (the emotional center):
```
Font:        Cormorant Garamond
Size:        clamp(3.5rem, 8vw, 7rem)
Weight:      300
Color:       #F4F1EB  ← warm white, not pure white
Line-height: 0.93
Tracking:    -0.025em
Max-width:   820px

PRIMARY OPTION (use this one):
  Line 1: "Your future"
  Line 2: "already has"
  Line 3: "funding."

ALTERNATIVE:
  "Scholarships matched
   to your ambition."

Animation: lines reveal one by one
  Each line: initial { opacity: 0, y: 40 }
             animate { opacity: 1, y: 0 }
             delay:  line 1 = 0.5s, line 2 = 0.65s, line 3 = 0.8s
             duration: 0.8s
             ease: [0.22, 1, 0.36, 1]

"funding." — the final word uses color: var(--color-moss) [#5F6F52]
but on dark: use #8DA67D (the dark mode moss) for legibility
```

**STEP 3 — Subtext**:
```
Font:        DM Sans, 18px, weight 400
Color:       rgba(244,241,235,0.55)
Line-height: 1.6
Max-width:   520px
Margin:      24px auto 0

Text: "Discover fully funded scholarships matched to your
       nationality, degree, and ambitions. Built for Africa."

Animation:
  initial: { opacity: 0 }
  animate: { opacity: 1, transition: { delay: 1.1, duration: 0.7 } }
```

**STEP 4 — CTA Row**:
```
Margin-top: 40px
Display: flex, gap: 12px, justify-content: center

Button 1 — Primary (large):
  Text:       "Find my scholarships →"
  Background: var(--color-moss) → #5F6F52
  Color:      white
  Padding:    14px 28px
  Radius:     pill (100px)
  Font:       DM Sans, 15px, weight 500
  Hover:      background #3F4F38, transform translateY(-2px)
              box-shadow: 0 12px 32px rgba(95,111,82,0.4)
  onClick:    router.push('/sign-up')

Button 2 — Ghost:
  Text:       "See how it works"
  Border:     1px solid rgba(255,255,255,0.2)
  Color:      rgba(255,255,255,0.6)
  Background: transparent
  Padding:    14px 24px
  Radius:     pill
  Hover:      border rgba(255,255,255,0.5), color white,
              background rgba(255,255,255,0.05)
  onClick:    smooth scroll to #how-it-works

Animation:
  initial: { opacity: 0, y: 12 }
  animate: { opacity: 1, y: 0, transition: { delay: 1.3, duration: 0.6 } }
```

**STEP 5 — Social proof strip**:
```
Margin-top: 56px
Display: flex, align-items: center, justify-content: center, gap: 32px
Flex-wrap: wrap

Font: DM Sans, 13px, rgba(255,255,255,0.35)
Separator: thin vertical line, 1px, rgba(255,255,255,0.12), height 14px

Items:
  "4M+ African students"
  "500+ scholarships"
  "54 countries"
  "Free forever"

Animation: { opacity: 0 } → { opacity: 1, delay: 1.6, duration: 0.8 }
```

### Floating UI Preview Cards

Three floating ScholarMatch cards positioned below the text,
partially visible, suggesting depth. Like Linear's floating
app screenshots.

```
Layout on desktop:
  Position: relative, margin-top: 80px
  Height: 320px  ← crops the cards, implying more below
  Width: 100%, max-width: 900px

  Card 1 (center, most visible):
    position: absolute
    top: 0, left: 50%, transform: translateX(-50%)
    width: 380px
    z-index: 3
    box-shadow: 0 40px 80px rgba(0,0,0,0.6),
                0 0 0 1px rgba(255,255,255,0.06)
    border-radius: 16px
    Shows: Chevening scholarship card with 91% match

  Card 2 (left, rotated slightly):
    position: absolute
    top: 40px, left: calc(50% - 340px)
    width: 300px
    z-index: 2
    transform: rotate(-3deg)
    opacity: 0.75
    box-shadow: 0 30px 60px rgba(0,0,0,0.5)
    Shows: DAAD scholarship card

  Card 3 (right, rotated other way):
    position: absolute
    top: 40px, right: calc(50% - 340px)
    width: 300px
    z-index: 2
    transform: rotate(3deg)
    opacity: 0.75
    box-shadow: 0 30px 60px rgba(0,0,0,0.5)
    Shows: Mastercard Foundation card

Bottom fade: linear-gradient(to bottom, transparent 60%, #080808 100%)
  This creates the impression of infinite depth below

Cards use dark surface variant:
  background: #171717
  border: 1px solid rgba(255,255,255,0.08)
  All text in light mode colors:
    title: #F4F1EB
    meta: rgba(244,241,235,0.5)
    match bar: moss fill on dark track

Framer Motion on cards:
  initial: { opacity: 0, y: 60, scale: 0.96 }
  animate: { opacity: 1/0.75, y: 0, scale: 1 }
  delay: card 1 = 1.0s, card 2 = 1.1s, card 3 = 1.1s
  duration: 1s
  ease: [0.22, 1, 0.36, 1]

Subtle hover parallax (useMousePosition):
  Cards drift ±8px based on cursor position
  transition: transform 400ms ease-out
```

### Scroll indicator (bottom of hero):
```
Position: absolute, bottom: 32px, left: 50%, transform: translateX(-50%)
Icon: animated down chevron or scroll line
Color: rgba(255,255,255,0.25)
Animation: bounce up/down, 2s, repeat infinite
```

---

## 3. TRUST BAR

Transitions from dark hero to parchment background.

```
Background: linear-gradient(to bottom, #080808 0%, var(--color-bg) 100%)
Padding: 48px 24px 64px

Label (center):
  Font: DM Sans, 11px, uppercase, tracking 0.12em
  Color: var(--color-ink-tertiary)
  Text: "TRUSTED BY STUDENTS APPLYING TO"
  Margin-bottom: 32px

Scholarship body logos/names in a horizontal row:
  Display: flex, align-items: center, justify-content: center
  Gap: 40px, flex-wrap: wrap

  Show text-based "logos" (simple wordmarks, no images needed at MVP):
  Each: DM Sans, 14px, weight 500, var(--color-ink-tertiary)
  Hover: var(--color-ink-secondary)

  Items:
    "Chevening" · "DAAD" · "Mastercard Foundation"
    "Swedish Institute" · "Commonwealth" · "Erasmus Mundus"

  Separator between each: · (dot, 16px, border color)
```

---

## 4. HOW IT WORKS

**id**: `how-it-works`
**Vibe**: Stripe Atlas × Notion AI — scroll-triggered storytelling.

Background: var(--color-bg)
Section padding: clamp(80px, 12vw, 160px) vertical

### Section Header
```
Section label (center):
  DM Sans, 11px, uppercase, tracking 0.12em, moss
  "THE PROCESS"
  Margin-bottom: 16px

Headline (Cormorant, center):
  Size: clamp(2.5rem, 5vw, 4rem), weight 300
  Color: var(--color-ink)
  "From zero to matched
   in 8 minutes."

Subtext (DM Sans, 17px, secondary, center):
  "Three steps. No jargon. No wasted time."
  Margin-top: 16px
```

### 3-Step Timeline

Desktop: alternating left-right layout (like Stripe Atlas)
Mobile: stacked vertical

```
STEP 1 — Left text, Right visual

Left side (content):
  Step number: "01"
    Font: Cormorant, 96px, weight 300, color var(--color-border-strong)
    Position: absolute, top-left of step block

  Overline: "STEP ONE" (moss, 11px, uppercase)

  Headline (Cormorant, 36px, 400):
    "Build your profile once."

  Body (DM Sans, 16px, secondary, line-height 1.7):
    "Tell us your nationality, degree level, field of study,
     GPA, and where you want to study. Takes under 3 minutes.
     Everything else is automatic."

  Feature chips (flex row, gap 8px, margin-top 20px):
    "✓ Nationality detection"
    "✓ GPA scale converter"
    "✓ 54 African countries"
    Each chip: DM Sans 12px, moss-light bg, moss text,
    border 1px moss-light, radius pill, padding 4px 12px

Right side (visual):
  Floating mockup of the onboarding step 3 screen
  Background: var(--color-surface)
  Border: 1px solid var(--color-border)
  Border-radius: 20px
  Box-shadow: 0 24px 64px rgba(22,21,20,0.08)
  Max-width: 460px

  Show the degree level selection cards
  (UNDERGRADUATE / MASTERS / PHD option cards)
  with MASTERS selected in moss state

---

STEP 2 — Right text, Left visual (alternated)

Right side (content):
  Step number: "02"
  Overline: "STEP TWO"
  
  Headline (Cormorant, 36px, 400):
    "See exactly why you match."

  Body (DM Sans, 16px, secondary):
    "Our AI scores every scholarship against your profile —
     with full transparency. You see every pass and every fail
     before you spend a minute reading."

  Feature chips:
    "✓ 7-criterion scoring"
    "✓ GPA normalisation"
    "✓ Original eligibility text always visible"

Left side (visual):
  Floating mockup of a scholarship card
  Showing the eligibility breakdown:
    ✓ Nigerian nationality eligible
    ✓ Masters level confirmed
    ✓ Open to all fields
    ✓ No GPA minimum
    ✗ Requires work experience

  Make the ✗ item slightly highlighted to show transparency

---

STEP 3 — Left text, Right visual

Left side (content):
  Step number: "03"
  Overline: "STEP THREE"
  
  Headline (Cormorant, 36px, 400):
    "Track it. We'll remind you."

  Body (DM Sans, 16px, secondary):
    "Save scholarships and we monitor them for you. Every 72
     hours we re-check for deadline changes, closures, or
     updates. You get an alert before anything changes."

  Feature chips:
    "✓ 30, 7, and 1-day reminders"
    "✓ Freshness monitoring"
    "✓ Push + email alerts"

Right side (visual):
  Floating mockup of the saved page
  Showing 2-3 saved items with:
    - One with red "8 days left" badge
    - One with amber "24 days left" badge
    - One with the change alert banner: "This scholarship has been updated"

---

Scroll animations for each step:
  Reveal as user scrolls into view
  initial: { opacity: 0, y: 48 }
  animate: { opacity: 1, y: 0 }
  transition: duration 0.7, ease [0.22, 1, 0.36, 1]
  Visual side: slight delay (0.15s) after text

Connector line between steps (desktop):
  Vertical dotted line, 1px, var(--color-border)
  Runs down the center axis between the 3 steps
  Each step's number circle "sits on" the line
```

---

## 5. BENTO FEATURES GRID

**Vibe**: Raycast × Framer × Superhuman — interactive feature showcase.

Background: var(--color-surface)  ← slightly elevated from parchment
Section padding: clamp(80px, 12vw, 140px) vertical

### Section Header
```
Label: "WHAT YOU GET"  (moss, uppercase, 11px)
Headline (Cormorant, 48px, 300):
  "Everything between you
   and your scholarship."
```

### Bento Grid Layout

Desktop: 12-column CSS grid
Mobile: single column stacked

```
Row 1: [  LARGE CARD (8 col)  ] [ SMALL CARD (4 col) ]
Row 2: [ SMALL (4 col) ] [ SMALL (4 col) ] [ SMALL (4 col) ]
Row 3: [ MEDIUM (6 col) ] [  MEDIUM (6 col)  ]
```

**LARGE CARD — AI Matching Engine** (col span 8):
```
Background: #0A0A0A  ← dark card in a light section
Border: 1px solid rgba(255,255,255,0.06)
Border-radius: 20px
Padding: 40px
Min-height: 320px

Label (top-left): "MATCHING ENGINE"  (moss, 11px, uppercase)

Headline (Cormorant, 32px, white):
  "See exactly why you qualify."

Body (DM Sans, 15px, rgba(255,255,255,0.55), max-width 360px):
  "Every match shows you the full breakdown. Pass, fail,
   or partial — with the original text from the source."

Visual (bottom-right, absolute positioned):
  Large eligibility breakdown panel
  Dark card style
  Shows 5 criteria with pass/fail icons
  Slight inner glow: box-shadow inset 0 0 80px rgba(95,111,82,0.08)

On hover:
  Card lifts: transform translateY(-4px)
  Border: 1px solid rgba(95,111,82,0.3)
  transition: 300ms ease
```

**SMALL CARD — Freshness Monitoring** (col span 4):
```
Background: var(--color-bg)
Border: 1px solid var(--color-border)
Border-radius: 20px
Padding: 32px
Min-height: 320px

Icon (40px circle, moss-light bg):
  ArrowsClockwise (Phosphor, moss, 20px)

Label: "FRESHNESS MONITORING"  (moss, 11px, uppercase)
Headline (Cormorant, 26px, 400): "Always up to date."
Body (DM Sans, 14px, secondary):
  "Saved scholarships re-checked every 72 hours.
   We alert you the moment anything changes."

Visual (bottom of card):
  Small alert banner: "⚠ Deadline moved to Mar 15"
  amber surface, warm border, 12px text

Hover: same lift effect
```

**SMALL CARD — Deadline Reminders**:
```
Background: var(--color-moss)  ← moss-filled card
Border-radius: 20px
Padding: 32px

Label: "NEVER MISS A DEADLINE"  (rgba(255,255,255,0.6), 11px)
Headline (Cormorant, 26px, white): "30, 7, 1 day ahead."
Body (DM Sans, 14px, rgba(255,255,255,0.7)):
  "Email and push reminders timed exactly right."

Visual: 3 notification previews stacked
  Each: white bg, radius 10px, padding 10px 14px
  Shows: "30 days — Chevening Scholarship"
         "7 days  — Swedish Institute"
         "1 day   — DAAD Application"

Hover: background var(--color-moss-dark)
```

**SMALL CARD — Long-tail Matching**:
```
Background: var(--color-surface)
Label: "UNIVERSITY-SPECIFIC"
Headline (Cormorant, 26px): "Scholarships others miss."
Body: "Department-level awards buried in university websites,
       surfaced for your exact programme."

Visual: 
  "Uppsala University · Microbiology Masters Award"
  Small card with a "University-specific" badge
  Text: "Less than 40 applicants last cycle"
  Color: clay surface
```

**SMALL CARD — African-First**:
```
Background: #0A0A0A  ← dark
Label (white): "BUILT FOR AFRICA"
Headline (Cormorant, 26px, white): "54 countries. All of us."
Body (rgba white): "The only matching platform built from the
                    ground up for African students."

Visual: 
  Simple SVG of Africa continent outline
  Color: var(--color-moss) at 0.3 opacity
  Large, decorative, fills card background
```

**MEDIUM CARD — Live Scholarship Preview**:
```
Background: var(--color-surface)
Padding: 40px
Shows: an interactive-feeling scholarship card
  (the actual ScholarshipCard component)
  with hover state active
Label: "THE CARD"
Headline (Cormorant, 26px): "Every detail you need."
```

**MEDIUM CARD — Mobile/PWA**:
```
Background: var(--color-moss-light)
Label: "WORKS EVERYWHERE"
Headline (Cormorant, 26px): "Offline. On any phone."
Body: "Installs like an app. Works without signal. Built for
       African networks."
Visual: simple phone outline with PWA install prompt shown
```

---

## 6. STUDENT STORIES

**Vibe**: Airbnb editorial × real humanity. No generic testimonial sliders.

Background: var(--color-bg)
Section padding: clamp(80px, 12vw, 140px) vertical

### Section Header
```
Label: "STUDENT VOICES"  (moss, uppercase, 11px)
Headline (Cormorant, 48px, 300, italic):
  "Real students.
   Real scholarships."
```

### Story Layout — 3 editorial cards

Desktop: 3-column grid
Mobile: vertical stack

**Each Story Card**:
```
Background: var(--color-surface)
Border: 1px solid var(--color-border)
Border-radius: 20px
Padding: 32px 36px
Overflow: hidden

TOP:
  Country/destination visual strip (80px height):
    Background: gradient representing their destination
    Nigeria → UK: deep green + union jack colors (subtle)
    Ghana → Germany: black/red/gold (subtle)
    Kenya → Sweden: blue/yellow (subtle)
    Use color gradients, not images

  "ACCEPTED" badge (absolute, top-right of strip):
    Background: var(--color-success-surface)
    Color: var(--color-success)
    Font: DM Sans, 11px, uppercase, 500
    Padding: 4px 10px, radius pill

MIDDLE:
  Large quotation mark (Cormorant, 80px, 300):
    Color: var(--color-moss), opacity 0.25
    Line-height: 0, margin-bottom: 0

  Quote (Cormorant, italic, 18px, 400, ink, line-height 1.5):
    Max 2-3 sentences.

  Name + origin (DM Sans, 13px, moss, margin-top 20px):
    "— Amara O., Nigeria → UK"
  
  Scholarship received (DM Sans, 12px, secondary):
    "Chevening Scholarship, 2025"

BOTTOM (margin-top: 20px):
  Destination stats (flex row, gap 16px):
    Small moss-light chips:
    "Masters in Public Policy"
    "University of Edinburgh"

STATIC DATA (hardcode these 3 for now):

Story 1:
  Quote: "I spent three weeks searching. ScholarMatch
          showed me Chevening in 8 minutes. I didn't
          believe it was real until I got the email."
  Name: Amara O., Nigeria
  Destination: United Kingdom
  Award: Chevening Scholarship
  Programme: MSc Public Policy, University of Edinburgh

Story 2:
  Quote: "The eligibility breakdown told me exactly why
          I qualified. No surprises in the application.
          I knew I was a match before I even clicked apply."
  Name: Kwame A., Ghana
  Destination: Germany
  Award: DAAD Scholarship
  Programme: MSc Engineering, TU Munich

Story 3:
  Quote: "I almost missed the Swedish Institute deadline.
          ScholarMatch sent me a reminder 7 days out and
          a change alert when the deadline moved. I made it."
  Name: Fatima M., Kenya
  Destination: Sweden
  Award: Swedish Institute Scholarship
  Programme: MSc International Relations, Uppsala University
```

---

## 7. FINAL CTA SECTION

**Vibe**: Linear's dark close meets Apple product launch ending.

```
Background: #080808  ← back to dark, bookending the hero
Padding: clamp(100px, 16vw, 200px) vertical
Text-align: center

Grain overlay: 0.04 opacity

Content (max-width: 700px, centered):

  Label (DM Sans, 12px, rgba(255,255,255,0.4), uppercase, tracking):
    "START FREE TODAY"

  Headline (Cormorant, clamp(3rem, 7vw, 6rem), 300):
    Color: #F4F1EB
    Line 1: "Your scholarship"
    Line 2: "is out there."

    "scholarship" word — color: var(--color-moss) adjusted:
    Use #8DA67D (dark mode moss) for visibility on dark

  Subtext (DM Sans, 18px, rgba(255,255,255,0.5), margin-top 20px):
    "Join students across Africa already discovering
     scholarships that match their ambition."

  CTA (margin-top: 48px):
    Single large primary button:
    Text: "Find my scholarships →"
    Background: var(--color-moss) → #5F6F52
    Color: white
    Padding: 16px 36px
    Radius: pill
    Font: DM Sans, 16px, weight 500
    Hover: background #3F4F38, shadow 0 16px 40px rgba(95,111,82,0.4),
           transform translateY(-2px)
    onClick: router.push('/sign-up')

  Below button (margin-top: 16px):
    Text: "No account required to explore."
    Font: DM Sans, 13px, rgba(255,255,255,0.3)

Framer Motion — scroll-triggered reveal:
  Each element staggered, same ease as hero
```

---

## 8. FOOTER

**Vibe**: Vercel × Stripe × OpenAI. Minimal. Huge spacing. Editorial.

```
Background: #080808  ← continues the dark close
Border-top: 1px solid rgba(255,255,255,0.06)
Padding: 64px 24px 40px
Max-width: var(--content-width), centered

TOP ROW (flex, justify-content: space-between, align-items: flex-start):

  Left:
    ScholarMatch wordmark (Cormorant, 20px, rgba(255,255,255,0.8))
    Tagline below (DM Sans, 13px, rgba(255,255,255,0.3)):
      "AI-powered scholarship matching for African students."

  Right (flex, gap: 64px):
    Column 1 — Product:
      Header: "Product" (DM Sans, 11px, uppercase, rgba(white,0.3))
      Links: Discover · Saved · How it works
    
    Column 2 — Company:
      Header: "Company" (same style)
      Links: About · Privacy Policy · Terms of Service
    
    Column 3 — Connect:
      Header: "Connect" (same style)
      Links: Twitter/X · LinkedIn · support@scholarmatch.app

  All footer links:
    Font: DM Sans, 14px, rgba(255,255,255,0.5)
    Hover: rgba(255,255,255,0.8)
    transition: 180ms

BOTTOM ROW (margin-top: 48px, padding-top: 24px,
             border-top: 1px solid rgba(255,255,255,0.06)):
  flex, justify-content: space-between

  Left: "© 2026 ScholarMatch. All rights reserved."
        DM Sans, 12px, rgba(255,255,255,0.25)

  Right: "Built for Africa 🌍"
         DM Sans, 12px, rgba(255,255,255,0.25)
```

---

## 9. Animation Summary

All landing page scroll animations use Framer Motion `whileInView`:

```tsx
// Standard section reveal
const sectionVariants = {
  hidden: { opacity: 0, y: 48, filter: 'blur(4px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  }
}

// Stagger container
const containerVariants = {
  visible: { transition: { staggerChildren: 0.1 } }
}

// Usage on every section:
<motion.section
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-80px" }}
>
```

**Hero animations** — trigger on page load, NOT scroll.
**All other sections** — trigger on scroll into viewport.

---

## 10. Page Composition (app/page.tsx)

```tsx
import { ReactLenis } from 'lenis/react'

export default function LandingPage() {
  return (
    <ReactLenis root>
      <main>
        <Navbar />
        
        {/* Dark sections */}
        <Hero />
        <TrustBar />
        
        {/* Light sections — parchment */}
        <HowItWorks />
        <BentoFeatures />
        <StudentStories />
        
        {/* Dark close */}
        <FinalCTA />
        <Footer />
      </main>
    </ReactLenis>
  )
}
```

---

## 11. Responsive Rules

```
Mobile (< 768px):
  - Hero cards: hide card 2 and 3, show only card 1
  - Hero headline: clamp(2.75rem, 10vw, 3.5rem)
  - Bento grid: single column stack
  - How it works: stacked (visual below text)
  - Student stories: carousel or stack
  - Footer: single column

Tablet (768px – 1023px):
  - Hero: single column, center aligned
  - Bento: 2-column grid
  - How it works: stacked

Desktop (1024px+):
  - Full layout as specified
```

---

*End of Landing Page Design Spec*
*File: LANDING_PAGE_DESIGN.md*
*Paste this spec into DESIGN.md section 6.1 to replace the previous landing page design.*
