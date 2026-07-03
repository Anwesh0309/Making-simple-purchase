// ── Audio Engine ──────────────────────────────────────────────────────────────
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
const MODEL    = 'eleven_multilingual_v2';

export const VOICE_SETTINGS = {
  celebration:   { stability:0.12, similarity_boost:0.45, style:0.75, use_speaker_boost:true },
  encouragement: { stability:0.16, similarity_boost:0.50, style:0.65, use_speaker_boost:true },
  question:      { stability:0.20, similarity_boost:0.55, style:0.55, use_speaker_boost:true },
  emphasis:      { stability:0.16, similarity_boost:0.50, style:0.60, use_speaker_boost:true },
  thinking:      { stability:0.24, similarity_boost:0.60, style:0.35, use_speaker_boost:true },
  statement:     { stability:0.20, similarity_boost:0.55, style:0.50, use_speaker_boost:true },
  instruction:   { stability:0.20, similarity_boost:0.55, style:0.50, use_speaker_boost:true },
};

export const say       = (t) => ({ text:t, style:'statement'     });
export const ask       = (t) => ({ text:t, style:'question'      });
export const cheer     = (t) => ({ text:t, style:'encouragement' });
export const emphasize = (t) => ({ text:t, style:'emphasis'      });
export const think     = (t) => ({ text:t, style:'thinking'      });
export const celebrate = (t) => ({ text:t, style:'celebration'   });
export const instruct  = (t) => ({ text:t, style:'instruction'   });

// ── State ─────────────────────────────────────────────────────────────────────
let currentAudio   = null;
let currentQueue   = null;
let audioEnabled   = true;
let urlCache       = {};
let onTextChange   = null;

// Store the last-played segment list so we can resume after unmute
let lastSegments   = [];
let lastSegmentIdx = 0;

export function setAudioEnabled(val) {
  const wasEnabled = audioEnabled;
  audioEnabled = val;

  if (!val) {
    // Muting — stop current playback immediately
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
    currentQueue = null;
    if (onTextChange) onTextChange('');
  } else if (!wasEnabled && val) {
    // Un-muting — resume from where we left off
    if (lastSegments.length > 0 && lastSegmentIdx < lastSegments.length) {
      narrate(lastSegments.slice(lastSegmentIdx), false);
    }
  }
}

export function setTextChangeCallback(cb) { onTextChange = cb; }

// ── URL resolution ─────────────────────────────────────────────────────────────
function slug(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g,'').trim().replace(/\s+/g,'_').slice(0,80);
}

async function getAudioUrl(text, style) {
  const key = `${style}::${text}`;
  if (urlCache[key]) return urlCache[key];

  const filename = `/assets/audio/audio_${slug(text)}.mp3`;
  try {
    const res = await fetch(filename, { method:'HEAD' });
    if (res.ok) { urlCache[key] = filename; return filename; }
  } catch {}

  try {
    const res = await fetch('/api/elevenlabs', {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ text, style, voiceId:VOICE_ID, model:MODEL, voiceSettings:VOICE_SETTINGS[style] }),
    });
    if (res.ok) {
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      urlCache[key] = url;
      return url;
    }
  } catch {}

  return null;
}

// ── Playback ──────────────────────────────────────────────────────────────────
function playAudio(url) {
  return new Promise((resolve) => {
    if (!audioEnabled || !url) { resolve(); return; }
    if (currentAudio) { currentAudio.pause(); currentAudio = null; }
    const a = new Audio(url);
    currentAudio = a;
    a.onended = () => { currentAudio = null; resolve(); };
    a.onerror = () => { currentAudio = null; resolve(); };
    a.play().catch(() => { currentAudio = null; resolve(); });
  });
}

export function stopNarration() {
  currentQueue = null;
  lastSegments = [];
  lastSegmentIdx = 0;
  if (currentAudio) { currentAudio.pause(); currentAudio = null; }
  if (onTextChange) onTextChange('');
}

export async function narrate(segments, interrupt = false) {
  if (!segments || segments.length === 0) return;

  // Save for resume-on-unmute
  if (interrupt || segments !== lastSegments.slice(lastSegmentIdx)) {
    lastSegments   = segments;
    lastSegmentIdx = 0;
  }

  const qSym = Symbol();
  currentQueue = qSym;
  if (interrupt && currentAudio) { currentAudio.pause(); currentAudio = null; }

  for (let i = 0; i < segments.length; i++) {
    if (currentQueue !== qSym) return;
    if (!audioEnabled) {
      // Remember where we paused
      lastSegmentIdx = i;
      if (onTextChange) onTextChange('');
      return;
    }

    const { text, style } = segments[i];
    lastSegmentIdx = i;
    if (onTextChange) onTextChange(text);

    // Preload next
    if (i + 1 < segments.length) getAudioUrl(segments[i+1].text, segments[i+1].style);

    const url = await getAudioUrl(text, style);
    if (currentQueue !== qSym) return;
    await playAudio(url);
  }

  lastSegmentIdx = segments.length; // done
  if (onTextChange && currentQueue === qSym) onTextChange('');
}
