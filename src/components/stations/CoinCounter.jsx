import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNarration } from '../../hooks/useNarration.js';
import { station2Intro, correctFeedback, incorrectFeedback } from '../../utils/narration.js';
import { generateCoinSet, mulberry32, getDailySeed } from '../../utils/questions.js';
import { formatAmount } from '../../data/coinDenominations.js';
import { CoinSVG } from '../ui/CoinSVG.jsx';

const TARGETS = [10, 25, 30, 35, 50, 60, 75, 85, 100, 125, 150];
function getTarget(a) { const r=mulberry32(getDailySeed()+a*77); return TARGETS[Math.floor(r()*TARGETS.length)]; }

export function CoinCounter({ onComplete }) {
  const { play }  = useNarration();
  const [attempt, setAttempt] = useState(0);
  const [target,  setTarget]  = useState(() => getTarget(0));
  const [coins,   setCoins]   = useState(() => generateCoinSet(getTarget(0), mulberry32(getDailySeed())));
  const [tray,    setTray]    = useState([]);
  const [running, setRunning] = useState(0);
  const [result,  setResult]  = useState(null);

  useEffect(() => { play(station2Intro()); }, []);

  const addCoin  = (d) => { if (result==='correct') return; setTray(p=>[...p,d]); setRunning(p=>p+d); setResult(null); };
  const removeCoin=(i) => { if (result==='correct') return; setTray(p=>{ const n=[...p]; const d=n.splice(i,1)[0]; setRunning(r=>Math.max(0,r-d)); return n; }); setResult(null); };

  const check = () => {
    if (running === target) { setResult('correct'); play(correctFeedback(attempt+1)); }
    else { setResult('wrong'); play(incorrectFeedback(1)); }
  };

  const next = () => {
    const nx = attempt+1; if (nx>=3){onComplete();return;}
    const rng=mulberry32(getDailySeed()+nx*77); const t=getTarget(nx);
    setAttempt(nx); setTarget(t); setCoins(generateCoinSet(t,rng));
    setTray([]); setRunning(0); setResult(null);
  };

  const statusColor = running===target?'var(--green)':running>target?'var(--red)':'rgba(255,255,255,0.7)';

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10, height:'100%' }}>

      {/* Round + target */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
        <span style={{ fontFamily:'var(--font-body)', fontSize:'0.82rem', color:'var(--text-muted)', fontWeight:700 }}>
          Round {attempt+1} of 3
        </span>
        <div style={{ background:'rgba(255,193,7,0.15)', border:'2px solid rgba(255,193,7,0.4)',
          borderRadius:12, padding:'4px 14px' }}>
          <span style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', color:'var(--gold)', fontWeight:700 }}>
            Target: {formatAmount(target)}
          </span>
        </div>
      </div>

      {/* Coin bank */}
      <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:14, padding:10,
        border:'1px solid rgba(255,255,255,0.09)', flexShrink:0 }}>
        <p style={{ fontFamily:'var(--font-body)', fontSize:'0.7rem', fontWeight:700,
          color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>
          🪙 Coin Bank — tap to add
        </p>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center' }}>
          {coins.map((d,i) => (
            <motion.div key={i} whileTap={{ scale:0.82 }} style={{ cursor:'pointer' }}>
              <CoinSVG denomination={d} size={46} showLabel onClick={()=>addCoin(d)} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tray */}
      <div style={{ flex:1, minHeight:0, background:'rgba(255,255,255,0.03)',
        borderRadius:14, padding:10, border:'2px dashed rgba(255,255,255,0.15)',
        display:'flex', flexDirection:'column' }}>
        <p style={{ fontFamily:'var(--font-body)', fontSize:'0.7rem', fontWeight:700,
          color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6, flexShrink:0 }}>
          🧺 Counting Tray — tap to remove
        </p>
        <div style={{ flex:1, display:'flex', flexWrap:'wrap', gap:6, justifyContent:'center',
          alignItems:'center', overflow:'hidden' }}>
          {tray.length===0
            ? <span style={{ color:'rgba(255,255,255,0.2)', fontSize:'0.85rem', fontStyle:'italic' }}>Tap coins above to add them here</span>
            : tray.map((d,i)=>(
              <motion.div key={i} initial={{scale:0}} animate={{scale:1}} whileTap={{scale:0.8}} style={{cursor:'pointer'}}>
                <CoinSVG denomination={d} size={42} showLabel onClick={()=>removeCoin(i)} />
              </motion.div>
            ))
          }
        </div>
        {/* Running total */}
        <div style={{ textAlign:'center', marginTop:8, padding:'6px 0',
          borderRadius:10, background:'rgba(255,255,255,0.06)',
          fontFamily:'var(--font-display)', fontSize:'1.1rem', fontWeight:700, color:statusColor, flexShrink:0 }}>
          Total: {formatAmount(running)}{running===target?' ✓':''}
          {running>target?' (too much!)':''}
        </div>
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}}
            style={{ borderRadius:12, padding:'10px 14px', textAlign:'center',
              fontFamily:'var(--font-display)', fontSize:'1rem', fontWeight:700, flexShrink:0,
              background: result==='correct'?'rgba(76,175,80,0.2)':'rgba(239,83,80,0.2)',
              color: result==='correct'?'var(--green-light)':'var(--red-light)',
              border: `1px solid ${result==='correct'?'var(--green)':'var(--red)'}` }}>
            {result==='correct'?`🎉 Correct! ${formatAmount(running)} = ${formatAmount(target)}`
              :`❌ Not quite! You have ${formatAmount(running)} but need ${formatAmount(target)}.`}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div style={{ display:'flex', gap:10, justifyContent:'flex-end', flexShrink:0 }}>
        {result !== 'correct' ? (<>
          <button className="btn btn-outline btn-sm"
            onClick={()=>{setTray([]);setRunning(0);setResult(null);}}>🔄 Reset</button>
          <button className="btn btn-primary btn-sm"
            onClick={check} disabled={tray.length===0}
            style={{ opacity:tray.length===0?0.45:1, cursor:tray.length===0?'not-allowed':'pointer' }}>
            ✓ Check Answer
          </button>
        </>) : (
          <button className="btn btn-green btn-sm" onClick={next}>
            {attempt>=2?'🎉 Station Complete!':'Next Round →'}
          </button>
        )}
      </div>
    </div>
  );
}
