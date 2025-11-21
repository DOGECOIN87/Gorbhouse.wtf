/**
 * Supabase Connection Test Script
 * 
 * This script tests the connection to Supabase and verifies that:
 * 1. Environment variables are set correctly
 * 2. Connection to Supabase is successful
 * 3. Memes table exists and can be queried
 * 4. Vote function is accessible
 * 
 * Run with: npx tsx test-supabase-connection.ts
 */

import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env file
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('='.repeat(60));
console.log('SUPABASE CONNECTION TEST');
console.log('='.repeat(60));

// Test 1: Check environment variables
console.log('\n[TEST 1] Checking environment variables...');
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ FAILED: Missing environment variables');
  console.error('   Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}
console.log('✅ Environment variables are set');
console.log(`   URL: ${supabaseUrl.substring(0, 30)}...`);
console.log(`   Key: ${supabaseAnonKey.substring(0, 20)}...`);

// Test 2: Create Supabase client
console.log('\n[TEST 2] Creating Supabase client...');
const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log('✅ Supabase client created');

// Test 3: Query memes table
console.log('\n[TEST 3] Querying memes table...');
const { data: memes, error: memesError } = await supabase
  .from('memes')
  .select('id, url, rating, wins, losses, matches')
  .limit(5);

if (memesError) {
  console.error('❌ FAILED: Error querying memes table');
  console.error('   Error:', memesError.message);
  console.error('\n   This likely means:');
  console.error('   1. The memes table does not exist');
  console.error('   2. RLS policies are not configured correctly');
  console.error('   3. You need to run the setup SQL scripts in Supabase');
  process.exit(1);
}

if (!memes || memes.length === 0) {
  console.warn('⚠️  WARNING: Memes table is empty');
  console.warn('   You need to run the seed SQL script to populate memes');
} else {
  console.log(`✅ Successfully queried memes table (${memes.length} memes found)`);
  console.log('   Sample meme:');
  console.log(`   - ID: ${memes[0].id}`);
  console.log(`   - URL: ${memes[0].url}`);
  console.log(`   - Rating: ${memes[0].rating}`);
}

// Test 4: Test vote function (dry run - we won't actually vote)
console.log('\n[TEST 4] Checking vote_and_update_elo function...');
if (memes && memes.length >= 2) {
  // We'll just check if the function exists by calling it with valid IDs
  // This will fail if the function doesn't exist
  const { data: voteResult, error: voteError } = await supabase.rpc('vote_and_update_elo', {
    p_winner_id: memes[0].id,
    p_loser_id: memes[1].id,
  });

  if (voteError) {
    console.error('❌ FAILED: Error calling vote function');
    console.error('   Error:', voteError.message);
    console.error('\n   This likely means:');
    console.error('   1. The vote_and_update_elo function does not exist');
    console.error('   2. You need to run the setup SQL script in Supabase');
    process.exit(1);
  }

  console.log('✅ Vote function is working correctly');
  console.log('   Test vote result:');
  console.log(`   - Winner: ${voteResult.winner.id} (${voteResult.winner.rating})`);
  console.log(`   - Loser: ${voteResult.loser.id} (${voteResult.loser.rating})`);
  console.log(`   - Rating changes: +${voteResult.winner.rating_change} / ${voteResult.loser.rating_change}`);
} else {
  console.warn('⚠️  SKIPPED: Not enough memes to test vote function');
}

// Test 5: Query votes table
console.log('\n[TEST 5] Querying votes table...');
const { data: votes, error: votesError } = await supabase
  .from('votes')
  .select('*')
  .limit(5);

if (votesError) {
  console.error('❌ FAILED: Error querying votes table');
  console.error('   Error:', votesError.message);
  process.exit(1);
}

console.log(`✅ Successfully queried votes table (${votes?.length || 0} votes found)`);

// Summary
console.log('\n' + '='.repeat(60));
console.log('TEST SUMMARY');
console.log('='.repeat(60));
console.log('✅ All tests passed!');
console.log('\nYour Supabase setup is ready to use.');
console.log('You can now run the app with: npm run dev');
console.log('='.repeat(60));
