# Quick Start Guide

## Prerequisites

- Node.js 16+ installed
- npm or yarn package manager

## Local Development (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Backend Server
```bash
npm run server
```
Expected output:
```
Server is running on port 3000
Connected to the SQLite database.
Seeding database with memes...
```

### 3. Start Frontend (New Terminal)
```bash
npm run dev
```
Expected output:
```
VITE v... ready in ... ms

➜  Local:   http://localhost:5173/
```

### 4. Open in Browser
Visit `http://localhost:5173/` and start voting!

## What You Can Do

### Main Page (Hero)
- View "GORBHOUSE" title
- Click social links:
  - 🐦 Twitter: @GorbhouseSOL
  - ✈️ Telegram: Community link
  - 🚀 Pump.fun: Token page

### Meme Ranker
- **Vote:** Click your favorite meme to vote
- **Leaderboard:** See top-ranked memes on the right
- **Hall of Fame:** View top 5 memes with medals
- **Music:** Listen to Audius tracks

## Voting System

1. Two random memes appear
2. Click the one you prefer
3. Toast notification confirms your vote
4. Ratings update in real-time
5. New pair appears automatically

## Troubleshooting

### "Cannot connect to API"
- Ensure backend is running: `npm run server`
- Check `VITE_API_URL` in `.env` is correct
- Verify port 3000 is not in use

### "Memes not loading"
- Check browser console for errors
- Verify backend is seeding database
- Try refreshing the page

### "Votes not saving"
- Check network tab in DevTools
- Verify backend is running
- Check database file exists: `ls -la memes.db`

### "Toast notifications not showing"
- Check browser console for errors
- Verify CSS animations are enabled
- Try a different browser

## Build for Production

```bash
# Build frontend
npm run build

# Output in dist/ folder
# Deploy to hosting service
```

## Environment Variables

### Development (Already Set)
```env
VITE_API_URL=http://localhost:3000
```

### Production
```env
VITE_API_URL=https://your-api-domain.com
```

## File Structure

```
gorbhouse/
├── components/          # React components
│   ├── Hero.tsx        # Main page with social links
│   ├── MainSite.tsx    # Meme ranker interface
│   ├── MemeCard.tsx    # Individual meme display
│   ├── Leaderboard.tsx # Rankings display
│   └── HallOfFame.tsx  # Top 5 memes
├── services/           # API services
│   ├── memeService.ts  # Fetch memes
│   └── eloService.ts   # Rating calculations
├── server/             # Backend
│   ├── server.js       # Express API
│   ├── database.js     # SQLite setup
│   └── memeIds.js      # 617 meme IDs
├── .env                # Environment variables
├── vite.config.ts      # Vite configuration
└── tsconfig.json       # TypeScript configuration
```

## Key Features

✅ **ELO Rating System** - Accurate ranking based on voting patterns
✅ **Real-time Updates** - Leaderboard updates instantly
✅ **Error Recovery** - Automatic retry on failed votes
✅ **Toast Notifications** - User feedback on actions
✅ **Responsive Design** - Works on desktop and mobile
✅ **Social Integration** - Links to Twitter, Telegram, Pump.fun
✅ **Music Player** - Audius integration for artist tracks

## Next Steps

1. Read `FIXES_APPLIED.md` for technical details
2. Check `DATABASE_SETUP.md` for database info
3. See `DEPLOYMENT_GUIDE.md` for production setup
4. Review `GITHUB_PAGES_DEPLOYMENT.md` for hosting

## Support

- Check console logs: `F12` → Console tab
- Review error messages in toast notifications
- Verify all services are running
- Check `.env` file configuration

Happy voting! 🎉
