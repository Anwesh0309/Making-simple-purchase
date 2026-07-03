import React from 'react';

// ── US Coin SVG renderer ──────────────────────────────────────────────────────
export function CoinSVG({ denomination, size = 64, animated = false, showLabel = true, onClick }) {
  const r = size / 2;

  const configs = {
    1:   { bg:'#c87533', rim:'#a05020', text:'1¢',  textColor:'#fff',    symbol:'🏛' },  // Penny (copper)
    5:   { bg:'#e0e0e0', rim:'#aaaaaa', text:'5¢',  textColor:'#333',    symbol:'⬟'  },  // Nickel (silver)
    10:  { bg:'#d8d8d8', rim:'#999999', text:'10¢', textColor:'#333',    symbol:'⬡'  },  // Dime (small, silver)
    25:  { bg:'#d0d0d0', rim:'#888888', text:'25¢', textColor:'#222',    symbol:'🦅' },  // Quarter (silver, eagle)
    50:  { bg:'#cccccc', rim:'#808080', text:'50¢', textColor:'#111',    symbol:'🗽' },  // Half Dollar
    100: { bg:'#f5d020', rim:'#c8a000', text:'$1',  textColor:'#7a4e00', symbol:'★'  },  // Dollar Coin (gold)
  };

  const c = configs[denomination] || configs[25];
  const fontSize   = size < 48 ? size * 0.22 : size * 0.20;
  const symbolSize = size < 48 ? size * 0.26 : size * 0.28;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
      onClick={onClick}
      role="img"
      aria-label={`${c.text} US coin — ${configs[denomination]?.text || ''}`}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.4))',
        transition: 'transform 0.15s ease',
      }}>

      {/* Outer rim */}
      <circle cx={r} cy={r} r={r - 1} fill={c.rim} />
      {/* Main face */}
      <circle cx={r} cy={r} r={r - 3} fill={c.bg} />
      {/* Reeded edge pattern */}
      {denomination === 10 || denomination === 25 || denomination === 50 ? (
        <circle cx={r} cy={r} r={r - 2} fill="none"
          stroke="rgba(255,255,255,0.2)" strokeWidth={1.5}
          strokeDasharray="3 2" />
      ) : null}
      {/* Inner ring */}
      <circle cx={r} cy={r} r={r * 0.72} fill="none" stroke={c.rim} strokeWidth={size * 0.035} />
      {/* Symbol */}
      <text x={r} y={r - fontSize * 0.2} textAnchor="middle" dominantBaseline="middle"
        fontSize={symbolSize} fill={c.rim}>{c.symbol}</text>
      {/* Value label */}
      {showLabel && (
        <text x={r} y={r + r * 0.44} textAnchor="middle" dominantBaseline="middle"
          fontSize={fontSize} fontWeight="bold" fontFamily="Fredoka, sans-serif"
          fill={c.textColor}>{c.text}</text>
      )}
      {/* Shine gloss */}
      <ellipse cx={r * 0.68} cy={r * 0.52} rx={r * 0.26} ry={r * 0.16}
        fill="white" opacity={0.22} transform={`rotate(-30 ${r} ${r})`} />
    </svg>
  );
}

// ── US Banknote SVG renderer ──────────────────────────────────────────────────
export function NoteSVG({ denomination, size = 'card', showValue = true }) {
  // denomination in cents: 200=$2, 500=$5, 1000=$10
  const isCard = size === 'card';
  const w = isCard ? 200 : 140;
  const h = isCard ? 90  : 62;

  // All US bills are green — use shade variation
  const configs = {
    200:  { text:'$2',  label:'TWO DOLLARS',   shade:'#2e7d32', mid:'#388e3c', stripe:'#66bb6a', portrait:'👨' },
    500:  { text:'$5',  label:'FIVE DOLLARS',  shade:'#1b5e20', mid:'#2e7d32', stripe:'#4caf50', portrait:'🏛' },
    1000: { text:'$10', label:'TEN DOLLARS',   shade:'#0d3b0d', mid:'#1b5e20', stripe:'#43a047', portrait:'🏛' },
  };
  const c = configs[denomination] || configs[500];

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}
      role="img" aria-label={`${c.text} US bill`}
      style={{ filter:'drop-shadow(0 4px 8px rgba(0,0,0,0.45))', borderRadius:6 }}>

      {/* Background */}
      <rect x={0} y={0} width={w} height={h} rx={6} fill={c.shade} />

      {/* Green wash overlay */}
      <rect x={2} y={2} width={w-4} height={h-4} rx={4}
        fill={c.mid} opacity={0.5} />

      {/* Security stripe */}
      <rect x={w*0.35} y={0} width={w*0.03} height={h}
        fill="rgba(100,200,100,0.35)" />

      {/* Inner border */}
      <rect x={5} y={5} width={w-10} height={h-10} rx={3}
        fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={1.5} />

      {/* "THE UNITED STATES OF AMERICA" */}
      <text x={w/2} y={h*0.22} textAnchor="middle" fontSize={isCard ? 5.5 : 4}
        fontFamily="Nunito, sans-serif" fill="rgba(255,255,255,0.7)" letterSpacing={1.5}>
        THE UNITED STATES OF AMERICA
      </text>

      {/* Large denomination */}
      {showValue && (
        <text x={w/2} y={h*0.62} textAnchor="middle" fontSize={isCard ? 30 : 22}
          fontFamily="Fredoka, sans-serif" fontWeight="bold" fill="white">
          {c.text}
        </text>
      )}

      {/* Label */}
      <text x={w/2} y={h*0.85} textAnchor="middle" fontSize={isCard ? 6 : 5}
        fontFamily="Nunito, sans-serif" fill="rgba(255,255,255,0.65)" letterSpacing={1}>
        {c.label}
      </text>

      {/* Corner values */}
      <text x={10} y={h*0.38} fontSize={isCard ? 9 : 7}
        fontFamily="Fredoka, sans-serif" fill="rgba(255,255,255,0.7)">{c.text}</text>
      <text x={w-10} y={h*0.38} textAnchor="end" fontSize={isCard ? 9 : 7}
        fontFamily="Fredoka, sans-serif" fill="rgba(255,255,255,0.7)">{c.text}</text>

      {/* Shine */}
      <ellipse cx={w*0.28} cy={h*0.28} rx={w*0.1} ry={h*0.09}
        fill="white" opacity={0.1} />
    </svg>
  );
}

// ── Coin set display (for question visuals) ───────────────────────────────────
export function CoinSetDisplay({ coins, maxVisible = 12 }) {
  if (!coins || coins.length === 0) return null;
  const visible = coins.slice(0, maxVisible);
  const rest = coins.length - maxVisible;
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center', alignItems:'center' }}>
      {visible.map((c, i) => {
        if (c.denomination >= 200) {
          return <NoteSVG key={i} denomination={c.denomination} size="small" showValue={true} />;
        }
        return <CoinSVG key={i} denomination={c.denomination} size={52} showLabel={true} />;
      })}
      {rest > 0 && (
        <span style={{
          color:'white', fontWeight:'bold', fontSize:'1rem',
          background:'rgba(255,255,255,0.15)', borderRadius:'50%',
          width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center',
        }}>+{rest}</span>
      )}
    </div>
  );
}
