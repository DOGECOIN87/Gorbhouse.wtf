import React from 'react';
import type { Gorb } from '../types';

type FloatingGorbProps = Pick<Gorb, 'src' | 'size' | 'x' | 'y' | 'rotation'>;

const FloatingGorb: React.FC<FloatingGorbProps> = ({
  src,
  size,
  x,
  y,
  rotation,
}) => {
  const style: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: `${size}px`,
    height: `${size}px`,
    transform: `translate(${x - size / 2}px, ${y - size / 2}px) rotate(${rotation}deg)`,
    willChange: 'transform',
  };

  return (
    <img
      src={src}
      alt="Floating Gorb"
      className="object-contain"
      style={style}
    />
  );
};

export default React.memo(FloatingGorb);
