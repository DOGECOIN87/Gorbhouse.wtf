import { GORBHOUSE_MEME_IDS } from '../src/data/memeIds';

// Fetch memes - uses pre-fetched IDs to avoid CORS issues
export async function fetchGorbhouseMemes(): Promise<string[]> {
  console.log(`Loading ${GORBHOUSE_MEME_IDS.length} Gorbhouse memes...`);
  
  // Convert meme IDs to Cloudflare CDN URLs
  const memeUrls = GORBHOUSE_MEME_IDS.map(
    id => `https://memedepot.com/cdn-cgi/imagedelivery/naCPMwxXX46-hrE49eZovw/${id}/public`
  );
  
  return memeUrls;
}
