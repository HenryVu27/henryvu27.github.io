# Life Section — Design Spec

## Overview

Add a "Life" section to henryvu27.github.io as a separate page showcasing personal hobbies: Food, Wine, and Piano. The section should feel like a casual scrapbook with a human touch, matching the warm minimalist aesthetic of the existing site.

## Architecture

### File Structure

```
henryvu27.github.io/
  life.html              # Landing page
  life/
    food.html            # Food category page
    wine.html            # Wine category page
    piano.html           # Piano category page
```

All pages share the existing `styles.css` and `script.js` (extended as needed). No new dependencies, frameworks, or build tools.

### Navigation

Add "Life" to the main nav bar in `index.html`:

**Before:** About · Experience · Projects · Contact
**After:** About · Experience · Projects · Life · Contact

"Life" links to `life.html`. The nav item appears on all pages (including the Life pages themselves) for consistent navigation.

## Page Designs

### Life Landing Page (`life.html`)

**Layout:** Centered content, minimal. A heading and a single narrative paragraph.

**Structure:**
- Page uses the same header/nav, theme toggle, and footer as `index.html`
- Large heading: "Life" — styled like existing section headings (`font-size: 1.75rem`, `font-weight: 500`, `letter-spacing: -0.03em`, `--heading-color`)
- Below: a conversational paragraph with hobbies woven as inline styled links
- Each link navigates to its category page
- Below the paragraph: a subtle italic hint in `--secondary-color`

**Link Styling:**
- Food link: `--accent-color` (#8b2500 vermillion)
- Wine link: custom burgundy (#722040)
- Piano link: `--primary-color`
- All links use the existing underline hover animation (`:after` pseudo-element, `width: 0 → 100%`, `0.2s ease-out`)

**Content:** Placeholder text — user will write final copy. Structure is a single flowing sentence that naturally references all three hobbies as clickable phrases.

### Category Pages (`life/food.html`, `life/wine.html`, `life/piano.html`)

All three share the same layout template with content-specific variations.

**Header Area:**
- "← Back to Life" link at top-left, styled in `--accent-color`
- Category title as large heading (same style as landing page)
- Short tagline below in `--secondary-color` (user will write)

**Content Area — Alternating Rows:**
- Odd entries (1st, 3rd, 5th...): image/video LEFT, text RIGHT
- Even entries (2nd, 4th, 6th...): text LEFT, image/video RIGHT
- Two-column flex layout with `gap: 20px`, items vertically centered

**Entry Structure (Food & Wine):**
- Image: aspect ratio ~3:2, `border-radius: 8px`, lazy-loaded (`loading="lazy"`, `decoding="async"`)
- Text side:
  - Location/context line — small text in `--secondary-color`
  - Title — `font-size: 1.05rem`, `font-weight: 500`, `--heading-color`
  - Review text — `font-size: 0.88rem`, `--text-color`, `line-height: 1.5` (pasted from Google Reviews)
  - Rating (optional) — `font-size: 0.85rem`, `--accent-color`, `font-weight: 500`
- Entries separated by `1px solid --border-color` divider with padding

**Entry Structure (Piano):**
- Same alternating layout
- Instead of images: embedded YouTube iframes (16:9 responsive aspect ratio)
- Text side:
  - Piece name — title styling
  - Composer — location/context styling
  - Short personal note — review text styling

**Responsive Behavior (≤600px):**
- Entries stack vertically: image/video on top, text below
- No alternating on mobile — all entries use the same stacked order
- Images span full width

### Adding New Entries

Each entry is a self-contained HTML block that can be copy-pasted. Example template:

```html
<!-- Entry: [odd = img-left, even = img-right] -->
<div class="life-entry">
  <div class="life-entry-media">
    <img src="assets/life/food/filename.webp" alt="description" loading="lazy" decoding="async">
  </div>
  <div class="life-entry-text">
    <span class="life-entry-location">Restaurant · City, State</span>
    <h3 class="life-entry-title">Dish Name</h3>
    <p class="life-entry-review">Your review text here.</p>
    <span class="life-entry-rating">9/10</span>
  </div>
</div>
```

For piano (YouTube embed):

```html
<div class="life-entry">
  <div class="life-entry-media">
    <div class="video-container">
      <iframe src="https://www.youtube.com/embed/VIDEO_ID" allowfullscreen></iframe>
    </div>
  </div>
  <div class="life-entry-text">
    <span class="life-entry-location">Composer</span>
    <h3 class="life-entry-title">Piece Name</h3>
    <p class="life-entry-review">Your note here.</p>
  </div>
</div>
```

## Styling

### New CSS (added to `styles.css`)

**New color variable:**
- `--wine-color: #722040` (burgundy, for wine link on landing page)

**New classes:**
- `.life-landing` — container for landing page content (centered, max-width)
- `.life-narrative` — paragraph styling (larger font, relaxed line-height)
- `.life-entry` — flex row for alternating entries
- `.life-entry:nth-child(even)` — `flex-direction: row-reverse` for alternating
- `.life-entry-media` — flex: 1, holds image or video
- `.life-entry-text` — flex: 1, holds text content
- `.life-entry-location`, `.life-entry-title`, `.life-entry-review`, `.life-entry-rating` — text styling
- `.video-container` — responsive 16:9 iframe wrapper

### Theme Support

All new styles use existing CSS variables (`--bg-color`, `--text-color`, `--heading-color`, `--border-color`, `--accent-color`, `--card-bg`, `--secondary-color`). Both Morning Fog and Piano Symphony themes work automatically with no additional theme-specific CSS needed.

The only new variable (`--wine-color`) needs dark mode equivalent: `#c4607a`.

### Animations

- Life entries use the existing Intersection Observer scroll-reveal pattern
- Fade in: `opacity: 0, translateY(20px)` → `opacity: 1, translateY(0)`
- Stagger: `180ms` delay between consecutive entries (matches About section paragraph stagger)
- Landing page links use existing `:after` underline animation

## JavaScript

### New JS (added to `script.js`)

- Intersection Observer for `.life-entry` elements (reuses existing pattern from project cards / about paragraphs)
- No other new JS needed

### Shared JS

The following existing functionality carries over to Life pages:
- Theme toggle (localStorage persistence)
- Header show/hide on scroll
- Smooth scroll behavior

## Assets

```
assets/life/
  food/       # Food photos (WebP preferred, lazy-loaded)
  wine/       # Wine photos
  piano/      # Piano thumbnails (optional, YouTube provides its own)
```

## Scope Boundaries

**In scope:**
- `life.html` landing page
- `life/food.html`, `life/wine.html`, `life/piano.html` category pages
- Nav update on `index.html`
- CSS additions to `styles.css`
- JS additions to `script.js` (Intersection Observer for new pages)
- Asset directory structure

**Out of scope:**
- CMS or dynamic content generation
- Search, filtering, or pagination
- Comments or social features
- Any new dependencies or build tools
