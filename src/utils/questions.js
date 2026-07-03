import { PRACTICE_COINS, PRACTICE_NOTES, formatAmount } from '../data/coinDenominations.js';
import { ITEM_POOL, roundToFiveCents } from '../data/shopItems.js';

// Keep legacy alias
export { PRACTICE_COINS as SG_COINS, PRACTICE_NOTES as SG_NOTES };

// ── Seeded PRNG (Mulberry32) ──────────────────────────────────────────────────
export function mulberry32(seed) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

export function getDailySeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

function shuffle(arr, rng) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickItem(rng) {
  const item = ITEM_POOL[Math.floor(rng() * ITEM_POOL.length)];
  const [min, max] = item.priceRange;
  const steps = Math.floor((max - min) / 5);
  return { ...item, price: Math.min(min + Math.floor(rng() * (steps + 1)) * 5, 995) };
}

// ── US coin set generator ─────────────────────────────────────────────────────
// Uses US denominations: penny(1), nickel(5), dime(10), quarter(25), half(50), dollar(100)
export function generateCoinSet(targetAmount, rng) {
  const coins = [];
  let remaining = targetAmount;
  // Use quarters, dimes, nickels, pennies primarily (most common in practice)
  const denoms = [100, 50, 25, 10, 5, 1];
  for (const d of denoms) {
    if (remaining <= 0) break;
    const maxCount = Math.min(Math.floor(remaining / d), 4); // cap at 4 of each
    if (maxCount === 0) continue;
    const count = Math.floor(rng() * (maxCount + 1));
    for (let i = 0; i < count; i++) coins.push(d);
    remaining -= count * d;
  }
  // Fill remainder with pennies
  while (remaining > 0 && remaining <= 99) { coins.push(1); remaining -= 1; }
  return shuffle(coins, rng);
}

function distractors(correct, rng, count = 3) {
  const offsets = [-25, -10, -5, 5, 10, 25, 15, -15, 30, -30, 20, -20];
  const set = new Set([correct]);
  const results = [];
  for (const off of shuffle(offsets, rng)) {
    const val = correct + off;
    if (val > 0 && !set.has(val)) { set.add(val); results.push(val); }
    if (results.length >= count) break;
  }
  while (results.length < count) {
    const val = correct + (results.length + 1) * 5;
    if (!set.has(val)) { set.add(val); results.push(val); }
  }
  return results;
}

// ── Question generators ───────────────────────────────────────────────────────
let qId = 0;
const nid = (t) => `${t}_${++qId}`;

function genCoinRecognition(rng) {
  const all = [...PRACTICE_COINS];
  const denom = all[Math.floor(rng() * all.length)];
  const label = formatAmount(denom);
  const wrong = shuffle(all.filter(d => d !== denom), rng).slice(0, 3).map(formatAmount);
  const options = shuffle([label, ...wrong], rng);
  const names = { 1:'Penny', 5:'Nickel', 10:'Dime', 25:'Quarter', 50:'Half Dollar', 100:'Dollar Coin' };
  return {
    id: nid('cr'), type:'coinRecognition', subTopic:'recognition', difficulty:1,
    prompt: `What is the value of this US coin?`,
    visual: { type:'coins', coins:[{ denomination:denom, quantity:1 }] },
    options, answer: label,
    hint: `Look at the number shown on the coin. ${names[denom] || ''} = ${label}`,
    explanation: `This is the ${names[denom] || label}. It is worth ${label}.`,
  };
}

function genCountCoins(rng) {
  const targets = [10, 25, 30, 35, 50, 60, 75, 85, 100, 125, 150, 175, 200, 250, 300];
  const target = targets[Math.floor(rng() * targets.length)];
  const coins  = generateCoinSet(target, rng);
  const answer = formatAmount(target);
  const wrong  = distractors(target, rng);
  const options = shuffle([answer, ...wrong.map(formatAmount)], rng);
  return {
    id: nid('cc'), type:'countCoins', subTopic:'counting', difficulty: target > 100 ? 2 : 1,
    prompt: `How much money is shown in total?`,
    visual: { type:'coins', coins: coins.map(d => ({ denomination:d, quantity:1 })) },
    options, answer,
    hint: `Start with the largest coin. Then add the smaller ones one by one.`,
    explanation: `Add the coins: the total is ${answer}.`,
  };
}

function genCompareAmounts(rng) {
  const pool = [10, 25, 30, 50, 60, 75, 100, 125, 150, 200];
  let i1 = Math.floor(rng() * pool.length);
  let i2 = Math.floor(rng() * pool.length);
  while (i2 === i1) i2 = Math.floor(rng() * pool.length);
  const amtA = pool[i1], amtB = pool[i2];
  const answer = amtA > amtB ? 'Piggy Bank A' : 'Piggy Bank B';
  return {
    id: nid('ca'), type:'compareAmounts', subTopic:'comparing', difficulty:1,
    prompt: `Which piggy bank has MORE money?`,
    visual: { type:'comparison', amountA:amtA, amountB:amtB },
    options: ['Piggy Bank A','Piggy Bank B'], answer,
    hint: `Count each piggy bank. ${formatAmount(amtA)} vs ${formatAmount(amtB)}.`,
    explanation: `${formatAmount(amtA)} vs ${formatAmount(amtB)} — ${answer} has more.`,
  };
}

function genEnoughToBuy(rng) {
  const item = pickItem(rng);
  const hasEnough = rng() > 0.4;
  const diff = [0, 5, 10, 25, 50][Math.floor(rng() * 5)];
  const wallet = hasEnough
    ? item.price + diff
    : Math.max(5, item.price - diff);
  const adj   = roundToFiveCents(wallet);
  const coins  = generateCoinSet(adj, rng);
  const answer = adj >= item.price ? 'Yes, I have enough!' : 'No, I need more money.';
  return {
    id: nid('eb'), type:'enoughToBuy', subTopic:'enoughMoney', difficulty:2,
    prompt: `Emma has ${formatAmount(adj)} in her wallet. The ${item.name} costs ${formatAmount(item.price)}. Does she have enough money?`,
    visual: { type:'coins', coins: coins.map(d => ({ denomination:d, quantity:1 })), item },
    options: ['Yes, I have enough!','No, I need more money.'], answer,
    hint: `Wallet: ${formatAmount(adj)}. Price: ${formatAmount(item.price)}. Is ${formatAmount(adj)} ≥ ${formatAmount(item.price)}?`,
    explanation: `Wallet: ${formatAmount(adj)}. Price: ${formatAmount(item.price)}. ${answer}`,
  };
}

function genCalculateChange(rng) {
  const item = pickItem(rng);
  const payOpts = [100, 200, 500, 1000].filter(n => n >= item.price);
  if (!payOpts.length) payOpts.push(1000);
  const payment = payOpts[Math.floor(rng() * payOpts.length)];
  const change  = payment - item.price;
  const answer  = formatAmount(change);
  const wrong   = distractors(change, rng);
  const options = shuffle([answer, ...wrong.map(formatAmount)], rng);
  return {
    id: nid('ch'), type:'calculateChange', subTopic:'change', difficulty:2,
    prompt: `Emma buys a ${item.name} for ${formatAmount(item.price)}. She pays with ${formatAmount(payment)}. How much change does she get?`,
    visual: { type:'item', item, paymentAmount:payment },
    options, answer,
    hint: `Change = Amount paid − Price. ${formatAmount(payment)} − ${formatAmount(item.price)} = ?`,
    explanation: `${formatAmount(payment)} − ${formatAmount(item.price)} = ${formatAmount(change)}`,
  };
}

function genWordProblem1Step(rng) {
  const item  = pickItem(rng);
  const opts  = [100, 200, 500, 1000].filter(n => n > item.price).slice(0, 2);
  const paid  = opts[Math.floor(rng() * opts.length)] || 1000;
  const change = paid - item.price;
  const templates = [
    `Emma buys a ${item.name} for ${formatAmount(item.price)}. She gives the shopkeeper ${formatAmount(paid)}. How much change does Emma get?`,
    `Sam wants to buy a ${item.name} that costs ${formatAmount(item.price)}. He has ${formatAmount(paid)}. How much money will he have left after buying it?`,
  ];
  const story = templates[Math.floor(rng() * templates.length)];
  const wrong = distractors(change, rng);
  const options = shuffle([formatAmount(change), ...wrong.map(formatAmount)], rng);
  return {
    id: nid('w1'), type:'wordProblem1Step', subTopic:'wordProblems', difficulty:2,
    prompt: story,
    visual: { type:'story_panel', storyText:story, item },
    options, answer: formatAmount(change),
    hint: `Change = Amount paid − Price. ${formatAmount(paid)} − ${formatAmount(item.price)} = ?`,
    explanation: `${formatAmount(paid)} − ${formatAmount(item.price)} = ${formatAmount(change)}`,
  };
}

function genWordProblem2Step(rng) {
  const item1 = pickItem(rng);
  let item2   = pickItem(rng);
  while (item2.id === item1.id) item2 = pickItem(rng);
  const total   = item1.price + item2.price;
  const payment = [500, 1000].find(n => n >= total) || 1000;
  const change  = payment - total;
  const wrong   = distractors(change, rng);
  const options = shuffle([formatAmount(change), ...wrong.map(formatAmount)], rng);
  const story   = `Emma buys a ${item1.name} for ${formatAmount(item1.price)} and a ${item2.name} for ${formatAmount(item2.price)}. She pays with ${formatAmount(payment)}. How much change does she get?`;
  return {
    id: nid('w2'), type:'wordProblem2Step', subTopic:'wordProblems', difficulty:3,
    prompt: story,
    visual: { type:'story_panel', storyText:story, item:item1, item2 },
    options, answer: formatAmount(change),
    hint: `Step 1: Add both prices. Step 2: Subtract from ${formatAmount(payment)}.`,
    explanation: `${formatAmount(item1.price)} + ${formatAmount(item2.price)} = ${formatAmount(total)}. Then ${formatAmount(payment)} − ${formatAmount(total)} = ${formatAmount(change)}.`,
  };
}

// ── Session generator (100 questions) ────────────────────────────────────────
const DISTRIBUTION = [
  [12, genCoinRecognition ],
  [18, genCountCoins      ],
  [10, genCompareAmounts  ],
  [18, genEnoughToBuy     ],
  [22, genCalculateChange ],
  [12, genWordProblem1Step],
  [8,  genWordProblem2Step],
];

export function generateSession(seed) {
  qId = 0;
  const rng = mulberry32(seed || getDailySeed());
  const questions = [];
  for (const [count, gen] of DISTRIBUTION) {
    for (let i = 0; i < count; i++) questions.push(gen(rng));
  }
  return shuffle(questions, rng);
}
