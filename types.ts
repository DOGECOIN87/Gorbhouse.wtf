export interface Gorb {
  id: number;
  src: string;
  size: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
}

export interface AudiusUser {
  id: string;
  name: string;
  handle: string;
  profile_picture?: {
    '150x150'?: string;
    '480x480'?: string;
    '1000x1000'?: string;
  };
  spl_wallet?: string;
}

export interface AudiusTrack {
  id: string;
  title: string;
  duration: number;
  user: AudiusUser;
  is_streamable?: boolean;
  artwork?: {
    '150x150'?: string;
    '480x480'?: string;
    '1000x1000'?: string;
  };
}

export interface Meme {
  id: number;
  url: string;
  rating: number;
}
