import React, { useState, useEffect } from 'react';

const AmusedPeek: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Start animation after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="fixed"
      style={{
        left: '18.24px',
        top: isVisible ? '18.24px' : 'calc(18.24px + 300px)', // Start 300px lower, move up to 18.24px
        width: 'clamp(60px, 10vw, 100px)',
        height: 'clamp(60px, 10vw, 100px)',
        zIndex: 5, // Behind background (z-10)
        transition: 'top 3000ms ease-out',
      }}
    >
      <img
        src="/other-images/Amused.png"
        alt="Amused"
        className="w-full h-full object-contain drop-shadow-2xl"
      />
    </div>
  );
};

export default AmusedPeek;
