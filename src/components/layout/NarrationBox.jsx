import React from 'react';
import { useModule } from '../../context/ModuleContext.jsx';

export function NarrationBox({ fallback = '' }) {
  const { state } = useModule();
  const text = state.narrationText || fallback;
  const isActive = !!state.narrationText;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 14, padding: '8px 14px',
      width: '100%', minHeight: 44,
    }} role="status" aria-live="polite">

      {/* Waveform */}
      <div style={{ display:'flex', alignItems:'flex-end', gap:3, height:22, flexShrink:0 }}>
        {[8,16,22,14,8].map((h, i) => (
          <div key={i} style={{
            width: 3, borderRadius: 2,
            background: isActive ? '#4ecdc4' : 'rgba(78,205,196,0.2)',
            height: isActive ? h : 4,
            animation: isActive ? `waveAnim 1.2s ease-in-out ${i * 0.15}s infinite` : 'none',
            transition: 'height 0.3s ease',
          }} />
        ))}
      </div>

      {/* Text */}
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.92rem', fontWeight: 700,
        color: isActive ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.28)',
        lineHeight: 1.45, flex: 1,
        fontStyle: isActive ? 'normal' : 'italic',
      }}>
        {text || 'Tap 🔊 to hear the instructions'}
      </p>
    </div>
  );
}
