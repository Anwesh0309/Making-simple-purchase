import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModule } from '../../context/ModuleContext.jsx';
import { useNarration } from '../../hooks/useNarration.js';
import { simulationCompleteNarration } from '../../utils/narration.js';
import { CoinExplorer }    from '../stations/CoinExplorer.jsx';
import { CoinCounter }     from '../stations/CoinCounter.jsx';
import { WhichIsMore }     from '../stations/WhichIsMore.jsx';
import { CanIBuyIt }       from '../stations/CanIBuyIt.jsx';
import { PayAndChange }    from '../stations/PayAndChange.jsx';
import { WordProblemShop } from '../stations/WordProblemShop.jsx';

const STATIONS = [
  { id:0, label:'Coin Explorer',  emoji:'🪙', subtitle:'Tap each coin or bill to learn its value',      Component:CoinExplorer    },
  { id:1, label:'Coin Counter',   emoji:'🔢', subtitle:'Count coins to find the total amount',           Component:CoinCounter     },
  { id:2, label:'Which is More?', emoji:'⚖️', subtitle:'Compare two amounts — pick the bigger one',     Component:WhichIsMore     },
  { id:3, label:'Can I Buy It?',  emoji:'🛒', subtitle:'Check if you have enough money to buy an item',  Component:CanIBuyIt       },
  { id:4, label:'Pay & Change',   emoji:'💵', subtitle:'Pay with a bill and calculate the change',       Component:PayAndChange    },
  { id:5, label:'Word Problems',  emoji:'📖', subtitle:'Read the story and solve the money problem',     Component:WordProblemShop },
];

const LAST_STATION = STATIONS.length - 1;

export function LearnPhase() {
  const { state, dispatch } = useModule();
  const { play } = useNarration();
  const [transitioning, setTransitioning] = useState(false);

  const idx     = Math.min(state.currentStation || 0, LAST_STATION);
  const station = STATIONS[idx];
  const { Component } = station;

  async function handleComplete() {
    dispatch({ type:'COMPLETE_STATION', payload:idx });

    if (idx >= LAST_STATION) {
      // Last station done — play congrats then go to play phase
      setTransitioning(true);
      // Small delay so the station card animates out first
      await new Promise(r => setTimeout(r, 400));
      play(simulationCompleteNarration());
      // Wait for narration (~5 seconds) then navigate
      await new Promise(r => setTimeout(r, 5200));
      dispatch({ type:'SET_PHASE', payload:'play' });
    }
  }

  // ── Transition overlay ──────────────────────────────────────────────────────
  if (transitioning) {
    return (
      <div style={{
        width:'100%', height:'100%',
        display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        padding:'20px', boxSizing:'border-box',
        gap:24,
      }}>
        <AnimatePresence>
          <motion.div
            initial={{ opacity:0, scale:0.7 }}
            animate={{ opacity:1, scale:1 }}
            transition={{ type:'spring', stiffness:200, damping:18 }}
            style={{ textAlign:'center', maxWidth:480 }}>

            {/* Trophy */}
            <motion.div
              animate={{ rotate:[0, -8, 8, -5, 5, 0], scale:[1, 1.1, 1.1, 1.05, 1] }}
              transition={{ duration:1.2, delay:0.3 }}
              style={{ fontSize:'5rem', marginBottom:16, display:'block', lineHeight:1 }}>
              🏆
            </motion.div>

            <h1 style={{
              fontFamily:'var(--font-display)',
              fontSize:'clamp(1.8rem,5vw,2.8rem)',
              color:'var(--gold)', marginBottom:8, lineHeight:1.15,
            }}>
              Congratulations!
            </h1>

            <p style={{
              fontFamily:'var(--font-body)', fontSize:'1.1rem',
              color:'var(--text-secondary)', fontWeight:700,
              lineHeight:1.6, marginBottom:16,
            }}>
              You have completed all <span style={{ color:'var(--gold)' }}>6 stations</span>!<br/>
              You are now ready for the test.
            </p>

            {/* Station completion row */}
            <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap', marginBottom:20 }}>
              {STATIONS.map(s => (
                <motion.div key={s.id}
                  initial={{ scale:0 }} animate={{ scale:1 }}
                  transition={{ delay: 0.5 + s.id * 0.08, type:'spring' }}
                  style={{
                    display:'flex', alignItems:'center', gap:5,
                    background:'rgba(76,175,80,0.2)',
                    border:'2px solid var(--green)',
                    borderRadius:9999, padding:'5px 12px',
                    fontFamily:'var(--font-body)', fontSize:'0.78rem',
                    fontWeight:700, color:'var(--green-light)',
                  }}>
                  {s.emoji} {s.label} ✓
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.5 }}
              style={{
                fontFamily:'var(--font-display)', fontSize:'1.3rem',
                color:'var(--gold)', fontWeight:700,
              }}>
              🎯 All the best! Let's go! 🚀
            </motion.p>

            {/* Loading indicator */}
            <motion.div
              initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:2 }}
              style={{ marginTop:20, display:'flex', alignItems:'center', gap:10, justifyContent:'center' }}>
              <div style={{
                width:180, height:6,
                background:'rgba(255,255,255,0.1)',
                borderRadius:9999, overflow:'hidden',
              }}>
                <motion.div
                  initial={{ width:0 }} animate={{ width:'100%' }}
                  transition={{ duration:3, delay:2.2, ease:'linear' }}
                  style={{ height:'100%', background:'linear-gradient(90deg,var(--gold),var(--green))', borderRadius:9999 }}
                />
              </div>
              <span style={{ fontFamily:'var(--font-body)', fontSize:'0.8rem', color:'var(--text-muted)', fontWeight:700 }}>
                Starting test…
              </span>
            </motion.div>

          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div style={{
      width:'100%', height:'100%',
      display:'flex', flexDirection:'column',
      padding:'80px 16px 16px',
      boxSizing:'border-box',
      overflow:'hidden',
      maxWidth:860, margin:'0 auto',
    }}>

      {/* ── Station tab pills ──────────────────────────────────────────────── */}
      <div style={{ display:'flex', gap:6, justifyContent:'center', flexWrap:'wrap', marginBottom:10, flexShrink:0 }}>
        {STATIONS.map(s => {
          const isActive    = s.id === idx;
          const isCompleted = state.stationsCompleted[s.id];
          return (
            <div key={s.id} style={{
              display:'flex', alignItems:'center', gap:4,
              padding:'5px 12px', borderRadius:9999,
              fontFamily:'var(--font-body)', fontSize:'0.72rem', fontWeight:700,
              transition:'all 0.2s',
              background: isActive ? 'var(--gold)' : isCompleted ? 'var(--green)' : 'rgba(255,255,255,0.07)',
              color:       isActive ? '#1a1a2e'    : isCompleted ? '#fff'         : 'rgba(255,255,255,0.35)',
              border:'1px solid',
              borderColor: isActive ? 'var(--gold)' : isCompleted ? 'var(--green)' : 'rgba(255,255,255,0.12)',
              cursor:'default',
            }}>
              {s.emoji} {s.label} {isCompleted ? '✓' : ''}
            </div>
          );
        })}
      </div>

      {/* ── Station card ───────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div key={idx}
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          exit={{ opacity:0, y:-16 }} transition={{ duration:0.3 }}
          style={{
            flex:1, display:'flex', flexDirection:'column',
            background:'rgba(30,30,100,0.65)',
            backdropFilter:'blur(20px)',
            border:'1px solid rgba(255,255,255,0.1)',
            borderRadius:24, padding:'16px 20px',
            overflow:'hidden', minHeight:0,
          }}>

          {/* Header */}
          <div style={{ marginBottom:10, flexShrink:0 }}>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.3rem', fontWeight:600, color:'var(--gold)', marginBottom:2 }}>
              {station.emoji} {station.label}
            </h2>
            <p style={{ fontFamily:'var(--font-body)', fontSize:'0.82rem', color:'var(--text-muted)', fontWeight:600 }}>
              {station.subtitle}
            </p>
          </div>

          <div style={{ height:1, background:'rgba(255,255,255,0.08)', marginBottom:12, flexShrink:0 }} />

          <div style={{ flex:1, overflow:'auto', minHeight:0 }} className="no-scrollbar">
            <Component onComplete={handleComplete} />
          </div>

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
