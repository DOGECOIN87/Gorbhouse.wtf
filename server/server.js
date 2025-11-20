const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Gorbhouse Meme Ranker API' });
});

// Get all memes with ratings
app.get('/api/memes', (req, res) => {
  const sql = "SELECT * FROM memes";
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    
    // Transform rows to match frontend format if needed
    // Frontend expects { id: number/string, url: string, rating: number }
    // But wait, database has 'id' as string (UUID) and 'rating'.
    // The frontend 'fetchGorbhouseMemes' generates URLs from IDs.
    // So we just need to return the stats, and frontend merges them?
    // Or we can construct URLs here. 
    // Frontend uses `services/memeService.ts` which imports static IDs.
    // Ideally backend provides everything.
    // Let's construct URLs here to be a true API.
    
    const memes = rows.map(row => ({
        id: row.id,
        url: `https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/${row.id}/public`,
        rating: row.rating,
        wins: row.wins,
        losses: row.losses
    }));

    res.json({ count: memes.length, data: memes });
  });
});

// Vote endpoint
app.post('/api/vote', (req, res) => {
    const { winnerId, loserId } = req.body;
    
    if (!winnerId || !loserId) {
        res.status(400).json({ error: "Missing winnerId or loserId" });
        return;
    }

    // Get current ratings
    const sqlGet = "SELECT * FROM memes WHERE id IN (?, ?)";
    db.all(sqlGet, [winnerId, loserId], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        
        if (rows.length !== 2) {
            res.status(404).json({ error: "One or both memes not found" });
            return;
        }

        const winner = rows.find(r => r.id === winnerId);
        const loser = rows.find(r => r.id === loserId);
        
        // Calculate Elo
        const K_FACTOR = 32;
        const calculateExpectedScore = (playerRating, opponentRating) => {
            return 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
        };

        const expectedWinnerScore = calculateExpectedScore(winner.rating, loser.rating);
        const expectedLoserScore = calculateExpectedScore(loser.rating, winner.rating);

        const newWinnerRating = Math.round(winner.rating + K_FACTOR * (1 - expectedWinnerScore));
        const newLoserRating = Math.round(loser.rating + K_FACTOR * (0 - expectedLoserScore));

        // Update Database
        const sqlUpdate = `UPDATE memes SET rating = ?, wins = wins + ?, losses = losses + ?, matches = matches + 1 WHERE id = ?`;
        
        db.serialize(() => {
            db.run("BEGIN TRANSACTION");
            
            // Update winner: rating, wins+1, losses+0
            db.run(sqlUpdate, [newWinnerRating, 1, 0, winnerId]);
            
            // Update loser: rating, wins+0, losses+1
            db.run(sqlUpdate, [newLoserRating, 0, 1, loserId]);
            
            db.run("COMMIT", (err) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json({
                    message: "Vote recorded",
                    winner: { id: winnerId, rating: newWinnerRating },
                    loser: { id: loserId, rating: newLoserRating }
                });
            });
        });
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
