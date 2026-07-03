import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModule } from '../../context/ModuleContext.jsx';
import { useNarration } from '../../hooks/useNarration.js';
import { wonderNarration } from '../../utils/narration.js';

const PARTICLES = [
  { x:8,  y:15, delay:0,   dur:8,  emoji:'🪙', size:1.3 },
  { x:82, y:12, delay:1.2, dur:10, emoji:'💵', size:1.0 },
  { x:62, y:72, delay:0.5, dur:9,  emoji:'💰', size:1.5 },
  { x:20, y:78, delay:2,   dur:11, emoji:'🛒', size:1.1 },
  { x:88, y:55, delay:0.8, dur:8,  emoji:'⭐', size:0.9 },
];

const QUESTIONS = [
  { emoji:'🪙', question:'Have you ever paid for something at a shop before?',
    subtext:'Think about a time you went shopping!',
    opts:['Yes, many times!','Yes, once or twice.','Not yet, but I want to!'] },
  { emoji:'💵', question:'Do you know the names of US coins and bills?',
    subtext:'Think about the money you have seen!',
    opts:['Yes, I know all of them!','I know some of them.','Not sure yet.'] },
  { emoji:'🤔', question:"What does 'change' mean when shopping?",
    subtext:'Have you ever seen a shopkeeper give money back?',
    opts:['Money you get back!','Swapping one thing for another.','Not sure yet!'] },
  { emoji:'🧮', question:'Something costs 50¢ and you pay $1. What happens?',
    subtext:'Think carefully — what should the shopkeeper do?',
    opts:['You get 50¢ back!','You pay more.','Not sure!'] },
];

export function WonderPhase() {
  const { dispatch } = useModule();
  const { play } = useNarration();
  const [step,     setStep]     = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const q = QUESTIONS[step];

  useEffect(() => {
    const t = setTimeout(() => { setRevealed(true); play(wonderNarration().slice(step, step+1)); }, 250);
    return () => clearTimeout(t);
  }, [step]);

  const handleNext = () => {
    if (step < QUESTIONS.length - 1) { setStep(s=>s+1); setSelected(null); setRevealed(false); }
    else dispatch({ type:'SET_PHASE', payload:'story' });
  };

  return (
    /* Full-viewport, no scroll */
    <div className="wonder-phase" style={{ overflow:'hidden', paddingTop:70 }}>

      {/* Ambient particles */}
      <div className="wonder-particles">
        {PARTICLES.map((p,i) => (
          <span key={i} className="wonder-particle" style={{
            left:`${p.x}%`, top:`${p.y}%`,
            animationDelay:`${p.delay}s`, animationDuration:`${p.dur}s`,
            fontSize:`${p.size}rem`,
          }}>{p.emoji}</span>
        ))}
      </div>

      <div className="wonder-content" style={{ gap:14 }}>

        {/* Orb */}
        <div className={`wonder-qmark${revealed?' revealed':''}`}>
          <span className="wonder-qmark-icon">{q.emoji}</span>
          <div className="wonder-qmark-glow" />
        </div>

        {/* Mascot */}
        <div className={`wonder-mascot${revealed?' visible':''}`}>
          <div className="mascot thinking">🛒</div>
          <div className="speech-bubble wonder-bubble">Hmm… I wonder… 🤔</div>
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div key={step}
            className={`wonder-question-card${revealed?' visible':''}`}
            initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-16 }} transition={{ duration:0.3 }}
            style={{ width:'100%', maxWidth:520 }}>

            <div className="wonder-emoji">{q.emoji}</div>
            <h2 className="wonder-question-text">{q.question}</h2>
            <p className="wonder-subtext">{q.subtext}</p>

            <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:14 }}>
              {q.opts.map((opt,i) => (
                <motion.button key={opt}
                  initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }}
                  transition={{ delay:i*0.08 }}
                  className={`option-btn${selected===opt?' selected':''}`}
                  onClick={() => { if (!selected) setSelected(opt); }}
                  style={{ padding:'10px 14px', fontSize:'0.92rem' }}>
                  <span style={{
                    width:26, height:26, minWidth:26, borderRadius:7,
                    background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)',
                    display:'inline-flex', alignItems:'center', justifyContent:'center',
                    fontFamily:'var(--font-display)', fontSize:'0.8rem', marginRight:9, flexShrink:0,
                  }}>{['A','B','C'][i]}</span>
                  {opt}
                </motion.button>
              ))}
            </div>

            {selected && (
              <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
                style={{ marginTop:10, background:'rgba(255,193,7,0.15)',
                  border:'1px solid rgba(255,193,7,0.3)', borderRadius:10,
                  padding:'8px 14px', textAlign:'center' }}>
                <span style={{ fontFamily:'var(--font-display)', color:'var(--gold)', fontSize:'0.88rem' }}>
                  ✨ Great thinking! Let's explore more!
                </span>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Progress dots */}
        <div className="progress-dots" style={{ margin:0 }}>
          {QUESTIONS.map((_,i) => (
            <div key={i} className={`progress-dot${i===step?' active':i<step?' completed':''}`} />
          ))}
        </div>

        {/* Nav */}
        <div style={{ display:'flex', gap:10 }}>
          <button className="btn btn-outline btn-sm"
            onClick={() => dispatch({ type:'SET_PHASE', payload:'intro' })}>← Back</button>
          <motion.button
            className={`btn btn-wonder${revealed?' visible':''}`}
            style={{ opacity:selected?1:0.42, cursor:selected?'pointer':'not-allowed' }}
            onClick={handleNext} disabled={!selected}
            whileHover={selected?{ scale:1.03 }:{}} whileTap={selected?{ scale:0.97 }:{}}>
            <span className="wonder-btn-sparkle">✨</span>
            {step < QUESTIONS.length-1 ? 'Next Question' : 'See the Story!'}
            <span className="wonder-btn-sparkle">✨</span>
          </motion.button>
        </div>

      </div>
    </div>
  );
}
