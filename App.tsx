import React, { useState, useEffect, useRef } from 'react';
import FloatingGorb from './components/FloatingGorb';
import Hero from './components/Hero';
import ParachuteItem from './components/ParachuteItem';
import NightSky from './components/NightSky';
import OscarPeek from './components/OscarPeek';
import GorbPeek from './components/GorbPeek';
import Rain from './components/Rain';
import UFO from './components/UFO';
import MainSite from './components/MainSite';
import WalletConnector from './components/WalletConnector';
import type { Gorb } from './types';
import { GORB_IMAGES } from './constants';

const App: React.FC = () => {
  const [hasEnteredSite, setHasEnteredSite] = useState(false);
  const [gorbs, setGorbs] = useState<Gorb[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isDaytime, setIsDaytime] = useState(true);
  const [tempoMultiplier, setTempoMultiplier] = useState(1.0);
  // FIX: Initialize useRef with null to provide an initial value and fix the type error.
  const animationFrameId = useRef<number | null>(null);

  const handleOscarClick = () => {
    setHasEnteredSite(true);
  };

  useEffect(() => {
    const checkTimeOfDay = () => {
      const hour = new Date().getHours();
      // Daytime is 6 AM to 6 PM (6-18)
      setIsDaytime(hour >= 6 && hour < 18);
    };
    
    checkTimeOfDay();
    // Check every minute
    const interval = setInterval(checkTimeOfDay, 60000);
    
    return () => clearInterval(interval);
  }, []);

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
          gorb.x += gorb.vx * tempoMultiplier;
          gorb.y += gorb.vy * tempoMultiplier;
          gorb.rotation += gorb.rotationSpeed * tempoMultiplier;

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
  }, [tempoMultiplier]);

  const parallaxX = (mousePos.x - window.innerWidth / 2) / 50;
  const parallaxY = (mousePos.y - window.innerHeight / 2) / 50;

  // If user has entered the site, show the main site
  if (hasEnteredSite) {
    return (
      <MainSite />
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Sky layers - z-0 (bottom) */}
      {!isDaytime && <NightSky />}
      {isDaytime && (
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-sky-200 -z-10" />
      )}
      
      {/* Background image - z-10 */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 z-10"
        style={{ 
          backgroundImage: "url('/other-images/Landfill-Background-Transparent-Sky.png')",
        }}
      />
      
      {/* Floating gorbs - z-20 */}
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out z-20"
        style={{ transform: `translate(${parallaxX}px, ${parallaxY}px)` }}
      >
        {gorbs.map((gorb) => (
          <FloatingGorb key={gorb.id} {...gorb} />
        ))}
      </div>
      {/* UI elements - z-30+ */}
      <ParachuteItem 
        src="/other-images/trashcoinlogo (4).png" 
        alt="trashcoin" 
        delay={0}
        href="https://trashcoin.wtf?code=272f2114-24fe-4d13-8cd4-4d24af0737c1"
      />
      <UFO href="https://justaliens.space" />
      <OscarPeek onOscarClick={handleOscarClick} />
      <Rain />
      <Hero onTempoChange={setTempoMultiplier} onEnterApp={handleOscarClick} />
    </div>
  );
};

export default App;
