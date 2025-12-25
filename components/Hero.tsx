
import React from 'react';
import { SOCIAL_LINKS } from '../constants';

const ICON_URLS: { [key: string]: string } = {
    twitter: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/X_logo_2023.svg/1200px-X_logo_2023.svg.png',
    telegram: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/1024px-Telegram_logo.svg.png',
    pumpfun: '/pump-fun-logo.png',
    trashbin: '/trashbin-icon.svg'
};

const getIconClasses = (iconName: string): string => {
  const baseClasses = 'w-12 h-12 object-contain hover:brightness-125 transition-all duration-200 drop-shadow-lg';
  if (iconName === 'twitter') {
    return `${baseClasses} invert`;
  }
  return baseClasses;
};

interface HeroProps {
  onTempoChange?: (tempo: number) => void;
  onEnterApp?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onTempoChange, onEnterApp }) => {
  return (
    <div className="relative z-40 flex flex-col items-center justify-center w-full h-full text-center p-4 pointer-events-none">
      <div className="bg-black/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-500/30 shadow-2xl shadow-purple-500/10 pointer-events-auto">
        <h1 className="font-bungee text-6xl md:text-8xl lg:text-9xl text-white drop-shadow-[0_5px_15px_rgba(168,85,247,0.4)]">
          GORBHOUSE
        </h1>
        <p className="mt-4 text-lg md:text-2xl text-gray-300">
          The Solana-Gorbagana Meme Community
        </p>
        <div className="mt-8 flex justify-center gap-6">
          {SOCIAL_LINKS.map((link) => {
            const iconUrl = ICON_URLS[link.icon];
            return (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform duration-200 pointer-events-auto"
                aria-label={link.name}
              >
                <img
                  src={iconUrl}
                  alt={link.name}
                  className={getIconClasses(link.icon)}
                  loading="eager"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    console.error(`Failed to load ${link.name} icon:`, iconUrl);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </a>
            );
          })}
          <button
            onClick={onEnterApp}
            className="hover:scale-110 transition-transform duration-200 pointer-events-auto cursor-pointer"
            aria-label="Enter Meme Ranker"
          >
            <img
              src="/other-images/Gorboyconsole.png"
              alt="Meme Ranker"
              className="w-12 h-12 object-contain hover:brightness-125 transition-all duration-200 drop-shadow-lg"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
