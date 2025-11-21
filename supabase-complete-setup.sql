-- =====================================================
-- GORBHOUSE MEME RANKER - COMPLETE SETUP SCRIPT
-- =====================================================
-- This script combines schema creation and data seeding
-- Copy and paste this entire file into Supabase SQL Editor
-- =====================================================

-- PART 1: DROP EXISTING TABLES (if any)
-- =====================================================
DROP TABLE IF EXISTS votes CASCADE;
DROP TABLE IF EXISTS memes CASCADE;
DROP FUNCTION IF EXISTS vote_and_update_elo(UUID, UUID);

-- =====================================================
-- PART 2: CREATE TABLES
-- =====================================================

-- Create memes table
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

-- Create index for faster rating-based queries
CREATE INDEX idx_memes_rating ON memes(rating DESC);

-- Create votes table
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
-- PART 3: CREATE ELO FUNCTION
-- =====================================================

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
    
    -- Calculate expected scores
    v_expected_winner := 1.0 / (1.0 + POWER(10, (v_loser_rating - v_winner_rating)::NUMERIC / 400.0));
    v_expected_loser := 1.0 / (1.0 + POWER(10, (v_winner_rating - v_loser_rating)::NUMERIC / 400.0));
    
    -- Calculate new ratings
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
    
    -- Record the vote
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
-- PART 4: ENABLE RLS AND CREATE POLICIES
-- =====================================================

ALTER TABLE memes ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Allow public read access to memes
CREATE POLICY "Allow public read access to memes"
    ON memes
    FOR SELECT
    USING (true);

-- Allow public insert of new memes
CREATE POLICY "Allow public insert of memes"
    ON memes
    FOR INSERT
    WITH CHECK (true);

-- Allow public update of memes
CREATE POLICY "Allow public update of memes"
    ON memes
    FOR UPDATE
    USING (true);

-- Allow public read access to votes
CREATE POLICY "Allow public read access to votes"
    ON votes
    FOR SELECT
    USING (true);

-- Allow public insert of votes
CREATE POLICY "Allow public insert of votes"
    ON votes
    FOR INSERT
    WITH CHECK (true);

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
-- If you see this message, Part 1-4 completed successfully!
-- Now scroll down to run Part 5 (seed data)
-- =====================================================
