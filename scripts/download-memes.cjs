#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const { GORBHOUSE_MEME_IDS } = require('../server/memeIds');

const MEMES_DIR = path.join(__dirname, '../public/memes');
const BASE_URL = 'https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw';

// Create memes directory if it doesn't exist
if (!fs.existsSync(MEMES_DIR)) {
  fs.mkdirSync(MEMES_DIR, { recursive: true });
  console.log(`Created directory: ${MEMES_DIR}`);
}

let downloaded = 0;
let failed = 0;
let skipped = 0;

const downloadMeme = (memeId, index) => {
  return new Promise((resolve) => {
    const filePath = path.join(MEMES_DIR, `${memeId}.png`);
    
    // Skip if already exists
    if (fs.existsSync(filePath)) {
      skipped++;
      console.log(`[${index + 1}/${GORBHOUSE_MEME_IDS.length}] SKIPPED: ${memeId}`);
      resolve();
      return;
    }

    const imageUrl = `${BASE_URL}/${memeId}/public`;
    
    https.get(imageUrl, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filePath);
        response.pipe(fileStream);
        
        fileStream.on('finish', () => {
          fileStream.close();
          downloaded++;
          console.log(`[${index + 1}/${GORBHOUSE_MEME_IDS.length}] ✓ Downloaded: ${memeId}`);
          resolve();
        });
        
        fileStream.on('error', (err) => {
          fs.unlink(filePath, () => {}); // Delete incomplete file
          failed++;
          console.error(`[${index + 1}/${GORBHOUSE_MEME_IDS.length}] ✗ Error saving: ${memeId}`, err.message);
          resolve();
        });
      } else {
        failed++;
        console.error(`[${index + 1}/${GORBHOUSE_MEME_IDS.length}] ✗ HTTP ${response.statusCode}: ${memeId}`);
        resolve();
      }
    }).on('error', (err) => {
      failed++;
      console.error(`[${index + 1}/${GORBHOUSE_MEME_IDS.length}] ✗ Network error: ${memeId}`, err.message);
      resolve();
    });
  });
};

const downloadAll = async () => {
  console.log(`\nStarting download of ${GORBHOUSE_MEME_IDS.length} memes...`);
  console.log(`Destination: ${MEMES_DIR}\n`);
  
  // Download with concurrency limit (5 at a time)
  const batchSize = 5;
  for (let i = 0; i < GORBHOUSE_MEME_IDS.length; i += batchSize) {
    const batch = GORBHOUSE_MEME_IDS.slice(i, i + batchSize);
    await Promise.all(batch.map((id, idx) => downloadMeme(id, i + idx)));
  }
  
  console.log(`\n✓ Download complete!`);
  console.log(`  Downloaded: ${downloaded}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Total: ${downloaded + failed + skipped}/${GORBHOUSE_MEME_IDS.length}`);
};

downloadAll().catch(console.error);
