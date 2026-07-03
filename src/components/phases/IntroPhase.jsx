import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useModule } from '../../context/ModuleContext.jsx';
import { useNarration } from '../../hooks/useNarration.js';
import { introNarration } from '../../utils/narration.js';

export function IntroPhase() {
  const { dispatch } = useModule();
  const { play } = useNarration();

  useEffect(() => {
    const t = setTimeout(() => play(introNarration()), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="intro-screen">

      {/* Top badge */}
      <motion.div className="intro-badge"
        initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}>
        ✨ Grade 2 Mathematics · Making Simple Purchases
      </motion.div>

      {/* Title */}
      <motion.h1 className="intro-title"
        initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
        Money &amp; Purchases
      </motion.h1>
      <motion.p className="intro-subtitle"
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}>
        ShopSmart · US Coins, Bills &amp; Change
      </motion.p>

      {/* Mascot + speech bubble */}
      <motion.div className="mascot-container"
        initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }}
        transition={{ delay:0.4, type:'spring' }}>
        <div className="mascot">🛒</div>
        <div className="speech-bubble">
          Hi! I'm Sam. Ready to shop? 🪙
        </div>
      </motion.div>

      {/* Description */}
      <motion.p className="intro-desc"
        initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}>
        Learn to <span className="text-gold">recognise US coins and bills</span>,
        count money, make purchases, and calculate{' '}
        <span className="text-coral">change</span> — through stories and fun games!
      </motion.p>

      {/* Journey map */}
      <motion.div className="intro-journey-map"
        initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.6 }}>
        <div className="intro-journey-title">YOUR LEARNING JOURNEY</div>
        <div className="intro-journey-steps">
          {[
            { icon:'🔮', label:'Wonder',   desc:'A money mystery!' },
            { icon:'📖', label:'Story',    desc:'See money in action' },
            { icon:'🧪', label:'Simulate', desc:'6 interactive labs' },
            { icon:'🎮', label:'Play',     desc:'100 challenges' },
            { icon:'📝', label:'Reflect',  desc:'What did you learn?' },
          ].map((s, i, arr) => (
            <React.Fragment key={s.label}>
              <div className="intro-journey-step">
                <div className="intro-journey-icon">{s.icon}</div>
                <div className="intro-journey-info">
                  <div className="intro-journey-label">{s.label}</div>
                  <div className="intro-journey-desc">{s.desc}</div>
                </div>
              </div>
              {i < arr.length - 1 && <div className="intro-journey-arrow">→</div>}
            </React.Fragment>
          ))}
        </div>
      </motion.div>

      {/* CTA — Begin button */}
      <motion.button
        className="btn btn-primary btn-lg intro-start-btn"
        initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }}
        transition={{ delay:0.7, type:'spring' }}
        onClick={() => dispatch({ type:'SET_PHASE', payload:'wonder' })}
      >
        🚀 Begin Your Journey!
      </motion.button>

      {/* Feature cards — BELOW the button, matching reference screenshot */}
      <motion.div
        className="feature-cards"
        initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
        transition={{ delay:0.9 }}
        style={{ marginTop:8 }}
      >
        {[
          { icon:'🎯', label:'100 Questions',  desc:'Randomised every day'  },
          { icon:'🪙', label:'US Coins & Bills', desc:'Penny to $10 bill'   },
          { icon:'✨', label:'Badges & XP',    desc:'Earn as you learn'     },
        ].map(f => (
          <div key={f.label} className="feature-card">
            <div className="feature-card-icon">{f.icon}</div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:'0.9rem',
              color:'var(--text-primary)', fontWeight:600, marginBottom:2 }}>
              {f.label}
            </div>
            <div className="feature-card-label">{f.desc}</div>
          </div>
        ))}
      </motion.div>

    </div>
  );
}
