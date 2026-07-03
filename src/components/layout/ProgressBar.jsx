import React from 'react';
import { useModule } from '../../context/ModuleContext.jsx';

const PHASES = [
  { id: 'intro',     label: 'Intro',    emoji: '🏠' },
  { id: 'wonder',    label: 'Wonder',   emoji: '🔮' },
  { id: 'learn',     label: 'Learn',    emoji: '📖' },
  { id: 'practice',  label: 'Practice', emoji: '🎮' },
  { id: 'reflect',   label: 'Reflect',  emoji: '📝' },
  { id: 'celebrate', label: 'Celebrate',emoji: '🎉' },
];

const PHASE_ORDER = PHASES.map(p => p.id);

export function ProgressBar() {
  const { state } = useModule();
  const currentIdx = PHASE_ORDER.indexOf(state.phase);
  const stationsCompleted = state.stationsCompleted || [];
  const completedStations = stationsCompleted.filter(Boolean).length;

  return (
    <div className="flex items-center gap-2 flex-1">
      {/* Passport stamps (stations) */}
      <div className="flex gap-1 items-center">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs transition-all
              ${i < completedStations
                ? 'bg-gold border-gold-dark text-white shadow-md'
                : 'bg-white/10 border-white/30'}`}
            title={`Station ${i + 1}`}
          >
            {i < completedStations ? '✓' : ''}
          </div>
        ))}
      </div>

      {/* Phase breadcrumb */}
      <div className="hidden md:flex items-center gap-1 ml-2">
        {PHASES.map((p, i) => (
          <React.Fragment key={p.id}>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold transition-all
              ${i === currentIdx
                ? 'bg-amber text-white shadow'
                : i < currentIdx
                  ? 'bg-gold/40 text-gold'
                  : 'bg-white/10 text-white/40'}`}>
              <span>{p.emoji}</span>
              <span className="hidden lg:inline">{p.label}</span>
            </div>
            {i < PHASES.length - 1 && <span className="text-white/30 text-xs">›</span>}
          </React.Fragment>
        ))}
      </div>

      {/* Mobile: just current phase name */}
      <div className="md:hidden ml-2 text-white font-bold text-sm">
        {PHASES[currentIdx]?.emoji} {PHASES[currentIdx]?.label}
      </div>
    </div>
  );
}
