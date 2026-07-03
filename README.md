# 🪙 ShopSmart: Money & Making Simple Purchases

**Grade 2 Interactive Learning Module** | Intellia SG

An engaging, gamified web-based learning module teaching Primary 2 students in Singapore about money recognition, counting, making purchases, and calculating change — aligned with the Singapore MOE curriculum.

---

## 🎯 Features

- **6 Interactive Stations:** Coin Explorer → Coin Counter → Compare Amounts → Can I Buy It? → Pay & Change → Word Problems
- **100 Auto-Generated Questions:** Randomised daily practice session with adaptive difficulty
- **Audio Narration:** ElevenLabs-powered voice narration with emotion styles (Alice voice)
- **Gamification:** Sen (virtual currency), badges, streaks, star ratings, and certificates
- **Accessibility:** WCAG 2.1 AA compliant, reduced motion support, keyboard navigation
- **Responsive:** Tablet-first design, works on desktop (1024px+) and mobile (375px+)
- **Singapore Context:** HDB void deck, Uncle Ahmad's shop, authentic SG coins & notes

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🎙️ Audio Pre-Generation

To pre-generate all narration audio files (saves API calls):

```bash
export VITE_ELEVENLABS_API_KEY=your_api_key_here
node scripts/generate_audio.js
```

This creates:
- `public/assets/audio/*.mp3` — Pre-generated audio files
- `src/utils/audioMap.js` — Text → file path mapping

**Note:** The app works without pre-generated audio by using the ElevenLabs API fallback via `/api/elevenlabs`.

---

## 📂 Project Structure

```
money-purchases/
├── public/
│   └── assets/
│       └── audio/              # Pre-generated .mp3 files
├── src/
│   ├── components/
│   │   ├── layout/             # ProgressBar, AudioToggle, NarrationBox
│   │   ├── phases/             # Intro, Wonder, Learn, Practice, Reflect, Celebrate
│   │   ├── stations/           # 6 learning stations
│   │   └── ui/                 # CoinSVG, NoteSVG, Badge, Confetti
│   ├── context/
│   │   └── ModuleContext.jsx   # Global state (React Context + useReducer)
│   ├── data/
│   │   ├── coinDenominations.js
│   │   └── shopItems.js
│   ├── hooks/
│   │   └── useNarration.js
│   ├── utils/
│   │   ├── audio.js            # Audio engine (mirrors NumberBound)
│   │   ├── audioMap.js         # Auto-generated map
│   │   ├── narration.js        # Phase narration scripts
│   │   ├── questions.js        # 100-question generator
│   │   └── scoring.js          # Badges & stars logic
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── api/
│   └── elevenlabs.js           # Vercel serverless function (TTS proxy)
├── scripts/
│   └── generate_audio.js       # Pre-generation script
├── package.json
├── vite.config.js
├── tailwind.config.js
└── vercel.json
```

---

## 🎨 Design System

### Colour Palette
- **Amber** `#F5A623` — Primary CTA, highlights
- **Gold** `#D4AF37` — Coins, achievements
- **Mint** `#4ECDC4` — Audio toggle, accents
- **Navy** `#2C3E7A` — Backgrounds, text
- **Cream** `#FFF8EE` — Surfaces, cards
- **Coral** `#FF6B6B` — Wrong answers, lives lost
- **Forest** `#27AE60` — Correct answers, success

### Typography
- **Display:** Fredoka One (headings, buttons, numbers)
- **Body:** Nunito (paragraphs, instructions)

---

## 🏗️ Tech Stack

| Layer        | Technology       |
|--------------|------------------|
| Framework    | React 18         |
| Build Tool   | Vite 5           |
| Styling      | Tailwind CSS 3   |
| Animation    | Framer Motion 11 |
| Icons        | Lucide React     |
| Audio        | ElevenLabs API   |
| State        | React Context    |
| Deployment   | Vercel           |

---

## 🧪 Testing

```bash
npm run test
```

---

## 📦 Deployment

### Vercel (Recommended)

1. Connect your GitHub repo to Vercel
2. Set environment variable: `ELEVENLABS_API_KEY`
3. Deploy

```bash
vercel --prod
```

### Other Platforms (Netlify, Cloudflare Pages)

```bash
npm run build
# Deploy the dist/ folder
```

---

## 🎓 Curriculum Alignment

**Singapore MOE Primary 2 Mathematics Syllabus (2026)**

| Sub-Topic | Learning Outcomes Covered |
|-----------|---------------------------|
| Coins and Notes | Identify and name Singapore currency denominations |
| Counting Money | Count mixed sets of coins and notes; express amounts |
| Comparing Amounts | Determine which amount is greater/smaller |
| Making Purchases | Check if an amount is sufficient to buy an item |
| Change | Calculate change when paying with larger denominations |
| Word Problems | Solve 1–2 step problems involving money |

---

## 🎤 Audio Pipeline

**Voice:** Alice (Clear Engaging Educator) — `Xb7hH8MSUJpSbSDYk0k2`  
**Model:** `eleven_multilingual_v2`

### Emotion Styles
- **celebration** — Milestone achievements
- **encouragement** — Correct answers
- **question** — Asking questions
- **thinking** — Hints & explanations
- **statement** — General narration
- **instruction** — Step-by-step guidance

---

## ♿ Accessibility

- All audio has text equivalents
- Colour is never the sole indicator
- Touch targets minimum 44×44px
- `prefers-reduced-motion` respected
- Keyboard navigation supported
- Lighthouse Accessibility ≥ 95

---

## 🏆 Gamification System

- **Sen:** 5¢ virtual currency per correct answer (max 500¢)
- **Lives:** 3 coins per practice session
- **Streaks:** 3 in a row → "Hot Streak" badge; 10 → "Money Master"
- **Stars:** 60% = 1★ | 80% = 2★ | 95% = 3★
- **Certificate:** Printable completion certificate with score

---

## 📝 License

Copyright © 2026 Intellia SG. All rights reserved.

---

## 🙏 Credits

- **Character Design:** Mei Mei, Uncle Ahmad, Priya
- **Audio:** ElevenLabs (Alice voice)
- **Framework:** React + Vite
- **UI Animation:** Framer Motion
- **Icons:** Lucide React
- **Reference Architecture:** NumberBound (github.com/dsamyak/numberbound)

---

## 📧 Contact

For questions or support: hello@intelliasg.com  
Platform: [intelliasg.com](https://intelliasg.com)
