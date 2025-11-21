# Supabase Migration Summary

## What Was Done

The Gorbhouse Meme Ranker has been migrated from a local SQLite database with Express.js backend to a **fully persistent global ELO ranking system** using Supabase.

---

## Key Changes

### ✅ Backend Replaced
- **Before**: Express.js server + SQLite database
- **After**: Supabase (PostgreSQL) with serverless functions

### ✅ Global Persistence
- **Before**: Local ratings that reset between sessions
- **After**: Global ratings shared across all users and sessions

### ✅ Atomic ELO Updates
- **Before**: ELO calculations in Node.js
- **After**: PostgreSQL function with row-level locking

### ✅ No Server Required
- **Before**: Required running `npm run dev:backend`
- **After**: Static frontend only, no backend needed

---

## Quick Start

### 1. Set Up Supabase

```bash
# 1. Create a Supabase project at https://app.supabase.com
# 2. Run supabase-setup.sql in the SQL Editor
# 3. Run supabase-seed-memes.sql in the SQL Editor
# 4. Get your project URL and anon key from Settings → API
```

### 2. Configure Environment

```bash
# Edit .env file
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Test & Run

```bash
# Test connection
npx tsx test-supabase-connection.ts

# Install dependencies
npm install

# Run development server
npm run dev
```

---

## File Changes

### 📁 New Files
```
lib/supabase.ts                    # Supabase client configuration
supabase-setup.sql                 # Database schema + RLS policies
supabase-seed-memes.sql            # Seed data for 617 memes
test-supabase-connection.ts        # Connection test script
SUPABASE_SETUP_GUIDE.md           # Comprehensive setup guide
SUPABASE_MIGRATION_SUMMARY.md     # This file
generate-seed-sql.cjs              # Script to generate seed data
```

### 📝 Modified Files
```
services/memeService.ts            # Now uses Supabase client
components/MainSite.tsx            # Updated to use new memeService
package.json                       # Removed backend deps, added Supabase
.env                               # Updated for Supabase credentials
.env.example                       # Updated template
.env.production                    # Updated for production
```

### 🗑️ Deprecated Files (No Longer Used)
```
server/                            # Express.js backend
memes.db                          # SQLite database
services/eloService.ts            # ELO logic (now in SQL function)
```

---

## Architecture

### Before (Old System)
```
┌─────────────┐      HTTP       ┌─────────────┐      SQLite      ┌─────────────┐
│   React     │ ────────────▶   │  Express.js │ ───────────────▶ │  memes.db   │
│  Frontend   │                  │   Backend   │                  │  (Local)    │
└─────────────┘                  └─────────────┘                  └─────────────┘
```

### After (New System)
```
┌─────────────┐    Supabase     ┌─────────────────────────────────────────┐
│   React     │    Client       │           Supabase Cloud                │
│  Frontend   │ ───────────────▶│  ┌──────────┐    ┌──────────────────┐  │
│  (Static)   │                 │  │ Postgres │◀──▶│ RPC Functions    │  │
└─────────────┘                 │  │ Database │    │ (ELO Calculation)│  │
                                │  └──────────┘    └──────────────────┘  │
                                └─────────────────────────────────────────┘
```

---

## Database Schema

### Tables

#### `memes`
- Stores all meme data with ELO ratings
- 617 memes seeded from existing data
- Indexed on `rating` for fast leaderboard queries

#### `votes`
- Audit trail of all votes
- Records before/after ratings
- Useful for analytics and debugging

### Functions

#### `vote_and_update_elo(winner_id, loser_id)`
- Atomic ELO calculation and update
- Uses row-level locking to prevent race conditions
- K-factor = 32 (standard ELO)
- Returns updated ratings as JSON

---

## ELO Formula

The system uses the standard ELO rating formula:

```javascript
// Expected score for player A
expectedA = 1 / (1 + 10^((ratingB - ratingA) / 400))

// New rating for player A (winner gets score = 1, loser gets score = 0)
newRatingA = ratingA + K * (actualScore - expectedA)
```

Where:
- **K = 32** (K-factor, determines rating volatility)
- **Initial rating = 1000** (all memes start here)

---

## Testing

### Manual Testing Checklist

- [ ] App loads without errors
- [ ] Memes display correctly
- [ ] Voting updates ratings
- [ ] Leaderboard reflects changes
- [ ] Ratings persist after page refresh
- [ ] Multiple browsers see same ratings (global state)

### Automated Test

```bash
npx tsx test-supabase-connection.ts
```

This will verify:
1. Environment variables are set
2. Connection to Supabase works
3. Memes table exists and has data
4. Vote function works correctly
5. Votes table is accessible

---

## Deployment

### Environment Variables Required

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Platforms

#### Vercel
```bash
npm run build
# Set env vars in Vercel dashboard
vercel deploy
```

#### Netlify
```bash
npm run build
# Set env vars in Netlify dashboard
netlify deploy --prod
```

#### GitHub Pages
```bash
# Update .env.production with your credentials
npm run deploy
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Missing Supabase environment variables" | Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env` |
| "relation 'memes' does not exist" | Run `supabase-setup.sql` in Supabase SQL Editor |
| "function vote_and_update_elo does not exist" | Re-run `supabase-setup.sql` completely |
| Memes table is empty | Run `supabase-seed-memes.sql` |
| Images not loading | Check that files exist in `public/memes/` |
| Ratings not persisting | Check browser console for errors, verify credentials |

---

## Security

- ✅ **Anon key is safe** - Designed for frontend use
- ✅ **RLS policies** - Control database access
- ✅ **Public access** - Appropriate for public voting app
- ✅ **No sensitive data** - Only meme ratings stored

---

## Performance

- ⚡ **Fast queries** - Indexed on rating for leaderboard
- ⚡ **Atomic updates** - No race conditions
- ⚡ **Global CDN** - Supabase serves from edge locations
- ⚡ **No backend** - Static frontend deployment

---

## Analytics Queries

### Top 10 Memes
```sql
SELECT id, url, rating, wins, losses, matches 
FROM memes 
ORDER BY rating DESC 
LIMIT 10;
```

### Recent Votes
```sql
SELECT * FROM votes 
ORDER BY created_at DESC 
LIMIT 20;
```

### Most Controversial (Close to 50% win rate)
```sql
SELECT 
  id, 
  url, 
  rating, 
  wins, 
  losses,
  ROUND(wins::numeric / NULLIF(matches, 0) * 100, 2) as win_rate
FROM memes
WHERE matches > 10
ORDER BY ABS(50 - (wins::numeric / NULLIF(matches, 0) * 100))
LIMIT 10;
```

---

## Next Steps

1. ✅ Follow `SUPABASE_SETUP_GUIDE.md` for detailed setup
2. ✅ Run test script to verify connection
3. ✅ Deploy to your preferred platform
4. 🎮 Start ranking memes globally!

---

## Support

For detailed setup instructions, see **SUPABASE_SETUP_GUIDE.md**

For issues:
1. Check browser console
2. Check Supabase logs
3. Run test script
4. Review the setup guide

---

**Migration completed successfully!** 🎉

Your meme ranker now has:
- ✅ Global persistent rankings
- ✅ Real-time updates
- ✅ No backend to maintain
- ✅ Scalable architecture
- ✅ Full audit trail
