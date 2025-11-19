import React from 'react';
import { Meme } from '../types';

interface LeaderboardProps {
  memes: Meme[];
}

const Trophy: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 7h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 3.54 10.05 3 9 3 7.34 3 6 4.34 6 6c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V9c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 5c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
  </svg>
);

const Leaderboard: React.FC<LeaderboardProps> = ({ memes }) => {
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 0: return 'text-yellow-400';
      case 1: return 'text-gray-300';
      case 2: return 'text-yellow-600';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl text-center mb-4 text-white drop-shadow-[0_3px_10px_rgba(168,85,247,0.4)]">
        LEADERBOARD
      </h2>
      <div className="flex-grow overflow-y-auto pr-2">
        <ul className="space-y-2">
          {memes.map((meme, index) => (
            <li
              key={meme.id}
              className="flex items-center p-3 bg-black/30 backdrop-blur-sm rounded-lg border border-gray-500/20 shadow-md transition-transform duration-200 hover:scale-102 hover:bg-black/40"
            >
              <div className={`w-10 text-xl font-bold flex-shrink-0 ${getRankColor(index)} flex items-center justify-center`}>
                {index < 3 ? <Trophy className="w-6 h-6" /> : `#${index + 1}`}
              </div>
              <img
                src={meme.url}
                alt={`Meme ${meme.id}`}
                className="w-16 h-16 object-contain rounded-md mx-4 bg-black/50"
                loading="lazy"
              />
              <div className="flex-grow text-right flex items-center justify-end">
                <span className="text-2xl font-bold text-purple-300">{meme.rating}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Leaderboard;
