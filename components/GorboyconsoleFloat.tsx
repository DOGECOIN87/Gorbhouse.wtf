import React, { useEffect, useState } from 'react';

const GorboyconsoleFloat: React.FC = () => {
  const [startX] = useState(() => Math.random() * 80 + 10);
  const [duration] = useState(() => Math.random() * 6 + 18);
  const [swayAmount] = useState(() => Math.random() * 40 + 30);
  const [delay] = useState(() => Math.random() * 5);

  return (
    <div
      className="fixed pointer-events-none"
      style={{
        right: `${startX}%`,
        bottom: '-200px',
        animation: `floatUp ${duration}s linear ${delay}s infinite`,
        zIndex: 25,
      }}
    >
      <style>
        {`
          @keyframes floatUp {
            0% {
              transform: translateY(0) translateX(0) rotate(0deg);
            }
            25% {
              transform: translateY(-25vh) translateX(${swayAmount}px) rotate(5deg);
            }
            50% {
              transform: translateY(-50vh) translateX(-${swayAmount}px) rotate(-5deg);
            }
            75% {
              transform: translateY(-75vh) translateX(${swayAmount / 2}px) rotate(3deg);
            }
            100% {
              transform: translateY(calc(-100vh - 200px)) translateX(0) rotate(0deg);
            }
          }
          @keyframes bobbing {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }
        `}
      </style>

      <div
        className="flex justify-center"
        style={{
          animation: 'bobbing 3s ease-in-out infinite',
        }}
      >
        <img
          src="/other-images/Gorboyconsole.png"
          alt="Gorboyconsole"
          className="w-24 h-24 sm:w-32 sm:h-32 object-contain drop-shadow-2xl"
          style={{
            filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.6))',
          }}
        />
      </div>
    </div>
  );
};

export default GorboyconsoleFloat;
