import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNarration } from '../../hooks/useNarration.js';
import { station5Intro, correctFeedback, incorrectFeedback } from '../../utils/narration.js';
import { mulberry32, getDailySeed } from '../../utils/questions.js';
import { formatAmount } from '../../data/coinDenominations.js';
import { getRandomItem } from '../../data/shopItems.js';
import { CoinSVG, NoteSVG } from '../ui/CoinSVG.jsx';

const PAY_OPTIONS = [100, 200, 500, 1000]; // $1, $2, $5, $10

function getScenario(round) {
  const rng  = mulberry32(getDailySeed() + round * 67);
  const item = getRandomItem(rng);
  const valid = PAY_OPTIONS.filter(n => n >= item.price);
  const payWith = valid[Math.floor(rng() * valid.length)] || 1000;
  return { item, payWith, change: payWith - item.price };
}

export function PayAndChange({ onComplete }) {
  const { play } = useNarration();
  const [round,       setRound]        = useState(0);
  const [scenario,    setScenario]     = useState(() => getScenario(0));
  const [selectedNote,setSelectedNote] = useState(null);
  const [step,        setStep]         = useState('pickNote');
  const [userChange,  setUserChange]   = useState('');
  const [result,      setResult]       = useState(null);
  const [chaChingAnim,setChaChingAnim] = useState(false);
  const [count,       setCount]        = useState(0);

  useEffect(() => { play(station5Intro()); }, []);

  const pickNote = (n) => {
    if (n < scenario.item.price) {
      play([{ text:`That bill is too small! The item costs ${formatAmount(scenario.item.price)}.`, style:'thinking' }]);
      return;
    }
    setSelectedNote(n); setStep('calcChange');
    setChaChingAnim(true); setTimeout(() => setChaChingAnim(false), 900);
  };

  const checkChange = () => {
    const parsed = parseFloat(userChange);
    const ok = Math.abs(parsed - scenario.change/100) < 0.01 || parseInt(userChange,10) === scenario.change;
    setResult(ok?'correct':'wrong');
    if (ok) play(correctFeedback(count+1));
    else play([{ text:`Change = ${formatAmount(selectedNote)} − ${formatAmount(scenario.item.price)} = ${formatAmount(scenario.change)}`, style:'thinking' }]);
  };

  const next = () => {
    const nx=count+1; if(nx>=3){onComplete();return;}
    setCount(nx); setRound(r=>r+1); setScenario(getScenario(round+1));
    setSelectedNote(null); setStep('pickNote'); setUserChange(''); setResult(null);
  };

  const { item, change } = scenario;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10, height:'100%' }}>

      <div style={{ display:'flex', justifyContent:'space-between', flexShrink:0 }}>
        <span style={{ fontFamily:'var(--font-body)', fontSize:'0.82rem', color:'var(--text-muted)', fontWeight:700 }}>
          Round {count+1} of 3
        </span>
        <span style={{ fontFamily:'var(--font-display)', fontSize:'0.9rem', color:'var(--gold)', fontWeight:600 }}>
          💵 Pay &amp; Get Change
        </span>
      </div>

      {/* Item + register */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, flexShrink:0 }}>
        <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:16, padding:12,
          border:'2px solid rgba(255,255,255,0.1)', display:'flex', flexDirection:'column',
          alignItems:'center', gap:6 }}>
          <span style={{ fontSize:'0.7rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em' }}>🏪 Item</span>
          <div style={{ fontSize:'2.5rem' }}>{item.emoji}</div>
          <span style={{ fontFamily:'var(--font-display)', fontSize:'0.9rem', color:'var(--text-primary)', fontWeight:600 }}>{item.name}</span>
          <div style={{ background:'var(--gold)', borderRadius:8, padding:'3px 12px' }}>
            <span style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', color:'#1a1a2e', fontWeight:700 }}>
              {formatAmount(item.price)}
            </span>
          </div>
        </div>
        <div style={{ borderRadius:16, padding:12,
          background: chaChingAnim?'rgba(255,193,7,0.12)':'rgba(255,255,255,0.05)',
          border:`2px solid ${chaChingAnim?'var(--gold)':'rgba(255,255,255,0.1)'}`,
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6,
          transition:'all 0.3s' }}>
          <span style={{ fontSize:'0.7rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em' }}>🏧 Register</span>
          <div style={{ fontSize:'2.5rem' }}>🏧</div>
          {chaChingAnim && <span style={{ fontFamily:'var(--font-display)', fontSize:'1rem', color:'var(--gold)' }}>🎵 Cha-ching!</span>}
          {selectedNote && !chaChingAnim && (
            <span style={{ fontFamily:'var(--font-body)', fontSize:'0.8rem', color:'var(--text-muted)' }}>
              Paid: {formatAmount(selectedNote)}
            </span>
          )}
        </div>
      </div>

      {/* Step 1: pick bill */}
      {step === 'pickNote' && (
        <div style={{ flexShrink:0 }}>
          <p style={{ fontFamily:'var(--font-body)', fontSize:'0.88rem', fontWeight:700,
            color:'var(--text-secondary)', textAlign:'center', marginBottom:8 }}>
            Which bill will Emma use to pay?
          </p>
          <div style={{ display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap' }}>
            {PAY_OPTIONS.map(n => (
              <motion.button key={n} whileTap={{ scale:0.9 }}
                onClick={() => pickNote(n)}
                disabled={n < item.price}
                style={{
                  padding:6, borderRadius:12, cursor:n>=item.price?'pointer':'not-allowed',
                  border:`2px solid ${n>=item.price?'rgba(255,255,255,0.25)':'rgba(255,255,255,0.06)'}`,
                  background:'transparent', opacity:n<item.price?0.25:1,
                  transition:'all 0.15s',
                }}>
                {n >= 200
                  ? <NoteSVG denomination={n} size="small" showValue />
                  : <CoinSVG denomination={n} size={50} showLabel />
                }
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: calculate change */}
      {step === 'calcChange' && (
        <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:14, padding:12,
          border:'1px solid rgba(255,255,255,0.1)', flexShrink:0 }}>
          <p style={{ fontFamily:'var(--font-body)', fontSize:'0.88rem', fontWeight:700,
            color:'var(--text-secondary)', textAlign:'center', marginBottom:10 }}>
            Change = {formatAmount(selectedNote)} − {formatAmount(item.price)} = ?
          </p>
          <div style={{ display:'flex', gap:10, alignItems:'center', justifyContent:'center' }}>
            <input type="number" placeholder="Enter amount"
              value={userChange} onChange={e=>setUserChange(e.target.value)}
              disabled={!!result}
              style={{
                background:'rgba(255,255,255,0.08)', color:'#fff',
                fontFamily:'var(--font-display)', fontSize:'1.2rem', fontWeight:700,
                padding:'8px 14px', borderRadius:10, width:140, textAlign:'center',
                border:`2px solid ${result?'rgba(255,255,255,0.2)':'rgba(255,193,7,0.5)'}`,
                outline:'none',
              }} />
            <span style={{ fontFamily:'var(--font-body)', fontSize:'0.8rem', color:'var(--text-muted)' }}>
              (in cents or $)
            </span>
          </div>
        </div>
      )}

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
              ? `🎉 Correct! Change = ${formatAmount(change)}`
              : `💡 Change = ${formatAmount(selectedNote)} − ${formatAmount(item.price)} = ${formatAmount(change)}`}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display:'flex', gap:10, justifyContent:'flex-end', flexShrink:0 }}>
        {step==='calcChange' && !result && (
          <button className="btn btn-primary btn-sm"
            onClick={checkChange} disabled={!userChange}
            style={{ opacity:userChange?1:0.45, cursor:userChange?'pointer':'not-allowed' }}>
            ✓ Check Answer
          </button>
        )}
        {result && (
          <button className="btn btn-green btn-sm" onClick={next}>
            {count>=2?'🎉 Station Complete!':'Next Round →'}
          </button>
        )}
      </div>
    </div>
  );
}
