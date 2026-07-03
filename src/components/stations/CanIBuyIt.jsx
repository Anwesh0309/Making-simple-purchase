import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNarration } from '../../hooks/useNarration.js';
import { station4Intro, correctFeedback, incorrectFeedback } from '../../utils/narration.js';
import { generateCoinSet, mulberry32, getDailySeed } from '../../utils/questions.js';
import { formatAmount } from '../../data/coinDenominations.js';
import { getRandomItem, roundToFiveCents } from '../../data/shopItems.js';
import { CoinSVG } from '../ui/CoinSVG.jsx';

function getScenario(round) {
  const rng = mulberry32(getDailySeed() + round * 53);
  const item = getRandomItem(rng);
  const hasEnough = rng() > 0.45;
  const diff = [0, 10, 25, 50][Math.floor(rng() * 4)];
  const walletAmount = roundToFiveCents(hasEnough ? item.price + diff : Math.max(5, item.price - diff));
  return { item, walletAmount, walletCoins: generateCoinSet(walletAmount, rng), hasEnough: walletAmount >= item.price };
}

export function CanIBuyIt({ onComplete }) {
  const { play } = useNarration();
  const [round,    setRound]    = useState(0);
  const [scenario, setScenario] = useState(() => getScenario(0));
  const [selected, setSelected] = useState(null);
  const [result,   setResult]   = useState(null);
  const [count,    setCount]    = useState(0);

  useEffect(() => { play(station4Intro()); }, []);

  const answer = (a) => {
    if (result) return;
    setSelected(a);
    const ok = (a==='yes') === scenario.hasEnough;
    setResult(ok?'correct':'wrong');
    play(ok?correctFeedback(count+1):incorrectFeedback(1));
  };

  const next = () => {
    const nx=count+1; if(nx>=4){onComplete();return;}
    setCount(nx); setRound(r=>r+1); setScenario(getScenario(round+1));
    setSelected(null); setResult(null);
  };

  const { item, walletAmount, walletCoins, hasEnough } = scenario;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10, height:'100%' }}>

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
        <span style={{ fontFamily:'var(--font-body)', fontSize:'0.82rem', color:'var(--text-muted)', fontWeight:700 }}>
          Round {count+1} of 4
        </span>
        <span style={{ fontFamily:'var(--font-display)', fontSize:'0.9rem', color:'var(--gold)', fontWeight:600 }}>
          Does Emma have enough? 🛒
        </span>
      </div>

      {/* Item + wallet */}
      <div style={{ flex:1, display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, minHeight:0 }}>
        {/* Shop item */}
        <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:18, padding:14,
          border:'2px solid rgba(255,255,255,0.1)', display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center', gap:8 }}>
          <span style={{ fontSize:'0.7rem', fontWeight:700, color:'var(--text-muted)',
            textTransform:'uppercase', letterSpacing:'0.08em' }}>🏪 Shop Item</span>
          <div style={{ fontSize:'3rem' }}>{item.emoji}</div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:'1rem', color:'var(--text-primary)', fontWeight:600, textAlign:'center' }}>
            {item.name}
          </div>
          <div style={{ background:'var(--gold)', borderRadius:10, padding:'4px 16px' }}>
            <span style={{ fontFamily:'var(--font-display)', fontSize:'1.3rem', color:'#1a1a2e', fontWeight:700 }}>
              {formatAmount(item.price)}
            </span>
          </div>
        </div>

        {/* Emma's wallet */}
        <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:18, padding:14,
          border:'2px solid rgba(255,255,255,0.1)', display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center', gap:8 }}>
          <span style={{ fontSize:'0.7rem', fontWeight:700, color:'var(--text-muted)',
            textTransform:'uppercase', letterSpacing:'0.08em' }}>👛 Emma's Wallet</span>
          <div style={{ display:'flex', flexWrap:'wrap', gap:4, justifyContent:'center' }}>
            {walletCoins.slice(0,8).map((d,i)=><CoinSVG key={i} denomination={d} size={38} showLabel />)}
          </div>
          <div style={{ background:'rgba(255,255,255,0.1)', borderRadius:10, padding:'4px 12px' }}>
            <span style={{ fontFamily:'var(--font-display)', fontSize:'1rem', color:'var(--text-primary)', fontWeight:700 }}>
              Total: {formatAmount(walletAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Yes / No buttons */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, flexShrink:0 }}>
        {[
          { val:'yes', label:'✅ Yes, enough!',    bg:'rgba(76,175,80,0.8)',  hover:'#4caf50' },
          { val:'no',  label:'❌ No, need more.',   bg:'rgba(239,83,80,0.8)',  hover:'#ef5350' },
        ].map(btn => {
          const isSelected = selected === btn.val;
          const isCorrect  = result && ((btn.val==='yes')===hasEnough);
          return (
            <motion.button key={btn.val} whileTap={{ scale:0.95 }}
              onClick={() => answer(btn.val)} disabled={!!result}
              style={{
                fontFamily:'var(--font-display)', fontSize:'1rem', fontWeight:700,
                color:'#fff', padding:'12px 8px', borderRadius:14,
                background: isSelected ? btn.bg : 'rgba(255,255,255,0.08)',
                border:`3px solid ${isSelected?(result==='correct'&&isCorrect?'var(--gold)':'var(--red)'):'rgba(255,255,255,0.2)'}`,
                cursor:result?'default':'pointer', transition:'all 0.18s',
                transform: isSelected && result==='correct'&&isCorrect ? 'scale(1.04)' : 'none',
              }}>
              {btn.label}
            </motion.button>
          );
        })}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
            style={{ borderRadius:12, padding:'10px 14px', textAlign:'center', flexShrink:0,
              fontFamily:'var(--font-display)', fontSize:'0.95rem', fontWeight:700,
              background:result==='correct'?'rgba(76,175,80,0.2)':'rgba(255,193,7,0.15)',
              color:result==='correct'?'var(--green-light)':'var(--gold)',
              border:`1px solid ${result==='correct'?'var(--green)':'var(--gold)'}` }}>
            {result==='correct'
              ? `🎉 Correct! ${formatAmount(walletAmount)} ${hasEnough?'≥':'<'} ${formatAmount(item.price)}`
              : `💡 ${formatAmount(walletAmount)} ${walletAmount>=item.price?'≥':'<'} ${formatAmount(item.price)} — ${walletAmount>=item.price?'She CAN buy it!':'She CANNOT buy it!'}`}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display:'flex', justifyContent:'flex-end', flexShrink:0 }}>
        {result && (
          <button className="btn btn-primary btn-sm" onClick={next}>
            {count>=3?'🎉 Station Complete!':'Next Round →'}
          </button>
        )}
      </div>
    </div>
  );
}
