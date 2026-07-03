import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { generateSession, getDailySeed } from '../utils/questions.js';
import { checkNewBadges, calculateStars } from '../utils/scoring.js';

const initialState = {
  phase: 'intro',
  currentStation: 0,
  stationsCompleted: [false, false, false, false, false, false],
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  streak: 0,
  lives: 3,
  scores: {
    recognition:  { correct: 0, total: 0 },
    counting:     { correct: 0, total: 0 },
    comparing:    { correct: 0, total: 0 },
    enoughMoney:  { correct: 0, total: 0 },
    change:       { correct: 0, total: 0 },
    wordProblems: { correct: 0, total: 0 },
  },
  xpEarned: 0,
  badges: [],
  stars: 0,
  audioEnabled: true,
  sessionId: Date.now().toString(),
  startTime: Date.now(),
  narrationText: '',
  showHint: false,
  wrongStreakBySubTopic: {},
};

function freshState() {
  return { ...initialState, sessionId: Date.now().toString(), startTime: Date.now() };
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PHASE':
      return { ...state, phase: action.payload, showHint: false };
    case 'SET_NARRATION_TEXT':
      return { ...state, narrationText: action.payload };
    case 'START_PRACTICE': {
      const questions = generateSession(getDailySeed());
      return { ...state, questions, currentQuestionIndex: 0, answers: [], streak: 0, lives: 3 };
    }
    case 'COMPLETE_STATION': {
      const sc = [...state.stationsCompleted];
      sc[action.payload] = true;
      return { ...state, stationsCompleted: sc, currentStation: action.payload + 1 };
    }
    case 'ANSWER_QUESTION': {
      const { questionId, answer, subTopic } = action.payload;
      const question = state.questions.find(q => q.id === questionId);
      if (!question) return state;
      const correct = answer === question.answer;
      const newAnswer = { questionId, answer, correct, attemptCount: 1 };
      const answers = [...state.answers, newAnswer];
      const streak = correct ? state.streak + 1 : 0;
      const lives  = correct ? state.lives : Math.max(0, state.lives - 1);
      const scores = { ...state.scores };
      const st = subTopic || question.subTopic;
      if (scores[st]) scores[st] = { correct: scores[st].correct + (correct ? 1 : 0), total: scores[st].total + 1 };
      const wst = { ...state.wrongStreakBySubTopic };
      if (!correct) wst[st] = (wst[st] || 0) + 1; else wst[st] = 0;
      const xpEarned = correct ? state.xpEarned + 10 : state.xpEarned;
      const newBadges = checkNewBadges({ ...state, answers, streak, xpEarned, scores }, newAnswer);
      const badges = [...state.badges, ...newBadges];
      const stars = calculateStars(answers.filter(a => a.correct).length, state.questions.length);
      return { ...state, answers, streak, lives, scores, xpEarned, badges, stars,
        wrongStreakBySubTopic: wst, showHint: !correct && (wst[st] >= 3),
        currentQuestionIndex: state.currentQuestionIndex + 1 };
    }
    case 'USE_HINT':      return { ...state, showHint: true };
    case 'EARN_BADGE':    if (state.badges.find(b => b.id === action.payload.id)) return state;
                          return { ...state, badges: [...state.badges, action.payload] };
    case 'TOGGLE_AUDIO':  return { ...state, audioEnabled: !state.audioEnabled };
    case 'RESTORE_SESSION': return { ...action.payload, narrationText: '' };
    case 'RESET_SESSION': return freshState();
    default: return state;
  }
}

const ModuleContext = createContext(null);

export function ModuleProvider({ children }) {
  // ── Always start fresh on every page load — no localStorage restore ─────
  const [state, dispatch] = useReducer(reducer, freshState());

  // Still persist for mid-session refresh resilience (but not for initial load)
  useEffect(() => {
    try { localStorage.setItem('shopmart_state', JSON.stringify(state)); } catch {}
  }, [state]);

  return (
    <ModuleContext.Provider value={{ state, dispatch }}>
      {children}
    </ModuleContext.Provider>
  );
}

export function useModule() {
  const ctx = useContext(ModuleContext);
  if (!ctx) throw new Error('useModule must be inside ModuleProvider');
  return ctx;
}
