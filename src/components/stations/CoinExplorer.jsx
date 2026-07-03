import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNarration } from '../../hooks/useNarration.js';
import { station1Intro } from '../../utils/narration.js';
import { DENOMINATION_INFO } from '../../data/coinDenominations.js';
import { CoinSVG, NoteSVG } from '../ui/CoinSVG.jsx';

// US denominations to show: penny, nickel, dime, quarter, half dollar, dollar coin, $5, $10
const ITEMS = [1, 5, 10, 25, 50, 100, 500, 1000];

export function CoinExplorer({ onComplete }) {
  const { play } = useNarration();
  const [tapped,  setTapped]  = useState(new Set());
  const [active,  setActive]  = useState(null);
  const [flipped, setFlipped] = useState(new Set());
  const allTapped = tapped.size >= ITEMS.length;

  useEffect(() => { play(station1Intro()); }, []);

  function handleTap(denom) {
    setActive(denom);
    setTapped(prev => new Set([...prev, denom]));
    setFlipped(prev => {
      const n = new Set([...prev]);
      n.has(denom) ? n.delete(denom) : n.add(denom);
      return n;
    });
    const info = DENOMINATION_INFO[denom];
    if (info) {
      play([
        { text: `This is the ${info.design}. It is worth ${info.display}.`, style: 'statement' },
        { text: info.funFact, style: 'thinking' },
      ]);
    }
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <p style={{ textAlign:'center', color:'rgba(255,255,255,0.6)',
        fontFamily:'var(--font-body)', fontWeight:700, fontSize:'0.9rem' }}>
        Tap each coin or bill to learn about it! ({tapped.size}/{ITEMS.length} tapped)
      </p>

      {/* Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, placeItems:'center' }}>
        {ITEMS.map(denom => {
          const info    = DENOMINATION_INFO[denom];
          const isTapped = tapped.has(denom);
          const isNote  = info?.type === 'note';

          return (
            <motion.div key={denom} whileTap={{ scale:0.88 }}
              onClick={() => handleTap(denom)}
              style={{
                display:'flex', flexDirection:'column', alignItems:'center', gap:6,
                cursor:'pointer', padding:10, borderRadius:16, transition:'all 0.2s',
                background: isTapped ? 'rgba(255,193,7,0.15)' : 'rgba(255,255,255,0.04)',
                border: isTapped ? '2px solid rgba(255,193,7,0.5)' : '2px solid rgba(255,255,255,0.08)',
              }}>
              {isNote
                ? <NoteSVG denomination={denom} size="small" showValue />
                : <CoinSVG denomination={denom} size={56} showLabel />
              }
              <span style={{ fontFamily:'var(--font-display)', fontSize:'0.85rem',
                color: isTapped ? 'var(--gold)' : 'rgba(255,255,255,0.7)' }}>
                {info?.label}
              </span>
              {isTapped && (
                <span style={{ fontSize:'0.7rem', color:'var(--green)', fontWeight:700 }}>✓ Tapped!</span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Fun fact bubble */}
      <AnimatePresence>
        {active && (
          <motion.div key={active}
            initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
            style={{
              background:'rgba(255,193,7,0.12)', border:'2px solid rgba(255,193,7,0.3)',
              borderRadius:16, padding:'10px 16px', textAlign:'center',
            }}>
            <p style={{ color:'rgba(255,255,255,0.9)', fontFamily:'var(--font-body)',
              fontWeight:700, fontSize:'0.88rem' }}>
              💡 {DENOMINATION_INFO[active]?.funFact}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Complete button */}
      <div style={{ display:'flex', justifyContent:'flex-end' }}>
        <button className={`btn btn-primary btn-sm${!allTapped ? ' disabled' : ''}`}
          style={{ opacity: allTapped ? 1 : 0.4, cursor: allTapped ? 'pointer' : 'not-allowed' }}
          disabled={!allTapped} onClick={onComplete}>
          {allTapped ? 'Next Station →' : `Tap all coins first (${tapped.size}/${ITEMS.length})`}
        </button>
      </div>
    </div>
  );
}
