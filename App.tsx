import React, { useState, useEffect, useRef } from 'react';
import FloatingGorb from './components/FloatingGorb';
import Hero from './components/Hero';
import type { Gorb } from './types';
import { GORB_IMAGES } from './constants';

const App: React.FC = () => {
  const [gorbs, setGorbs] = useState<Gorb[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  // FIX: Initialize useRef with null to provide an initial value and fix the type error.
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const generateGorbs = () => {
      const newGorbs: Gorb[] = Array.from({ length: 15 }).map((_, i) => {
        const size = Math.random() * 80 + 40; // 40px to 120px
        return {
          id: i,
          src: GORB_IMAGES[i % GORB_IMAGES.length],
          size: size,
          x: Math.random() * (window.innerWidth - size) + size / 2,
          y: Math.random() * (window.innerHeight - size) + size / 2,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5),
        };
      });
      setGorbs(newGorbs);
    };
    generateGorbs();
  }, []);
  
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePos({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const animate = () => {
      setGorbs(prevGorbs => {
        if (prevGorbs.length === 0) return [];

        const nextGorbs = prevGorbs.map(g => ({ ...g }));
        const { innerWidth, innerHeight } = window;

        // Update positions and handle wall collisions
        nextGorbs.forEach(gorb => {
          gorb.x += gorb.vx;
          gorb.y += gorb.vy;
          gorb.rotation += gorb.rotationSpeed;

          // Wall collision
          if (gorb.x - gorb.size / 2 < 0 || gorb.x + gorb.size / 2 > innerWidth) {
            gorb.vx *= -1;
            gorb.x = Math.max(gorb.size / 2, Math.min(innerWidth - gorb.size / 2, gorb.x));
            gorb.rotationSpeed = (Math.random() - 0.5) * 2;
          }
          if (gorb.y - gorb.size / 2 < 0 || gorb.y + gorb.size / 2 > innerHeight) {
            gorb.vy *= -1;
            gorb.y = Math.max(gorb.size / 2, Math.min(innerHeight - gorb.size / 2, gorb.y));
            gorb.rotationSpeed = (Math.random() - 0.5) * 2;
          }
        });

        // Handle Gorb-on-Gorb collisions
        for (let i = 0; i < nextGorbs.length; i++) {
          for (let j = i + 1; j < nextGorbs.length; j++) {
            const g1 = nextGorbs[i];
            const g2 = nextGorbs[j];

            const dx = g2.x - g1.x;
            const dy = g2.y - g1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = g1.size / 2 + g2.size / 2;

            if (distance < minDistance) {
              const angle = Math.atan2(dy, dx);
              const overlap = minDistance - distance;
              
              g1.x -= (overlap / 2) * Math.cos(angle);
              g1.y -= (overlap / 2) * Math.sin(angle);
              g2.x += (overlap / 2) * Math.cos(angle);
              g2.y += (overlap / 2) * Math.sin(angle);

              [g1.vx, g2.vx] = [g2.vx, g1.vx];
              [g1.vy, g2.vy] = [g2.vy, g1.vy];
              
              g1.rotationSpeed += (Math.random() - 0.5);
              g2.rotationSpeed += (Math.random() - 0.5);
            }
          }
        }
        
        return nextGorbs;
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const parallaxX = (mousePos.x - window.innerWidth / 2) / 50;
  const parallaxY = (mousePos.y - window.innerHeight / 2) / 50;

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{ transform: `translate(${parallaxX}px, ${parallaxY}px)` }}
      >
        {gorbs.map((gorb) => (
          <FloatingGorb key={gorb.id} {...gorb} />
        ))}
      </div>
      <Hero />
    </div>
  );
};

export default App;