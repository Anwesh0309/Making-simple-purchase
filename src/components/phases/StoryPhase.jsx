import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModule }  from '../../context/ModuleContext.jsx';
import { useNarration } from '../../hooks/useNarration.js';
import { storyNarration } from '../../utils/narration.js';

const SLIDES = [
  {
    image:       "/images/story_slide1.png",
    title:       "Sam's Shop is Open!",
    text:        "Sam has just opened his shop. He has cookies, pencils, stickers, juice boxes and many more things for sale. Every item has a price tag!",
    highlight:   '"Every item in the shop has a price!"',
    mascotText:  "Welcome to Sam's Shop! Let's learn about money! 🛒",
  },
  {
    image:       "/images/story_slide2.png",
    title:       "Emma Wants to Buy Something",
    text:        "Emma wants to buy a chocolate bar for 80¢. She opens her purse and finds some coins. Does she have enough money to buy it?",
    highlight:   '"Count your coins before you buy!"',
    mascotText:  "Always count your money first! 🪙",
  },
  {
    image:       "/images/story_slide3.png",
    title:       "Paying at the Shop",
    text:        "Emma has a $1 bill. The chocolate bar costs only 80¢. She gives her dollar to Sam at the register. Sam opens the cash drawer.",
    highlight:   '"Emma paid more than the price!"',
    mascotText:  "Emma paid $1.00 for an 80¢ item. What happens next? 🤔",
  },
  {
    image:       "/images/story_slide4.png",
    title:       "Getting Change Back",
    text:        "Sam gives Emma 20¢ back. This is called CHANGE — the money you receive when you pay more than the price of an item.",
    highlight:   '"Change = $1.00 − 80¢ = 20¢"',
    mascotText:  "Now it's YOUR turn to be a smart shopper! 🚀",
  },
];

export function StoryPhase() {
  const { dispatch } = useModule();
  const { play }     = useNarration();

  const [slide,  setSlide]  = useState(0);
  const [txtVis, setTxtVis] = useState(false);
  const [hlVis,  setHlVis]  = useState(false);

  const current  = SLIDES[slide];
  const progress = ((slide + 1) / SLIDES.length) * 100;

  useEffect(() => {
    setTxtVis(false); setHlVis(false);
    const t1 = setTimeout(() => setTxtVis(true), 120);
    const t2 = setTimeout(() => setHlVis(true),  750);
    play(storyNarration(slide));
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [slide]);

  const next = () => slide < SLIDES.length - 1 ? setSlide(s => s + 1) : dispatch({ type:'SET_PHASE', payload:'simulate' });
  const prev = () => slide > 0 ? setSlide(s => s - 1) : dispatch({ type:'SET_PHASE', payload:'wonder' });

  return (
    <div style={{
      width:'100%', height:'100%',
      display:'flex', flexDirection:'column',
      justifyContent:'center',
      padding:'70px 16px 20px',
      boxSizing:'border-box',
      overflow:'hidden',
    }}>

      {/* Progress bar */}
      <div className="story-progress" style={{ marginBottom:12, flexShrink:0, width: '100%', maxWidth: 860, alignSelf: 'center' }}>
        <div className="story-progress-bar" style={{ height: 8 }}>
          <div className="story-progress-fill" style={{ width:`${progress}%` }} />
        </div>
        <span className="story-progress-label" style={{ fontSize: '0.9rem', fontWeight: 700 }}>{slide + 1} / {SLIDES.length}</span>
      </div>

      {/* Story card — two columns matching reference */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide}
          initial={{ opacity:0, scale:0.97 }}
          animate={{ opacity:1, scale:1 }}
          exit={{   opacity:0, scale:1.02 }}
          transition={{ duration:0.3 }}
          style={{
            display:'grid',
            gridTemplateColumns:'1fr 1fr',
            background:'var(--bg-card)',
            backdropFilter:'blur(20px)',
            border:'1px solid rgba(255,255,255,0.1)',
            borderRadius:24,
            padding: 20,
            gap: 20,
            boxShadow:'var(--shadow-card)',
            width: '100%',
            maxWidth: 860,
            alignSelf: 'center',
          }}
        >
          {/* LEFT: Image illustration — nested with wide landscape aspect ratio */}
          <div style={{
            position:'relative',
            borderRadius:16,
            overflow:'hidden',
            border:'2px solid rgba(255,255,255,0.15)',
            boxShadow:'0 8px 24px rgba(0,0,0,0.3)',
            aspectRatio: '4 / 3',
            width: '100%',
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            background:'#0b0b2b',
          }}>
            <img
              src={current.image}
              alt={current.title}
              style={{
                width:'100%',
                height:'100%',
                objectFit:'cover',
                display:'block',
              }}
            />
          </div>

          {/* RIGHT: Text content */}
          <div style={{
            display:'flex', flexDirection:'column',
            justifyContent:'center',
            overflow:'hidden',
            paddingRight: 10,
          }}>
            {/* Title */}
            <h2 style={{
              fontFamily:'var(--font-display)', fontSize:'clamp(1.2rem,2.8vw,1.6rem)',
              fontWeight: 800,
              color:'var(--gold)', marginBottom:12,
              opacity: txtVis ? 1 : 0,
              transform: txtVis ? 'translateY(0)' : 'translateY(10px)',
              transition:'all 0.5s ease',
            }}>{current.title}</h2>

            {/* Body text */}
            <p style={{
              fontFamily:'var(--font-body)', fontSize:'clamp(0.85rem,1.9vw,1.05rem)',
              fontWeight:700, color:'var(--text-secondary)',
              lineHeight:1.65, marginBottom:16,
              opacity: txtVis ? 1 : 0,
              transform: txtVis ? 'translateY(0)' : 'translateY(10px)',
              transition:'all 0.5s ease 0.1s',
            }}>{current.text}</p>

            {/* Highlight */}
            <div style={{
              display:'flex', alignItems:'center', justifyContent: 'center', gap:8,
              padding:'12px 16px',
              background:'rgba(255,193,7,0.1)',
              border:'2.5px solid rgba(255,193,7,0.4)',
              borderRadius:16,
              marginBottom: 16,
              opacity: hlVis ? 1 : 0,
              transform: hlVis ? 'scale(1)' : 'scale(0.9)',
              transition:'all 0.4s ease',
            }}>
              <span style={{ fontSize:'1.1rem' }}>✨</span>
              <span style={{
                fontFamily:'var(--font-display)',
                fontSize:'clamp(0.9rem,2.1vw,1.15rem)',
                fontWeight:800, color:'var(--gold)',
                textAlign: 'center',
              }}>{current.highlight}</span>
              <span style={{ fontSize:'1.1rem' }}>✨</span>
            </div>

            {/* Mascot bubble row */}
            <div style={{
              display:'flex', alignItems:'center', gap:14,
              opacity: txtVis ? 1 : 0,
              transform: txtVis ? 'translateY(0)' : 'translateY(10px)',
              transition:'all 0.5s ease 0.2s',
            }}>
              {/* Mascot badge */}
              <div style={{
                width:48, height:48, borderRadius:'50%',
                background:'linear-gradient(135deg,var(--gold),var(--gold-dark))',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'1.5rem', flexShrink:0,
                boxShadow:'0 4px 15px rgba(255,193,7,0.45)',
                border: '2px solid rgba(255,255,255,0.2)',
              }}>🦁</div>
              {/* Speech bubble */}
              <div style={{
                background:'white', color:'#222',
                padding:'10px 16px', borderRadius:16,
                fontSize:'clamp(0.78rem,1.7vw,0.88rem)', fontWeight:700,
                position:'relative',
                boxShadow:'0 4px 12px rgba(0,0,0,0.15)',
                flex: 1,
              }}>
                {current.mascotText}
                <div style={{
                  position:'absolute', left:-8, top:'50%', transform:'translateY(-50%)',
                  width:0, height:0,
                  borderTop:'6px solid transparent',
                  borderBottom:'6px solid transparent',
                  borderRight:'8px solid white',
                }}/>
              </div>
            </div>
          </div>

        </motion.div>
      </AnimatePresence>

      {/* Navigation Row */}
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        marginTop:14, flexShrink:0, width: '100%', maxWidth: 860, alignSelf: 'center',
      }}>
        <button className="btn btn-outline btn-sm" onClick={prev} style={{ borderRadius: 20 }}>
          ← Back
        </button>

        {/* Slide dots centered */}
        <div style={{ display:'flex', gap:8 }}>
          {SLIDES.map((_,i) => (
            <div key={i}
              onClick={() => setSlide(i)}
              style={{
                width:10, height:10, borderRadius:'50%', cursor:'pointer',
                background: i===slide ? 'var(--gold)' : i<slide ? 'var(--green)' : 'rgba(255,255,255,0.2)',
                boxShadow: i===slide ? '0 0 8px var(--gold)' : 'none',
                transition:'all 0.2s',
              }}
            />
          ))}
        </div>

        <button className="btn btn-primary btn-sm" onClick={next} style={{ borderRadius: 20, fontWeight: 700 }}>
          {slide === SLIDES.length - 1 ? '🧪 Start Lab!' : 'Next →'}
        </button>
      </div>

    </div>
  );
}
