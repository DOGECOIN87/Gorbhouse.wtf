# Database Setup & Configuration

## Overview

The Gorbhouse Meme Ranker uses SQLite for persistent storage of meme ratings and voting statistics.

## Database Location

- **Development:** `memes.db` (created in project root when server starts)
- **Production:** Configure via environment variables or deployment platform

## Database Schema

```sql
CREATE TABLE memes (
  id TEXT PRIMARY KEY,           -- UUID from memedepot.com
  rating INTEGER,                -- ELO rating (starts at 1200)
  wins INTEGER DEFAULT 0,        -- Total wins
  losses INTEGER DEFAULT 0,      -- Total losses
  matches INTEGER DEFAULT 0      -- Total matches played
)
```

## Initial Setup

1. The database is automatically created on first server start
2. All 617 Gorbhouse memes are seeded with an initial rating of 1200
3. No manual setup required

## Backup & Migration

### Backup Database
```bash
# Create a backup
cp memes.db memes.db.backup

# Restore from backup
cp memes.db.backup memes.db
```

### Export Ratings
```bash
# Export current ratings to CSV
sqlite3 memes.db "SELECT id, rating, wins, losses, matches FROM memes ORDER BY rating DESC;" > ratings_export.csv
```

### Reset Ratings
```bash
# Reset all ratings to initial value (1200)
sqlite3 memes.db "UPDATE memes SET rating = 1200, wins = 0, losses = 0, matches = 0;"
```

## Environment Variables

### Development
```env
VITE_API_URL=http://localhost:3000
```

### Production
```env
VITE_API_URL=https://your-domain.com
```

## Deployment Considerations

1. **Database Persistence:** Ensure `memes.db` is persisted across deployments
2. **File Permissions:** Database file needs read/write permissions for the server process
3. **Backup Strategy:** Implement regular backups before deployments
4. **Database Size:** Current dataset (~617 memes) is minimal; no performance concerns

## Troubleshooting

### Database Locked Error
- Ensure only one server instance is running
- Check for stale processes: `lsof | grep memes.db`

### Corrupted Database
- Stop the server
- Restore from backup: `cp memes.db.backup memes.db`
- Restart server

### Missing Memes
- Check `server/memeIds.js` contains all 617 IDs
- Verify database seeding completed: `sqlite3 memes.db "SELECT COUNT(*) FROM memes;"`
