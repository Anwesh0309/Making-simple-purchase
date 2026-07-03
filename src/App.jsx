import React, { Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { ModuleProvider, useModule } from './context/ModuleContext.jsx';
import { IntroPhase }   from './components/phases/IntroPhase.jsx';
import { WonderPhase }  from './components/phases/WonderPhase.jsx';
import { StoryPhase }   from './components/phases/StoryPhase.jsx';
import { LearnPhase }   from './components/phases/LearnPhase.jsx';
import { ReflectPhase } from './components/phases/ReflectPhase.jsx';

const PracticePhase  = lazy(() => import('./components/phases/PracticePhase.jsx').then(m => ({ default: m.PracticePhase })));
const CelebratePhase = lazy(() => import('./components/phases/CelebratePhase.jsx').then(m => ({ default: m.CelebratePhase })));

// ── Journey phases shown in header (no "intro") ───────────────────────────────
const NAV_PHASES = ['wonder', 'story', 'simulate', 'play', 'reflect'];
const ALL_PHASES = ['intro', ...NAV_PHASES];

const PHASE_META = {
  wonder:   { label:'Wonder',   emoji:'🔮' },
  story:    { label:'Story',    emoji:'📖' },
  simulate: { label:'Simulate', emoji:'🧪' },
  play:     { label:'Play',     emoji:'🎮' },
  reflect:  { label:'Reflect',  emoji:'📝' },
};

// ── Floating money symbols ────────────────────────────────────────────────────
function FloatingNumbers() {
  const symbols = ['🪙','$','¢','💰','🛒','💵','25¢','$1','$5','10¢'];
  return (
    <div className="floating-numbers" aria-hidden="true">
      {symbols.map((s,i) => (
        <span key={i} className="floating-number" style={{
          left:`${(i*10+4)%96}%`,
          animationDuration:`${16+i*2.1}s`,
          animationDelay:`${-i*1.8}s`,
          fontSize: i%3===0?'2.8rem':i%3===1?'1.6rem':'3.2rem',
        }}>{s}</span>
      ))}
    </div>
  );
}

// ── Journey bar — only rendered on non-intro phases ───────────────────────────
function JourneyBar() {
  const { state } = useModule();
  if (state.phase === 'intro') return null;

  const allIdx = ALL_PHASES.indexOf(state.phase);

  return (
    <div className="journey-bar">
      {NAV_PHASES.map((phase, i) => {
        const phaseAllIdx = ALL_PHASES.indexOf(phase);
        const isActive    = state.phase === phase;
        const isCompleted = allIdx > phaseAllIdx;
        return (
          <React.Fragment key={phase}>
            <div className={`journey-step${isActive?' active':''}${isCompleted?' completed':''}`}>
              <div className="journey-step-dot">
                {isCompleted ? '✓' : PHASE_META[phase].emoji}
              </div>
              <span className="journey-step-label">{PHASE_META[phase].label}</span>
            </div>
            {i < NAV_PHASES.length - 1 && (
              <div className={`journey-connector${isCompleted?' filled':''}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ── Audio toggle ──────────────────────────────────────────────────────────────
function AudioToggle() {
  const { state, dispatch } = useModule();
  return (
    <button
      className="audio-toggle-btn"
      onClick={() => dispatch({ type:'TOGGLE_AUDIO' })}
      aria-label={state.audioEnabled ? 'Mute audio' : 'Unmute audio'}
    >
      {state.audioEnabled ? <Volume2 size={20}/> : <VolumeX size={20}/>}
    </button>
  );
}

// ── Home button — hidden on intro ─────────────────────────────────────────────
function HomeButton() {
  const { state, dispatch } = useModule();
  if (state.phase === 'intro') return null;
  return (
    <button className="home-btn"
      onClick={() => {
        if (window.confirm('Go back to start?')) dispatch({ type:'SET_PHASE', payload:'intro' });
      }}>
      🏠 Home
    </button>
  );
}

// ── Loading ───────────────────────────────────────────────────────────────────
function Loading() {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
      flex:1, flexDirection:'column', gap:16 }}>
      <div style={{ fontSize:'4rem', animation:'pulse 1s infinite' }}>🪙</div>
      <p style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem', color:'var(--gold)' }}>
        Loading…
      </p>
    </div>
  );
}

// ── Phase transitions ─────────────────────────────────────────────────────────
const phaseVariants = {
  enter:  { opacity:0, x:60 },
  center: { opacity:1, x:0,   transition:{ duration:0.4, ease:'easeOut' } },
  exit:   { opacity:0, x:-60, transition:{ duration:0.3 } },
};

function PhaseRouter() {
  const { state } = useModule();
  const map = {
    intro:    <IntroPhase />,
    wonder:   <WonderPhase />,
    story:    <StoryPhase />,
    simulate: <LearnPhase />,
    play:     <Suspense fallback={<Loading />}><PracticePhase /></Suspense>,
    reflect:  <ReflectPhase />,
    celebrate:<Suspense fallback={<Loading />}><CelebratePhase /></Suspense>,
  };
  return (
    <AnimatePresence mode="wait">
      <motion.div key={state.phase} variants={phaseVariants}
        initial="enter" animate="center" exit="exit"
        style={{ width:'100%', flex:1, display:'flex', flexDirection:'column', alignItems:'center' }}>
        {map[state.phase] || map.intro}
      </motion.div>
    </AnimatePresence>
  );
}

// ── App shell ─────────────────────────────────────────────────────────────────
function AppShell() {
  return (
    <div className="app-container">
      <FloatingNumbers />
      <JourneyBar />
      <AudioToggle />
      <HomeButton />
      <PhaseRouter />
    </div>
  );
}

export default function App() {
  return (
    <ModuleProvider>
      <AppShell />
    </ModuleProvider>
  );
}
