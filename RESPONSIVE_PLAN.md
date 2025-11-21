# Responsive Layout Analysis & Plan

## Step 1: Scan & Report

### Current Layout Analysis
- **Root Container (`MainSite.tsx`)**: Uses `w-screen overflow-hidden`. This forces the page to be exactly the viewport size. This is problematic for mobile devices where content (2 stacked images + leaderboard) will easily exceed viewport height, causing content to be clipped.
- **Voting Section**:
  - Uses `flex-col` on mobile, `flex-row` on desktop (`lg`).
  - `MemeCard` uses `w-full aspect-square`. On a mobile phone, two stacked square images will take up >100% of vertical space, pushing the leaderboard off-screen (and since it's `overflow-hidden`, it becomes inaccessible).
- **Leaderboard**:
  - On desktop, it has a constrained height `max-h-[calc(100vh-12rem)]` with scroll.
  - On mobile, it has no height constraint, so it expands fully. Combined with `overflow-hidden` on root, the bottom is cut off.
- **Ultrawide**:
  - Content stretches to full width (`w-screen`). Using `lg:w-2/3` means on a 4k screen the voting area is huge.

### Identified Issues
1. **Text/Content Clipping**: `overflow-hidden` on the root container in `MainSite.tsx` prevents vertical scrolling on small screens.
2. **Mobile Layout**: Stacked large square images consume too much vertical space.
3. **Large Screen Legibility**: Content spans full width without a maximum container width, leading to stretched layouts on large monitors.

## Step 2: Responsive Strategy

### Breakpoints
We will use standard Tailwind breakpoints but refine component behavior:
- **sm (640px)**: Small tablets/Landscape phones.
- **md (768px)**: Tablets. Switch voting cards to side-by-side if height permits, or keep stacked but smaller.
- **lg (1024px)**: Desktops. Side-by-side layout for Voting vs Leaderboard.
- **xl (1280px)+**: Limit max content width.

### Proposed Changes

#### 1. `components/MainSite.tsx`
- **Container**: Change `overflow-hidden` to `overflow-x-hidden`. Enable vertical scrolling by default on the body/root.
- **Max Width**: Wrap the main content in a container with `max-w-7xl mx-auto` to prevent it from stretching infinitely on ultrawide screens.
- **Voting/Leaderboard Layout**:
  - Keep `flex-col` on mobile, `lg:flex-row` on desktop.
  - Remove `h-screen` or `overflow-hidden` constraints that block scrolling on mobile.
  - Limit Leaderboard height on mobile (e.g., `max-h-96` with scroll) so it doesn't push the footer too far down, OR just let it flow naturally if scrolling is enabled.

#### 2. `components/MemeCard.tsx`
- **Sizing**:
  - Maintain `aspect-square` but ensure `max-h` constraints.
  - On mobile, we might want to allow them to be smaller or fit within the viewport better.

#### 3. `index.html` / Global CSS
- Ensure `html` and `body` don't have `overflow: hidden` styles that conflict with scrolling `MainSite`.

### Structural Layout Changes
- **Switch Block to Grid?**: The current Flexbox approach for the main columns (Voting vs Leaderboard) works well. We will stick to Flexbox but add constraint wrappers.
- **Grid for Cards**: The two voting cards are better as Flex items to center them easily.

## Step 3: Implementation Plan (Files to touch)
- `components/MainSite.tsx`: Fix root overflow, add max-width container, adjust responsiveness of flex containers.
- `components/MemeCard.tsx`: Review sizing constraints (mostly handled by parent, but check `max-w-md`).
