import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Meme } from '../types';
import { fetchGorbhouseMemes } from '../services/memeService';
import { updateRatings } from '../services/eloService';
import MemeCard from './MemeCard';
import Leaderboard from './Leaderboard';

const INITIAL_RATING = 1200;

const MainSite: React.FC = () => {
  console.log('MainSite component rendering');
  const [memes, setMemes] = useState<Meme[]>([]);
  const [currentPair, setCurrentPair] = useState<[number, number] | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [votedFor, setVotedFor] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMemes = async () => {
      try {
        console.log('Fetching memes...');
        const urls = await fetchGorbhouseMemes();
        console.log('Fetched memes:', urls.length);
        
        const memeData: Meme[] = urls.map((url, index) => ({
          id: index,
          url,
          rating: INITIAL_RATING,
        }));
        setMemes(memeData);
        console.log(`Initialized ${memeData.length} memes`);
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

  const handleVote = useCallback((winnerIndex: number, loserIndex: number) => {
    if (isVoting) return;
    setIsVoting(true);
    setVotedFor(winnerIndex);

    const winner = memes[winnerIndex];
    const loser = memes[loserIndex];

    const { newWinnerRating, newLoserRating } = updateRatings(winner.rating, loser.rating);

    const updatedMemes = memes.map((meme, index) => {
      if (index === winnerIndex) {
        return { ...meme, rating: newWinnerRating };
      }
      if (index === loserIndex) {
        return { ...meme, rating: newLoserRating };
      }
      return meme;
    });

    setMemes(updatedMemes);
    setTimeout(() => {
      selectNewPair();
    }, 800);
  }, [memes, selectNewPair, isVoting]);

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
        <header className="text-center mb-4">
          <h1 className="text-4xl sm:text-5xl text-white drop-shadow-[0_5px_15px_rgba(168,85,247,0.4)]">
            GORBHOUSE MEME RANKER
          </h1>
          <p className="mt-2 text-lg text-gray-300 drop-shadow-lg">Which meme reigns supreme? You decide!</p>
        </header>

        <main className="flex-grow flex flex-col lg:flex-row gap-4 lg:gap-6">
          <div className="lg:w-2/3 flex flex-col items-center justify-center p-6 bg-black/50 backdrop-blur-sm rounded-2xl border border-gray-500/30 shadow-2xl shadow-purple-500/10">
            <h2 className="text-xl sm:text-2xl mb-4 text-gray-300">CLICK YOUR FAVORITE MEME</h2>
            {meme1 && meme2 && currentPair ? (
              <div className="w-full flex flex-col md:flex-row items-center justify-around gap-4 md:gap-6">
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
              <div className="flex items-center justify-center h-64">
                <p className="text-xl text-gray-400">Loading memes...</p>
              </div>
            )}
          </div>

          <div className="lg:w-1/3 p-6 bg-black/50 backdrop-blur-sm rounded-2xl border border-gray-500/30 shadow-2xl shadow-purple-500/10 lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto">
            <Leaderboard memes={sortedMemes} />
          </div>
        </main>


      </div>
    </div>
  );
};

export default MainSite;
