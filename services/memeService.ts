import { Meme } from '../types';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/memes`;

// Fetch memes from backend
export async function fetchGorbhouseMemes(): Promise<Meme[]> {
  console.log('Fetching memes from backend...');
  try {
      const response = await fetch(API_URL);
      if (!response.ok) {
          throw new Error(`Failed to fetch memes: ${response.statusText}`);
      }
      const json = await response.json();
      return json.data;
  } catch (error) {
      console.error("Error fetching memes:", error);
      return [];
  }
}
