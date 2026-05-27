# ScholarMatch — Onboarding Flow Design Spec
> Use with `/frontend-design` to build the onboarding experience.
> This is the product's most important UX moment.
> Inspiration: Typeform · Duolingo · Headspace · Arc · Clay

---

## Design Mandate

This onboarding must feel like:
**"An AI understanding your future."**

NOT:
- A form
- A survey
- A job application
- A university portal

Every screen is a conversation. The AI is listening.
The student is not filling fields — they are being understood.

---

## Global Onboarding Rules

```
Architecture:
  One question per screen. Always.
  Never show two inputs simultaneously.
  Keyboard navigation: Enter advances, Backspace goes back.

Layout (every screen):
  Full viewport height (100dvh)
  Background: var(--color-bg) — parchment
  Single centered column, max-width: 580px
  Vertical rhythm: question sits at 38% from top (not center)
  This feels more natural than true center

Typography scale for questions:
  Font: Cormorant Garamond
  Size: clamp(2rem, 4.5vw, 3rem)
  Weight: 300
  Color: var(--color-ink)
  Line-height: 1.15

Typography for sub-prompts:
  Font: DM Sans
  Size: 16px
  Weight: 400
  Color: var(--color-ink-secondary)
  Margin-top: 12px

Input style (conversational):
  No visible input border until focused
  Bottom line only: 2px, animated
  Focus: moss bottom line expands left → right
  Font: DM Sans, 20px
  Color: var(--color-ink)
  Background: transparent

Transitions between screens:
  Exit: { opacity: 0, x: -40, filter: 'blur(4px)' }
  Enter: { opacity: 0, x: 40, filter: 'blur(4px)' }
  → { opacity: 1, x: 0, filter: 'blur(0px)' }
  Duration: 400ms, ease: [0.22, 1, 0.36, 1]
  Use Framer Motion AnimatePresence with mode="wait"

Progress bar (top of screen, full width):
  Height: 2px
  Background track: var(--color-border)
  Fill: var(--color-moss)
  Animated: width transitions on every step
  Step 1 = 16%, Step 2 = 33%, ... Step 6 = 100%
  No step dots. No numbers. Just the bar.

Continue mechanic:
  Primary: large "Continue →" button
    BUT also: pressing Enter on keyboard triggers continue
    On mobile: "Next" appears after input is valid
  
  Skip option (where applicable):
    Ghost text below continue: "Skip for now →"
    Color: var(--color-ink-tertiary)
    Only shown on optional fields (GPA, experience)

Back navigation:
  Top-left: ← arrow (ghost, no text)
  Also: Backspace key when input is empty

Step counter (top-right):
  DM Sans, 12px, var(--color-ink-tertiary)
  Format: "2 of 6"

Ambient background shift:
  Each screen has a subtle background gradient shift:
  Screen 1: neutral parchment
  Screen 2: slight warm tint
  Screen 3: slight cool tint
  Screen 4: deepest warmth (destination = excitement)
  Screen 5: neutral
  Screen 6: preparing for reveal (slight darkening)
  Transition: 800ms ease between screens
```

---

## Screen 1 — Name + Aspiration

**What Clay + Notion AI taught us:**
Start with identity, not data. Ask who they are, not what their
GPA is.

```
Question (Cormorant, question size):
  "What's your name, and what
   are you building your future around?"

Sub-prompt (DM Sans, 16px, secondary):
  "This helps us personalise everything for you."

INPUT 1 — First name:
  Conversational placeholder: "Your first name..."
  Bottom line input, auto-focused on screen load
  On type: placeholder vanishes, bottom line animates moss

INPUT 2 — Aspiration (appears after first name has content):
  Animate in from opacity 0 with 300ms delay after name typed
  Question shifts upward slightly when second input appears
  Placeholder: "I'm building my future around..."
  This is free text — not a dropdown, not chips
  Examples shown as ghost suggestions in placeholder:
    rotating between: "medicine in Canada" /
    "tech entrepreneurship" / "public policy in Europe" /
    "climate research" / "engineering in Germany"
  These rotate every 3 seconds with a fade transition
  User types their own answer — suggestions are inspiration only

VISUAL TREATMENT:
  As user types name, a subtle greeting appears above the input:
    "Hi, [Name]." (Cormorant, 28px, moss, italic)
    Fades in after 400ms pause in typing
    Feels like the AI is already acknowledging them

CONTINUE CONDITION:
  First name filled → Continue enabled
  Aspiration is optional

CONTINUE BUTTON STYLE (same on all screens):
  Background: var(--color-moss)
  Color: white
  Padding: 14px 32px
  Border-radius: pill
  Font: DM Sans, 15px, weight 500
  Width: fit-content, min-width: 180px
  Hover: translateY(-2px), deeper moss shadow
  Press Enter: same as clicking
```

---

## Screen 2 — Nationality

**What Wise + Airbnb taught us:**
Country selection should feel like the world opening up,
not a dropdown from 1997.

```
Question:
  "Where are you from?"

Sub-prompt:
  "Your nationality determines which scholarships
   you can access. Be specific — it matters."

SEARCH INPUT:
  Large, conversational
  Placeholder: "Search your country..."
  Auto-focused
  Font: DM Sans, 20px
  No border — only animated bottom line (moss on focus)

QUICK-SELECT FLAGS (above search):
  Top 8 most common African scholarship origins:
  Display as flag + country name cards
  Layout: horizontal scroll row, gap 10px
  Each card: 
    Flag emoji (24px) + country name (DM Sans, 13px, 500)
    Background: var(--color-surface)
    Border: 1px solid var(--color-border)
    Border-radius: var(--radius-lg)
    Padding: 10px 14px
    Cursor: pointer
    
    Countries: 🇳🇬 Nigeria · 🇰🇪 Kenya · 🇬🇭 Ghana · 🇪🇹 Ethiopia
               🇿🇦 South Africa · 🇹🇿 Tanzania · 🇺🇬 Uganda · 🇿🇼 Zimbabwe

    On hover: border-color var(--color-border-strong), 
              translateY(-1px)
    On select: background var(--color-moss-light),
               border-color var(--color-moss),
               text color var(--color-moss)
    Transition: 180ms

  Flag ANIMATION on selection:
    Selected flag: scale 1 → 1.15 → 1.0 (spring, 300ms)
    Slight confetti burst from the flag (3-4 particles, moss color)
    This is the delight moment — celebrate the identity

SEARCH RESULTS DROPDOWN:
  Appears below input after 1+ character
  Max 6 results shown
  Each result: flag emoji + country name
  Highlight matching characters in bold
  Background: var(--color-surface)
  Border: 1px solid var(--color-border)
  Border-radius: var(--radius-lg)
  Box-shadow: 0 8px 32px rgba(22,21,20,0.08)
  
  Result hover: background var(--color-surface-hover)

SELECTED STATE:
  When country selected:
    Search input replaced by selected flag card (large)
    Card: 
      Flag emoji (32px) + country name (Cormorant, 24px, ink)
      "Scholarship access unlocked" (DM Sans, 13px, moss)
      Background: var(--color-moss-light)
      Border: 1px solid var(--color-moss)
      Border-radius: var(--radius-xl)
      Padding: 16px 20px
    
    Below: dynamically show scholarship count:
      "We have [N] scholarships available for [Country] students."
      DM Sans, 14px, secondary ink
      Number animates counting up from 0 → N (800ms)

CONTINUE CONDITION:
  Country selected → Continue enabled
```

---

## Screen 3 — GPA

**What Ramp + Brex taught us:**
Financial/academic data should feel professional and precise,
not clinical. Give confidence, not anxiety.

```
Question:
  "How are you performing academically?"

Sub-prompt:
  "We use this to filter out scholarships you can't access.
   Don't worry — most scholarships have no GPA requirement."

SCALE SELECTOR (shown first):
  4 toggle chips in a row:
    "4.0 scale" · "5.0 scale" · "7.0 scale" · "Percentage"
  Active chip: moss fill, white text
  Inactive: border, secondary text
  Selecting scale adjusts the slider below

SLIDER INPUT:
  Full width of content area
  Track height: 4px
  Track color: var(--color-border)
  Fill color: var(--color-moss)
  Thumb: 24px circle, white, 2px moss border, shadow
         On drag: scale 1.2, shadow expands
  
  Range:
    4.0 scale: 0.0 → 4.0, step 0.1
    5.0 scale: 0.0 → 5.0, step 0.1
    7.0 scale: 0.0 → 7.0, step 0.1
    Percentage: 0 → 100, step 1

CURRENT VALUE DISPLAY:
  Above thumb (tooltip style):
    Value: Cormorant, 32px, weight 300, ink
    e.g. "3.7" or "74%"
    Animate: counts up from 0 as slider first loads (800ms)

CONFIDENCE INDICATOR (below slider):
  Based on GPA value, show a status line:
  
  Top 10% of scale:
    Color: var(--color-moss)
    Text: "Excellent — opens most scholarship opportunities"
    Icon: Star (Phosphor, 14px)
  
  Top 30%:
    Color: var(--color-clay)
    Text: "Good — you qualify for the majority of scholarships"
  
  Below median:
    Color: var(--color-ink-secondary)
    Text: "Don't worry — many scholarships have no minimum GPA"

  Animate: fades in/out as slider moves, 200ms transition

SCHOLARSHIPS PREVIEW (updates live):
  Below confidence indicator:
  "~[N] scholarships match your GPA"
  DM Sans, 13px, secondary ink
  Number updates as slider moves (debounced 300ms)

SKIP OPTION:
  "Skip — I'll add this later →" ghost text
  Below continue button

CONTINUE CONDITION:
  Always enabled (GPA is optional but encouraged)
```

---

## Screen 4 — Destination

**What Google Earth + Nomad List taught us:**
Destination is about dreams, not logistics.
This screen should feel like opening a map and imagining.

```
Question:
  "Where do you imagine yourself?"

Sub-prompt:
  "Choose the countries you'd love to study in.
   Or anywhere — we'll find funding for each."

DESTINATION CARDS LAYOUT:
  
  PRIMARY: Visual destination grid
  2-column on desktop, 1-column on mobile
  Each card: 140px height

  DESTINATION CARD DESIGN:
    Position: relative, overflow: hidden
    Border-radius: var(--radius-xl)
    Cursor: pointer
    
    Background: rich gradient for each country/region
      UK:          linear-gradient(135deg, #1a3a4a 0%, #2d5a6e 100%)
      Germany:     linear-gradient(135deg, #1a1a2e 0%, #2d2d4a 100%)
      Sweden:      linear-gradient(135deg, #1a2a4a 0%, #005f9e 100%)
      Canada:      linear-gradient(135deg, #8b1a1a 0%, #cc0000 100%)
      Netherlands: linear-gradient(135deg, #1a3a6a 0%, #ff6600 60%)
      USA:         linear-gradient(135deg, #1a2a5a 0%, #bf0a30 100%)
      France:      linear-gradient(135deg, #002395 0%, #ED2939 100%)
      Australia:   linear-gradient(135deg, #00843D 0%, #FFCD00 100%)
      Any country: linear-gradient(135deg, #2d1b69 0%, #5f6f52 100%)
    
    Grain overlay: opacity 0.06
    
    CONTENT (bottom of card):
      Country name (Cormorant, 20px, white, weight 400)
      Scholarship count (DM Sans, 12px, rgba(255,255,255,0.7)):
        "47 scholarships available"
    
    UNSELECTED STATE:
      Slight dark overlay: rgba(0,0,0,0.2)
    
    SELECTED STATE:
      Remove dark overlay
      Glow ring: box-shadow 0 0 0 2px var(--color-moss),
                            0 0 0 4px rgba(95,111,82,0.3)
      Checkmark (top-right): 
        24px moss circle, white CheckCircle icon (Phosphor, fill)
        Animate: scale 0 → 1, spring easing
    
    HOVER STATE (unselected):
      Dark overlay lifts slightly
      Card lifts: translateY(-3px)
      Transition: 200ms

  FEATURED DESTINATIONS (shown first, prominent):
    UK · Germany · Sweden · Canada
    Shown as 2×2 grid of larger cards (160px height)
    
  "MORE COUNTRIES" SECTION (below featured):
    Label: "Or explore more →" (DM Sans, 13px, moss)
    Clicking expands to show 20+ additional destination cards
    With Framer Motion height animation

  SEARCH OPTION:
    Above destination grid:
    Small search input: "Search any country..."
    Filters the grid dynamically

MULTI-SELECT:
  User can select multiple destinations
  Each selection: spring bounce animation on card
  Selected count shown in continue button:
    "Continue with [N] destinations →"
    Updates dynamically

"ANYWHERE" OPTION:
  Below all cards:
  Special card with globe icon
  "Open to anywhere" — selects no specific countries
  Background: var(--color-surface), border: 1px dashed var(--color-border)
  Selecting this deselects all others

CONTINUE CONDITION:
  At least 1 destination selected OR "anywhere" selected
  "Skip for now →" ghost option also available
```

---

## Screen 5 — Field of Study

**What Spotify + Pinterest taught us:**
Interest selection should feel like discovery, not filing.
Make the options feel like possibilities.

```
Question:
  "What are you studying — or planning to?"

Sub-prompt:
  "Pick everything that applies. We'll find scholarships
   across all your interests."

CHIP SELECTION LAYOUT:
  Masonry-style grid (not a uniform grid)
  Chips of varied widths based on text length
  Gap: 10px
  Natural wrapping

CHIP DESIGN:
  Default state:
    Background: var(--color-surface)
    Border: 1px solid var(--color-border)
    Color: var(--color-ink-secondary)
    Border-radius: var(--radius-pill)
    Padding: 10px 18px
    Font: DM Sans, 14px, weight 400
    Transition: all 180ms var(--ease-primary)
  
  Hover:
    Border-color: var(--color-border-strong)
    Color: var(--color-ink)
    Background: var(--color-surface-hover)
    translateY(-1px)
  
  Selected:
    Background: var(--color-moss)
    Border-color: var(--color-moss)
    Color: white
    Font-weight: 500
    Scale: 1.02 (spring animation on select)
    Checkmark prepended: "✓ Computer Science"

CHIP CATEGORIES AND ITEMS:

Technology & Engineering:
  Computer Science · Software Engineering · Data Science
  AI & Machine Learning · Electrical Engineering
  Mechanical Engineering · Civil Engineering · Robotics

Medicine & Health:
  Medicine · Nursing · Public Health · Pharmacy
  Biomedical Science · Dentistry · Physiotherapy

Business & Economics:
  Business Administration · Economics · Finance
  Entrepreneurship · Marketing · Accounting · MBA

Sciences:
  Biology · Chemistry · Physics · Environmental Science
  Microbiology · Biochemistry · Marine Science

Social Sciences & Arts:
  Law · Political Science · International Relations
  Psychology · Sociology · Education · Journalism
  Architecture · Fine Arts · Communication

Agriculture & Environment:
  Agriculture · Food Science · Forestry
  Climate Science · Urban Planning

CATEGORY HEADERS:
  Shown as small dividers between category groups
  DM Sans, 11px, uppercase, tracking 0.08em, tertiary ink
  Collapse/expand categories on mobile with tap

EXPANDABLE CATEGORIES:
  Show top 3 chips per category initially
  "Show more →" link (clay, 13px) expands the category
  Animation: height expand with spring easing

SEARCH OVERRIDE:
  At top of chip grid:
  "Or search a specific field..."
  Typing filters chips in real-time AND allows free-text entry
  If no chip matches: show "Add '[typed text]' as your field"
  This catches edge cases like "Marine Archaeology"

SELECTION FEEDBACK:
  As chips are selected, a summary appears below:
  "You're focused on [chip 1], [chip 2], and [chip 3]"
  DM Sans, 14px, secondary ink, italic
  Updates dynamically as selections change
  Max 3 shown, then "+ N more"

CONTINUE CONDITION:
  At least 1 chip selected OR free text entered
  Continue button shows: "Continue with [N] fields →"
```

---

## Screen 6 — Experience & Degree Level

**What LinkedIn + Tally taught us:**
Experience and academic level should feel like milestones
achieved, not boxes to check.

```
Question:
  "Where are you in your academic journey?"

Sub-prompt:
  "This determines which scholarship types you qualify for."

DEGREE LEVEL (shown first):
  3 large option cards in a column
  Each card full width of content area

  CARD DESIGN:
    Default:
      Background: var(--color-surface)
      Border: 1px solid var(--color-border)
      Border-radius: var(--radius-xl)
      Padding: 20px 24px
      Cursor: pointer
      Transition: all 180ms var(--ease-primary)
      
      Layout: flex, space-between
      Left: 
        Degree name (DM Sans, 16px, 500, ink)
        Description (DM Sans, 13px, secondary ink, margin-top 3px)
      Right:
        Radio circle (20px, border 2px solid border-color)

    Hover:
      Border-color: var(--color-border-strong)
      Background: var(--color-surface-hover)
      translateY(-1px)
    
    Selected:
      Border-color: var(--color-moss)
      Background: var(--color-moss-light)
      Left text: color var(--color-moss)
      Right: filled circle, moss, with white dot center
      
      Spring animation: scale 1 → 1.01 → 1.0 on select

  CARD 1 — Undergraduate:
    Name: "Bachelor's degree"
    Description: "BSc, BA, BEng, BEd — currently studying or applying"

  CARD 2 — Masters (pre-selected/highlighted visually):
    Name: "Master's degree"
    Description: "MSc, MA, MBA, MEng — the most scholarship opportunities"
    
    MOST POPULAR BADGE (absolute, top-right):
      "Most opportunities"
      Background: var(--color-gold-light)
      Color: var(--color-clay)
      Font: DM Sans, 11px, 500
      Padding: 3px 10px, border-radius: pill

  CARD 3 — PhD:
    Name: "Doctoral degree"
    Description: "PhD, DPhil — research-focused funding available"

YEARS OF EXPERIENCE (appears below degree selection):
  Animate in after degree is selected (300ms delay, fade + slide up)
  
  Label (DM Sans, 14px, secondary ink):
    "Years of work or research experience (optional)"
  
  SLIDER:
    Range: 0 → 10+
    Track: same moss fill style as GPA screen
    
    Labels below track:
      0        2        5        10+
      "Fresh"  "Some"  "Growing" "Seasoned"
      DM Sans, 11px, tertiary ink
    
    MILESTONE MARKERS on track:
      At 2 years: small tick mark (some scholarships require this)
      At 3 years: small tick mark (Swedish Institute requirement)
      Tooltip on hover: "[N] scholarships unlock at this level"
    
    Current value display:
      Above thumb:
        0: "No experience yet"
        1: "1 year"
        2-9: "N years"
        10: "10+ years"
        Font: DM Sans, 14px, weight 500, ink
  
  NOTE (below slider):
    DM Sans, 12px, var(--color-ink-tertiary)
    "Some scholarships require minimum experience.
     We'll always show you why you qualify or don't."

CONTINUE CONDITION:
  Degree level selected → Continue enabled
  Experience is optional, skip option shown
```

---

## Screen 7 — AI Loading (SIGNATURE MOMENT)

**This is not a loading screen. It is a cinematic reveal.**

**What Perplexity + Cursor + Runway taught us:**
Show the thinking. Let the user feel the intelligence working.
Make every millisecond feel intentional.

### Full Spec

```
Duration: 3.5 to 5 seconds total (never shorter, never longer)
Background: transitions from var(--color-bg) → #0A0A0A over 800ms
  The screen darkens as the AI "focuses"

PHASE 1 — AWAKENING (0ms to 800ms):
  Background dims: parchment → dark (#0A0A0A), 800ms ease
  
  Center of screen:
    ScholarMatch logo mark appears first
    40px moss square, "SM" in white
    Scale: 0.8 → 1.0, opacity 0 → 1, 400ms
    Then: logo gently pulses (scale 1.0 → 1.04 → 1.0, 1.5s, infinite)

PHASE 2 — THINKING (800ms to 2800ms):
  Animated thinking messages appear below the logo
  One at a time, each fading in then out:
  
  Duration per message: ~500ms visible, 200ms fade between
  
  Messages (in sequence):
    "Reading your profile..."
    "Scanning 500+ scholarships..."
    "Checking nationality requirements..."
    "Analysing GPA eligibility..."
    "Finding [Country] student opportunities..."  ← use their actual country
    "Matching your field of study..."
    "Discovering hidden university awards..."
    "Almost there..."
  
  Message style:
    Font: DM Sans, 15px, weight 400
    Color: rgba(255,255,255,0.6)
    Text-align: center
    Max-width: 320px
    
    Animation per message:
      Enter: opacity 0, y: 8 → opacity 1, y: 0 (200ms)
      Exit:  opacity 1 → opacity 0 (200ms)
  
  AMBIENT PARTICLES (background):
    15-20 tiny particles floating upward
    Size: 2-4px circles
    Color: var(--color-moss) at 0.3-0.6 opacity
    Random positions across the screen
    Slow upward float: translateY(0) → translateY(-120px)
    Duration: 3-5s per particle, random stagger
    Loop: continuous
    Implementation: simple CSS keyframes or Framer Motion
    
    IMPORTANT: Particles should be SUBTLE.
    They suggest intelligence working, not a nightclub.

  SCHOLARSHIP COUNT (appears at 1500ms):
    Below messages, counting up:
    "Evaluating [0 → N] scholarships"
    where N = total scholarship count from your DB
    Count animation: 0 → N over 1200ms, easeOut
    Font: Cormorant, 28px, 300, white
    
    Then when count reaches N:
    Transitions to: "[N] scholarships analysed"
    Color shifts: white → var(--color-moss) (the dark mode moss: #8DA67D)

PHASE 3 — REVEAL PREPARATION (2800ms to 3500ms):
  All thinking messages fade out
  Particles fade out
  
  The match count remains:
  "[N] scholarships analysed" fades out
  
  NEW text fades in:
    Line 1 (DM Sans, 14px, uppercase, tracking, rgba(255,255,255,0.5)):
      "YOUR RESULTS ARE READY"
    
    Line 2 (Cormorant, clamp(2rem, 5vw, 3.5rem), 300, #F4F1EB):
      "We found [X] scholarships
       aligned with your future."
    
    Where [X] = actual match count from API
    The number [X] animates: 0 → X, 600ms, ease-out
    [X] is in moss color (#8DA67D on dark)
    
    Lines animate in with stagger:
      Line 1: delay 0ms, fade + y: 20 → 0
      Line 2: delay 200ms, fade + y: 20 → 0

PHASE 4 — TRANSITION OUT (3500ms+):
  Background lifts from #0A0A0A → var(--color-bg) (parchment)
  Duration: 700ms
  
  As background lifts:
    The cards are already rendered behind this overlay
    (pre-render the results screen so it's instant)
    The dark overlay fades away like a curtain lifting
  
  The user is now on the results/dashboard screen
  
  First 4 scholarship cards float in:
    Each: opacity 0, y: 48, scale: 0.96 → opacity 1, y: 0, scale: 1
    Stagger: 150ms between each card
    Duration: 700ms per card
    Ease: [0.22, 1, 0.36, 1]

CRITICAL RULES FOR THIS SCREEN:
  ✗ NO spinners — not even small ones
  ✗ NO progress bars
  ✗ NO percentage complete
  ✗ NO generic "Loading..." text
  ✓ Always show personalised messages (use their name, country)
  ✓ Always show the scholarship count counting up
  ✓ Always make it feel like intelligence, not waiting
```

---

## Implementation Notes

### File Structure
```
components/onboarding/
  OnboardingShell.tsx       ← progress bar, navigation, transitions
  screens/
    Screen1Name.tsx         ← name + aspiration
    Screen2Nationality.tsx  ← country picker with flags
    Screen3GPA.tsx          ← slider with confidence
    Screen4Destination.tsx  ← destination cards
    Screen5Field.tsx        ← chip selector
    Screen6Experience.tsx   ← degree + experience slider
  MatchReveal.tsx           ← AI loading + cinematic reveal

hooks/
  useOnboardingState.ts     ← shared state across all screens
  useCountUp.ts             ← number count animation
```

### State Shape
```typescript
type OnboardingState = {
  // Screen 1
  firstName: string
  lastName: string
  aspiration: string

  // Screen 2
  nationality: string          // ISO code e.g. "NG"
  nationalityName: string      // e.g. "Nigeria"

  // Screen 3
  gpa: number | null
  gpaScale: 4 | 5 | 7 | 100

  // Screen 4
  destinations: string[]       // ISO codes, empty = anywhere

  // Screen 5
  fields: string[]

  // Screen 6
  currentDegree: 'UNDERGRADUATE' | 'MASTERS' | 'PHD'
  workExperienceYears: number
  
  // Derived
  needsFinancialAid: boolean   // set from financial preferences
}
```

### Keyboard Navigation
```tsx
// Global keyboard handler in OnboardingShell:
useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && isCurrentStepValid()) advanceStep()
    if (e.key === 'Backspace' && !isInputFocused()) goBack()
  }
  window.addEventListener('keydown', handler)
  return () => window.removeEventListener('keydown', handler)
}, [currentStep, isCurrentStepValid])
```

### AI Loading Timing
```tsx
// MatchReveal.tsx phase controller
const phases = [
  { start: 0,    end: 800,  phase: 'awakening' },
  { start: 800,  end: 2800, phase: 'thinking' },
  { start: 2800, end: 3500, phase: 'revealing' },
  { start: 3500, end: 4200, phase: 'transition' },
]

// Messages with personalisation
const getMessages = (state: OnboardingState) => [
  "Reading your profile...",
  "Scanning 500+ scholarships...",
  `Checking ${state.nationalityName} eligibility...`,
  "Analysing academic requirements...",
  state.destinations.length > 0
    ? `Finding ${countryName(state.destinations[0])} opportunities...`
    : "Searching globally...",
  `Matching ${state.fields[0] || 'your field'}...`,
  "Discovering hidden university awards...",
  "Almost there...",
]
```

---

## Verification Checklist

```
□ Each screen occupies full viewport height
□ Question sits at 38% from top (not centered)
□ Progress bar is 2px, full width, no step dots
□ Transitions between screens: blur + slide (not slide alone)
□ Enter key advances every screen
□ Backspace (when input empty) goes back
□ Screen 2: flag animation on country select
□ Screen 2: scholarship count counts up after selection
□ Screen 3: confidence indicator updates as slider moves
□ Screen 4: destination cards have gradient backgrounds
□ Screen 4: checkmark spring-animates on card select
□ Screen 5: chips are varied width (not uniform grid)
□ Screen 5: "You're focused on..." summary updates live
□ Screen 6: experience section animates in after degree selected
□ Screen 7: NO spinners anywhere
□ Screen 7: messages are personalised with user's name/country
□ Screen 7: scholarship count counts up
□ Screen 7: dark overlay lifts like a curtain (not a cut)
□ First 4 cards float in with stagger after reveal
□ tsc --noEmit: 0 errors
```

---

*End of Onboarding Flow Design Spec*
*This is the product's most important UX surface.*
*Every pixel of this flow is a promise to the student.*
