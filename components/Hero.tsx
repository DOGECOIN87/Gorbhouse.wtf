
import React from 'react';
import { SOCIAL_LINKS } from '../constants';

const TwitterIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22.46 6C21.71 6.34 20.91 6.58 20.06 6.69C20.94 6.17 21.63 5.38 21.94 4.42C21.1 4.91 20.19 5.26 19.23 5.45C18.43 4.6 17.29 4 16.03 4C13.62 4 11.69 5.93 11.69 8.34C11.69 8.68 11.73 9.01 11.81 9.32C8.24 9.14 5.09 7.38 2.94 4.79C2.56 5.43 2.36 6.18 2.36 6.98C2.36 8.54 3.16 9.91 4.34 10.7C3.62 10.68 2.96 10.47 2.38 10.15V10.2C2.38 12.44 4.03 14.29 6.12 14.72C5.75 14.82 5.36 14.88 4.95 14.88C4.66 14.88 4.38 14.85 4.11 14.8C4.7 16.61 6.39 17.96 8.43 18C6.8 19.23 4.81 20 2.62 20C2.28 20 1.95 19.98 1.62 19.94C3.68 21.28 6.08 22.04 8.68 22.04C16.02 22.04 20.32 15.93 20.32 10.41C20.32 10.22 20.31 10.03 20.3 9.84C21.1 9.25 21.85 8.51 22.46 7.63V6Z"/></svg>
);

const TelegramIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22 2L11 13L2 9L22 2ZM22 2L15 22L11 13L2 9L22 2Z"/></svg>
);

const SolanaIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M4.68 3.56c-.57.34-.84.99-.64 1.59l2.84 8.52c.2.6.8.99 1.4.99h4.35c.57 0 .96-.34 1.1-.86l2.83-10.6c.2-.74-.29-1.52-1.03-1.72-2.16-.57-4.32-1-6.49-1.13-1.09-.07-2.18-.07-3.27.1-.4.06-.75.33-.92.7ZM19.29 18.8c.57-.34.84-.99-.64-1.59l-2.84-8.52c-.2-.6-.8-.99-1.4-.99h-4.35c-.57 0-.96.34-1.1-.86l-2.83 10.6c-.2.74.29 1.52 1.03 1.72 2.16.57 4.32 1 6.49 1.13 1.09.07 2.18.07 3.27-.1.4-.06-.75-.33-.92-.7Z"/></svg>
);

const ICONS: { [key: string]: React.FC<{className?: string}> } = {
    twitter: TwitterIcon,
    telegram: TelegramIcon,
    solana: SolanaIcon
};

const Hero: React.FC = () => {
  return (
    <div className="relative z-40 flex flex-col items-center justify-center w-full h-full text-center p-4 pointer-events-none">
      <div className="bg-black/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-500/30 shadow-2xl shadow-purple-500/10 pointer-events-auto">
        <h1 className="font-bungee text-6xl md:text-8xl lg:text-9xl text-white drop-shadow-[0_5px_15px_rgba(168,85,247,0.4)]">
          GORBHOUSE
        </h1>
        <p className="mt-4 text-lg md:text-2xl text-gray-300">
          The Solana-Gorbagana Meme Community
        </p>
      </div>
    </div>
  );
};

export default Hero;