import React, { useState, useEffect } from 'react';

const UFO: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: -20 });
  const [phase, setPhase] = useState<'descending' | 'hovering' | 'beaming' | 'hidden'>('hidden');

  useEffect(() => {
    // Trigger UFO event every 4 minutes (240000ms)
    const triggerInterval = setInterval(() => {
      // Random horizontal position (20% to 80% of screen width)
      const randomX = 20 + Math.random() * 60;
      setPosition({ x: randomX, y: -20 });
      setIsActive(true);
      setPhase('descending');
    }, 240000); // 4 minutes

    // Trigger first appearance after 5 seconds for testing
    const initialTimeout = setTimeout(() => {
      const randomX = 20 + Math.random() * 60;
      setPosition({ x: randomX, y: -20 });
      setIsActive(true);
      setPhase('descending');
    }, 5000);

    return () => {
      clearInterval(triggerInterval);
      clearTimeout(initialTimeout);
    };
  }, []);

  useEffect(() => {
    if (!isActive) return;

    if (phase === 'descending') {
      // Descend to 20% from top over 8 seconds
      const descendTimer = setTimeout(() => {
        setPosition(prev => ({ ...prev, y: 20 }));
        setPhase('hovering');
      }, 100);

      return () => clearTimeout(descendTimer);
    }

    if (phase === 'hovering') {
      // Hover for 3 seconds before beaming
      const hoverTimer = setTimeout(() => {
        setPhase('beaming');
      }, 3000);

      return () => clearTimeout(hoverTimer);
    }

    if (phase === 'beaming') {
      // Show beam for 5 seconds then disappear
      const beamTimer = setTimeout(() => {
        setPhase('hidden');
        setIsActive(false);
      }, 5000);

      return () => clearTimeout(beamTimer);
    }
  }, [phase, isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 35 }}>
      {/* UFO Container */}
      <div
        className="absolute"
        style={{
          left: `clamp(15%, ${position.x}%, 85%)`,
          top: `${position.y}%`,
          transform: 'translate(-50%, -50%)',
          transition: 'all 8000ms ease-out',
        }}
      >
        {/* UFO with hovering animation */}
        <div
          className="relative"
          style={{
            animation: phase === 'hovering' || phase === 'beaming' ? 'ufoHover 2s ease-in-out infinite' : 'none',
          }}
        >
          <img
            src="/other-images/UFO.png"
            alt="UFO"
            className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-contain drop-shadow-2xl"
          />
        </div>


      </div>

      <style>
        {`
          @keyframes ufoHover {
            0%, 100% {
              transform: translateY(0px) rotate(-2deg);
            }
            50% {
              transform: translateY(-10px) rotate(2deg);
            }
          }

          @keyframes beamAppear {
            0% {
              opacity: 0;
              transform: scaleY(0);
            }
            100% {
              opacity: 1;
              transform: scaleY(1);
            }
          }

          @keyframes beamPulse {
            0%, 100% {
              opacity: 0.8;
            }
            50% {
              opacity: 1;
            }
          }

          @keyframes beamParticle {
            0% {
              transform: translateY(0) scale(1);
              opacity: 0;
            }
            50% {
              opacity: 1;
            }
            100% {
              transform: translateY(100px) scale(0.5);
              opacity: 0;
            }
          }

          .animate-beam-appear {
            animation: beamAppear 0.5s ease-out forwards;
          }

          .animate-beam-particle {
            animation: beamParticle 3s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default UFO;
