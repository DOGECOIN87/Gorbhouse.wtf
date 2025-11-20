# 🎮 Gorbhouse Meme Ranker - START HERE

Welcome! This guide will help you get started with the Gorbhouse Meme Ranker.

## 📋 What Just Happened?

Your meme ranker has been reviewed and improved with:
- ✅ Fixed type system issues
- ✅ Added environment variable support
- ✅ Implemented error handling & retry logic
- ✅ Added toast notifications
- ✅ Created comprehensive documentation

## 🚀 Quick Start (5 minutes)

### Step 1: Start Backend
```bash
npm run server
```
You should see:
```
Server is running on port 3000
Connected to the SQLite database.
```

### Step 2: Start Frontend (New Terminal)
```bash
npm run dev
```
You should see:
```
VITE v... ready in ... ms
➜  Local:   http://localhost:5173/
```

### Step 3: Open Browser
Visit `http://localhost:5173/` and start voting!

## 📚 Documentation Guide

### For Immediate Setup
👉 **[QUICK_START.md](QUICK_START.md)** - 5-minute setup guide with troubleshooting

### For Understanding Changes
👉 **[FIXES_APPLIED.md](FIXES_APPLIED.md)** - What was fixed and why

### For Database Questions
👉 **[DATABASE_SETUP.md](DATABASE_SETUP.md)** - Database configuration and backup

### For Production Deployment
👉 **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Deploy to production

### For Complete Details
👉 **[REVIEW_COMPLETE.md](REVIEW_COMPLETE.md)** - Full review and implementation details

## 🎯 What You Can Do

### Main Page
- View "GORBHOUSE" title with social links
- Click social media icons:
  - 🐦 Twitter: @GorbhouseSOL
  - ✈️ Telegram: Community link
  - 🚀 Pump.fun: Token page

### Meme Ranker
- **Vote:** Click your favorite meme
- **Leaderboard:** See top-ranked memes
- **Hall of Fame:** View top 5 memes
- **Music:** Listen to Audius tracks

## ⚡ Key Features

✨ **ELO Rating System** - Accurate ranking based on votes
✨ **Real-time Updates** - Leaderboard updates instantly
✨ **Error Recovery** - Automatic retry on failed votes
✨ **Toast Notifications** - User feedback on actions
✨ **Responsive Design** - Works on desktop and mobile
✨ **Social Integration** - Links to Twitter, Telegram, Pump.fun

## 🔧 Troubleshooting

### "Cannot connect to API"
- Ensure backend is running: `npm run server`
- Check port 3000 is not in use
- Verify `.env` has correct `VITE_API_URL`

### "Memes not loading"
- Check browser console (F12)
- Verify backend is running
- Try refreshing the page

### "Votes not saving"
- Check network tab in DevTools
- Verify backend is running
- Check database file exists: `ls -la memes.db`

## 📦 Project Structure

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
└── vite.config.ts      # Vite configuration
```

## 🌍 Environment Variables

### Development (Already Set)
```env
VITE_API_URL=http://localhost:3000
```

### Production
```env
VITE_API_URL=https://your-api-domain.com
```

## 📊 What Was Fixed

| Issue | Fix | Impact |
|-------|-----|--------|
| Type mismatch | Changed `id: number` → `id: string` | Eliminates errors |
| Hardcoded URLs | Added environment variables | Works everywhere |
| No error handling | Added retry logic & toasts | Better reliability |
| No visual feedback | Added animations | Better UX |

## 🚀 Next Steps

1. **Run locally** - Follow Quick Start above
2. **Test features** - Vote, check leaderboard, view Hall of Fame
3. **Read docs** - Check QUICK_START.md for details
4. **Deploy** - See DEPLOYMENT_GUIDE.md when ready

## 💡 Tips

- **Voting:** Click the meme you prefer, toast confirms your vote
- **Leaderboard:** Sorts by rating, updates in real-time
- **Hall of Fame:** Shows top 5 memes with medals
- **Social Links:** Share the app on social media

## 🎉 You're All Set!

Everything is ready to go. Start with:
```bash
npm run server    # Terminal 1
npm run dev       # Terminal 2
```

Then visit `http://localhost:5173/` and enjoy!

---

## 📞 Need Help?

- **Setup issues?** → Check QUICK_START.md
- **Technical questions?** → Check FIXES_APPLIED.md
- **Database issues?** → Check DATABASE_SETUP.md
- **Deployment?** → Check DEPLOYMENT_GUIDE.md

Happy voting! 🎮✨
