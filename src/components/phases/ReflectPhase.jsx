import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useModule } from '../../context/ModuleContext.jsx';
import { useNarration } from '../../hooks/useNarration.js';
import { reflectNarration } from '../../utils/narration.js';
import { getSubTopicLabel, getSubTopicEmoji, getScoreEmoji, calculateStars } from '../../utils/scoring.js';
import { BadgeGrid } from '../ui/Badge.jsx';

const REFLECT_STEPS = [
  { title:'What did you learn today?', emoji:'🪙', correct:null,
    opts:[
      { emoji:'🪙', label:'I can name US coins and bills!' },
      { emoji:'🔢', label:'I can count coins and find the total!' },
      { emoji:'🛒', label:'I know how to check if I have enough money!' },
    ]},
  { title:'What is change?', emoji:'💵', correct:'Money you get back when you pay too much.',
    opts:[
      { emoji:'💵', label:'Money you get back when you pay too much.', correct:true },
      { emoji:'🔄', label:'Swapping one item for another.' },
      { emoji:'🎁', label:'A free gift from the shopkeeper.' },
    ]},
  { title:'You buy something for 60¢ and pay $1. How much change?', emoji:'🧮', correct:'40¢',
    opts:[
      { emoji:'🔢', label:'40¢', correct:true },
      { emoji:'🔢', label:'50¢' },
      { emoji:'🔢', label:'60¢' },
    ]},
];

export function ReflectPhase() {
  const { state, dispatch } = useModule();
  const { play } = useNarration();
  const [step, setStep]       = useState(0);
  const [selected, setSelected] = useState(null);

  useEffect(() => { play(reflectNarration()); }, []);

  const answers = state.answers || [];
  const correct = answers.filter(a => a.correct).length;
  const total   = answers.length || 1;
  const stars   = calculateStars(correct, total);
  const scores  = state.scores || {};
  const current = REFLECT_STEPS[step];

  const handlePick = (opt) => {
    if (selected) return;
    setSelected(opt);
    play([{ text:`Great! ${opt.label}`, style:'encouragement' }]);
  };

  const handleNext = () => {
    if (step < REFLECT_STEPS.length-1) { setStep(s=>s+1); setSelected(null); }
    else dispatch({ type:'SET_PHASE', payload:'celebrate' });
  };

  return (
    /* Full-viewport, no scroll */
    <div style={{
      width:'100%', height:'100%',
      display:'flex', flexDirection:'column',
      padding:'80px 16px 12px', boxSizing:'border-box',
      overflow:'hidden', maxWidth:700, margin:'0 auto',
    }}>

      {/* Header */}
      <div style={{ textAlign:'center', marginBottom:10, flexShrink:0 }}>
        <div style={{ fontFamily:'var(--font-display)', fontSize:'1.15rem', color:'var(--gold)', fontWeight:700 }}>📝 Reflect</div>
        <div style={{ fontFamily:'var(--font-body)', fontSize:'0.8rem', color:'var(--text-muted)', fontWeight:600 }}>Let's see what you've learned!</div>
      </div>

      {/* Score chips */}
      <div style={{ display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap', marginBottom:10, flexShrink:0 }}>
        {[
          { label:'Score', val:`${correct}/${total}`,     color:'var(--gold)'       },
          { label:'XP',    val:`⭐ ${state.xpEarned||0}`, color:'var(--gold)'       },
          { label:'Stars', val:'★'.repeat(stars)+'☆'.repeat(3-stars), color:'var(--gold)' },
          { label:'Badges',val:`🏅 ${state.badges?.length||0}`,color:'var(--green-light)'},
        ].map(s => (
          <div key={s.label} className="hud-item"
            style={{ flexDirection:'column', gap:1, minWidth:70, textAlign:'center', padding:'6px 12px' }}>
            <span style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', color:s.color }}>{s.val}</span>
            <span style={{ fontSize:'0.65rem', color:'var(--text-muted)', fontWeight:700, textTransform:'uppercase' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Reflect card */}
      <div className="reflect-card" style={{ flexShrink:0, padding:'16px 18px' }}>
        <div className="reflect-progress">
          {REFLECT_STEPS.map((_,i) => (
            <div key={i} className={`reflect-dot${i===step?' active':i<step?' done':''}`} />
          ))}
        </div>
        <div className="reflect-mascot-row" style={{ margin:'10px 0 12px' }}>
          <div className="mascot" style={{ width:44, height:44, fontSize:'1.3rem' }}>{current.emoji}</div>
          <div className="speech-bubble" style={{ fontSize:'0.85rem' }}>{current.title}</div>
        </div>
        <div className="reflect-options" style={{ gap:8 }}>
          {current.opts.map((opt,i) => {
            let cls = '';
            if (selected) {
              if (selected===opt) cls = current.correct?(opt.correct?'correct':'wrong'):'correct';
              else if (current.correct && opt.correct) cls = 'correct';
            }
            return (
              <motion.button key={opt.label}
                initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.07 }}
                className={`reflect-option${cls?' '+cls:''}`}
                style={{ padding:'10px 14px', fontSize:'0.88rem' }}
                onClick={() => handlePick(opt)} disabled={!!selected}>
                <span className="reflect-option-emoji">{opt.emoji}</span>
                {opt.label}
              </motion.button>
            );
          })}
        </div>
        {selected && (
          <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}
            style={{ textAlign:'center', marginTop:10 }}>
            <button className="btn btn-primary btn-sm" onClick={handleNext}>
              {step < REFLECT_STEPS.length-1 ? 'Next →' : '🎉 See My Certificate!'}
            </button>
          </motion.div>
        )}
      </div>

      {/* Per-topic scores — compact 2-col grid */}
      <div style={{ flex:1, overflow:'hidden', marginTop:10 }}>
        <p style={{ fontFamily:'var(--font-body)', fontSize:'0.66rem', fontWeight:900,
          color:'var(--text-muted)', letterSpacing:'0.1em', textTransform:'uppercase',
          textAlign:'center', marginBottom:6 }}>
          Your Performance by Topic
        </p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
          {Object.entries(scores).map(([st,{ correct:c, total:t }]) => (
            <div key={st} style={{ background:'rgba(255,255,255,0.05)',
              border:'1px solid rgba(255,255,255,0.08)', borderRadius:10,
              padding:'8px 12px', display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:'1.1rem' }}>{getSubTopicEmoji(st)}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontFamily:'var(--font-display)', fontSize:'0.78rem',
                  color:'var(--text-primary)', fontWeight:600, whiteSpace:'nowrap',
                  overflow:'hidden', textOverflow:'ellipsis' }}>{getSubTopicLabel(st)}</p>
                <p style={{ fontSize:'0.66rem', color:'var(--text-muted)' }}>{c}/{t} correct</p>
              </div>
              <span style={{ fontSize:'1rem' }}>{getScoreEmoji(c,t)}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
