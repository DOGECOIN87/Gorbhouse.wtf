import React, { useState, useEffect } from 'react';

const GORB_EXPRESSIONS = [
  'Amused.png',
  'Chill.png',
  'Confused.png',
  'Curious.png',
  'Happy.png',
  'Surprised.png',
];

const GorbPeek: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentExpression, setCurrentExpression] = useState('');
  const [position, setPosition] = useState<'left' | 'right'>('right');

  useEffect(() => {
    const showGorb = () => {
      // Pick a random expression
      const randomExpression = GORB_EXPRESSIONS[Math.floor(Math.random() * GORB_EXPRESSIONS.length)];
      setCurrentExpression(randomExpression);
      
      // Pick random side (left or right)
      setPosition(Math.random() > 0.5 ? 'right' : 'left');
      
      setIsVisible(true);

      // Hide after 3-5 seconds
      const hideDelay = 3000 + Math.random() * 2000;
      setTimeout(() => {
        setIsVisible(false);
      }, hideDelay);
    };

    // Show gorb randomly every 15-30 seconds
    const scheduleNext = () => {
      const delay = 15000 + Math.random() * 15000;
      setTimeout(() => {
        showGorb();
        scheduleNext();
      }, delay);
    };

    // Initial appearance after 10 seconds
    setTimeout(() => {
      showGorb();
      scheduleNext();
    }, 10000);
  }, []);

  return (
    <div
      className="fixed transition-all duration-1000 ease-out overflow-hidden"
      style={{
        left: position === 'right' ? '80%' : '20%',
        top: '15%',
        width: 'clamp(60px, 10vw, 100px)',
        height: 'clamp(60px, 10vw, 100px)',
        zIndex: 5, // Behind background (z-10) so it appears to go behind it
      }}
    >
      <img
        src={`/other-images/${currentExpression}`}
        alt="Gorb peeking"
        className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-1000"
        style={{
          transform: isVisible 
            ? 'translateY(0)' 
            : 'translateY(100%)',
        }}
      />
    </div>
  );
};

export default GorbPeek;
