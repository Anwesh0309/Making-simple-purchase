export const BADGES = {
  FIRST_CORRECT:    { id: 'first_correct',   label: 'First Purchase!',  emoji: '🛒', desc: 'Got your first answer right!' },
  STREAK_3:         { id: 'streak_3',         label: 'Hot Streak!',      emoji: '🔥', desc: '3 correct in a row!' },
  STREAK_10:        { id: 'streak_10',        label: 'Money Master!',    emoji: '👑', desc: '10 correct in a row!' },
  XP_50:            { id: 'xp_50',            label: 'XP Collector!',    emoji: '💰', desc: 'Earned 500 XP!' },
  XP_100:           { id: 'xp_100',           label: 'XP Champion!',     emoji: '🏆', desc: 'Earned 1000 XP!' },
  ALL_STATIONS:     { id: 'all_stations',     label: 'Shop Explorer!',   emoji: '🗺️', desc: 'Completed all 6 stations!' },
  PERFECT_PRACTICE: { id: 'perfect_practice', label: 'Perfect Shopper!', emoji: '⭐', desc: '100% in practice!' },
  COIN_EXPERT:      { id: 'coin_expert',      label: 'Coin Expert!',     emoji: '🪙', desc: 'Mastered coin recognition!' },
};

export function calculateStars(correctCount, totalCount = 100) {
  const pct = (correctCount / Math.max(totalCount, 1)) * 100;
  if (pct >= 95) return 3;
  if (pct >= 80) return 2;
  if (pct >= 60) return 1;
  return 0;
}

export function checkNewBadges(state, newAnswer) {
  const earned = [];
  const { answers, streak, xpEarned, badges, stationsCompleted, scores } = state;

  if (newAnswer.correct && answers.filter(a => a.correct).length === 0)
    if (!badges.find(b => b.id === 'first_correct')) earned.push(BADGES.FIRST_CORRECT);

  const newStreak = newAnswer.correct ? streak + 1 : 0;
  if (newStreak === 3  && !badges.find(b => b.id === 'streak_3'))  earned.push(BADGES.STREAK_3);
  if (newStreak === 10 && !badges.find(b => b.id === 'streak_10')) earned.push(BADGES.STREAK_10);

  const newXp = xpEarned + (newAnswer.correct ? 10 : 0);
  if (newXp >= 500  && xpEarned < 500  && !badges.find(b => b.id === 'xp_50'))  earned.push(BADGES.XP_50);
  if (newXp >= 1000 && xpEarned < 1000 && !badges.find(b => b.id === 'xp_100')) earned.push(BADGES.XP_100);

  if (stationsCompleted?.every(Boolean) && !badges.find(b => b.id === 'all_stations'))
    earned.push(BADGES.ALL_STATIONS);

  const recog = scores['recognition'];
  if (recog && recog.total >= 5 && recog.correct === recog.total && !badges.find(b => b.id === 'coin_expert'))
    earned.push(BADGES.COIN_EXPERT);

  return earned;
}

export function getSubTopicLabel(subTopic) {
  return {
    recognition:  'Coin Recognition',
    counting:     'Counting Money',
    comparing:    'Comparing Amounts',
    enoughMoney:  'Can I Buy It?',
    change:       'Making Change',
    wordProblems: 'Word Problems',
  }[subTopic] || subTopic;
}

export function getSubTopicEmoji(subTopic) {
  return {
    recognition: '🪙', counting: '🔢', comparing: '⚖️',
    enoughMoney: '🛒', change: '💵', wordProblems: '📖',
  }[subTopic] || '📚';
}

export function getScoreEmoji(correct, total) {
  const pct = total > 0 ? correct / total : 0;
  if (pct >= 0.9) return '🌟';
  if (pct >= 0.7) return '😊';
  if (pct >= 0.5) return '🙂';
  return '💪';
}
