const sqlite3 = require('sqlite3').verbose();
const { GORBHOUSE_MEME_IDS } = require('./memeIds');

const INITIAL_RATING = 1200;
const DB_SOURCE = "memes.db";

const db = new sqlite3.Database(DB_SOURCE, (err) => {
    if (err) {
      console.error(err.message);
      throw err;
    } else {
      console.log('Connected to the SQLite database.');
      db.run(`CREATE TABLE IF NOT EXISTS memes (
            id TEXT PRIMARY KEY,
            rating INTEGER,
            wins INTEGER DEFAULT 0,
            losses INTEGER DEFAULT 0,
            matches INTEGER DEFAULT 0
            )`,
      (err) => {
        if (err) {
            // Table already created
        } else {
            // Table just created, creating some rows
            console.log('Seeding database with memes...');
            const insert = 'INSERT OR IGNORE INTO memes (id, rating) VALUES (?,?)';
            db.serialize(() => {
                db.run("BEGIN TRANSACTION");
                GORBHOUSE_MEME_IDS.forEach((id) => {
                    db.run(insert, [id, INITIAL_RATING]);
                });
                db.run("COMMIT");
            });
            console.log('Seeding complete.');
        }
      });  
    }
});

module.exports = db;
