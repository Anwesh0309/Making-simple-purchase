import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNarration } from '../../hooks/useNarration.js';
import { station3Intro, correctFeedback, incorrectFeedback } from '../../utils/narration.js';
import { generateCoinSet, mulberry32, getDailySeed } from '../../utils/questions.js';
import { formatAmount } from '../../data/coinDenominations.js';
import { CoinSVG } from '../ui/CoinSVG.jsx';

const PAIRS = [[25,50],[30,60],[75,100],[85,60],[150,100],[50,75],[100,125],[200,150],[250,175],[300,350]];
const getPair = (r) => { const rng=mulberry32(getDailySeed()+r*31); return PAIRS[Math.floor(rng()*PAIRS.length)]; };

export function WhichIsMore({ onComplete }) {
  const { play } = useNarration();
  const [round,    setRound]    = useState(0);
  const [selected, setSelected] = useState(null);
  const [result,   setResult]   = useState(null);
  const [done,     setDone]     = useState(0);

  const [amtA, amtB] = getPair(round);
  const coinsA = generateCoinSet(amtA, mulberry32(getDailySeed()+round*31+1));
  const coinsB = generateCoinSet(amtB, mulberry32(getDailySeed()+round*31+2));
  const correct = amtA > amtB ? 'A' : 'B';

  useEffect(() => { play(station3Intro()); }, []);

  const pick = (p) => {
    if (result) return;
    setSelected(p);
    const ok = p === correct;
    setResult(ok?'correct':'wrong');
    play(ok?correctFeedback(done+1):incorrectFeedback(1));
  };

  const next = () => {
    const nx=done+1; if(nx>=3){onComplete();return;}
    setDone(nx); setRound(r=>r+1); setSelected(null); setResult(null);
  };

  const banks = [
    { label:'A', coins:coinsA, amount:amtA },
    { label:'B', coins:coinsB, amount:amtB },
  ];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10, height:'100%' }}>

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
        <span style={{ fontFamily:'var(--font-body)', fontSize:'0.82rem', color:'var(--text-muted)', fontWeight:700 }}>
          Round {done+1} of 3
        </span>
        <span style={{ fontFamily:'var(--font-body)', fontSize:'0.82rem', color:'var(--text-muted)', fontWeight:600 }}>
          Tap the piggy bank with MORE money!
        </span>
      </div>

      {/* Two piggy banks */}
      <div style={{ flex:1, display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, minHeight:0 }}>
        {banks.map(({ label, coins, amount }) => {
          const isSelected = selected === label;
          const isCorrect  = label === correct;
          let bg = 'rgba(255,255,255,0.05)';
          let border = 'rgba(255,255,255,0.15)';
          if (result) {
            if (isSelected && isCorrect)  { bg='rgba(76,175,80,0.18)';  border='var(--green)'; }
            if (isSelected && !isCorrect) { bg='rgba(239,83,80,0.18)';  border='var(--red)'; }
            if (!isSelected && isCorrect) { bg='rgba(76,175,80,0.08)';  border='rgba(76,175,80,0.4)'; }
          }
          return (
            <motion.button key={label} whileTap={{ scale:0.95 }}
              onClick={() => pick(label)} disabled={!!result}
              style={{
                display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                gap:8, padding:12, borderRadius:20,
                background:bg, border:`3px solid ${border}`,
                cursor:result?'default':'pointer', transition:'all 0.2s',
              }}>
              <div style={{ fontSize:'2.8rem' }}>🐷</div>
              <div style={{ fontFamily:'var(--font-display)', fontSize:'0.9rem',
                color:'var(--text-secondary)', fontWeight:600 }}>
                Piggy Bank {label}
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:4, justifyContent:'center' }}>
                {coins.slice(0,5).map((d,i)=><CoinSVG key={i} denomination={d} size={32} showLabel={false}/>)}
                {coins.length>5 && <span style={{color:'rgba(255,255,255,0.5)',fontSize:'0.75rem',alignSelf:'center'}}>+{coins.length-5}</span>}
              </div>
              {result && (
                <div style={{ fontFamily:'var(--font-display)', fontSize:'1rem', fontWeight:700,
                  color: isCorrect?'var(--green-light)':'rgba(255,255,255,0.5)' }}>
                  {formatAmount(amount)}{isCorrect?' ✓ More!':''}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}}
            style={{ borderRadius:12, padding:'10px 14px', textAlign:'center', flexShrink:0,
              fontFamily:'var(--font-display)', fontSize:'1rem', fontWeight:700,
              background:result==='correct'?'rgba(76,175,80,0.2)':'rgba(239,83,80,0.2)',
              color:result==='correct'?'var(--green-light)':'var(--red-light)',
              border:`1px solid ${result==='correct'?'var(--green)':'var(--red)'}` }}>
            {result==='correct'
              ? `🎉 Correct! Piggy Bank ${correct} has ${formatAmount(correct==='A'?amtA:amtB)}!`
              : `❌ Piggy Bank ${correct} has more — ${formatAmount(correct==='A'?amtA:amtB)}`}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display:'flex', justifyContent:'flex-end', flexShrink:0 }}>
        {result && (
          <button className="btn btn-primary btn-sm" onClick={next}>
            {done>=2?'🎉 Station Complete!':'Next Round →'}
          </button>
        )}
      </div>
    </div>
  );
}
