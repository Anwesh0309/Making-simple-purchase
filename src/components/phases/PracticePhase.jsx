import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModule } from '../../context/ModuleContext.jsx';
import { useNarration } from '../../hooks/useNarration.js';
import { correctFeedback, incorrectFeedback } from '../../utils/narration.js';
import { CoinSVG, NoteSVG } from '../ui/CoinSVG.jsx';
import { BadgeToast } from '../ui/Badge.jsx';
import { formatAmount } from '../../data/coinDenominations.js';
import { getSubTopicEmoji } from '../../utils/scoring.js';

// ── Test-mode popup ────────────────────────────────────────────────────────────
function FeedbackPopup({ type, explanation, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1100);
    return () => clearTimeout(t);
  }, []);

  const isCorrect = type === 'correct';
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, y: 20 }}
      animate={{ opacity: 1, scale: 1,   y: 0  }}
      exit={{   opacity: 0, scale: 0.8,  y: -20 }}
      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
      style={{
        position: 'fixed', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 999,
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}>
      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 420, damping: 20 }}
        style={{
          background: isCorrect
            ? 'linear-gradient(135deg, #2e7d32, #4caf50)'
            : 'linear-gradient(135deg, #c62828, #ef5350)',
          borderRadius: 24,
          padding: '32px 40px',
          textAlign: 'center',
          maxWidth: 320,
          width: '88vw',
          boxShadow: `0 24px 60px ${isCorrect ? 'rgba(76,175,80,0.45)' : 'rgba(239,83,80,0.45)'}`,
          border: `2px solid ${isCorrect ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.2)'}`,
        }}>
        {/* Icon */}
        <div style={{ fontSize: '3.5rem', marginBottom: 10, lineHeight: 1 }}>
          {isCorrect ? '🎉' : '😢'}
        </div>
        {/* Title */}
        <p style={{
          fontFamily: 'var(--font-display)', fontSize: '1.6rem',
          fontWeight: 700, color: '#fff', marginBottom: 8,
        }}>
          {isCorrect ? 'Correct! 🎉' : 'Not quite!'}
        </p>
        {/* Explanation */}
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '0.9rem',
          color: 'rgba(255,255,255,0.88)', lineHeight: 1.5,
        }}>
          {isCorrect ? 'Great job! Keep it up!' : explanation}
        </p>
      </motion.div>
    </motion.div>
  );
}

// ── Main Practice Phase ────────────────────────────────────────────────────────
export function PracticePhase() {
  const { state, dispatch } = useModule();
  const { play } = useNarration();

  const [selected,   setSelected]   = useState(null);
  const [popup,      setPopup]      = useState(null); // null | 'correct' | 'wrong'
  const [toastBadge, setToastBadge] = useState(null);
  const lockedRef = useRef(false); // prevent double-tap

  // Bootstrap questions
  useEffect(() => {
    if (!state.questions?.length) dispatch({ type: 'START_PRACTICE' });
  }, []);

  const questions = state.questions || [];
  const idx    = state.currentQuestionIndex || 0;
  const q      = questions[idx];
  const totalQ = questions.length;
  const streak = state.streak ?? 0;
  const correctSoFar = state.answers?.filter(a => a.correct).length || 0;

  // ── Narrate question prompt whenever question changes ─────────────────────
  useEffect(() => {
    if (!q) return;
    // Short delay so previous popup finishes fading
    const t = setTimeout(() => {
      play([{ text: q.prompt, style: 'question' }]);
    }, 350);
    return () => clearTimeout(t);
  }, [q?.id]);

  // Badge toast
  useEffect(() => {
    const last = state.badges?.[state.badges.length - 1];
    if (last && last !== toastBadge) setToastBadge(last);
  }, [state.badges?.length]);

  if (!q || !questions.length) return (
    <div style={{
      width: '100%', height: '100%', display: 'flex',
      alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16,
    }}>
      <div style={{ fontSize: '4rem', animation: 'pulse 1s infinite' }}>🪙</div>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--gold)' }}>
        Loading questions…
      </p>
    </div>
  );

  function handleAnswer(opt) {
    if (lockedRef.current || popup) return;
    lockedRef.current = true;
    setSelected(opt);

    const isCorrect = opt === q.answer;
    dispatch({ type: 'ANSWER_QUESTION', payload: { questionId: q.id, answer: opt, subTopic: q.subTopic } });
    play(isCorrect ? correctFeedback(streak + 1) : incorrectFeedback(1));
    setPopup(isCorrect ? 'correct' : 'wrong');
  }

  function advanceQuestion() {
    setPopup(null);
    setSelected(null);
    lockedRef.current = false;
    // idx is already advanced by ANSWER_QUESTION dispatch
    const nextIdx = idx + 1; // use local +1 since state.currentQuestionIndex already updated
    if (nextIdx >= totalQ) {
      dispatch({ type: 'SET_PHASE', payload: 'reflect' });
    }
  }

  const pct = Math.round((idx / Math.max(totalQ, 1)) * 100);

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      padding: '80px 16px 16px', boxSizing: 'border-box',
      overflow: 'hidden', maxWidth: 700, margin: '0 auto',
    }}>
      <BadgeToast badge={toastBadge} onDone={() => setToastBadge(null)} />
      <AnimatePresence>{popup && (
        <FeedbackPopup
          type={popup}
          explanation={q.explanation}
          onDone={advanceQuestion}
        />
      )}</AnimatePresence>

      {/* ── HUD ────────────────────────────────────────────────────────── */}
      <div className="hud" style={{ marginBottom: 12, flexShrink: 0 }}>
        <div style={{ flex: 1, marginRight: 12 }}>
          <div className="progress-bar-label" style={{ marginBottom: 4 }}>
            <span style={{ fontFamily:'var(--font-body)', fontSize:'0.78rem', color:'var(--text-muted)', fontWeight:700 }}>
              Question {idx + 1} / {totalQ}
            </span>
            <span style={{ fontFamily:'var(--font-body)', fontSize:'0.78rem', color:'var(--text-muted)', fontWeight:700 }}>
              {pct}%
            </span>
          </div>
          <div className="progress-bar-track">
            <motion.div className="progress-bar-fill"
              animate={{ width: `${pct}%` }} transition={{ duration: 0.4 }} />
          </div>
        </div>
        {streak >= 3 && (
          <div className="hud-item" style={{ background:'rgba(255,112,67,0.18)', border:'1px solid rgba(255,112,67,0.35)', color:'var(--coral)', fontSize:'0.82rem' }}>
            🔥 {streak} streak
          </div>
        )}
        <div className="hud-item" style={{ background:'rgba(76,175,80,0.15)', border:'1px solid rgba(76,175,80,0.3)', color:'var(--green-light)', fontSize:'0.82rem' }}>
          ✓ {correctSoFar}
        </div>
        <div className="hud-item" style={{ background:'rgba(255,193,7,0.15)', border:'1px solid rgba(255,193,7,0.3)', color:'var(--gold)', fontSize:'0.82rem' }}>
          ⭐ {state.xpEarned || 0} XP
        </div>
      </div>

      {/* ── Question card ───────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div key={q.id}
          initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.28 }}
          style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            background: 'rgba(30,30,100,0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 24, padding: '16px 20px',
            overflow: 'hidden', minHeight: 0,
          }}>

          {/* Sub-topic badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 8,
            background: 'var(--coral)', color: '#fff', padding: '4px 12px',
            borderRadius: 9999, fontFamily: 'var(--font-body)', fontSize: '0.72rem',
            fontWeight: 800, letterSpacing: '0.04em', alignSelf: 'flex-start',
          }}>
            {getSubTopicEmoji(q.subTopic)} {q.subTopic.replace(/([A-Z])/g,' $1').trim()}
          </div>

          {/* Question text */}
          <p style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem,2.5vw,1.25rem)',
            fontWeight: 700, color: '#fff', lineHeight: 1.55, marginBottom: 10, flexShrink: 0,
          }}>{q.prompt}</p>

          {/* Visual */}
          {q.visual && (
            <div style={{ marginBottom: 10, flexShrink: 0 }}>
              <QuestionVisual visual={q.visual} />
            </div>
          )}

          {/* Answer options — 2-column grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 10, flex: 1, alignContent: 'center',
          }}>
            {q.options.map((opt, i) => {
              const isSelected = selected === opt;
              const isAnswer   = opt === q.answer;
              let bg     = 'rgba(255,255,255,0.06)';
              let border = 'rgba(255,255,255,0.15)';
              let color  = 'var(--text-primary)';

              if (popup && isSelected && popup === 'correct') {
                bg='rgba(76,175,80,0.25)'; border='var(--green)'; color='var(--green-light)';
              } else if (popup && isSelected && popup === 'wrong') {
                bg='rgba(239,83,80,0.25)'; border='var(--red)'; color='var(--red-light)';
              } else if (popup && isAnswer && !isSelected) {
                bg='rgba(76,175,80,0.12)'; border='rgba(76,175,80,0.4)'; color='var(--green-light)';
              } else if (popup) {
                bg='rgba(255,255,255,0.03)'; border='rgba(255,255,255,0.06)'; color='rgba(255,255,255,0.3)';
              } else if (isSelected) {
                bg='rgba(255,193,7,0.18)'; border='var(--gold)'; color='var(--gold)';
              }

              return (
                <motion.button key={opt} whileTap={!popup ? { scale: 0.96 } : {}}
                  onClick={() => handleAnswer(opt)}
                  disabled={!!popup}
                  style={{
                    padding: '12px 14px', borderRadius: 14, cursor: popup ? 'default' : 'pointer',
                    background: bg, border: `2px solid ${border}`, color,
                    fontFamily: 'var(--font-display)', fontSize: 'clamp(0.85rem,2vw,1.05rem)',
                    fontWeight: 700, textAlign: 'center', transition: 'all 0.15s ease',
                    transform: isSelected && popup === 'correct' ? 'scale(1.04)' : 'none',
                  }}>
                  <span style={{ opacity: 0.55, fontSize: '0.78rem', marginRight: 5 }}>
                    {['A','B','C','D'][i]}.
                  </span>
                  {opt}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ── Visual renderer ────────────────────────────────────────────────────────────
function QuestionVisual({ visual }) {
  if (!visual) return null;

  if (visual.type === 'coins') return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center', padding:'6px 0' }}>
      {visual.coins?.slice(0,10).map((c,i) =>
        c.denomination >= 200
          ? <NoteSVG key={i} denomination={c.denomination} size="small" showValue />
          : <CoinSVG key={i} denomination={c.denomination} size={46} showLabel />
      )}
      {visual.item && (
        <div style={{ display:'flex', alignItems:'center', gap:6,
          background:'rgba(255,193,7,0.15)', borderRadius:10, padding:'3px 10px', marginLeft:6 }}>
          <span style={{ fontSize:'1.3rem' }}>{visual.item.emoji}</span>
          <span style={{ fontFamily:'var(--font-display)', color:'var(--gold)', fontWeight:700 }}>
            {formatAmount(visual.item.price)}
          </span>
        </div>
      )}
    </div>
  );

  if (visual.type === 'comparison') return (
    <div style={{ display:'flex', gap:16, justifyContent:'center', alignItems:'center', padding:'6px 0' }}>
      {[{ label:'Piggy Bank A', amt:visual.amountA },{ label:'Piggy Bank B', amt:visual.amountB }].map((p,i)=>(
        <React.Fragment key={p.label}>
          {i>0 && <span style={{ color:'rgba(255,255,255,0.3)', fontSize:'1rem' }}>vs</span>}
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:'2rem' }}>🐷</div>
            <div style={{ color:'var(--text-muted)', fontSize:'0.7rem', fontWeight:700 }}>{p.label}</div>
            <div style={{ color:'var(--gold)', fontFamily:'var(--font-display)', fontWeight:700 }}>
              {formatAmount(p.amt)}
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );

  if (visual.type === 'item') return (
    <div style={{ display:'flex', alignItems:'center', gap:16, justifyContent:'center', padding:'6px 0' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:'2.5rem' }}>{visual.item?.emoji}</div>
        <div style={{ color:'var(--text-secondary)', fontSize:'0.78rem', fontWeight:700 }}>{visual.item?.name}</div>
        <div style={{ background:'rgba(255,193,7,0.18)', borderRadius:8, padding:'2px 10px', marginTop:3,
          color:'var(--gold)', fontFamily:'var(--font-display)', fontWeight:700 }}>
          {formatAmount(visual.item?.price)}
        </div>
      </div>
      <span style={{ color:'rgba(255,255,255,0.25)', fontSize:'1.3rem' }}>→</span>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:'2rem' }}>💳</div>
        <div style={{ color:'var(--text-secondary)', fontSize:'0.78rem', fontWeight:700 }}>Pay with</div>
        <div style={{ background:'rgba(255,193,7,0.18)', borderRadius:8, padding:'2px 10px', marginTop:3,
          color:'var(--gold)', fontFamily:'var(--font-display)', fontWeight:700 }}>
          {formatAmount(visual.paymentAmount)}
        </div>
      </div>
    </div>
  );

  if (visual.type === 'story_panel') return (
    <div style={{ display:'flex', gap:10, padding:'4px 0', alignItems:'center' }}>
      <span style={{ fontSize:'2rem' }}>{visual.item?.emoji}</span>
      {visual.item2 && <span style={{ fontSize:'2rem' }}>{visual.item2?.emoji}</span>}
    </div>
  );

  return null;
}
