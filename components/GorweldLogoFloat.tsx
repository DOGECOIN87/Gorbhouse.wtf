import React, { useState } from 'react';

const GorweldLogoFloat: React.FC = () => {
  const [startX] = useState(() => Math.random() * 80 + 10);
  const [duration] = useState(() => Math.random() * 4 + 10);
  const [swayAmount] = useState(() => Math.random() * 30 + 20);
  const [delay] = useState(() => Math.random() * 5);

  return (
    <div
      className="fixed pointer-events-none"
      style={{
        left: `${startX}%`,
        top: '-120px',
        animation: `floatDownSlow ${duration}s linear ${delay}s infinite`,
        zIndex: 22,
      }}
    >
      <style>
        {`
          @keyframes floatDownSlow {
            0% {
              transform: translateY(0) translateX(0) rotate(0deg);
            }
            25% {
              transform: translateY(25vh) translateX(${swayAmount}px) rotate(10deg);
            }
            50% {
              transform: translateY(50vh) translateX(-${swayAmount}px) rotate(-10deg);
            }
            75% {
              transform: translateY(75vh) translateX(${swayAmount / 2}px) rotate(5deg);
            }
            100% {
              transform: translateY(calc(100vh + 120px)) translateX(0) rotate(0deg);
            }
          }
          @keyframes spinSlow {
            0%, 100% {
              transform: rotate(0deg);
            }
            50% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>

      <div
        className="flex justify-center"
        style={{
          animation: 'spinSlow 8s linear infinite',
        }}
      >
        <img
          src="/other-images/Gorweld-Logo.png"
          alt="Gorweld Logo"
          className="w-12 h-12 sm:w-16 sm:h-16 object-contain drop-shadow-2xl"
          style={{
            filter: 'drop-shadow(0 0 15px rgba(255, 165, 0, 0.5))',
          }}
        />
      </div>
    </div>
  );
};

export default GorweldLogoFloat;
