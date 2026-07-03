import { say, ask, cheer, think, celebrate, instruct } from './audio.js';

// ── Intro ─────────────────────────────────────────────────────────────────────
export function introNarration() {
  return [
    say("Welcome to ShopSmart! A brand new shop has just opened."),
    say("It has snacks, stationery, and fun toys — all with price tags."),
    ask("Do you know how to pay for things at a shop?"),
    instruct("Let us go on a shopping adventure and learn about money!"),
  ];
}

// ── Wonder ────────────────────────────────────────────────────────────────────
export function wonderNarration() {
  return [
    ask("Have you ever paid for something at a shop before?"),
    ask("Do you know the names of the US coins and bills we use?"),
    ask("What does the word change mean when you go shopping?"),
    say("Let us find out together!"),
  ];
}

// ── Story ─────────────────────────────────────────────────────────────────────
export function storyNarration(slideIdx) {
  const scripts = [
    [say("Sam just opened his shop. Everything has a price tag on it!"),
     instruct("Look carefully at the prices as you shop.")],
    [say("Emma wants to buy a chocolate bar that costs 80 cents."),
     ask("Does she have enough coins in her purse?")],
    [say("Emma has one dollar. She gives it to the shopkeeper Sam."),
     say("She paid more than the price of 80 cents.")],
    [say("Sam gives Emma 20 cents back. That is her change!"),
     instruct("Change equals the amount you paid minus the price.")],
  ];
  return scripts[Math.min(slideIdx, scripts.length - 1)];
}

// ── Station intros ────────────────────────────────────────────────────────────
export function station1Intro() {
  return [
    instruct("Let us learn about US coins and bills!"),
    instruct("Tap each coin or bill to hear its name and value."),
  ];
}
export function station2Intro() {
  return [
    instruct("Now let us practise counting coins!"),
    say("Tap the coins to add them to the tray and count the total."),
  ];
}
export function station3Intro() {
  return [
    ask("Which piggy bank has more money?"),
    instruct("Tap the one with the bigger amount!"),
  ];
}
export function station4Intro() {
  return [
    say("Emma wants to buy something from the shop."),
    ask("Does she have enough money to buy it?"),
    instruct("Count the coins first, then tap your answer."),
  ];
}
export function station5Intro() {
  return [
    say("Time to pay at the cash register!"),
    instruct("Choose the right bill, then work out the change you will get."),
  ];
}
export function station6Intro() {
  return [
    say("Sam has a word problem for you to solve!"),
    instruct("Read the story carefully and choose the correct answer."),
  ];
}

// ── Feedback ──────────────────────────────────────────────────────────────────
export function correctFeedback(streak = 0) {
  if (streak >= 10) return [celebrate("Money Master! Ten correct in a row! Amazing work!")];
  if (streak >= 3)  return [cheer("Hot streak! You are on fire! Keep going!")];
  const p = [
    cheer("That is right! Well done!"),
    cheer("Excellent! You are a money expert!"),
    cheer("Perfect! Great counting skills!"),
    cheer("Brilliant! You got it right!"),
    cheer("Spot on! You really know your money!"),
  ];
  return [p[Math.floor(Math.random() * p.length)]];
}

export function incorrectFeedback(attempt = 1) {
  if (attempt === 1) return [think("Hmm, not quite. Let us try again!")];
  return [think("Here is a hint to help you. You can do it!")];
}

export function hintNarration(text) { return [think(text)]; }

export function milestoneNarration(badge) {
  return [celebrate(`Amazing! You earned the ${badge} badge! Keep it up!`)];
}

export function stationCompleteNarration(name) {
  return [cheer(`You completed the ${name} station!`),
          say("Emma is one step closer to becoming a great shopper!")];
}

// ── Simulation complete → Play transition ────────────────────────────────────
export function simulationCompleteNarration() {
  return [
    celebrate("Congratulations! You have completed all six stations!"),
    cheer("You are now ready for the test. All the best!"),
    instruct("Get ready — 100 questions are coming your way. Let us go!"),
  ];
}

// ── Reflect & Celebrate ───────────────────────────────────────────────────────
export function reflectNarration() {
  return [
    say("You have learned so much about money today!"),
    ask("What was your favourite part of the lesson?"),
    instruct("Tap a thought bubble to share what you learned!"),
  ];
}

export function celebrateNarration(stars) {
  if (stars === 3) return [
    celebrate("Three stars! You are a true Money Master!"),
    celebrate("Sam and Emma are so proud of you!"),
  ];
  if (stars === 2) return [
    cheer("Two stars! Fantastic work today!"),
    say("Keep practising and you will reach three stars next time!"),
  ];
  return [
    cheer("One star — you completed the module! Well done!"),
    say("Try again to improve your score!"),
  ];
}
