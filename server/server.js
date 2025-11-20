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
    
    // Get the protocol and host from the request
    const protocol = req.protocol;
    const host = req.get('host');
    const baseUrl = `${protocol}://${host}`;
    
    const memes = rows.map(row => ({
        id: row.id,
        url: `${baseUrl}/api/meme-image/${row.id}`,
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

// Serve meme images from local storage
const path = require('path');
app.get('/api/meme-image/:memeId', (req, res) => {
    const { memeId } = req.params;
    const imagePath = path.join(__dirname, '../public/memes', `${memeId}.png`);
    
    // Security: prevent directory traversal
    if (!imagePath.startsWith(path.join(__dirname, '../public/memes'))) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    
    res.set('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    res.sendFile(imagePath, (err) => {
        if (err) {
            console.error(`Image not found: ${memeId}`, err.message);
            res.status(404).json({ error: 'Image not found' });
        }
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
