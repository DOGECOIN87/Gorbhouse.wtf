import React, { useState } from 'react';

const ChillFloat: React.FC = () => {
  const [startX] = useState(() => Math.random() * 80 + 10);
  const [duration] = useState(() => Math.random() * 7 + 20);
  const [swayAmount] = useState(() => Math.random() * 35 + 25);
  const [delay] = useState(() => Math.random() * 6);

  return (
    <div
      className="fixed pointer-events-none"
      style={{
        left: `${startX}%`,
        top: '-150px',
        animation: `floatDown ${duration}s linear ${delay}s infinite`,
        zIndex: 24,
      }}
    >
      <style>
        {`
          @keyframes floatDown {
            0% {
              transform: translateY(0) translateX(0) rotate(0deg);
            }
            25% {
              transform: translateY(25vh) translateX(${swayAmount}px) rotate(-8deg);
            }
            50% {
              transform: translateY(50vh) translateX(-${swayAmount}px) rotate(8deg);
            }
            75% {
              transform: translateY(75vh) translateX(${swayAmount / 2}px) rotate(-4deg);
            }
            100% {
              transform: translateY(calc(100vh + 150px)) translateX(0) rotate(0deg);
            }
          }
          @keyframes gentleSway {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-8px) rotate(2deg);
            }
          }
        `}
      </style>

      <div
        className="flex justify-center"
        style={{
          animation: 'gentleSway 4s ease-in-out infinite',
        }}
      >
        <img
          src="/other-images/Chill.png"
          alt="Chill"
          className="w-20 h-20 sm:w-28 sm:h-28 object-contain drop-shadow-2xl"
          style={{
            filter: 'drop-shadow(0 0 15px rgba(59, 130, 246, 0.5))',
          }}
        />
      </div>
    </div>
  );
};

export default ChillFloat;
