# Gorbhouse Meme Ranker - Supabase Edition

## 🚀 Quick Start

### 1. Create Supabase Project
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Create a new project
3. Wait for it to initialize

### 2. Run Database Scripts
In Supabase SQL Editor, run these files in order:
1. `supabase-setup.sql` - Creates tables and functions
2. `supabase-seed-memes.sql` - Adds 617 memes

### 3. Get Credentials
From Settings → API, copy:
- Project URL
- anon public key

### 4. Configure Environment
Edit `.env`:
```bash
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Run
```bash
npm install
npm run dev
```

---

## 📚 Documentation

- **SUPABASE_SETUP_GUIDE.md** - Detailed setup instructions
- **SUPABASE_MIGRATION_SUMMARY.md** - What changed and why
- **test-supabase-connection.ts** - Test your setup

---

## ✅ What You Get

- ✅ **Global Rankings** - All users see the same ratings
- ✅ **Persistent** - Ratings saved forever
- ✅ **Real-time** - Updates instantly
- ✅ **No Backend** - Just static frontend
- ✅ **Scalable** - Handles any traffic
- ✅ **Free Tier** - Supabase free plan is enough

---

## 🔧 Key Files

```
lib/supabase.ts              # Supabase client
services/memeService.ts      # Database operations
supabase-setup.sql          # Schema + functions
supabase-seed-memes.sql     # Initial data
```

---

## 🧪 Test Your Setup

```bash
npx tsx test-supabase-connection.ts
```

---

## 🚢 Deploy

### Vercel / Netlify
1. Set environment variables in dashboard
2. Deploy normally

### GitHub Pages
1. Update `.env.production`
2. Run `npm run deploy`

---

## 💡 Need Help?

See **SUPABASE_SETUP_GUIDE.md** for:
- Detailed setup steps
- Troubleshooting
- Advanced configuration
- Analytics queries

---

## 🎮 How It Works

1. User votes for a meme
2. Frontend calls Supabase RPC function
3. PostgreSQL calculates new ELO ratings atomically
4. Both memes updated in database
5. Vote recorded for audit trail
6. Frontend updates with new ratings

**ELO Formula**: Standard chess rating system (K=32)

---

## 📊 Database Schema

### `memes` table
- `id` (UUID) - Meme identifier
- `url` (TEXT) - Image path
- `rating` (INT) - Current ELO rating
- `wins`, `losses`, `matches` (INT) - Statistics

### `votes` table
- Records all votes with before/after ratings
- Useful for analytics

### `vote_and_update_elo()` function
- Atomic ELO calculation
- Row-level locking
- Returns updated ratings

---

Made with ❤️ for the Gorbhouse community
