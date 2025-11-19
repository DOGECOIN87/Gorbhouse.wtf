import React from 'react';

const NightSky: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Night sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-blue-950 to-indigo-900" />
      
      {/* Stars */}
      <div className="absolute inset-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              top: Math.random() * 70 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.7 + 0.3,
              animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Moon */}
      <div
        className="absolute"
        style={{
          top: '15%',
          right: '20%',
          width: '120px',
          height: '120px',
        }}
      >
        <div className="relative w-full h-full">
          {/* Moon glow */}
          <div className="absolute inset-0 rounded-full bg-yellow-100/30 blur-3xl scale-150" />
          {/* Moon body */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-50 to-yellow-200 shadow-2xl">
            {/* Moon craters */}
            <div className="absolute top-1/4 left-1/3 w-4 h-4 rounded-full bg-yellow-300/40" />
            <div className="absolute top-1/2 right-1/4 w-6 h-6 rounded-full bg-yellow-300/30" />
            <div className="absolute bottom-1/3 left-1/4 w-3 h-3 rounded-full bg-yellow-300/50" />
          </div>
        </div>
      </div>

      {/* Animated clouds */}
      <div className="absolute inset-0">
        {/* Cloud 1 */}
        <div
          className="absolute opacity-70"
          style={{
            top: '20%',
            animation: 'cloudDrift1 60s linear infinite',
          }}
        >
          <svg width="200" height="80" viewBox="0 0 200 80">
            <ellipse cx="50" cy="50" rx="40" ry="25" fill="rgba(100, 120, 150, 0.6)" />
            <ellipse cx="90" cy="45" rx="50" ry="30" fill="rgba(100, 120, 150, 0.6)" />
            <ellipse cx="130" cy="50" rx="45" ry="28" fill="rgba(100, 120, 150, 0.6)" />
            <ellipse cx="160" cy="55" rx="35" ry="22" fill="rgba(100, 120, 150, 0.6)" />
          </svg>
        </div>

        {/* Cloud 2 */}
        <div
          className="absolute opacity-60"
          style={{
            top: '35%',
            animation: 'cloudDrift2 80s linear infinite',
          }}
        >
          <svg width="250" height="100" viewBox="0 0 250 100">
            <ellipse cx="60" cy="60" rx="50" ry="30" fill="rgba(80, 100, 130, 0.5)" />
            <ellipse cx="120" cy="55" rx="60" ry="35" fill="rgba(80, 100, 130, 0.5)" />
            <ellipse cx="180" cy="60" rx="55" ry="32" fill="rgba(80, 100, 130, 0.5)" />
          </svg>
        </div>

        {/* Cloud 3 */}
        <div
          className="absolute opacity-50"
          style={{
            top: '10%',
            animation: 'cloudDrift3 100s linear infinite',
          }}
        >
          <svg width="180" height="70" viewBox="0 0 180 70">
            <ellipse cx="45" cy="45" rx="35" ry="22" fill="rgba(90, 110, 140, 0.4)" />
            <ellipse cx="80" cy="40" rx="45" ry="28" fill="rgba(90, 110, 140, 0.4)" />
            <ellipse cx="120" cy="45" rx="40" ry="25" fill="rgba(90, 110, 140, 0.4)" />
          </svg>
        </div>

        {/* Cloud 4 */}
        <div
          className="absolute opacity-65"
          style={{
            top: '45%',
            animation: 'cloudDrift4 70s linear infinite',
          }}
        >
          <svg width="220" height="90" viewBox="0 0 220 90">
            <ellipse cx="55" cy="55" rx="45" ry="28" fill="rgba(95, 115, 145, 0.55)" />
            <ellipse cx="110" cy="50" rx="55" ry="33" fill="rgba(95, 115, 145, 0.55)" />
            <ellipse cx="165" cy="55" rx="50" ry="30" fill="rgba(95, 115, 145, 0.55)" />
          </svg>
        </div>
      </div>

      <style>
        {`
          @keyframes twinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
          @keyframes cloudDrift1 {
            0% { transform: translateX(-250px); }
            100% { transform: translateX(calc(100vw + 250px)); }
          }
          @keyframes cloudDrift2 {
            0% { transform: translateX(-300px); }
            100% { transform: translateX(calc(100vw + 300px)); }
          }
          @keyframes cloudDrift3 {
            0% { transform: translateX(-200px); }
            100% { transform: translateX(calc(100vw + 200px)); }
          }
          @keyframes cloudDrift4 {
            0% { transform: translateX(-280px); }
            100% { transform: translateX(calc(100vw + 280px)); }
          }
        `}
      </style>
    </div>
  );
};

export default NightSky;
