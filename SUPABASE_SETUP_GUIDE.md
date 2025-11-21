# Supabase Setup Guide for Gorbhouse Meme Ranker

This guide will walk you through setting up the persistent global ELO ranking system using Supabase as the backend database.

## Overview

The meme ranker now uses **Supabase** instead of a local SQLite database and Express.js backend. This provides:

- ✅ **Global persistence** - All users see the same ratings
- ✅ **Real-time updates** - Ratings update instantly across all sessions
- ✅ **Scalability** - No backend server to maintain
- ✅ **Atomic transactions** - ELO calculations happen safely in the database
- ✅ **Audit trail** - All votes are recorded for analytics

---

## Prerequisites

1. A [Supabase](https://supabase.com) account (free tier works fine)
2. Node.js and npm installed
3. The Gorbhouse.wtf repository cloned locally

---

## Step 1: Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in the project details:
   - **Name**: `gorbhouse-meme-ranker` (or any name you prefer)
   - **Database Password**: Choose a strong password (save it somewhere safe)
   - **Region**: Choose the region closest to your users
4. Click **"Create new project"**
5. Wait for the project to be created (this takes 1-2 minutes)

---

## Step 2: Set Up the Database Schema

### Option A: Using the Supabase SQL Editor (Recommended)

1. In your Supabase project dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Open the file `supabase-setup.sql` from this repository
4. Copy the entire contents and paste it into the SQL editor
5. Click **"Run"** (or press Ctrl+Enter)
6. You should see a success message

### Option B: Using the Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run the setup script
supabase db push
```

---

## Step 3: Seed the Memes Data

1. In the SQL Editor, click **"New query"**
2. Open the file `supabase-seed-memes.sql` from this repository
3. Copy the entire contents and paste it into the SQL editor
4. Click **"Run"** (or press Ctrl+Enter)
5. You should see a message indicating 617 memes were inserted

**Note**: The seed script uses relative URLs (`/memes/{id}.png`) that point to the images in your `public/memes` directory. These will work correctly when the app is deployed.

---

## Step 4: Get Your Supabase Credentials

1. In your Supabase project dashboard, click **"Settings"** (gear icon) in the left sidebar
2. Click **"API"** in the settings menu
3. You'll see two important values:
   - **Project URL**: Something like `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: A long string starting with `eyJ...`
4. Copy both of these values

---

## Step 5: Configure Environment Variables

### For Local Development

1. Open the `.env` file in the root of the repository
2. Replace the placeholder values with your actual Supabase credentials:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### For Production Deployment

Set these environment variables in your deployment platform:

#### Vercel
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your anon key

#### Netlify
1. Go to Site settings → Build & deploy → Environment
2. Add the same variables as above

#### GitHub Pages
1. Update `.env.production` with your credentials
2. The build process will use these values

---

## Step 6: Test the Connection

Run the test script to verify everything is set up correctly:

```bash
# Install tsx if you don't have it
npm install -D tsx

# Run the test
npx tsx test-supabase-connection.ts
```

If all tests pass, you're ready to go! 🎉

---

## Step 7: Run the Application

### Local Development

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

### Deploy to GitHub Pages

```bash
# Deploy to GitHub Pages
npm run deploy
```

---

## Verification Checklist

After setup, verify that:

- [ ] The app loads without errors
- [ ] Memes are displayed correctly
- [ ] You can vote between two memes
- [ ] Ratings update after voting
- [ ] The leaderboard shows updated rankings
- [ ] Refreshing the page preserves the ratings (persistence)
- [ ] Opening the app in a different browser shows the same ratings (global)

---

## Database Schema Overview

### Tables

#### `memes`
Stores all memes with their ELO ratings and statistics.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (matches meme file names) |
| `url` | TEXT | URL or path to the meme image |
| `rating` | INTEGER | Current ELO rating (default: 1000) |
| `wins` | INTEGER | Number of times this meme won |
| `losses` | INTEGER | Number of times this meme lost |
| `matches` | INTEGER | Total number of matches |
| `created_at` | TIMESTAMP | When the meme was added |
| `updated_at` | TIMESTAMP | Last rating update |

#### `votes`
Records all votes for audit trail and analytics.

| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGSERIAL | Auto-incrementing primary key |
| `winner_id` | UUID | ID of the winning meme |
| `loser_id` | UUID | ID of the losing meme |
| `winner_rating_before` | INTEGER | Winner's rating before the vote |
| `loser_rating_before` | INTEGER | Loser's rating before the vote |
| `winner_rating_after` | INTEGER | Winner's rating after the vote |
| `loser_rating_after` | INTEGER | Loser's rating after the vote |
| `created_at` | TIMESTAMP | When the vote was cast |

### Functions

#### `vote_and_update_elo(p_winner_id UUID, p_loser_id UUID)`
PostgreSQL function that:
1. Locks both meme records to prevent race conditions
2. Calculates new ELO ratings using the standard formula
3. Updates both memes atomically
4. Records the vote in the votes table
5. Returns the updated ratings

**ELO Formula Used:**
```
Expected Score = 1 / (1 + 10^((opponent_rating - player_rating) / 400))
New Rating = Old Rating + K * (Actual Score - Expected Score)
```
Where K = 32 (standard K-factor)

---

## Troubleshooting

### Error: "Missing Supabase environment variables"

**Solution**: Make sure you've set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your `.env` file.

### Error: "relation 'memes' does not exist"

**Solution**: You need to run the `supabase-setup.sql` script in the Supabase SQL Editor.

### Error: "function vote_and_update_elo does not exist"

**Solution**: The setup script wasn't run completely. Re-run `supabase-setup.sql`.

### Memes table is empty

**Solution**: Run the `supabase-seed-memes.sql` script to populate the memes.

### Images not loading

**Solution**: Make sure the meme images are in the `public/memes/` directory and that the URLs in the database match the file names.

### Ratings not persisting

**Solution**: Check the browser console for errors. Verify that the Supabase credentials are correct and that RLS policies are enabled.

---

## Advanced Configuration

### Adjusting the K-Factor

The K-factor determines how much ratings change after each match. The default is 32.

To change it:
1. Open `supabase-setup.sql`
2. Find the line `v_k_factor INTEGER := 32;`
3. Change 32 to your desired value (e.g., 16 for slower changes, 64 for faster)
4. Re-run the setup script

### Resetting All Ratings

To reset all memes back to 1000 rating:

```sql
UPDATE memes SET rating = 1000, wins = 0, losses = 0, matches = 0;
DELETE FROM votes;
```

### Viewing Analytics

Get the top 10 memes:
```sql
SELECT id, url, rating, wins, losses, matches 
FROM memes 
ORDER BY rating DESC 
LIMIT 10;
```

Get recent voting activity:
```sql
SELECT 
  v.*,
  m1.rating as winner_current_rating,
  m2.rating as loser_current_rating
FROM votes v
JOIN memes m1 ON v.winner_id = m1.id
JOIN memes m2 ON v.loser_id = m2.id
ORDER BY v.created_at DESC
LIMIT 20;
```

---

## Migration from Old Backend

If you were previously using the Express.js backend with SQLite:

1. **Export existing ratings** (optional):
   ```bash
   sqlite3 memes.db "SELECT id, rating FROM memes;" > old_ratings.csv
   ```

2. **Import to Supabase** (optional):
   - Use the Supabase dashboard to import the CSV
   - Or write a script to update ratings via the Supabase client

3. **Remove old backend**:
   - The `server/` directory is no longer needed
   - The `memes.db` file is no longer used
   - Backend dependencies have been removed from `package.json`

---

## Security Notes

- The **anon key** is safe to use in the frontend - it's designed for public access
- Row Level Security (RLS) policies control what operations are allowed
- The current setup allows public read/write access, which is appropriate for a public voting app
- If you need to restrict access, modify the RLS policies in `supabase-setup.sql`

---

## Support

If you encounter any issues:

1. Check the browser console for error messages
2. Check the Supabase logs in the dashboard
3. Run the test script: `npx tsx test-supabase-connection.ts`
4. Review this guide for missed steps

---

## What Changed?

### Files Added
- `lib/supabase.ts` - Supabase client configuration
- `supabase-setup.sql` - Database schema and functions
- `supabase-seed-memes.sql` - Initial meme data
- `test-supabase-connection.ts` - Connection test script
- `SUPABASE_SETUP_GUIDE.md` - This guide

### Files Modified
- `services/memeService.ts` - Now uses Supabase instead of fetch API
- `components/MainSite.tsx` - Updated to use new memeService
- `package.json` - Removed backend dependencies, added Supabase
- `.env`, `.env.example`, `.env.production` - Updated for Supabase

### Files No Longer Used
- `server/` directory - Backend is no longer needed
- `memes.db` - SQLite database replaced by Supabase
- `services/eloService.ts` - ELO logic moved to database function

---

## Next Steps

- ✅ Set up Supabase project
- ✅ Run database scripts
- ✅ Configure environment variables
- ✅ Test the connection
- ✅ Deploy to production
- 🎮 Start ranking memes!

Enjoy your fully persistent, globally synchronized meme ranking system! 🚀
