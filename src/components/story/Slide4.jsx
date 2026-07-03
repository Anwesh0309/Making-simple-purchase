// Slide 4: Sam gives Emma 20¢ change — CHANGE formula shown
import React from 'react';

export function Slide4() {
  return (
    <div style={{
      width:'100%', height:'100%', position:'relative', overflow:'hidden',
      background:'linear-gradient(180deg,#f5e6c8 0%,#e8d4a8 100%)',
      display:'flex', flexDirection:'column',
    }}>

      {/* Formula board - top */}
      <div style={{
        background:'#fff8ee', margin:'8px 8px 4px', borderRadius:10,
        padding:'8px 12px', border:'2px solid #d4b483',
        boxShadow:'0 2px 6px rgba(0,0,0,0.1)',
      }}>
        <div style={{
          fontFamily:'Nunito,sans-serif', fontSize:'0.72rem', fontWeight:800, color:'#333',
          textAlign:'center', lineHeight:1.5,
        }}>
          Sam gives Emma <span style={{ color:'#2ecc71', fontWeight:900 }}>20¢</span> back.
          This is called <span style={{ color:'#2ecc71', fontWeight:900 }}>CHANGE</span> —
          the money you receive when you pay more than the price.
        </div>
        <div style={{
          display:'flex', justifyContent:'center', alignItems:'center', gap:8,
          marginTop:6, background:'white', borderRadius:8, padding:'6px 12px',
          border:'1px solid #e0d0b0',
        }}>
          <span style={{ fontFamily:'Fredoka,sans-serif', fontSize:'0.9rem', fontWeight:700, color:'#2ecc71' }}>Change</span>
          <span style={{ color:'#333', fontWeight:700 }}>=</span>
          <span style={{ fontFamily:'Fredoka,sans-serif', fontSize:'0.9rem', fontWeight:700, color:'#3498db' }}>Amount Paid</span>
          <span style={{ color:'#333', fontWeight:700 }}>−</span>
          <span style={{ fontFamily:'Fredoka,sans-serif', fontSize:'0.9rem', fontWeight:700, color:'#e74c3c' }}>Price</span>
        </div>
        <div style={{
          display:'flex', justifyContent:'center', alignItems:'center', gap:8,
          marginTop:4,
        }}>
          <span style={{ fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, color:'#2ecc71' }}>20¢</span>
          <span style={{ color:'#333', fontWeight:700 }}>=</span>
          <span style={{ fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, color:'#3498db' }}>$1.00</span>
          <span style={{ color:'#333', fontWeight:700 }}>−</span>
          <span style={{ fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, color:'#e74c3c' }}>80¢</span>
        </div>
      </div>

      {/* Characters scene */}
      <div style={{ flex:1, display:'flex', gap:8, padding:'0 10px', minHeight:0, alignItems:'center' }}>

        {/* Emma receiving */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
          {/* Speech bubble */}
          <div style={{
            background:'white', borderRadius:12, padding:'5px 10px',
            border:'2px solid #ddd', fontSize:'0.7rem',
            fontFamily:'Nunito,sans-serif', fontWeight:800, color:'#333',
          }}>Thank you! 😊</div>
          {/* Emma */}
          <div style={{ fontSize:'3.5rem', filter:'drop-shadow(0 3px 6px rgba(0,0,0,0.2))' }}>👧</div>
          {/* Hand receiving coin */}
          <div style={{ display:'flex', alignItems:'center', gap:4 }}>
            <span style={{ fontSize:'1.2rem' }}>🤲</span>
            <div style={{
              width:24, height:24, borderRadius:'50%',
              background:'#d0d0d0', border:'2px solid #a0a0a0',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:'Fredoka,sans-serif', fontSize:'0.55rem', fontWeight:700, color:'#333',
            }}>20¢</div>
          </div>
          {/* Purse */}
          <div style={{ fontSize:'1.4rem' }}>👛</div>
        </div>

        {/* Counter with chocolate bar */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
          <div style={{
            background:'#5d3318', borderRadius:8, padding:'6px 10px',
            border:'2px solid #3d1f08', textAlign:'center',
          }}>
            <div style={{ fontFamily:'Fredoka,sans-serif', fontSize:'0.5rem', color:'#d4a464' }}>CHOCOLATE BAR</div>
            <div style={{ fontFamily:'Fredoka,sans-serif', fontSize:'0.85rem', color:'white', fontWeight:700 }}>80¢</div>
          </div>

          {/* Cash register */}
          <div style={{
            background:'#2c3e50', borderRadius:8, padding:'5px 10px',
            border:'2px solid #1a252f',
          }}>
            <div style={{
              background:'#1a1a1a', borderRadius:4, padding:'3px 8px',
              fontFamily:'Fredoka,sans-serif', fontSize:'0.85rem',
              color:'#00ff88', textShadow:'0 0 6px #00ff88', letterSpacing:2,
            }}>$1.00</div>
          </div>
        </div>

        {/* Sam handing coin */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
          {/* Sam */}
          <div style={{ fontSize:'3.5rem', filter:'drop-shadow(0 3px 6px rgba(0,0,0,0.2))' }}>🧒</div>
          <div style={{
            background:'#3498db', color:'white', borderRadius:8, padding:'2px 10px',
            fontFamily:'Fredoka,sans-serif', fontSize:'0.75rem', fontWeight:700,
          }}>Sam</div>
          {/* Giving gesture */}
          <div style={{ display:'flex', alignItems:'center', gap:4 }}>
            <div style={{
              width:24, height:24, borderRadius:'50%',
              background:'#d0d0d0', border:'2px solid #a0a0a0',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:'Fredoka,sans-serif', fontSize:'0.55rem', fontWeight:700, color:'#333',
            }}>20¢</div>
            <span style={{ fontSize:'1.2rem' }}>🤏</span>
          </div>
        </div>
      </div>

      {/* Bottom: Remember + Change badge */}
      <div style={{ display:'flex', gap:8, padding:'0 8px 8px', flexShrink:0 }}>
        {/* Remember box */}
        <div style={{
          flex:1, background:'#fff3cd', borderRadius:10, padding:'6px 10px',
          border:'2px solid #ffc107', boxShadow:'0 2px 6px rgba(0,0,0,0.1)',
        }}>
          <div style={{ fontFamily:'Nunito,sans-serif', fontSize:'0.65rem', fontWeight:900, color:'#333', marginBottom:4 }}>
            📌 REMEMBER:
          </div>
          <div style={{ fontFamily:'Fredoka,sans-serif', fontSize:'0.7rem', color:'#555' }}>
            Change = Amount Paid − Price
          </div>
          <div style={{ fontFamily:'Fredoka,sans-serif', fontSize:'0.8rem', fontWeight:700, color:'#2ecc71' }}>
            $1.00 − 80¢ = 20¢
          </div>
        </div>

        {/* Change badge */}
        <div style={{
          width:110, background:'linear-gradient(135deg,#3498db,#9b59b6)',
          borderRadius:50, padding:'8px 10px', textAlign:'center',
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
          boxShadow:'0 3px 10px rgba(0,0,0,0.25)',
          border:'3px solid rgba(255,255,255,0.3)',
        }}>
          <div style={{ fontFamily:'Fredoka,sans-serif', fontSize:'0.9rem', fontWeight:700, color:'white' }}>CHANGE</div>
          <div style={{ fontFamily:'Nunito,sans-serif', fontSize:'0.55rem', fontWeight:700, color:'rgba(255,255,255,0.9)', lineHeight:1.4 }}>
            is the money<br/>you get back!
          </div>
        </div>
      </div>
    </div>
  );
}
