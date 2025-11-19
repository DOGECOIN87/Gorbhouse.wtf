import React, { useState } from 'react';

const ConfusedFloat: React.FC = () => {
  const [startX] = useState(() => Math.random() * 80 + 10);
  const [duration] = useState(() => Math.random() * 6 + 17);
  const [swayAmount] = useState(() => Math.random() * 40 + 30);
  const [delay] = useState(() => Math.random() * 7);

  return (
    <div
      className="fixed pointer-events-none"
      style={{
        right: `${startX}%`,
        bottom: '-180px',
        animation: `floatUpward ${duration}s linear ${delay}s infinite`,
        zIndex: 23,
      }}
    >
      <style>
        {`
          @keyframes floatUpward {
            0% {
              transform: translateY(0) translateX(0) rotate(0deg);
            }
            25% {
              transform: translateY(-25vh) translateX(-${swayAmount}px) rotate(6deg);
            }
            50% {
              transform: translateY(-50vh) translateX(${swayAmount}px) rotate(-6deg);
            }
            75% {
              transform: translateY(-75vh) translateX(-${swayAmount / 2}px) rotate(3deg);
            }
            100% {
              transform: translateY(calc(-100vh - 180px)) translateX(0) rotate(0deg);
            }
          }
          @keyframes wobble {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-12px) rotate(-3deg);
            }
          }
        `}
      </style>

      <div
        className="flex justify-center"
        style={{
          animation: 'wobble 3.5s ease-in-out infinite',
        }}
      >
        <img
          src="/other-images/Confused.png"
          alt="Confused"
          className="w-24 h-24 sm:w-32 sm:h-32 object-contain drop-shadow-2xl"
          style={{
            filter: 'drop-shadow(0 0 18px rgba(236, 72, 153, 0.5))',
          }}
        />
      </div>
    </div>
  );
};

export default ConfusedFloat;
