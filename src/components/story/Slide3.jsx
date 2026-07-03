// Slide 3: Emma pays Sam with a $1 bill at the cash register
import React from 'react';

export function Slide3() {
  return (
    <div style={{
      width:'100%', height:'100%', position:'relative', overflow:'hidden',
      background:'linear-gradient(180deg,#f5e6c8 0%,#e8d4a8 100%)',
      display:'flex', flexDirection:'column',
    }}>

      {/* Main scene */}
      <div style={{ flex:1, display:'flex', gap:8, padding:'8px 10px 0', minHeight:0 }}>

        {/* Emma side */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6 }}>
          {/* Emma */}
          <div style={{ fontSize:'3.5rem', lineHeight:1, filter:'drop-shadow(0 3px 6px rgba(0,0,0,0.2))' }}>👧</div>

          {/* Dollar bill she's handing */}
          <div style={{
            background:'linear-gradient(135deg,#1b5e20,#388e3c)',
            borderRadius:8, padding:'6px 14px',
            border:'2px solid #0d3b0d',
            boxShadow:'0 3px 8px rgba(0,0,0,0.3)',
            transform:'rotate(-5deg)',
          }}>
            <div style={{ fontFamily:'Nunito,sans-serif', fontSize:'0.55rem', color:'rgba(255,255,255,0.8)', letterSpacing:1 }}>THE UNITED STATES OF AMERICA</div>
            <div style={{ fontFamily:'Fredoka,sans-serif', fontSize:'1.4rem', fontWeight:700, color:'white', textAlign:'center' }}>$1.00</div>
            <div style={{ fontFamily:'Nunito,sans-serif', fontSize:'0.5rem', color:'rgba(255,255,255,0.7)', letterSpacing:1, textAlign:'center' }}>ONE DOLLAR</div>
          </div>

          <div style={{
            fontSize:'1.5rem', filter:'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
            transform:'translateX(20px)',
          }}>👉</div>
        </div>

        {/* Chocolate bar on counter */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6 }}>
          <div style={{
            background:'#5d3318', borderRadius:10, padding:'8px 12px',
            border:'3px solid #3d1f08', textAlign:'center',
            boxShadow:'0 3px 8px rgba(0,0,0,0.3)',
          }}>
            <div style={{ fontFamily:'Fredoka,sans-serif', fontSize:'0.55rem', color:'#d4a464', letterSpacing:1 }}>MILK CHOCOLATE</div>
            <div style={{ fontSize:'1.8rem' }}>🍫</div>
            <div style={{ fontFamily:'Fredoka,sans-serif', fontSize:'0.55rem', color:'#d4a464', letterSpacing:1 }}>CHOCOLATE BAR</div>
            <div style={{
              background:'#f5f0e0', borderRadius:6, padding:'2px 8px', marginTop:4,
              fontFamily:'Fredoka,sans-serif', fontSize:'1rem', fontWeight:700, color:'#5d3318',
            }}>80¢</div>
          </div>
        </div>

        {/* Sam + register side */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6 }}>
          {/* Speech bubble */}
          <div style={{
            background:'white', borderRadius:14, padding:'6px 10px',
            border:'2px solid #ddd', position:'relative',
            boxShadow:'0 2px 6px rgba(0,0,0,0.15)', textAlign:'center',
            fontSize:'0.65rem', fontFamily:'Nunito,sans-serif', fontWeight:800, color:'#333',
            lineHeight:1.4, maxWidth:130,
          }}>
            The chocolate bar costs <span style={{ color:'#e74c3c', fontWeight:900 }}>80¢.</span><br/>
            I'll open the register.
            <div style={{
              position:'absolute', bottom:-8, left:20,
              width:0, height:0,
              borderLeft:'8px solid transparent',
              borderRight:'8px solid transparent',
              borderTop:'8px solid white',
            }}/>
          </div>
          {/* Sam */}
          <div style={{ fontSize:'3.5rem', lineHeight:1, filter:'drop-shadow(0 3px 6px rgba(0,0,0,0.2))' }}>🧒</div>
          <div style={{
            background:'#3498db', color:'white', borderRadius:8, padding:'2px 10px',
            fontFamily:'Fredoka,sans-serif', fontSize:'0.8rem', fontWeight:700,
          }}>Sam</div>
        </div>
      </div>

      {/* Cash register */}
      <div style={{ display:'flex', justifyContent:'center', padding:'6px 10px' }}>
        <div style={{
          background:'#2c3e50', borderRadius:12, padding:'8px 20px',
          border:'3px solid #1a252f', display:'flex', alignItems:'center', gap:12,
          boxShadow:'0 4px 12px rgba(0,0,0,0.4)',
        }}>
          <span style={{ fontSize:'1.5rem' }}>🏧</span>
          <div style={{
            background:'#1a1a1a', borderRadius:6, padding:'4px 12px',
            border:'2px solid #333',
          }}>
            <div style={{
              fontFamily:'Fredoka,sans-serif', fontSize:'1.2rem',
              color:'#00ff88', textShadow:'0 0 8px #00ff88',
              letterSpacing:2,
            }}>$1.00</div>
          </div>
          <div style={{
            background:'#c8a97a', borderRadius:4, padding:'4px 8px',
            border:'2px solid #a08050',
          }}>
            <div style={{ width:60, height:20, background:'#8B6914', borderRadius:3 }} />
          </div>
        </div>
      </div>

      {/* Signs row */}
      <div style={{ display:'flex', gap:8, padding:'0 10px 8px', justifyContent:'flex-end', flexShrink:0 }}>
        <div style={{
          background:'white', borderRadius:8, padding:'6px 10px',
          border:'1px solid #ddd', boxShadow:'0 1px 4px rgba(0,0,0,0.1)',
          textAlign:'center',
        }}>
          <div style={{ fontFamily:'Nunito,sans-serif', fontSize:'0.5rem', color:'#3498db', fontWeight:900, lineHeight:1.4 }}>
            Thank you<br/>for shopping<br/>at Sam's Shop!
          </div>
          <div style={{ fontSize:'0.8rem' }}>❤️</div>
        </div>
        <div style={{
          background:'white', borderRadius:8, padding:'6px 10px',
          border:'1px solid #ddd', boxShadow:'0 1px 4px rgba(0,0,0,0.1)',
          textAlign:'center',
        }}>
          <div style={{ fontFamily:'Nunito,sans-serif', fontSize:'0.5rem', fontWeight:900, lineHeight:1.5 }}>
            <span style={{ color:'#e74c3c' }}>GOOD</span><br/>
            <span style={{ color:'#e67e22' }}>CHOICES</span><br/>
            <span style={{ color:'#2ecc71' }}>MAKE</span><br/>
            <span style={{ color:'#3498db' }}>HAPPY</span><br/>
            <span style={{ color:'#9b59b6' }}>DAYS!</span>
          </div>
          <div style={{ fontSize:'0.8rem' }}>⭐</div>
        </div>
      </div>
    </div>
  );
}
