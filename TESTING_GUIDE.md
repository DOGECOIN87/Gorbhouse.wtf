# Testing Guide - Gorbhouse Meme Ranker

## ✅ System Status

Both servers are now running:
- **Frontend:** http://localhost:5173/ (Vite dev server)
- **Backend:** http://localhost:3000/ (Node.js API server)
- **Database:** SQLite with 617 memes seeded
- **Meme Images:** All 617 images stored locally in `/public/memes/`

## 🧪 Test Checklist

### 1. Main Page (Hero Component)
- [ ] Visit http://localhost:5173/
- [ ] Verify "GORBHOUSE" title displays
- [ ] Verify "The Solana-Gorbagana Meme Community" subtitle displays
- [ ] Check social icons appear below subtitle:
  - [ ] X (Twitter) logo - white/inverted
  - [ ] Telegram logo - blue
  - [ ] Pump.fun logo - colorful
- [ ] Click each social link and verify they open in new tabs:
  - [ ] Twitter: https://x.com/GorbhouseSOL?s=20
  - [ ] Telegram: https://t.co/aYDZQP8fBF
  - [ ] Pump.fun: https://pump.fun/coin/GTYRKAD5hD2DKGa27kfTrZz3XfadKgw6bm9nZWh7pump

### 2. Meme Ranker Page
- [ ] Click "🎮 Back to Voting" button (or refresh to see ranker)
- [ ] Verify two meme images load side-by-side
- [ ] Verify meme images are NOT broken/missing
- [ ] Verify loading spinner appears while images load
- [ ] Verify "VS" text appears between the two memes

### 3. Voting Functionality
- [ ] Click on one of the meme images to vote
- [ ] Verify toast notification appears (success message)
- [ ] Verify the winning meme scales up and glows green
- [ ] Verify the losing meme scales down and fades
- [ ] Verify new meme pair appears after ~800ms
- [ ] Vote multiple times and verify ratings change

### 4. Leaderboard
- [ ] Check right sidebar shows "LEADERBOARD"
- [ ] Verify memes are sorted by rating (highest first)
- [ ] Verify top 3 have trophy icons (🥇🥈🥉)
- [ ] Verify ratings update in real-time as you vote
- [ ] Verify meme thumbnails display in leaderboard

### 5. Hall of Fame
- [ ] Click "🏆 View Hall of Fame" button
- [ ] Verify top 5 memes display in podium layout
- [ ] Verify 1st place is largest and centered
- [ ] Verify 2nd and 3rd place flank the winner
- [ ] Verify medal emojis display (🥇🥈🥉⭐)
- [ ] Verify ratings display for each meme
- [ ] Click on a meme to see enlarged view
- [ ] Click "🎮 Back to Voting" to return to ranker

### 6. Error Handling
- [ ] Disconnect network while voting
- [ ] Verify error toast appears
- [ ] Reconnect network
- [ ] Verify vote is retried automatically
- [ ] Verify success toast appears after retry

### 7. Music Player
- [ ] Click "🎵 Music" button
- [ ] Verify Audius player modal opens
- [ ] Verify player displays artist information
- [ ] Close modal by clicking X or outside

### 8. Home Button
- [ ] Click "🏠 Home" button
- [ ] Verify page reloads and returns to main page

### 9. Performance
- [ ] Verify images load quickly (< 2 seconds)
- [ ] Verify no console errors (F12 → Console)
- [ ] Verify smooth animations and transitions
- [ ] Verify responsive design on different screen sizes

### 10. API Endpoints
- [ ] Open browser DevTools (F12)
- [ ] Go to Network tab
- [ ] Verify GET `/api/memes` returns 617 memes
- [ ] Verify each meme has: id, url, rating, wins, losses
- [ ] Verify POST `/api/vote` updates ratings correctly
- [ ] Verify `/api/meme-image/{id}` serves PNG images

## 🔍 Expected Results

### Meme Images
- All 617 memes should load from local storage
- Images should be PNG format
- No CORS errors in console
- Images should display in MemeCard components

### Ratings
- Initial rating: 1200 for all memes
- ELO calculation should update ratings based on votes
- Winner rating increases, loser rating decreases
- Leaderboard should sort by rating descending

### Social Links
- All three icons should be visible and clickable
- X logo should be white (inverted)
- Telegram logo should be blue
- Pump.fun logo should display properly

## 📊 Test Results Template

```
Date: [Date]
Tester: [Name]

Main Page:
- Hero title: ✓/✗
- Subtitle: ✓/✗
- Social icons: ✓/✗
- Social links: ✓/✗

Meme Ranker:
- Images load: ✓/✗
- Voting works: ✓/✗
- Ratings update: ✓/✗
- Leaderboard updates: ✓/✗

Hall of Fame:
- Displays correctly: ✓/✗
- Podium layout: ✓/✗
- Modal works: ✓/✗

Error Handling:
- Toast notifications: ✓/✗
- Retry logic: ✓/✗

Overall Status: ✓ PASS / ✗ FAIL
Issues Found: [List any issues]
```

## 🚀 How to Test

1. **Open Browser:** Visit http://localhost:5173/
2. **Check Console:** Press F12 and go to Console tab
3. **Check Network:** Go to Network tab to see API calls
4. **Test Features:** Follow the checklist above
5. **Report Issues:** Note any errors or unexpected behavior

## 📝 Notes

- All 617 meme images are stored locally in `/public/memes/`
- Backend serves images via `/api/meme-image/{memeId}` endpoint
- Database persists ratings in SQLite (`memes.db`)
- Frontend uses environment variable `VITE_API_URL` for API connection
- Hot module reloading enabled for development

## ✅ Ready to Test!

Both servers are running and all systems are configured. Start testing now!
