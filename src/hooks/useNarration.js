import { useEffect, useRef, useCallback } from 'react';
import { narrate, stopNarration, setTextChangeCallback, setAudioEnabled } from '../utils/audio.js';
import { useModule } from '../context/ModuleContext.jsx';

export function useNarration() {
  const { state, dispatch } = useModule();
  const audioEnabledRef = useRef(state.audioEnabled);

  useEffect(() => {
    audioEnabledRef.current = state.audioEnabled;
    setAudioEnabled(state.audioEnabled);
  }, [state.audioEnabled]);

  useEffect(() => {
    setTextChangeCallback((text) => {
      dispatch({ type: 'SET_NARRATION_TEXT', payload: text });
    });
    return () => setTextChangeCallback(null);
  }, [dispatch]);

  const play = useCallback((segments, interrupt = true) => {
    if (!segments || segments.length === 0) return;
    narrate(segments, interrupt);
  }, []);

  const stop = useCallback(() => {
    stopNarration();
    dispatch({ type: 'SET_NARRATION_TEXT', payload: '' });
  }, [dispatch]);

  return { play, stop, narrationText: state.narrationText, audioEnabled: state.audioEnabled };
}
