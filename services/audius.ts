
import { AudiusUser, AudiusTrack } from '../types';
import { APP_NAME } from '../constants';

let cachedHost: string | null = null;

async function getAudiusHost(): Promise<string> {
  if (cachedHost) return cachedHost;

  try {
    const response = await fetch('https://api.audius.co');
    if (!response.ok) throw new Error('Failed to fetch Audius hosts');
    const json = await response.json();
    const hosts = json.data as string[];
    if (!Array.isArray(hosts) || hosts.length === 0) {
      throw new Error('No Audius hosts returned');
    }
    const host = hosts[Math.floor(Math.random() * hosts.length)];
    cachedHost = host;
    return host;
  } catch (error) {
    console.error("Error getting Audius host:", error);
    // Fallback host
    return 'https://discoveryprovider.audius.co';
  }
}

async function getUserByHandle(host: string, handle: string): Promise<AudiusUser> {
  const url = `${host}/v1/users/handle/${encodeURIComponent(handle)}?app_name=${APP_NAME}`;
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) {
    if (response.status === 404) throw new Error(`Artist handle "${handle}" not found.`);
    throw new Error(`Failed to get user by handle: ${response.statusText}`);
  }
  const json = await response.json();
  return json.data;
}

async function getTracksByUser(host: string, userId: string, limit: number = 20): Promise<AudiusTrack[]> {
  const url = new URL(`/v1/users/${encodeURIComponent(userId)}/tracks`, host);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('app_name', APP_NAME);
  const response = await fetch(url.toString(), { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Failed to get tracks by user: ${response.statusText}`);
  const json = await response.json();
  return json.data;
}

export async function getArtistTracks(handle: string): Promise<{ host: string; user: AudiusUser; tracks: AudiusTrack[] }> {
  const host = await getAudiusHost();
  const user = await getUserByHandle(host, handle);
  const tracks = await getTracksByUser(host, user.id);
  const playableTracks = tracks.filter(t => t.is_streamable !== false);

  if (playableTracks.length === 0) {
    throw new Error('No streamable tracks found for this artist.');
  }

  return { host, user, tracks: playableTracks };
}
