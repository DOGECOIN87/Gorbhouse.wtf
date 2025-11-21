import React, { useState, useEffect } from 'react';

interface OscarPeekProps {
  onOscarClick?: () => void;
}

const OscarPeek: React.FC<OscarPeekProps> = ({ onOscarClick }) => {
  const [isPeeking, setIsPeeking] = useState(false);
  const [position] = useState(() => Math.random() * 60 + 20); // 20-80% from left

  useEffect(() => {
    const scheduleNextPeek = () => {
      // Random delay between 8-28 seconds before next peek
      const delay = Math.random() * 20000 + 8000;
      
      const timeout = setTimeout(() => {
        setIsPeeking(true);
        
        // Stay up for 3-6 seconds
        const peekDuration = Math.random() * 3000 + 3000;
        setTimeout(() => {
          setIsPeeking(false);
          scheduleNextPeek();
        }, peekDuration);
      }, delay);

      return timeout;
    };

    const timeout = scheduleNextPeek();
    
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div
      className="fixed"
      style={{
        bottom: '-50px',
        left: `clamp(10%, ${position}%, 90%)`,
        transform: 'translateX(-50%)',
        pointerEvents: isPeeking ? 'auto' : 'none',
        zIndex: 9998,
      }}
    >
      <div
        className="transition-transform duration-[2000ms] ease-in-out"
        style={{
          transform: isPeeking ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        <img
          src="/other-images/oscarthegrouch.webp"
          alt="Oscar the Grouch"
          className="w-80 h-auto sm:w-96 md:w-[28rem] lg:w-[32rem] drop-shadow-2xl cursor-pointer hover:scale-105 transition-transform"
          style={{
            imageRendering: 'crisp-edges',
          }}
          onClick={onOscarClick}
        />
      </div>
    </div>
  );
};

export default OscarPeek;
