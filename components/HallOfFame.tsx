import React, { useState } from 'react';
import { Meme } from '../types';

interface HallOfFameProps {
  memes: Meme[];
  topCount?: number;
}

const HallOfFame: React.FC<HallOfFameProps> = ({ memes, topCount = 5 }) => {
  const [selectedMeme, setSelectedMeme] = useState<Meme | null>(null);
  const topMemes = memes.slice(0, topCount);

  const getMedalEmoji = (rank: number) => {
    switch (rank) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return '⭐';
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 0:
        return {
          border: 'border-yellow-400',
          glow: 'shadow-[0_0_30px_rgba(250,204,21,0.6)]',
          bg: 'bg-gradient-to-br from-yellow-400/20 to-yellow-600/20',
          text: 'text-yellow-300',
          scale: 'scale-110',
        };
      case 1:
        return {
          border: 'border-gray-300',
          glow: 'shadow-[0_0_25px_rgba(209,213,219,0.5)]',
          bg: 'bg-gradient-to-br from-gray-300/20 to-gray-500/20',
          text: 'text-gray-200',
          scale: 'scale-105',
        };
      case 2:
        return {
          border: 'border-orange-600',
          glow: 'shadow-[0_0_20px_rgba(234,88,12,0.5)]',
          bg: 'bg-gradient-to-br from-orange-400/20 to-orange-700/20',
          text: 'text-orange-300',
          scale: 'scale-100',
        };
      default:
        return {
          border: 'border-purple-400',
          glow: 'shadow-[0_0_15px_rgba(168,85,247,0.4)]',
          bg: 'bg-gradient-to-br from-purple-400/20 to-purple-600/20',
          text: 'text-purple-300',
          scale: 'scale-95',
        };
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl text-white drop-shadow-[0_5px_30px_rgba(250,204,21,0.8)] mb-3 sm:mb-4 animate-pulse">
          🏆 HALL OF FAME 🏆
        </h2>
        <p className="text-lg sm:text-xl lg:text-2xl text-yellow-300 drop-shadow-lg font-bold">
          The Elite. The Legendary. The Unforgettable.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center lg:items-end justify-center gap-6 lg:gap-8 px-4">
        {/* Left Honorable Mention */}
        {topMemes[3] && (
          <div className="hidden lg:flex flex-col items-center self-end mb-8">
            <div className="relative transition-all duration-300 hover:scale-105">
              <div
                className={`relative p-4 rounded-lg ${getRankStyle(3).bg} ${getRankStyle(3).border} border-2 ${getRankStyle(3).glow} backdrop-blur-sm cursor-pointer transition-all duration-300 hover:brightness-125`}
                onClick={() => setSelectedMeme(topMemes[3])}
              >
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-3xl">
                  {getMedalEmoji(3)}
                </div>
                <img
                  src={topMemes[3].url}
                  alt="4th Place"
                  className="w-28 h-28 lg:w-32 lg:h-32 object-contain rounded-lg bg-black/50"
                />
                <div className="mt-3 text-center">
                  <p className={`text-lg lg:text-xl font-bold ${getRankStyle(3).text}`}>
                    {topMemes[3].rating}
                  </p>
                  <p className="text-xs lg:text-sm text-gray-400 mt-1">#4</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top 3 Podium Layout */}
        <div className="flex items-end justify-center gap-4 sm:gap-6 lg:gap-8">
        {/* 2nd Place */}
        {topMemes[1] && (
          <div className="flex flex-col items-center">
            <div className="relative transition-all duration-300 hover:scale-110">
              <div
                className={`relative p-4 sm:p-5 rounded-xl ${getRankStyle(1).bg} ${getRankStyle(1).border} border-4 ${getRankStyle(1).glow} backdrop-blur-sm cursor-pointer transition-all duration-300 hover:brightness-125`}
                onClick={() => setSelectedMeme(topMemes[1])}
              >
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-4xl sm:text-5xl">
                  {getMedalEmoji(1)}
                </div>
                <img
                  src={topMemes[1].url}
                  alt="2nd Place"
                  className="w-36 h-36 sm:w-44 sm:h-44 lg:w-48 lg:h-48 object-contain rounded-lg bg-black/50"
                />
                <div className="mt-3 text-center">
                  <p className={`text-2xl sm:text-3xl font-bold ${getRankStyle(1).text}`}>
                    {topMemes[1].rating}
                  </p>
                </div>
              </div>
            </div>
            <div className={`mt-3 w-36 sm:w-44 lg:w-48 h-16 sm:h-20 ${getRankStyle(1).bg} ${getRankStyle(1).border} border-2 rounded-t-lg flex items-center justify-center`}>
              <span className="text-lg sm:text-xl font-bold text-white">2nd</span>
            </div>
          </div>
        )}

        {/* 1st Place */}
        {topMemes[0] && (
          <div className="flex flex-col items-center">
            <div className="relative transition-all duration-300 hover:scale-110">
              <div
                className={`relative p-5 sm:p-6 rounded-xl ${getRankStyle(0).bg} ${getRankStyle(0).border} border-4 ${getRankStyle(0).glow} backdrop-blur-sm cursor-pointer transition-all duration-300 hover:brightness-125 animate-pulse`}
                onClick={() => setSelectedMeme(topMemes[0])}
              >
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-4xl sm:text-5xl">
                  {getMedalEmoji(0)}
                </div>
                <img
                  src={topMemes[0].url}
                  alt="1st Place"
                  className="w-44 h-44 sm:w-56 sm:h-56 lg:w-64 lg:h-64 object-contain rounded-lg bg-black/50"
                />
                <div className="mt-4 text-center">
                  <p className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${getRankStyle(0).text}`}>
                    {topMemes[0].rating}
                  </p>
                </div>
              </div>
            </div>
            <div className={`mt-3 w-44 sm:w-56 lg:w-64 h-20 sm:h-24 lg:h-28 ${getRankStyle(0).bg} ${getRankStyle(0).border} border-2 rounded-t-lg flex items-center justify-center`}>
              <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">1st</span>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {topMemes[2] && (
          <div className="flex flex-col items-center">
            <div className="relative transition-all duration-300 hover:scale-110">
              <div
                className={`relative p-4 sm:p-5 rounded-xl ${getRankStyle(2).bg} ${getRankStyle(2).border} border-4 ${getRankStyle(2).glow} backdrop-blur-sm cursor-pointer transition-all duration-300 hover:brightness-125`}
                onClick={() => setSelectedMeme(topMemes[2])}
              >
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-4xl sm:text-5xl">
                  {getMedalEmoji(2)}
                </div>
                <img
                  src={topMemes[2].url}
                  alt="3rd Place"
                  className="w-36 h-36 sm:w-44 sm:h-44 lg:w-48 lg:h-48 object-contain rounded-lg bg-black/50"
                />
                <div className="mt-3 text-center">
                  <p className={`text-2xl sm:text-3xl font-bold ${getRankStyle(2).text}`}>
                    {topMemes[2].rating}
                  </p>
                </div>
              </div>
            </div>
            <div className={`mt-3 w-36 sm:w-44 lg:w-48 h-14 sm:h-16 ${getRankStyle(2).bg} ${getRankStyle(2).border} border-2 rounded-t-lg flex items-center justify-center`}>
              <span className="text-lg sm:text-xl font-bold text-white">3rd</span>
            </div>
          </div>
        )}
        </div>

        {/* Right Honorable Mention */}
        {topMemes[4] && (
          <div className="hidden lg:flex flex-col items-center self-end mb-8">
            <div className="relative transition-all duration-300 hover:scale-105">
              <div
                className={`relative p-4 rounded-lg ${getRankStyle(4).bg} ${getRankStyle(4).border} border-2 ${getRankStyle(4).glow} backdrop-blur-sm cursor-pointer transition-all duration-300 hover:brightness-125`}
                onClick={() => setSelectedMeme(topMemes[4])}
              >
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-3xl">
                  {getMedalEmoji(4)}
                </div>
                <img
                  src={topMemes[4].url}
                  alt="5th Place"
                  className="w-28 h-28 lg:w-32 lg:h-32 object-contain rounded-lg bg-black/50"
                />
                <div className="mt-3 text-center">
                  <p className={`text-lg lg:text-xl font-bold ${getRankStyle(4).text}`}>
                    {topMemes[4].rating}
                  </p>
                  <p className="text-xs lg:text-sm text-gray-400 mt-1">#5</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Honorable Mentions - Mobile Only */}
      {topMemes.length > 3 && (
        <div className="mt-8 px-4 lg:hidden">
          <h3 className="text-2xl sm:text-3xl text-center text-purple-300 mb-4 drop-shadow-lg font-bold">
            ⭐ Honorable Mentions ⭐
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {topMemes.slice(3).map((meme, index) => {
              const rank = index + 3;
              const style = getRankStyle(rank);
              return (
                <div
                  key={meme.id}
                  className={`relative p-3 rounded-lg ${style.bg} ${style.border} border-2 ${style.glow} backdrop-blur-sm cursor-pointer transition-all duration-300 hover:scale-105 hover:brightness-125`}
                  onClick={() => setSelectedMeme(meme)}
                >
                  <div className="absolute -top-4 -left-4 text-3xl">
                    {getMedalEmoji(rank)}
                  </div>
                  <img
                    src={meme.url}
                    alt={`${rank + 1}th Place`}
                    className="w-28 h-28 object-contain rounded-lg bg-black/50"
                  />
                  <div className="mt-3 text-center">
                    <p className={`text-xl font-bold ${style.text}`}>
                      {meme.rating}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">#{rank + 1}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal for selected meme */}
      {selectedMeme && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMeme(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-gradient-to-br from-purple-900/90 to-black/90 p-8 rounded-2xl border-4 border-yellow-400 shadow-[0_0_50px_rgba(250,204,21,0.8)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-white text-3xl hover:text-yellow-400 transition-colors"
              onClick={() => setSelectedMeme(null)}
            >
              ×
            </button>
            <div className="text-center">
              <h3 className="text-3xl text-yellow-300 mb-4 drop-shadow-lg">
                Hall of Fame Meme
              </h3>
              <img
                src={selectedMeme.url}
                alt="Selected meme"
                className="max-w-full max-h-96 mx-auto object-contain rounded-lg bg-black/50 mb-4"
              />
              <p className="text-4xl font-bold text-yellow-400 mb-2">
                {selectedMeme.rating}
              </p>
              <p className="text-gray-300">
                Rank #{memes.findIndex(m => m.id === selectedMeme.id) + 1}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HallOfFame;
