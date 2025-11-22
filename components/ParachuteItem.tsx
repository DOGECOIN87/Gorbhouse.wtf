import React, { useEffect, useState } from 'react';

interface ParachuteItemProps {
  src: string;
  alt: string;
  delay: number;
  href?: string;
}

const ParachuteItem: React.FC<ParachuteItemProps> = ({ src, alt, delay, href }) => {
  const [startX] = useState(() => Math.random() * 80 + 10); // 10-90% of screen width
  const [duration] = useState(() => Math.random() * 5 + 15); // 15-20 seconds
  const [swayAmount] = useState(() => Math.random() * 30 + 20); // 20-50px sway

  return (
    <div
      className="fixed pointer-events-none"
      style={{
        left: `${startX}%`,
        top: '-150px',
        animation: `fall ${duration}s linear ${delay}s infinite`,
        zIndex: 5,
      }}
    >
      <style>
        {`
          @keyframes fall {
            0% {
              transform: translateY(0) translateX(0);
            }
            25% {
              transform: translateY(25vh) translateX(${swayAmount}px);
            }
            50% {
              transform: translateY(50vh) translateX(-${swayAmount}px);
            }
            75% {
              transform: translateY(75vh) translateX(${swayAmount / 2}px);
            }
            100% {
              transform: translateY(calc(100vh + 150px)) translateX(0);
            }
          }
          @keyframes parachuteSway {
            0%, 100% {
              transform: rotate(-5deg);
            }
            50% {
              transform: rotate(5deg);
            }
          }
          @keyframes stringWave {
            0%, 100% {
              transform: scaleY(1) translateX(0);
            }
            50% {
              transform: scaleY(1.1) translateX(2px);
            }
          }
        `}
      </style>
      
      {/* Parachute */}
      <div 
        className="relative mx-auto"
        style={{
          animation: 'parachuteSway 3s ease-in-out infinite',
          transformOrigin: 'center bottom',
        }}
      >
        <svg width="80" height="50" viewBox="0 0 80 50" className="mx-auto">
          <defs>
            <linearGradient id={`gradient-${alt}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#ff6b6b', stopOpacity: 0.9 }} />
              <stop offset="50%" style={{ stopColor: '#ee5a6f', stopOpacity: 0.8 }} />
              <stop offset="100%" style={{ stopColor: '#c44569', stopOpacity: 0.7 }} />
            </linearGradient>
          </defs>
          {/* Parachute canopy */}
          <path
            d="M 5 25 Q 5 5, 20 5 Q 40 0, 60 5 Q 75 5, 75 25 L 70 30 Q 60 20, 40 20 Q 20 20, 10 30 Z"
            fill={`url(#gradient-${alt})`}
            stroke="#fff"
            strokeWidth="1"
            opacity="0.9"
          />
          {/* Parachute lines */}
          <line x1="10" y1="30" x2="40" y2="50" stroke="#fff" strokeWidth="1" opacity="0.6" />
          <line x1="25" y1="25" x2="40" y2="50" stroke="#fff" strokeWidth="1" opacity="0.6" />
          <line x1="40" y1="20" x2="40" y2="50" stroke="#fff" strokeWidth="1" opacity="0.7" />
          <line x1="55" y1="25" x2="40" y2="50" stroke="#fff" strokeWidth="1" opacity="0.6" />
          <line x1="70" y1="30" x2="40" y2="50" stroke="#fff" strokeWidth="1" opacity="0.6" />
        </svg>
      </div>

      {/* Strings */}
      <div className="flex justify-center gap-2 relative" style={{ height: '40px' }}>
        <div 
          className="w-px bg-white/40"
          style={{
            animation: 'stringWave 2s ease-in-out infinite',
          }}
        />
        <div 
          className="w-px bg-white/40"
          style={{
            animation: 'stringWave 2s ease-in-out infinite 0.5s',
          }}
        />
      </div>

      {/* Image */}
      <div className="flex justify-center">
        {href ? (
          <a 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer"
            className="pointer-events-auto hover:scale-110 transition-transform duration-200"
          >
            <img
              src={src}
              alt={alt}
              className="w-16 h-16 object-contain drop-shadow-lg"
              style={{
                animation: 'parachuteSway 2.5s ease-in-out infinite',
              }}
            />
          </a>
        ) : (
          <img
            src={src}
            alt={alt}
            className="w-16 h-16 object-contain drop-shadow-lg"
            style={{
              animation: 'parachuteSway 2.5s ease-in-out infinite',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ParachuteItem;
