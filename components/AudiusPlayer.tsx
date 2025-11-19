
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { AudiusTrack, AudiusUser } from '../types';
import { getArtistTracks } from '../services/audius';
import { sendTip, isValidSolanaAddress } from '../services/solanaService';
import { APP_NAME } from '../constants';
import Spinner from './Spinner';

interface Props {
  artistHandle: string;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const getTrackArtwork = (track: AudiusTrack): string => {
  return track.artwork?.['480x480'] || track.artwork?.['150x150'] || `https://picsum.photos/seed/${track.id}/480`;
};

const AudiusPlayer: React.FC<Props> = ({ artistHandle, audioRef }) => {
  const wallet = useWallet();
  const { setVisible: setWalletModalVisible } = useWalletModal();
  
  const [host, setHost] = useState<string | null>(null);
  const [user, setUser] = useState<AudiusUser | null>(null);
  const [tracks, setTracks] = useState<AudiusTrack[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Solana Wallet State
  const [tipping, setTipping] = useState(false);
  const [tipAmount, setTipAmount] = useState('0.1');
  const [txSig, setTxSig] = useState<string | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      setLoading(true);
      setError(null);
      try {
        const { host, user, tracks } = await getArtistTracks(artistHandle);
        const randomIndex = Math.floor(Math.random() * tracks.length);
        setHost(host);
        setUser(user);
        setTracks(tracks);
        setCurrentIndex(randomIndex);
      } catch (e: any) {
        setError(e.message || 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [artistHandle]);

  const currentTrack = useMemo(() => tracks[currentIndex] || null, [tracks, currentIndex]);

  const streamUrl = useMemo(() => {
    if (!host || !currentTrack) return '';
    const url = new URL(`/v1/tracks/${currentTrack.id}/stream`, host);
    url.searchParams.set('app_name', APP_NAME);
    return url.toString();
  }, [host, currentTrack]);

  // Update audio src when track changes
  useEffect(() => {
    if (audioRef.current && streamUrl) {
      console.log('Setting audio source:', streamUrl);
      audioRef.current.src = streamUrl;
      audioRef.current.volume = 1.0;
      audioRef.current.play()
        .then(() => console.log('Audio playing'))
        .catch(err => console.log('Play prevented:', err));
    }
  }, [streamUrl, audioRef]);

  // Listen for track end event to auto-advance
  useEffect(() => {
    const handleNextTrack = () => {
      setCurrentIndex((prev) => (prev + 1) % tracks.length);
    };

    window.addEventListener('requestNextTrack', handleNextTrack);
    return () => window.removeEventListener('requestNextTrack', handleNextTrack);
  }, [tracks.length]);
  
  const handleNext = useCallback(() => {
    setTxSig(null);
    setCurrentIndex((prev) => (prev + 1) % tracks.length);
  }, [tracks.length]);

  const handlePrev = useCallback(() => {
    setTxSig(null);
    setCurrentIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  }, [tracks.length]);

  const handleTip = useCallback(async () => {
    if (!wallet.connected || !wallet.publicKey) {
      setWalletModalVisible(true);
      return;
    }

    if (!currentTrack?.user?.spl_wallet) {
      setError("Artist doesn't have a linked Solana wallet.");
      return;
    }

    if (!isValidSolanaAddress(currentTrack.user.spl_wallet)) {
      setError("Artist's Solana wallet address is invalid.");
      return;
    }

    const amount = parseFloat(tipAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid tip amount.');
      return;
    }

    setTipping(true);
    setError(null);
    setTxSig(null);

    try {
      const result = await sendTip(wallet, currentTrack.user.spl_wallet, amount);
      setTxSig(result.signature);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send tip');
    } finally {
      setTipping(false);
    }
  }, [wallet, currentTrack, tipAmount, setWalletModalVisible]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10">
        <Spinner />
        <span className="ml-3 text-gray-300">Loading tracks for @{artistHandle}...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-red-900/50 backdrop-blur-md border border-red-500/50 text-center text-red-200">
        <p className="font-semibold">Failed to load tracks</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }
  
  if (!currentTrack || !user) return null;

  return (
    <div className="w-full max-w-md rounded-2xl bg-black/30 backdrop-blur-xl border border-white/10 shadow-2xl p-5 flex flex-col gap-4 text-white">
      <div className="flex items-center gap-4">
        <img
          src={getTrackArtwork(currentTrack)}
          alt={currentTrack.title}
          className="w-24 h-24 rounded-lg object-cover shadow-lg"
        />
        <div className="flex-1 overflow-hidden">
          <p className="text-sm text-purple-300">Now Playing ({currentIndex + 1}/{tracks.length})</p>
          <h2 className="text-xl font-bold truncate" title={currentTrack.title}>{currentTrack.title}</h2>
          <p className="text-sm text-gray-400 truncate" title={`${user.name} @${user.handle}`}>{user.name} @{user.handle}</p>
        </div>
      </div>

      {/* Audio controls */}
      <div className="w-full flex items-center gap-2 p-2 bg-white/5 rounded-lg">
        <button 
          onClick={() => audioRef.current?.play()}
          className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded text-sm transition-colors"
        >
          ▶ Play
        </button>
        <button 
          onClick={() => audioRef.current?.pause()}
          className="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded text-sm transition-colors"
        >
          ⏸ Pause
        </button>
      </div>
      
      <div className="flex justify-between items-center mt-2">
         <button onClick={handlePrev} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">Prev</button>
         <button onClick={handleNext} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">Next</button>
      </div>
      
      <div className="border-t border-white/10 pt-4 mt-2">
        <h3 className="text-sm font-semibold text-gray-300 mb-2">Tip Artist (SOL)</h3>
        {wallet.connected && wallet.publicKey ? (
          <div className="flex flex-col gap-3">
            <div className="text-xs text-purple-300 mb-2">
              Connected: {wallet.publicKey.toString().slice(0, 8)}...
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                step="0.01"
                value={tipAmount}
                onChange={(e) => setTipAmount(e.target.value)}
                className="flex-1 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none focus:border-purple-400 transition-colors"
                placeholder="Amount in SOL"
              />
              <button
                onClick={handleTip}
                disabled={tipping}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-60 text-sm font-semibold transition-colors flex items-center justify-center w-28"
              >
                {tipping ? <Spinner /> : `Tip ${tipAmount} SOL`}
              </button>
            </div>
            {error && (
              <div className="text-xs text-red-400 bg-red-900/50 p-2 rounded-md">
                {error}
              </div>
            )}
            {txSig && (
              <div className="text-xs text-emerald-400 bg-emerald-900/50 p-2 rounded-md break-all">
                <strong>Success!</strong> Tip sent! Tx: {txSig}
              </div>
            )}
            <button 
              onClick={() => wallet.disconnect()} 
              className="text-xs text-gray-400 hover:text-white mt-2"
            >
              Disconnect Wallet
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setWalletModalVisible(true)} 
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-colors text-sm font-semibold"
          >
            Connect Wallet to Tip
          </button>
        )}
      </div>
    </div>
  );
};

export default AudiusPlayer;
