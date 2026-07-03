import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useModule } from '../../context/ModuleContext.jsx';

export function AudioToggle() {
  const { state, dispatch } = useModule();

  return (
    <button
      className={`w-11 h-11 rounded-full flex items-center justify-center transition-all
        border-2 font-bold text-lg cursor-pointer hover:scale-110 active:scale-95
        ${state.audioEnabled
          ? 'bg-mint border-mint-dark text-white shadow-lg'
          : 'bg-white/20 border-white/30 text-white/60'}`}
      onClick={() => dispatch({ type: 'TOGGLE_AUDIO' })}
      aria-label={state.audioEnabled ? 'Mute audio' : 'Unmute audio'}
      title={state.audioEnabled ? 'Audio On' : 'Audio Off'}
    >
      {state.audioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
    </button>
  );
}
