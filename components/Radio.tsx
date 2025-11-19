import React, { useState, useRef, useEffect } from 'react';
import AudiusPlayer from './AudiusPlayer';
import { DEFAULT_HANDLE } from '../constants';

interface MusicNote {
  id: number;
  x: number;
  delay: number;
  duration: number;
}

interface RadioProps {
  onTempoChange?: (tempo: number) => void;
}

const Radio: React.FC<RadioProps> = ({ onTempoChange }) => {
  const [isPlayerOpen, setIsPlayerOpen] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const [musicNotes] = useState<MusicNote[]>(() => 
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      x: Math.random() * 300 - 150, // Wider spread: -150px to +150px
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 2,
    }))
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => {
      setIsPlaying(true);
      console.log('Audio play event triggered');
    };
    
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      // Trigger next track in player
      const event = new CustomEvent('requestNextTrack');
      window.dispatchEvent(event);
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Simple tempo simulation based on time (since Web Audio API breaks playback)
  useEffect(() => {
    if (!isPlaying || !onTempoChange) return;

    const simulateTempo = () => {
      if (!isPlaying) return;
      
      // Create a pulsing effect that varies between 0.7 and 1.5
      const time = Date.now() / 1000;
      const tempo = 1.0 + Math.sin(time * 0.5) * 0.3 + Math.sin(time * 2) * 0.2;
      
      onTempoChange(tempo);
      
      requestAnimationFrame(simulateTempo);
    };
    
    const animationId = requestAnimationFrame(simulateTempo);
    
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying, onTempoChange]);



  return (
    <>
      {/* Audio element - visible for debugging */}
      <div className="fixed bottom-4 right-4 z-50 bg-black/80 p-2 rounded">
        <audio ref={audioRef} controls className="w-64" />
      </div>

      {/* Radio Image with Music Notes */}
      <div 
        className="fixed z-30 cursor-pointer hover:scale-110 transition-transform duration-300"
        style={{
          bottom: '-100px',
          left: '80px',
        }}
        onClick={() => setIsPlayerOpen(true)}
        title="Click to open music player"
      >
        <img 
          src="/other-images/radio.webp" 
          alt="Radio" 
          className="object-contain drop-shadow-2xl"
          style={{
            width: '400px',
            height: '400px',
            transform: 'rotate(-5deg)',
          }}
        />
        
        {/* Animated Music Notes */}
        {isPlaying && (
          <div className="absolute inset-0 pointer-events-none overflow-visible">
            {musicNotes.map((note) => (
              <div
                key={note.id}
                className="absolute text-4xl text-white animate-float-up opacity-0"
                style={{
                  left: `calc(50% + ${note.x}px)`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  animationDelay: `${note.delay}s`,
                  animationDuration: `${note.duration}s`,
                }}
              >
                {['♪', '♫', '♬'][note.id % 3]}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Music Player Modal - Upper Left Corner */}
      {isPlayerOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsPlayerOpen(false)}
        >
          <div 
            className="absolute top-8 left-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsPlayerOpen(false)}
              className="absolute -top-4 -right-4 z-10 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold flex items-center justify-center shadow-lg transition-colors"
            >
              ×
            </button>
            <AudiusPlayer 
              artistHandle={DEFAULT_HANDLE} 
              audioRef={audioRef}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Radio;
