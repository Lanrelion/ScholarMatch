# Saved Page (The Tracker) Design Spec

## Design Mandate
The Saved page must feel like **"Your future collection."** It should be a visual sanctuary for inspiration and intellectual organization, borrowing the clean, uninterrupted grids of Cosmos and the thoughtful, distraction-free collections of Are.na. 
**DO NOT** use data tables, generic lists, or boring bookmark UI. 

## 1. Visual Architecture & Layout
*   **Masonry Grid:** Scholarships should populate in a fluid, staggered masonry layout (Pinterest-style) rather than a rigid, uniform grid. 
*   **Collections / "Clusters":** Users should be able to organize saves into visual folders (e.g., "Safety Schools", "Dream Masters", "High Probability").
*   **Drag & Drop:** The UI must support fluid drag-and-drop interactions to move cards between collections or reorder them based on priority.

## 2. Card Aesthetics (The "Moodboard" Feel)
*   **Visual Dominance:** Even though scholarships are text-heavy, the cards must feel visual. Use dynamic, deterministically generated abstract gradients (or university brand colors) as the "cover image" for each card.
*   **Minimalist Badges:** Remove noisy text. Use sleek, pill-shaped tags for matching criteria (e.g., "🧬 Microbiology", "🇳🇬 Eligible").
*   **Urgency Visualization:** Instead of a screaming red text for deadlines, use a subtle, animated progress bar or a beautifully glowing ring around the deadline date.

## 3. Interaction Patterns
*   **Hover States:** Cards should slightly elevate with a soft drop-shadow on hover. 
*   **Tag Filtering:** A sticky top bar with selectable visual tags (e.g., "Closing < 30 Days", "Fully Funded") that instantly re-sorts the masonry grid without page reloads.

## 4. File Targets & Structure Updates
*   **[MODIFY] `app/saved/page.tsx`:** Compose the main Collections view and the masonry layout.
*   **[NEW] `components/saved/MasonryGrid.tsx`:** The core engine for the staggered layout.
*   **[NEW] `components/saved/CollectionBoard.tsx`:** The drag-and-drop container for specific clusters of scholarships.
*   **[NEW] `components/saved/TrackerCard.tsx`:** The highly visual, gradient-backed card component specifically optimized for the saved view (different from the feed card).