import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function BadgeToast({ badge, onDone }) {
  return (
    <AnimatePresence>
      {badge && (
        <motion.div
          key={badge.id}
          initial={{ scale:0, y:-60, opacity:0 }}
          animate={{ scale:1, y:0, opacity:1 }}
          exit={{ scale:0, y:-60, opacity:0 }}
          transition={{ type:'spring', stiffness:400, damping:20 }}
          onAnimationComplete={() => setTimeout(onDone, 2200)}
          className="xp-popup"
          style={{ display:'flex', alignItems:'center', gap:12, top:90, left:'50%', transform:'translateX(-50%)', animation:'none', borderRadius:20, padding:'14px 24px' }}
        >
          <span style={{ fontSize:'2.2rem', animation:'bounceIn 0.4s ease' }}>{badge.emoji}</span>
          <div>
            <p style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', fontWeight:700, color:'#1a1a2e' }}>
              {badge.label}
            </p>
            <p style={{ fontSize:'0.8rem', color:'rgba(26,26,46,0.7)', fontWeight:600 }}>{badge.desc}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function BadgeGrid({ badges }) {
  if (!badges?.length) return (
    <p style={{ textAlign:'center', color:'var(--text-muted)', fontFamily:'var(--font-body)', fontSize:'0.9rem', padding:'16px 0' }}>
      Complete activities to earn badges! 🏅
    </p>
  );
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:10, justifyContent:'center' }}>
      {badges.map(b => (
        <div key={b.id} style={{
          display:'flex', flexDirection:'column', alignItems:'center', gap:4,
          background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)',
          borderRadius:14, padding:'10px 14px', minWidth:72,
          animation:'bounceIn 0.4s ease',
        }}>
          <span style={{ fontSize:'1.8rem' }}>{b.emoji}</span>
          <p style={{ fontFamily:'var(--font-display)', fontSize:'0.7rem', color:'var(--text-secondary)', textAlign:'center', lineHeight:1.3 }}>
            {b.label}
          </p>
        </div>
      ))}
    </div>
  );
}
