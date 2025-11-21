-- =====================================================
-- GORBHOUSE MEME RANKER - SUPABASE DATABASE SETUP
-- =====================================================
-- This script creates the database schema for persistent
-- global ELO ranking of memes using Supabase.
-- =====================================================

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS votes CASCADE;
DROP TABLE IF EXISTS memes CASCADE;
DROP FUNCTION IF EXISTS vote_and_update_elo(UUID, UUID);

-- =====================================================
-- TABLE: memes
-- =====================================================
-- Stores all memes with their ELO ratings and statistics
CREATE TABLE memes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 1000,
    wins INTEGER NOT NULL DEFAULT 0,
    losses INTEGER NOT NULL DEFAULT 0,
    matches INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster rating-based queries (leaderboard)
CREATE INDEX idx_memes_rating ON memes(rating DESC);

-- =====================================================
-- TABLE: votes
-- =====================================================
-- Records all votes for audit trail and analytics
CREATE TABLE votes (
    id BIGSERIAL PRIMARY KEY,
    winner_id UUID NOT NULL REFERENCES memes(id) ON DELETE CASCADE,
    loser_id UUID NOT NULL REFERENCES memes(id) ON DELETE CASCADE,
    winner_rating_before INTEGER NOT NULL,
    loser_rating_before INTEGER NOT NULL,
    winner_rating_after INTEGER NOT NULL,
    loser_rating_after INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for vote queries
CREATE INDEX idx_votes_winner ON votes(winner_id);
CREATE INDEX idx_votes_loser ON votes(loser_id);
CREATE INDEX idx_votes_created_at ON votes(created_at DESC);

-- =====================================================
-- FUNCTION: vote_and_update_elo
-- =====================================================
-- Atomically updates ELO ratings for both memes and records the vote
-- Uses K-factor of 32 for standard ELO calculation
CREATE OR REPLACE FUNCTION vote_and_update_elo(
    p_winner_id UUID,
    p_loser_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    v_winner_rating INTEGER;
    v_loser_rating INTEGER;
    v_expected_winner NUMERIC;
    v_expected_loser NUMERIC;
    v_new_winner_rating INTEGER;
    v_new_loser_rating INTEGER;
    v_k_factor INTEGER := 32;
    v_result JSON;
BEGIN
    -- Lock rows to prevent race conditions
    SELECT rating INTO v_winner_rating
    FROM memes
    WHERE id = p_winner_id
    FOR UPDATE;
    
    SELECT rating INTO v_loser_rating
    FROM memes
    WHERE id = p_loser_id
    FOR UPDATE;
    
    -- Check if both memes exist
    IF v_winner_rating IS NULL OR v_loser_rating IS NULL THEN
        RAISE EXCEPTION 'One or both memes not found';
    END IF;
    
    -- Calculate expected scores using ELO formula
    -- Expected score = 1 / (1 + 10^((opponent_rating - player_rating) / 400))
    v_expected_winner := 1.0 / (1.0 + POWER(10, (v_loser_rating - v_winner_rating)::NUMERIC / 400.0));
    v_expected_loser := 1.0 / (1.0 + POWER(10, (v_winner_rating - v_loser_rating)::NUMERIC / 400.0));
    
    -- Calculate new ratings
    -- New rating = old rating + K * (actual_score - expected_score)
    -- Winner gets actual_score = 1, Loser gets actual_score = 0
    v_new_winner_rating := ROUND(v_winner_rating + v_k_factor * (1.0 - v_expected_winner));
    v_new_loser_rating := ROUND(v_loser_rating + v_k_factor * (0.0 - v_expected_loser));
    
    -- Update winner meme
    UPDATE memes
    SET 
        rating = v_new_winner_rating,
        wins = wins + 1,
        matches = matches + 1,
        updated_at = NOW()
    WHERE id = p_winner_id;
    
    -- Update loser meme
    UPDATE memes
    SET 
        rating = v_new_loser_rating,
        losses = losses + 1,
        matches = matches + 1,
        updated_at = NOW()
    WHERE id = p_loser_id;
    
    -- Record the vote in votes table
    INSERT INTO votes (
        winner_id,
        loser_id,
        winner_rating_before,
        loser_rating_before,
        winner_rating_after,
        loser_rating_after
    ) VALUES (
        p_winner_id,
        p_loser_id,
        v_winner_rating,
        v_loser_rating,
        v_new_winner_rating,
        v_new_loser_rating
    );
    
    -- Return the updated ratings as JSON
    v_result := json_build_object(
        'winner', json_build_object(
            'id', p_winner_id,
            'rating', v_new_winner_rating,
            'rating_change', v_new_winner_rating - v_winner_rating
        ),
        'loser', json_build_object(
            'id', p_loser_id,
            'rating', v_new_loser_rating,
            'rating_change', v_new_loser_rating - v_loser_rating
        )
    );
    
    RETURN v_result;
END;
$$;

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on both tables
ALTER TABLE memes ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to memes
CREATE POLICY "Allow public read access to memes"
    ON memes
    FOR SELECT
    USING (true);

-- Policy: Allow public insert of new memes (for future expansion)
CREATE POLICY "Allow public insert of memes"
    ON memes
    FOR INSERT
    WITH CHECK (true);

-- Policy: Allow public update of memes (needed for voting)
CREATE POLICY "Allow public update of memes"
    ON memes
    FOR UPDATE
    USING (true);

-- Policy: Allow public read access to votes (for analytics)
CREATE POLICY "Allow public read access to votes"
    ON votes
    FOR SELECT
    USING (true);

-- Policy: Allow public insert of votes (needed for voting)
CREATE POLICY "Allow public insert of votes"
    ON votes
    FOR INSERT
    WITH CHECK (true);

-- =====================================================
-- INITIAL DATA SEEDING
-- =====================================================
-- Note: Meme URLs will need to be populated separately
-- This can be done via a separate script or API call
-- The meme images are stored in /public/memes/{id}.png

-- Example of how to seed (to be customized with actual data):
-- INSERT INTO memes (id, url, rating) VALUES
--   ('bc6bf203-67de-4284-90a9-9592b2901a00', 'https://your-cdn.com/memes/bc6bf203-67de-4284-90a9-9592b2901a00.png', 1000),
--   ('72c84d2b-2fe8-4db7-640c-5d1c8c201800', 'https://your-cdn.com/memes/72c84d2b-2fe8-4db7-640c-5d1c8c201800.png', 1000);

-- =====================================================
-- HELPFUL QUERIES FOR MANAGEMENT
-- =====================================================

-- Get top 10 memes by rating
-- SELECT id, url, rating, wins, losses, matches FROM memes ORDER BY rating DESC LIMIT 10;

-- Get recent votes
-- SELECT v.*, m1.rating as winner_rating, m2.rating as loser_rating 
-- FROM votes v 
-- JOIN memes m1 ON v.winner_id = m1.id 
-- JOIN memes m2 ON v.loser_id = m2.id 
-- ORDER BY v.created_at DESC LIMIT 20;

-- Reset all ratings (use with caution!)
-- UPDATE memes SET rating = 1000, wins = 0, losses = 0, matches = 0;

-- =====================================================
-- END OF SETUP SCRIPT
-- =====================================================
