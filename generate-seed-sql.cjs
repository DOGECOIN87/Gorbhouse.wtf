const { GORBHOUSE_MEME_IDS } = require('./server/memeIds');
const fs = require('fs');

// Generate SQL INSERT statements for all memes
const generateSeedSQL = () => {
  const lines = [];
  
  lines.push('-- =====================================================');
  lines.push('-- SEED DATA FOR MEMES TABLE');
  lines.push('-- =====================================================');
  lines.push('-- This script inserts all Gorbhouse memes into the memes table');
  lines.push('-- Note: The URLs point to the local /public/memes directory');
  lines.push('-- You may need to update these URLs to point to your CDN or hosting');
  lines.push('-- =====================================================\n');
  
  lines.push('-- Insert all memes with initial rating of 1000');
  lines.push('INSERT INTO memes (id, url, rating) VALUES');
  
  const values = GORBHOUSE_MEME_IDS.map((id, index) => {
    const isLast = index === GORBHOUSE_MEME_IDS.length - 1;
    // Use relative path that will work with Vite's public directory
    const url = `/memes/${id}.png`;
    return `  ('${id}', '${url}', 1000)${isLast ? ';' : ','}`;
  });
  
  lines.push(...values);
  
  lines.push('\n-- =====================================================');
  lines.push(`-- Total memes inserted: ${GORBHOUSE_MEME_IDS.length}`);
  lines.push('-- =====================================================');
  
  return lines.join('\n');
};

// Write to file
const sql = generateSeedSQL();
fs.writeFileSync('supabase-seed-memes.sql', sql);
console.log(`Generated seed SQL with ${GORBHOUSE_MEME_IDS.length} memes`);
console.log('File: supabase-seed-memes.sql');
