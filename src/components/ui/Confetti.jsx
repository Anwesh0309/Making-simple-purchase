import React, { useEffect, useState } from 'react';

const COLOURS = ['#ffc107','#d4af37','#4ecdc4','#ff6b6b','#9b59b6','#27ae60','#3498db','#e74c3c'];
const SHAPES  = ['●','■','▲','★','♦','✦'];

export function Confetti({ active = false, count = 60 }) {
  const [pieces, setPieces] = useState([]);
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!active || prefersReduced) { setPieces([]); return; }
    const p = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 800,
      colour: COLOURS[i % COLOURS.length],
      shape: SHAPES[i % SHAPES.length],
      size: 12 + Math.random() * 14,
      duration: 1200 + Math.random() * 1000,
    }));
    setPieces(p);
    const t = setTimeout(() => setPieces([]), 3200);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <>
      {pieces.map(p => (
        <div key={p.id} style={{
          position: 'fixed', top: -20, left: `${p.x}%`,
          fontSize: p.size, color: p.colour,
          animationName: 'confettiFall',
          animationDuration: `${p.duration}ms`,
          animationDelay: `${p.delay}ms`,
          animationTimingFunction: 'linear',
          animationFillMode: 'forwards',
          pointerEvents: 'none', userSelect: 'none',
          zIndex: 9999,
        }}>
          {p.shape}
        </div>
      ))}
    </>
  );
}

export function CoinRain({ active = false }) {
  const [coins, setCoins] = useState([]);
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!active || prefersReduced) { setCoins([]); return; }
    const c = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: 5 + Math.random() * 90,
      delay: i * 55,
      duration: 900 + Math.random() * 500,
    }));
    setCoins(c);
    const t = setTimeout(() => setCoins([]), 2800);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <>
      {coins.map(c => (
        <div key={c.id} style={{
          position: 'fixed', top: -30, left: `${c.x}%`,
          fontSize: '1.6rem',
          animationName: 'confettiFall',
          animationDuration: `${c.duration}ms`,
          animationDelay: `${c.delay}ms`,
          animationTimingFunction: 'ease-in',
          animationFillMode: 'forwards',
          pointerEvents: 'none', zIndex: 9998,
        }}>
          🪙
        </div>
      ))}
    </>
  );
}
