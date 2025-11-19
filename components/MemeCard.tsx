import React, { useState } from 'react';
import { Meme } from '../types';

interface MemeCardProps {
  meme: Meme;
  onClick: () => void;
  disabled: boolean;
  voteState?: 'winner' | 'loser' | null;
}

const MemeCard: React.FC<MemeCardProps> = ({ meme, onClick, disabled, voteState }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getDynamicClasses = () => {
    if (voteState === 'winner') {
      return 'scale-105 shadow-2xl shadow-green-500/50 ring-4 ring-green-500 z-10';
    }
    if (voteState === 'loser') {
      return 'scale-95 opacity-40';
    }
    return 'scale-100 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50';
  };

  const cardClasses = `
    relative w-full max-w-md aspect-square bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden
    border border-gray-500/30 shadow-lg transform transition-all duration-300
    ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
    ${getDynamicClasses()}
  `;

  return (
    <div
      className={cardClasses}
      onClick={!disabled ? onClick : undefined}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={`Vote for meme ${meme.id}`}
    >
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center text-red-400">
          <p>Failed to load</p>
        </div>
      )}
      <img
        src={meme.url}
        alt={`Meme ${meme.id}`}
        className={`w-full h-full object-contain ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        loading="lazy"
        onLoad={() => {
          console.log('Image loaded:', meme.url);
          setImageLoaded(true);
        }}
        onError={(e) => {
          console.error('Image failed to load:', meme.url, e);
          setImageError(true);
        }}
      />
      <div className="absolute inset-0 bg-black opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
    </div>
  );
};

export default MemeCard;
