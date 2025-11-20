import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Meme } from '../types';
import { fetchGorbhouseMemes } from '../services/memeService';
import { updateRatings } from '../services/eloService';
import MemeCard from './MemeCard';
import Leaderboard from './Leaderboard';
import HallOfFame from './HallOfFame';
import AudiusPlayer from './AudiusPlayer';
import { DEFAULT_HANDLE } from '../constants';

const INITIAL_RATING = 1200;
const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/vote`;

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

const MainSite: React.FC = () => {
  console.log('MainSite component rendering');
  const [memes, setMemes] = useState<Meme[]>([]);
  const [currentPair, setCurrentPair] = useState<[number, number] | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [votedFor, setVotedFor] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showHallOfFame, setShowHallOfFame] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const voteRetryRef = useRef<{ winnerId: string; loserId: string } | null>(null);

  useEffect(() => {
    const loadMemes = async () => {
      try {
        console.log('Fetching memes from backend...');
        const fetchedMemes = await fetchGorbhouseMemes();
        console.log('Fetched memes:', fetchedMemes.length);
        
        // fetchedMemes are already proper Meme objects with current ratings
        setMemes(fetchedMemes);
      } catch (error) {
        console.error('Error loading memes:', error);
      } finally {
        setLoading(false);
      }
    };
    loadMemes();
  }, []);

  const selectNewPair = useCallback(() => {
    const totalMemes = memes.length;
    if (totalMemes < 2) {
      setCurrentPair(null);
      return;
    }

    let index1 = Math.floor(Math.random() * totalMemes);
    let index2 = Math.floor(Math.random() * totalMemes);

    while (index1 === index2) {
      index2 = Math.floor(Math.random() * totalMemes);
    }

    setCurrentPair([index1, index2]);
    setIsVoting(false);
    setVotedFor(null);
  }, [memes.length]);

  useEffect(() => {
    if (memes.length > 0) {
      selectNewPair();
    }
  }, [memes.length, selectNewPair]);

  const addToast = useCallback((message: string, type: 'success' | 'error') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const handleVote = useCallback(async (winnerIndex: number, loserIndex: number) => {
    if (isVoting) return;
    setIsVoting(true);
    setVotedFor(winnerIndex);

    const winner = memes[winnerIndex];
    const loser = memes[loserIndex];

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                winnerId: winner.id,
                loserId: loser.id
            }),
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Vote failed:', errorText);
            voteRetryRef.current = { winnerId: winner.id, loserId: loser.id };
            addToast('Vote failed. Retrying...', 'error');
            
            // Retry after 2 seconds
            setTimeout(() => {
              if (voteRetryRef.current) {
                handleVote(winnerIndex, loserIndex);
              }
            }, 2000);
            return;
        } else {
            const result = await response.json();
            const { winner: rWinner, loser: rLoser } = result;
            
            // Update state with new ratings
            const updatedMemes = memes.map((meme) => {
                if (meme.id === rWinner.id) {
                    return { ...meme, rating: rWinner.rating };
                }
                if (meme.id === rLoser.id) {
                    return { ...meme, rating: rLoser.rating };
                }
                return meme;
            });
            setMemes(updatedMemes);
            voteRetryRef.current = null;
            addToast('Vote recorded!', 'success');
        }
    } catch (error) {
        console.error('Vote error:', error);
        voteRetryRef.current = { winnerId: winner.id, loserId: loser.id };
        addToast('Network error. Retrying...', 'error');
        
        // Retry after 2 seconds
        setTimeout(() => {
          if (voteRetryRef.current) {
            handleVote(winnerIndex, loserIndex);
          }
        }, 2000);
        return;
    }
    
    setTimeout(() => {
      setIsVoting(false);
      selectNewPair();
    }, 800);
  }, [memes, selectNewPair, isVoting, addToast]);

  const sortedMemes = useMemo(() => {
    return [...memes].sort((a, b) => b.rating - a.rating);
  }, [memes]);

  const meme1 = currentPair ? memes[currentPair[0]] : null;
  const meme2 = currentPair ? memes[currentPair[1]] : null;

  const getVoteState = (memeIndex: number): 'winner' | 'loser' | null => {
    if (!votedFor) return null;
    return votedFor === memeIndex ? 'winner' : 'loser';
  };

  if (loading) {
    return (
      <div className="relative min-h-screen w-screen overflow-hidden font-bungee">
        {/* Sky background */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-sky-200 -z-10" />
        
        {/* Landfill background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{ 
            backgroundImage: "url('/other-images/Landfill-Background-Transparent-Sky.png')",
          }}
        />

        {/* Loading content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center bg-black/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-500/30">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-xl text-white">Loading Gorbhouse memes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-screen overflow-hidden font-bungee">
      {/* Sky background */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-sky-200 -z-10" />
      
      {/* Landfill background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ 
          backgroundImage: "url('/other-images/Landfill-Background-Transparent-Sky.png')",
        }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen text-white flex flex-col p-4 sm:p-6 lg:p-8">
        <header className="mb-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-grow text-center sm:text-left">
              <h1 className="text-4xl sm:text-5xl text-white drop-shadow-[0_5px_15px_rgba(168,85,247,0.4)]">
                GORBHOUSE MEME RANKER
              </h1>
              <p className="mt-2 text-lg text-gray-300 drop-shadow-lg">
                {showHallOfFame ? 'The Elite. The Legendary. The Unforgettable.' : 'Which meme reigns supreme? You decide!'}
              </p>
            </div>
            <div className="flex gap-3 flex-wrap justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white font-bold rounded-lg shadow-lg hover:shadow-green-500/50 hover:scale-105 transition-all duration-300 border-2 border-green-400 whitespace-nowrap"
              >
                🏠 Home
              </button>
              <button
                onClick={() => setIsPlayerOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-700 text-white font-bold rounded-lg shadow-lg hover:shadow-red-500/50 hover:scale-105 transition-all duration-300 border-2 border-red-400 whitespace-nowrap"
              >
                🎵 Music
              </button>
              <button
                onClick={() => setShowHallOfFame(!showHallOfFame)}
                className={`px-6 py-3 font-bold rounded-lg shadow-lg hover:scale-105 transition-all duration-300 border-2 whitespace-nowrap ${
                  showHallOfFame
                    ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white hover:shadow-purple-500/50 border-purple-400'
                    : 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:shadow-yellow-400/50 border-yellow-300'
                }`}
              >
                {showHallOfFame ? '🎮 Back to Voting' : '🏆 View Hall of Fame'}
              </button>
            </div>
          </div>
        </header>

        <main className="flex-grow flex flex-col lg:flex-row gap-4 lg:gap-6">
          {showHallOfFame ? (
            <div className="w-full flex flex-col">
              <div className="flex-grow p-8 bg-black/50 backdrop-blur-sm rounded-2xl border border-yellow-400/30 shadow-2xl shadow-yellow-500/20 overflow-y-auto">
                <HallOfFame memes={sortedMemes} topCount={5} />
              </div>
            </div>
          ) : (
            <>
              <div className="lg:w-2/3 flex flex-col p-6 bg-black/50 backdrop-blur-sm rounded-2xl border border-gray-500/30 shadow-2xl shadow-purple-500/10">
                <h2 className="text-xl sm:text-2xl mb-8 text-center text-white drop-shadow-[0_3px_10px_rgba(168,85,247,0.4)]">
                  CLICK YOUR FAVORITE MEME
                </h2>
                {meme1 && meme2 && currentPair ? (
                  <div className="flex-grow flex flex-col md:flex-row items-center justify-around gap-4 md:gap-6">
                    <MemeCard
                      key={meme1.id}
                      meme={meme1}
                      onClick={() => handleVote(currentPair[0], currentPair[1])}
                      disabled={isVoting}
                      voteState={getVoteState(currentPair[0])}
                    />
                    <span className="text-3xl text-purple-400 my-2 md:my-0">VS</span>
                    <MemeCard
                      key={meme2.id}
                      meme={meme2}
                      onClick={() => handleVote(currentPair[1], currentPair[0])}
                      disabled={isVoting}
                      voteState={getVoteState(currentPair[1])}
                    />
                  </div>
                ) : (
                  <div className="flex-grow flex items-center justify-center">
                    <p className="text-xl text-gray-400">Loading memes...</p>
                  </div>
                )}
              </div>

              <div className="lg:w-1/3 p-6 bg-black/50 backdrop-blur-sm rounded-2xl border border-gray-500/30 shadow-2xl shadow-purple-500/10 lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto">
                <Leaderboard memes={sortedMemes} />
              </div>
            </>
          )}
        </main>

        {/* Audio element */}
        <audio ref={audioRef} className="hidden" />

        {/* Music Player Modal */}
        {isPlayerOpen && (
          <div 
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsPlayerOpen(false)}
          >
            <div 
              className="relative bg-black/80 rounded-2xl border-2 border-red-400 shadow-2xl shadow-red-500/50"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsPlayerOpen(false)}
                className="absolute -top-4 -right-4 z-10 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold flex items-center justify-center shadow-lg transition-colors"
              >
                ×
              </button>
              <div className="p-6">
                <AudiusPlayer 
                  artistHandle={DEFAULT_HANDLE} 
                  audioRef={audioRef}
                />
              </div>
            </div>
          </div>
        )}

        {/* Toast Notifications */}
        <div className="fixed bottom-4 right-4 z-40 space-y-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm border animate-fade-in ${
                toast.type === 'success'
                  ? 'bg-green-500/80 border-green-400 text-white'
                  : 'bg-red-500/80 border-red-400 text-white'
              }`}
            >
              {toast.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainSite;
