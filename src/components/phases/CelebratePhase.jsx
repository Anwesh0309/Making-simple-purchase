import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useModule } from '../../context/ModuleContext.jsx';
import { useNarration } from '../../hooks/useNarration.js';
import { celebrateNarration } from '../../utils/narration.js';
import { Confetti, CoinRain } from '../ui/Confetti.jsx';
import { BadgeGrid } from '../ui/Badge.jsx';
import { calculateStars } from '../../utils/scoring.js';

export function CelebratePhase() {
  const { state, dispatch } = useModule();
  const { play } = useNarration();

  const answers = state.answers || [];
  const correct = answers.filter(a => a.correct).length;
  const total   = answers.length || 1;
  const stars   = calculateStars(correct, total);
  const pct     = Math.round((correct / total) * 100);

  useEffect(() => { play(celebrateNarration(stars)); }, []);

  return (
    /* Full-viewport, no scroll */
    <div style={{
      width:'100%', height:'100%',
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'space-between',
      padding:'80px 20px 16px', boxSizing:'border-box', overflow:'hidden',
      maxWidth:600, margin:'0 auto',
    }}>
      <Confetti active count={60} />
      <CoinRain active />

      {/* Trophy + title */}
      <motion.div initial={{ opacity:0, scale:0.7 }} animate={{ opacity:1, scale:1 }}
        transition={{ type:'spring', stiffness:200, damping:16 }}
        style={{ textAlign:'center' }}>
        <div style={{ fontSize:'4rem', animation:'bounceIn 0.6s ease' }}>
          {stars===3?'🏆':stars===2?'🥈':'🥉'}
        </div>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.8rem,5vw,2.8rem)',
          color:'var(--gold)', margin:'6px 0 2px', lineHeight:1.1 }}>
          {stars===3?'Money Master!':stars===2?'Great Shopper!':'Well Done!'}
        </h1>
        <p style={{ color:'var(--text-secondary)', fontWeight:600, fontSize:'0.9rem' }}>
          You scored {correct} out of {total} ({pct}%)
        </p>
        <div style={{ display:'flex', gap:10, justifyContent:'center', marginTop:8 }}>
          {[0,1,2].map(i => (
            <motion.span key={i} initial={{ scale:0, rotate:-30 }} animate={{ scale:1, rotate:0 }}
              transition={{ delay:0.4+i*0.15, type:'spring' }}
              className={`world-star${i<stars?' earned':''}`} style={{ fontSize:'2.2rem' }}>★</motion.span>
          ))}
        </div>
      </motion.div>

      {/* Certificate */}
      <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35 }}
        className="certificate-card" style={{ width:'100%', padding:'18px 20px' }}>
        <div className="cert-badge" style={{ fontSize:'2.5rem', marginBottom:6 }}>🏅</div>
        <h2 className="cert-title" style={{ fontSize:'1.3rem', marginBottom:2 }}>Certificate of Purchase Power</h2>
        <p className="cert-subtitle" style={{ fontSize:'0.75rem', marginBottom:12 }}>
          ✨ Grade 2 Mathematics · ShopSmart · Making Simple Purchases
        </p>
        <div className="cert-stats">
          <div className="cert-stat">
            <div className="cert-stat-value" style={{ color:'var(--gold)', fontSize:'1.2rem' }}>{correct}/{total}</div>
            <div className="cert-stat-label">Questions</div>
          </div>
          <div className="cert-stat">
            <div className="cert-stat-value" style={{ color:'var(--gold)', fontSize:'1.2rem' }}>⭐ {state.xpEarned||0}</div>
            <div className="cert-stat-label">XP Earned</div>
          </div>
          <div className="cert-stat">
            <div className="cert-stat-value" style={{ color:'var(--gold)', fontSize:'1.2rem' }}>
              {'★'.repeat(stars)}{'☆'.repeat(3-stars)}
            </div>
            <div className="cert-stat-label">Stars</div>
          </div>
        </div>
      </motion.div>

      {/* Characters */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.6 }}
        style={{ display:'flex', gap:20, alignItems:'flex-end', justifyContent:'center' }}>
        {[{ e:'👧', n:'Emma' },{ e:'🎉', n:'' },{ e:'👦', n:'Sam' }].map((c,i)=>(
          <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
            <div style={{ fontSize:'2.5rem', animation:`wobble ${1.2+i*0.3}s infinite` }}>{c.e}</div>
            {c.n && <div style={{ background:'rgba(255,255,255,0.12)', backdropFilter:'blur(8px)',
              borderRadius:7, padding:'1px 9px', fontSize:'0.7rem', fontWeight:700, color:'var(--text-secondary)' }}>
              {c.n}
            </div>}
          </div>
        ))}
      </motion.div>

      {/* Badges */}
      <div style={{ width:'100%' }}>
        <p style={{ fontFamily:'var(--font-body)', fontSize:'0.65rem', fontWeight:900,
          color:'var(--text-muted)', letterSpacing:'0.1em', textTransform:'uppercase',
          textAlign:'center', marginBottom:6 }}>Badges Earned</p>
        <BadgeGrid badges={state.badges} />
      </div>

      {/* Actions */}
      <div style={{ display:'flex', gap:10, flexWrap:'wrap', justifyContent:'center' }}>
        <button className="btn btn-outline btn-sm" onClick={() => window.print()}>🖨️ Print</button>
        <button className="btn btn-primary btn-sm" onClick={() => dispatch({ type:'RESET_SESSION' })}>🔄 Try Again</button>
      </div>
    </div>
  );
}
