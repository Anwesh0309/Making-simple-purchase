import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNarration } from '../../hooks/useNarration.js';
import { station6Intro, correctFeedback, incorrectFeedback } from '../../utils/narration.js';
import { mulberry32, getDailySeed } from '../../utils/questions.js';
import { formatAmount } from '../../data/coinDenominations.js';
import { getRandomItem } from '../../data/shopItems.js';

const TEMPLATES = [
  (item, paid) => ({
    story: `Emma buys a ${item.name} for ${formatAmount(item.price)}. She pays with ${formatAmount(paid)}. How much change does she get?`,
    answer: paid - item.price,
    equation: `${formatAmount(paid)} − ${formatAmount(item.price)} = ?`,
  }),
  (item, paid) => ({
    story: `Sam wants to buy a ${item.name} that costs ${formatAmount(item.price)}. He pays with ${formatAmount(paid)}. How much money will he have left?`,
    answer: paid - item.price,
    equation: `${formatAmount(paid)} − ${formatAmount(item.price)} = ?`,
  }),
];

function getScenario(round) {
  const rng   = mulberry32(getDailySeed() + round * 89);
  const item  = getRandomItem(rng);
  const notes = [100, 200, 500, 1000].filter(n => n > item.price);
  const paid  = notes[Math.floor(rng() * notes.length)] || 1000;
  const tmpl  = TEMPLATES[Math.floor(rng() * TEMPLATES.length)](item, paid);
  const correct = formatAmount(tmpl.answer);
  const rng2  = mulberry32(getDailySeed() + round * 89 + 1);
  const wrong = [
    formatAmount(Math.max(5, tmpl.answer - 10)),
    formatAmount(tmpl.answer + 10),
    formatAmount(Math.max(5, tmpl.answer - 25)),
  ].filter(w => w !== correct);
  const opts  = [correct, ...wrong.slice(0,3)].sort(() => rng2()-0.5);
  return { ...tmpl, item, paid, correct, options:opts };
}

export function WordProblemShop({ onComplete }) {
  const { play } = useNarration();
  const [round,    setRound]    = useState(0);
  const [scenario, setScenario] = useState(() => getScenario(0));
  const [selected, setSelected] = useState(null);
  const [result,   setResult]   = useState(null);
  const [count,    setCount]    = useState(0);
  const [hint,     setHint]     = useState(false);

  useEffect(() => { play(station6Intro()); }, []);

  const answer = (opt) => {
    if (result) return;
    setSelected(opt);
    const ok = opt === scenario.correct;
    setResult(ok?'correct':'wrong');
    if (ok) play(correctFeedback(count+1));
    else { play(incorrectFeedback(2)); setHint(true); }
  };

  const next = () => {
    const nx=count+1; if(nx>=2){onComplete();return;}
    setCount(nx); setRound(r=>r+1); setScenario(getScenario(round+1));
    setSelected(null); setResult(null); setHint(false);
  };

  const { story, equation, options, correct, item } = scenario;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10, height:'100%' }}>

      <div style={{ display:'flex', justifyContent:'space-between', flexShrink:0 }}>
        <span style={{ fontFamily:'var(--font-body)', fontSize:'0.82rem', color:'var(--text-muted)', fontWeight:700 }}>
          Problem {count+1} of 2
        </span>
        <span style={{ fontFamily:'var(--font-display)', fontSize:'0.9rem', color:'var(--gold)', fontWeight:600 }}>
          📖 Word Problem
        </span>
      </div>

      {/* Story panel */}
      <div style={{ background:'rgba(45,27,105,0.5)', borderRadius:18, padding:14,
        border:'2px solid rgba(255,193,7,0.25)', display:'flex', gap:12, flexShrink:0 }}>
        <div style={{ fontSize:'2.5rem', flexShrink:0 }}>{item.emoji}</div>
        <div style={{ display:'flex', alignItems:'flex-start', gap:8 }}>
          <span style={{ fontSize:'1.5rem' }}>🛒</span>
          <div style={{ background:'rgba(255,255,255,0.08)', borderRadius:14,
            borderTopLeftRadius:4, padding:'8px 12px' }}>
            <p style={{ fontFamily:'var(--font-body)', fontSize:'0.9rem', fontWeight:700,
              color:'var(--text-secondary)', lineHeight:1.55 }}>
              {story}
            </p>
          </div>
        </div>
      </div>

      {/* Hint scaffold */}
      {hint && (
        <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
          style={{ background:'rgba(255,193,7,0.1)', border:'2px solid rgba(255,193,7,0.3)',
            borderRadius:12, padding:'8px 12px', textAlign:'center', flexShrink:0 }}>
          <span style={{ fontFamily:'var(--font-display)', fontSize:'0.95rem', color:'var(--gold)', fontWeight:700 }}>
            💡 Hint: {equation}
          </span>
        </motion.div>
      )}

      {/* Options */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, flex:1, alignContent:'center' }}>
        {options.map((opt, i) => {
          const isSelected = selected === opt;
          const isCorrect  = opt === correct;
          let bg = 'rgba(255,255,255,0.07)';
          let border = 'rgba(255,255,255,0.18)';
          let color = 'var(--text-primary)';
          if (result) {
            if (isSelected && isCorrect)  { bg='rgba(76,175,80,0.22)'; border='var(--green)'; color='var(--green-light)'; }
            if (isSelected && !isCorrect) { bg='rgba(239,83,80,0.22)'; border='var(--red)'; color='var(--red-light)'; }
            if (!isSelected && isCorrect) { bg='rgba(76,175,80,0.1)'; border='rgba(76,175,80,0.4)'; color='var(--green-light)'; }
            if (!isSelected && !isCorrect){ bg='rgba(255,255,255,0.03)'; border='rgba(255,255,255,0.08)'; color='rgba(255,255,255,0.3)'; }
          }
          return (
            <motion.button key={opt} whileTap={{ scale:0.96 }}
              onClick={() => answer(opt)} disabled={!!result}
              style={{
                padding:'12px 8px', borderRadius:14, cursor:result?'default':'pointer',
                background:bg, border:`3px solid ${border}`, color,
                fontFamily:'var(--font-display)', fontSize:'1.1rem', fontWeight:700,
                transition:'all 0.18s',
                transform: isSelected&&result==='correct'?'scale(1.04)':'none',
              }}>
              {opt}
            </motion.button>
          );
        })}
      </div>

      {/* Explanation */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}
            style={{ borderRadius:12, padding:'10px 14px', textAlign:'center', flexShrink:0,
              fontFamily:'var(--font-body)', fontSize:'0.9rem', fontWeight:700,
              background:result==='correct'?'rgba(76,175,80,0.2)':'rgba(255,193,7,0.15)',
              color:result==='correct'?'var(--green-light)':'var(--gold)',
              border:`1px solid ${result==='correct'?'var(--green)':'var(--gold)'}` }}>
            {result==='correct' ? `🎉 Correct! ${equation} = ${correct}` : `💡 Answer: ${equation} = ${correct}`}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display:'flex', justifyContent:'flex-end', flexShrink:0 }}>
        {result && (
          <button className="btn btn-primary btn-sm" onClick={next}>
            {count>=1?'🎉 Station Complete!':'Next Problem →'}
          </button>
        )}
      </div>
    </div>
  );
}
