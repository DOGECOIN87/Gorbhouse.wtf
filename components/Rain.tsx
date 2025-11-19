import React, { useState, useEffect } from 'react';

interface Raindrop {
  id: number;
  left: number;
  delay: number;
  duration: number;
  opacity: number;
}

const Rain: React.FC = () => {
  const [isRaining, setIsRaining] = useState(false);
  const [raindrops, setRaindrops] = useState<Raindrop[]>([]);

  useEffect(() => {
    // Generate raindrops once
    const drops: Raindrop[] = Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: Math.random() * 0.5 + 0.5,
      opacity: Math.random() * 0.3 + 0.3,
    }));
    setRaindrops(drops);

    const startRainCycle = () => {
      // Wait 3-4 minutes before starting rain
      const waitTime = (Math.random() * 60000) + 180000; // 3-4 minutes
      
      const waitTimeout = setTimeout(() => {
        setIsRaining(true);
        
        // Rain for 45-75 seconds
        const rainDuration = Math.random() * 30000 + 45000;
        const rainTimeout = setTimeout(() => {
          setIsRaining(false);
          startRainCycle();
        }, rainDuration);

        return rainTimeout;
      }, waitTime);

      return waitTimeout;
    };

    const timeout = startRainCycle();
    
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  if (!isRaining) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {/* Rain overlay for atmosphere */}
      <div className="absolute inset-0 bg-blue-900/10" />
      
      {/* Raindrops */}
      {raindrops.map((drop) => (
        <div
          key={drop.id}
          className="absolute w-px bg-gradient-to-b from-transparent via-blue-200 to-transparent"
          style={{
            left: `${drop.left}%`,
            top: '-10%',
            height: '100px',
            opacity: drop.opacity,
            animation: `fall ${drop.duration}s linear ${drop.delay}s infinite`,
          }}
        />
      ))}

      {/* Splash effects at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-blue-200/20 to-transparent" />

      <style>
        {`
          @keyframes fall {
            0% {
              transform: translateY(-100px);
            }
            100% {
              transform: translateY(calc(100vh + 100px));
            }
          }
        `}
      </style>
    </div>
  );
};

export default Rain;
