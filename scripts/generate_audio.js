/**
 * generate_audio.js — generates ALL narration MP3s for every phase
 * Includes all 100 question prompts for the Play phase test mode
 * Run: node scripts/generate_audio.js
 */
import fs    from 'fs';
import path  from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VOICE_ID  = 'Xb7hH8MSUJpSbSDYk0k2';
const MODEL     = 'eleven_multilingual_v2';
const API_KEY   = 'sk_7ef27dccb32144843f8ee5068dfd4223a85326c56c14b00a';
const OUT_DIR   = path.join(__dirname, '..', 'public', 'assets', 'audio');
const MAP_FILE  = path.join(__dirname, '..', 'src', 'utils', 'audioMap.js');
const DELAY_MS  = 550;

const VS = {
  celebration:   { stability:0.12, similarity_boost:0.45, style:0.75, use_speaker_boost:true },
  encouragement: { stability:0.16, similarity_boost:0.50, style:0.65, use_speaker_boost:true },
  question:      { stability:0.20, similarity_boost:0.55, style:0.55, use_speaker_boost:true },
  thinking:      { stability:0.24, similarity_boost:0.60, style:0.35, use_speaker_boost:true },
  statement:     { stability:0.20, similarity_boost:0.55, style:0.50, use_speaker_boost:true },
  instruction:   { stability:0.20, similarity_boost:0.55, style:0.50, use_speaker_boost:true },
};

// ── Phase narrations ──────────────────────────────────────────────────────────
const PHASE_PHRASES = [
  // INTRO
  { text:"Welcome to ShopSmart! A brand new shop has just opened.",         style:'statement'   },
  { text:"It has snacks, stationery, and fun toys — all with price tags.",   style:'statement'   },
  { text:"Do you know how to pay for things at a shop?",                     style:'question'    },
  { text:"Let us go on a shopping adventure and learn about money!",         style:'instruction' },
  // WONDER
  { text:"Have you ever paid for something at a shop before?",               style:'question'    },
  { text:"Do you know the names of the US coins and bills we use?",          style:'question'    },
  { text:"What does the word change mean when you go shopping?",             style:'question'    },
  { text:"Let us find out together!",                                        style:'statement'   },
  // STORY
  { text:"Sam just opened his shop. Everything has a price tag on it!",      style:'statement'   },
  { text:"Look carefully at the prices as you shop.",                        style:'instruction' },
  { text:"Emma wants to buy a chocolate bar that costs 80 cents.",           style:'statement'   },
  { text:"Does she have enough coins in her purse?",                         style:'question'    },
  { text:"Emma has one dollar. She gives it to the shopkeeper Sam.",         style:'statement'   },
  { text:"She paid more than the price of 80 cents.",                        style:'statement'   },
  { text:"Sam gives Emma 20 cents back. That is her change!",                style:'statement'   },
  { text:"Change equals the amount you paid minus the price.",               style:'instruction' },
  // SIMULATE — station intros
  { text:"Let us learn about US coins and bills!",                           style:'instruction' },
  { text:"Tap each coin or bill to hear its name and value.",                style:'instruction' },
  { text:"Now let us practise counting coins!",                              style:'instruction' },
  { text:"Tap the coins to add them to the tray and count the total.",       style:'statement'   },
  { text:"Which piggy bank has more money?",                                 style:'question'    },
  { text:"Tap the one with the bigger amount!",                              style:'instruction' },
  { text:"Emma wants to buy something from the shop.",                       style:'statement'   },
  { text:"Does she have enough money to buy it?",                            style:'question'    },
  { text:"Count the coins first, then tap your answer.",                     style:'instruction' },
  { text:"Time to pay at the cash register!",                                style:'statement'   },
  { text:"Choose the right bill, then work out the change you will get.",    style:'instruction' },
  { text:"Sam has a word problem for you to solve!",                         style:'statement'   },
  { text:"Read the story carefully and choose the correct answer.",          style:'instruction' },
  // SIMULATION COMPLETE → PLAY transition
  { text:"Congratulations! You have completed all six stations!",            style:'celebration' },
  { text:"You are now ready for the test. All the best!",                    style:'encouragement'},
  { text:"Get ready — 100 questions are coming your way. Let us go!",        style:'instruction' },
  // FEEDBACK
  { text:"That is right! Well done!",                                        style:'encouragement' },
  { text:"Excellent! You are a money expert!",                               style:'encouragement' },
  { text:"Perfect! Great counting skills!",                                  style:'encouragement' },
  { text:"Brilliant! You got it right!",                                     style:'encouragement' },
  { text:"Spot on! You really know your money!",                             style:'encouragement' },
  { text:"Hot streak! You are on fire! Keep going!",                         style:'encouragement' },
  { text:"Money Master! Ten correct in a row! Amazing work!",                style:'celebration'   },
  { text:"Hmm, not quite. Let us try again!",                                style:'thinking'      },
  { text:"Here is a hint to help you. You can do it!",                       style:'thinking'      },
  // REFLECT
  { text:"You have learned so much about money today!",                      style:'statement'     },
  { text:"What was your favourite part of the lesson?",                      style:'question'      },
  { text:"Tap a thought bubble to share what you learned!",                  style:'instruction'   },
  { text:"Great! I can name US coins and bills!",                            style:'encouragement' },
  { text:"Great! I can count coins and find the total!",                     style:'encouragement' },
  { text:"Great! I know how to check if I have enough money!",               style:'encouragement' },
  { text:"Great! Money you get back when you pay too much.",                 style:'encouragement' },
  { text:"Great! 40 cents is the correct change!",                           style:'encouragement' },
  // CELEBRATE
  { text:"Three stars! You are a true Money Master!",                        style:'celebration'   },
  { text:"Sam and Emma are so proud of you!",                                style:'celebration'   },
  { text:"Two stars! Fantastic work today!",                                 style:'encouragement' },
  { text:"Keep practising and you will reach three stars next time!",        style:'statement'     },
  { text:"One star — you completed the module! Well done!",                  style:'encouragement' },
  { text:"Try again to improve your score!",                                 style:'statement'     },
  // MILESTONES
  { text:"Amazing! You earned the Hot Streak badge! Keep it up!",            style:'celebration'   },
  { text:"Amazing! You earned the Money Master badge! Keep it up!",          style:'celebration'   },
  { text:"Amazing! You earned the Shop Explorer badge! Keep it up!",         style:'celebration'   },
  { text:"Amazing! You earned the Coin Expert badge! Keep it up!",           style:'celebration'   },
  { text:"Emma is one step closer to becoming a great shopper!",             style:'encouragement' },
];

// ── Play phase — all 100 question prompts (seeded from getDailySeed) ──────────
// These are the exact prompts generated by the question engine
const QUESTION_PHRASES = [
  // Generic prompts (reused across many questions)
  { text:"What is the value of this US coin?",    style:'question' },
  { text:"How much money is shown in total?",     style:'question' },
  { text:"Which piggy bank has MORE money?",      style:'question' },
  // enoughToBuy — wallet vs price questions
  { text:"Emma has $3.10 in her wallet. The Bread Loaf costs $3.10. Does she have enough money?", style:'question' },
  { text:"Emma has $2.95 in her wallet. The Crayons costs $2.70. Does she have enough money?", style:'question' },
  { text:"Emma has 25¢ in her wallet. The Banana costs 25¢. Does she have enough money?", style:'question' },
  { text:"Emma has 30¢ in her wallet. The Lollipop costs 55¢. Does she have enough money?", style:'question' },
  { text:"Emma has $1.30 in her wallet. The Biscuit Pack costs $1.80. Does she have enough money?", style:'question' },
  { text:"Emma has $1.05 in her wallet. The Yo-Yo costs $1.05. Does she have enough money?", style:'question' },
  { text:"Emma has 95¢ in her wallet. The Bookmark costs 90¢. Does she have enough money?", style:'question' },
  { text:"Emma has 85¢ in her wallet. The Ruler costs $1.35. Does she have enough money?", style:'question' },
  { text:"Emma has 50¢ in her wallet. The Pencil Sharpener costs 55¢. Does she have enough money?", style:'question' },
  { text:"Emma has $1.55 in her wallet. The Tissue Pack costs $1.55. Does she have enough money?", style:'question' },
  { text:"Emma has 55¢ in her wallet. The Balloon costs 30¢. Does she have enough money?", style:'question' },
  { text:"Emma has $1.75 in her wallet. The Juice Box costs $1.25. Does she have enough money?", style:'question' },
  { text:"Emma has $1.80 in her wallet. The Sweets Bag costs $1.70. Does she have enough money?", style:'question' },
  { text:"Emma has $1.15 in her wallet. The Cookie costs 65¢. Does she have enough money?", style:'question' },
  { text:"Emma has $2.20 in her wallet. The Sandwich costs $2.20. Does she have enough money?", style:'question' },
  { text:"Emma has $2 in her wallet. The Tissue Pack costs $2. Does she have enough money?", style:'question' },
  { text:"Emma has 25¢ in her wallet. The Banana costs 50¢. Does she have enough money?", style:'question' },
  { text:"Emma has $1.40 in her wallet. The Ice Cream costs $1.35. Does she have enough money?", style:'question' },
  { text:"Emma has $1 in her wallet. The Water Bottle costs $1.25. Does she have enough money?", style:'question' },
  { text:"Emma has $1.45 in her wallet. The Water Bottle costs $1.45. Does she have enough money?", style:'question' },
  { text:"Emma has $1.30 in her wallet. The Ruler costs $1.35. Does she have enough money?", style:'question' },
  { text:"Emma has $1.85 in her wallet. The Biscuit Pack costs $1.90. Does she have enough money?", style:'question' },
  { text:"Emma has $2.40 in her wallet. The Notebook costs $2.15. Does she have enough money?", style:'question' },
  { text:"Emma has $2.90 in her wallet. The Ice Cream costs $2.40. Does she have enough money?", style:'question' },
  { text:"Emma has $1.55 in her wallet. The Water Bottle costs $1.45. Does she have enough money?", style:'question' },
  { text:"Emma has 85¢ in her wallet. The Bookmark costs 90¢. Does she have enough money?", style:'question' },
  { text:"Emma has $3.25 in her wallet. The Bread Loaf costs $3. Does she have enough money?", style:'question' },
  { text:"Emma has 50¢ in her wallet. The Banana costs 50¢. Does she have enough money?", style:'question' },
  { text:"Emma has 40¢ in her wallet. The Apple costs 40¢. Does she have enough money?", style:'question' },
  { text:"Emma has $1.50 in her wallet. The Yo-Yo costs $1.25. Does she have enough money?", style:'question' },
  { text:"Emma has 20¢ in her wallet. The Eraser costs 25¢. Does she have enough money?", style:'question' },
  { text:"Emma has $2.65 in her wallet. The Sandwich costs $2.60. Does she have enough money?", style:'question' },
  { text:"Emma has 65¢ in her wallet. The Cookie costs 65¢. Does she have enough money?", style:'question' },
  { text:"Emma has 45¢ in her wallet. The Lollipop costs 40¢. Does she have enough money?", style:'question' },
  { text:"Emma has 75¢ in her wallet. The Lollipop costs 65¢. Does she have enough money?", style:'question' },
  { text:"Emma has $2.70 in her wallet. The Ice Cream costs $2.45. Does she have enough money?", style:'question' },
];

const CHANGE_PHRASES = [
  // calculateChange & wordProblem prompts
  { text:"Emma buys a Banana for 45¢ and a Cookie for 30¢. She pays with $5. How much change does she get?", style:'question' },
  { text:"Emma buys a Chocolate Bar for $1.15. She pays with $5. How much change does she get?", style:'question' },
  { text:"Emma buys a Pencil Sharpener for 75¢. She pays with $2. How much change does she get?", style:'question' },
  { text:"Emma buys a Notebook for $2.40. She pays with $10. How much change does she get?", style:'question' },
  { text:"Emma buys a Biscuit Pack for $1.55 and a Glue Stick for $1.30. She pays with $5. How much change does she get?", style:'question' },
  { text:"Emma buys a Glue Stick for $1.10. She pays with $2. How much change does she get?", style:'question' },
  { text:"Sam wants to buy a Glue Stick that costs $1.50. He has $5. How much money will he have left after buying it?", style:'question' },
  { text:"Sam wants to buy a Notebook that costs $2.10. He has $5. How much money will he have left after buying it?", style:'question' },
  { text:"Emma buys a Biscuit Pack for $2.35. She gives the shopkeeper $10. How much change does Emma get?", style:'question' },
  { text:"Emma buys a Crayons for $2.10. She gives the shopkeeper $5. How much change does Emma get?", style:'question' },
  { text:"Emma buys a Cookie for 45¢ and a Bookmark for 95¢. She pays with $5. How much change does she get?", style:'question' },
  { text:"Emma buys a Ice Cream for $2.45. She pays with $10. How much change does she get?", style:'question' },
  { text:"Emma buys a Eraser for 55¢. She pays with $1. How much change does she get?", style:'question' },
  { text:"Emma buys a Sweets Bag for $1.20. She pays with $10. How much change does she get?", style:'question' },
  { text:"Sam wants to buy a Water Bottle that costs $1.35. He has $2. How much money will he have left after buying it?", style:'question' },
  { text:"Emma buys a Crayons for $1.95. She pays with $2. How much change does she get?", style:'question' },
  { text:"Emma buys a Glue Stick for $1.05. She pays with $5. How much change does she get?", style:'question' },
  { text:"Emma buys a Sticker Pack for $1.60. She pays with $2. How much change does she get?", style:'question' },
  { text:"Emma buys a Juice Box for 95¢ and a Apple for 50¢. She pays with $5. How much change does she get?", style:'question' },
  { text:"Sam wants to buy a Cookie that costs 45¢. He has $1. How much money will he have left after buying it?", style:'question' },
  { text:"Emma buys a Ice Cream for $1.80. She pays with $5. How much change does she get?", style:'question' },
  { text:"Emma buys a Banana for 50¢. She pays with $5. How much change does she get?", style:'question' },
  { text:"Emma buys a Ice Cream for $1. She gives the shopkeeper $5. How much change does Emma get?", style:'question' },
  { text:"Emma buys a Balloon for 70¢. She gives the shopkeeper $1. How much change does Emma get?", style:'question' },
  { text:"Emma buys a Eraser for 50¢. She pays with $10. How much change does she get?", style:'question' },
  { text:"Emma buys a Sticker Pack for $1.35. She pays with $2. How much change does she get?", style:'question' },
  { text:"Emma buys a Notebook for $1.05 and a Yo-Yo for $2.45. She pays with $5. How much change does she get?", style:'question' },
  { text:"Emma buys a Toy Car for $3.50. She pays with $5. How much change does she get?", style:'question' },
  { text:"Sam wants to buy a Pencil Sharpener that costs 65¢. He has $2. How much money will he have left after buying it?", style:'question' },
  { text:"Sam wants to buy a Crayons that costs $3.45. He has $5. How much money will he have left after buying it?", style:'question' },
  { text:"Emma buys a Balloon for 50¢. She pays with $5. How much change does she get?", style:'question' },
  { text:"Emma buys a Crayons for $2.75 and a Chocolate Bar for $1.45. She pays with $5. How much change does she get?", style:'question' },
  { text:"Emma buys a Water Bottle for $1.50. She pays with $2. How much change does she get?", style:'question' },
  { text:"Emma buys a Juice Box for $1.25. She pays with $2. How much change does she get?", style:'question' },
  { text:"Emma buys a Sandwich for $1.55. She pays with $5. How much change does she get?", style:'question' },
  { text:"Sam wants to buy a Pencil that costs 35¢. He has $2. How much money will he have left after buying it?", style:'question' },
  { text:"Emma buys a Bookmark for 55¢ and a Bread Loaf for $3.20. She pays with $5. How much change does she get?", style:'question' },
  { text:"Emma buys a Crayons for $1.50 and a Water Bottle for $1. She pays with $5. How much change does she get?", style:'question' },
  { text:"Sam wants to buy a Cookie that costs 70¢. He has $2. How much money will he have left after buying it?", style:'question' },
  { text:"Emma buys a Notebook for $1.70. She pays with $5. How much change does she get?", style:'question' },
];

const MORE_CHANGE_PHRASES = [
  { text:"Emma buys a Chocolate Bar for $1.80. She pays with $10. How much change does she get?", style:'question' },
  { text:"Emma buys a Glue Stick for 75¢. She pays with $1. How much change does she get?", style:'question' },
  { text:"Emma buys a Pencil for 30¢. She pays with $10. How much change does she get?", style:'question' },
  { text:"Emma buys a Lollipop for 70¢. She pays with $5. How much change does she get?", style:'question' },
  { text:"Emma buys a Muffin for $1.20. She pays with $2. How much change does she get?", style:'question' },
  { text:"Emma buys a Bread Loaf for $2.05. She gives the shopkeeper $5. How much change does Emma get?", style:'question' },
  { text:"Emma buys a Chocolate Bar for $1.90. She pays with $2. How much change does she get?", style:'question' },
  { text:"Emma buys a Muffin for $1.85. She pays with $5. How much change does she get?", style:'question' },
  { text:"Emma buys a Sandwich for $1.65. She pays with $5. How much change does she get?", style:'question' },
  { text:"Sam wants to buy a Juice Box that costs 80¢. He has $1. How much money will he have left after buying it?", style:'question' },
  { text:"Emma buys a Ice Cream for $1.05. She pays with $5. How much change does she get?", style:'question' },
  { text:"Emma buys a Sticker Pack for $2.30. She pays with $10. How much change does she get?", style:'question' },
  { text:"Emma buys a Cookie for 60¢. She pays with $1. How much change does she get?", style:'question' },
  { text:"Emma buys a Lollipop for 75¢ and a Biscuit Pack for $1.10. She pays with $5. How much change does she get?", style:'question' },
  { text:"Emma buys a Sweets Bag for $1.85. She pays with $10. How much change does she get?", style:'question' },
  { text:"Emma buys a Ruler for $1.05 and a Eraser for 25¢. She pays with $5. How much change does she get?", style:'question' },
  { text:"Emma buys a Juice Box for $1.15 and a Balloon for 45¢. She pays with $5. How much change does she get?", style:'question' },
  { text:"Emma buys a Eraser for 70¢. She pays with $1. How much change does she get?", style:'question' },
  { text:"Emma buys a Yo-Yo for $2. She pays with $10. How much change does she get?", style:'question' },
  { text:"Emma buys a Sandwich for $3.30. She pays with $5. How much change does she get?", style:'question' },
  { text:"Sam wants to buy a Banana that costs 45¢. He has $1. How much money will he have left after buying it?", style:'question' },
  { text:"Emma buys a Ice Cream for $1.95. She pays with $5. How much change does she get?", style:'question' },
  { text:"Sam wants to buy a Glue Stick that costs 95¢. He has $1. How much money will he have left after buying it?", style:'question' },
  { text:"Sam wants to buy a Tissue Pack that costs $1.05. He has $5. How much money will he have left after buying it?", style:'question' },
  { text:"Sam wants to buy a Sticker Pack that costs $1.90. He has $5. How much money will he have left after buying it?", style:'question' },
  { text:"Emma buys a Cookie for 55¢. She pays with $1. How much change does she get?", style:'question' },
  { text:"Emma buys a Eraser for 40¢ and a Juice Box for $1. She pays with $5. How much change does she get?", style:'question' },
  { text:"Emma buys a Yo-Yo for $1.80. She gives the shopkeeper $5. How much change does Emma get?", style:'question' },
  { text:"Emma buys a Yo-Yo for $2.15. She pays with $5. How much change does she get?", style:'question' },
  { text:"Emma buys a Banana for 25¢ and a Balloon for 60¢. She pays with $5. How much change does she get?", style:'question' },
  { text:"Emma buys a Sweets Bag for 80¢. She pays with $5. How much change does she get?", style:'question' },
  { text:"Sam wants to buy a Banana that costs 35¢. He has $2. How much money will he have left after buying it?", style:'question' },
  { text:"Emma buys a Glue Stick for $1.25. She gives the shopkeeper $2. How much change does Emma get?", style:'question' },
  { text:"Emma buys a Eraser for 75¢ and a Bread Loaf for $3.50. She pays with $5. How much change does she get?", style:'question' },
  { text:"Emma buys a Sweets Bag for $1.40. She pays with $2. How much change does she get?", style:'question' },
  { text:"Emma buys a Tissue Pack for $1.90 and a Muffin for $1.35. She pays with $5. How much change does she get?", style:'question' },
  { text:"Emma buys a Yo-Yo for $2.30. She gives the shopkeeper $10. How much change does Emma get?", style:'question' },
  { text:"Emma buys a Juice Box for 50¢. She gives the shopkeeper $2. How much change does Emma get?", style:'question' },
  { text:"Emma buys a Sticker Pack for 75¢. She pays with $5. How much change does she get?", style:'question' },
  { text:"Emma buys a Muffin for $1.70. She pays with $5. How much change does she get?", style:'question' },
  { text:"Emma buys a Ruler for $1.40 and a Toy Car for $4.95. She pays with $10. How much change does she get?", style:'question' },
  { text:"Emma buys a Lollipop for 40¢. She gives the shopkeeper $1. How much change does Emma get?", style:'question' },
];

// ── All phrases combined ──────────────────────────────────────────────────────
const PHRASES = [
  ...PHASE_PHRASES,
  ...QUESTION_PHRASES,
  ...CHANGE_PHRASES,
  ...MORE_CHANGE_PHRASES,
];

// ── Helpers ────────────────────────────────────────────────────────────────────
const slug = t => t.toLowerCase().replace(/[^a-z0-9\s]/g,'').trim().replace(/\s+/g,'_').slice(0,80);
const sleep = ms => new Promise(r => setTimeout(r, ms));

function fetchTTS(text, style) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ text, model_id: MODEL, voice_settings: VS[style] });
    const req  = https.request({
      hostname: 'api.elevenlabs.io',
      path: `/v1/text-to-speech/${VOICE_ID}`,
      method: 'POST',
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'Accept': 'audio/mpeg',
      },
    }, res => {
      if (res.statusCode !== 200) {
        let e = ''; res.on('data', d => e += d);
        res.on('end', () => reject(new Error(`HTTP ${res.statusCode}: ${e.slice(0,150)}`)));
        return;
      }
      const c = []; res.on('data', d => c.push(d));
      res.on('end', () => resolve(Buffer.concat(c)));
    });
    req.on('error', reject);
    req.write(body); req.end();
  });
}

// ── Main ───────────────────────────────────────────────────────────────────────
async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // De-duplicate phrases by text
  const seen = new Set();
  const unique = PHRASES.filter(p => {
    if (seen.has(p.text)) return false;
    seen.add(p.text); return true;
  });

  const map = {};
  let gen = 0, skip = 0, fail = 0;
  console.log(`\n🎙️  Processing ${unique.length} unique phrases…\n`);

  for (const { text, style } of unique) {
    const fn = `audio_${slug(text)}.mp3`;
    const fp = path.join(OUT_DIR, fn);

    if (fs.existsSync(fp)) {
      process.stdout.write(`  ⏭  SKIP  ${fn.slice(0,65)}\n`);
      map[text] = `/assets/audio/${fn}`; skip++; continue;
    }

    try {
      process.stdout.write(`  🎙  GEN   ${fn.slice(0,65)}... `);
      const buf = await fetchTTS(text, style);
      fs.writeFileSync(fp, buf);
      map[text] = `/assets/audio/${fn}`;
      console.log('✓'); gen++;
      await sleep(DELAY_MS);
    } catch (e) {
      console.log(`✗ ${e.message}`); fail++;
    }
  }

  // Load existing map entries so we don't lose previously generated files
  let existingMap = {};
  if (fs.existsSync(MAP_FILE)) {
    try {
      const content = fs.readFileSync(MAP_FILE, 'utf8');
      const match = content.match(/export const audioMap = ({[\s\S]*?});/);
      if (match) existingMap = JSON.parse(match[1]);
    } catch {}
  }

  const finalMap = { ...existingMap, ...map };

  fs.writeFileSync(MAP_FILE,
    `// Auto-generated — DO NOT EDIT\nexport const audioMap = ${JSON.stringify(finalMap, null, 2)};\n`
  );

  console.log(`\n✅  Done!`);
  console.log(`   Generated : ${gen}`);
  console.log(`   Skipped   : ${skip}`);
  console.log(`   Failed    : ${fail}`);
  console.log(`   Total map : ${Object.keys(finalMap).length} entries`);
  console.log(`   Map file  : src/utils/audioMap.js\n`);
}

main().catch(e => { console.error(e); process.exit(1); });
