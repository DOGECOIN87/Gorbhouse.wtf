/**
 * Meme Service - Supabase Integration
 * 
 * This service handles all meme-related operations using Supabase as the backend.
 * It replaces the previous Express.js API with direct database queries.
 */

import { supabase } from '../lib/supabase';
import { Meme } from '../types';

/**
 * Fetch all memes from Supabase
 * @returns Promise<Meme[]> Array of all memes with their current ratings
 */
export async function fetchGorbhouseMemes(): Promise<Meme[]> {
  console.log('Fetching memes from Supabase...');
  
  try {
    const { data, error } = await supabase
      .from('memes')
      .select('*')
      .order('rating', { ascending: false });

    if (error) {
      console.error('Error fetching memes from Supabase:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn('No memes found in database');
      return [];
    }

    console.log(`Successfully fetched ${data.length} memes from Supabase`);
    
    // Map database records to Meme type
    return data.map(row => ({
      id: row.id,
      url: row.url,
      rating: row.rating,
      wins: row.wins || 0,
      losses: row.losses || 0,
      matches: row.matches || 0,
    }));
  } catch (error) {
    console.error('Error in fetchGorbhouseMemes:', error);
    return [];
  }
}

/**
 * Submit a vote and update ELO ratings atomically
 * @param winnerId UUID of the winning meme
 * @param loserId UUID of the losing meme
 * @returns Promise with updated ratings
 */
export async function submitVote(winnerId: string, loserId: string): Promise<{
  winner: { id: string; rating: number; rating_change: number };
  loser: { id: string; rating: number; rating_change: number };
}> {
  console.log(`Submitting vote: winner=${winnerId}, loser=${loserId}`);

  try {
    // Call the PostgreSQL function that handles ELO calculation and updates atomically
    const { data, error } = await supabase.rpc('vote_and_update_elo', {
      p_winner_id: winnerId,
      p_loser_id: loserId,
    });

    if (error) {
      console.error('Error submitting vote to Supabase:', error);
      throw error;
    }

    console.log('Vote submitted successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in submitVote:', error);
    throw error;
  }
}

/**
 * Get top N memes by rating
 * @param limit Number of top memes to retrieve
 * @returns Promise<Meme[]> Array of top memes
 */
export async function getTopMemes(limit: number = 10): Promise<Meme[]> {
  try {
    const { data, error } = await supabase
      .from('memes')
      .select('*')
      .order('rating', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching top memes:', error);
      throw error;
    }

    return data.map(row => ({
      id: row.id,
      url: row.url,
      rating: row.rating,
      wins: row.wins || 0,
      losses: row.losses || 0,
      matches: row.matches || 0,
    }));
  } catch (error) {
    console.error('Error in getTopMemes:', error);
    return [];
  }
}

/**
 * Get recent votes for analytics
 * @param limit Number of recent votes to retrieve
 * @returns Promise with vote history
 */
export async function getRecentVotes(limit: number = 20) {
  try {
    const { data, error } = await supabase
      .from('votes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent votes:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in getRecentVotes:', error);
    return [];
  }
}
