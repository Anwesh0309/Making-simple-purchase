// Slide 1: Sam's Shop is Open — colorful shop counter with price tags
import React from 'react';

export function Slide1() {
  return (
    <div style={{
      width:'100%', height:'100%', position:'relative', overflow:'hidden',
      background:'linear-gradient(180deg, #f5e6c8 0%, #e8d4a8 100%)',
      display:'flex', flexDirection:'column',
    }}>
      {/* Banner */}
      <div style={{
        background:'white', margin:'12px 12px 6px', borderRadius:10,
        padding:'8px 14px', textAlign:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.15)',
        border:'3px solid #eee', position:'relative',
      }}>
        {/* Confetti dots */}
        {['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#ff6bff'].map((c,i)=>(
          <div key={i} style={{
            position:'absolute', width:8, height:8, borderRadius:'50%', background:c,
            top: i%2===0?4:10, left:20+i*30, opacity:0.8,
          }}/>
        ))}
        <span style={{
          fontFamily:'Fredoka, sans-serif', fontSize:'1.4rem', fontWeight:700,
          background:'linear-gradient(90deg,#e74c3c,#3498db,#2ecc71)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          letterSpacing:1,
        }}>Sam's Shop is Open!</span>
      </div>

      {/* Main content row */}
      <div style={{ flex:1, display:'flex', gap:8, padding:'0 10px 8px', minHeight:0 }}>

        {/* Left: Welcome board */}
        <div style={{
          width:100, background:'#2c3e50', borderRadius:10, padding:8,
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
          border:'3px solid #1a252f', boxShadow:'inset 0 0 10px rgba(0,0,0,0.3)',
        }}>
          <div style={{ color:'#4ecdc4', fontFamily:'Fredoka,sans-serif', fontSize:'0.65rem', fontWeight:700, textAlign:'center', lineHeight:1.4 }}>
            Welcome<br/>to<br/>Sam's<br/>Shop!
          </div>
          <div style={{ fontSize:'1.2rem', marginTop:4 }}>😊</div>
        </div>

        {/* Centre: Sam behind counter */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
          {/* Sam character */}
          <div style={{ fontSize:'3rem', lineHeight:1, filter:'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>🧒</div>
          <div style={{
            background:'#3498db', color:'white', borderRadius:8, padding:'2px 10px',
            fontFamily:'Fredoka,sans-serif', fontSize:'0.8rem', fontWeight:700,
          }}>Sam</div>

          {/* Counter */}
          <div style={{
            width:'100%', background:'#8B6914', borderRadius:'8px 8px 0 0',
            padding:'6px 8px', border:'3px solid #6b4f0e',
          }}>
            {/* Items on counter */}
            <div style={{ display:'flex', gap:6, justifyContent:'center', flexWrap:'wrap' }}>
              {[
                { emoji:'🍪', label:'Cookies', price:'$1.50' },
                { emoji:'✏️', label:'Pencils', price:'$0.75' },
                { emoji:'⭐', label:'Stickers', price:'$1.00' },
                { emoji:'🧃', label:'Juice', price:'$1.25' },
              ].map(item => (
                <div key={item.label} style={{
                  background:'#f5f0e8', borderRadius:8, padding:'4px 6px',
                  textAlign:'center', minWidth:52,
                  border:'1px solid #d4b483', boxShadow:'0 1px 3px rgba(0,0,0,0.15)',
                }}>
                  <div style={{ fontSize:'1.2rem' }}>{item.emoji}</div>
                  <div style={{ fontFamily:'Nunito,sans-serif', fontSize:'0.55rem', fontWeight:700, color:'#5a3e1b' }}>{item.label}</div>
                  <div style={{ fontFamily:'Fredoka,sans-serif', fontSize:'0.65rem', fontWeight:700, color:'#e74c3c' }}>{item.price}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Shelf with items */}
        <div style={{
          width:100, display:'flex', flexDirection:'column', gap:4,
        }}>
          {/* Top shelf */}
          <div style={{
            background:'#c8a97a', borderRadius:6, padding:'4px 6px',
            border:'2px solid #a08050', display:'flex', gap:4, justifyContent:'center',
          }}>
            <span style={{ fontSize:'1.3rem' }}>🧸</span>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontFamily:'Fredoka,sans-serif', fontSize:'0.55rem', color:'#5a3e1b', fontWeight:700 }}>$2.50</div>
            </div>
          </div>
          {/* Bottom shelf */}
          <div style={{
            background:'#c8a97a', borderRadius:6, padding:'4px 6px',
            border:'2px solid #a08050', display:'flex', gap:4, justifyContent:'center',
            flex:1, alignItems:'center',
          }}>
            <span style={{ fontSize:'1.1rem' }}>📔</span>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontFamily:'Fredoka,sans-serif', fontSize:'0.55rem', color:'#5a3e1b', fontWeight:700 }}>$5.00</div>
            </div>
          </div>
          {/* Thank you sign */}
          <div style={{
            background:'white', borderRadius:6, padding:'4px 6px', textAlign:'center',
            border:'2px solid #eee', boxShadow:'0 1px 4px rgba(0,0,0,0.1)',
          }}>
            <div style={{ fontFamily:'Nunito,sans-serif', fontSize:'0.5rem', color:'#e74c3c', fontWeight:900, lineHeight:1.3 }}>
              THANK<br/>YOU ❤️
            </div>
          </div>
        </div>
      </div>

      {/* Bottom banner */}
      <div style={{
        background:'linear-gradient(90deg,#3498db,#9b59b6)',
        padding:'5px 12px', textAlign:'center', margin:'0 10px 8px',
        borderRadius:8,
      }}>
        <span style={{ fontFamily:'Fredoka,sans-serif', fontSize:'0.75rem', fontWeight:700, color:'white', letterSpacing:1 }}>
          GOOD CHOICES MAKE HAPPY DAYS! 😊
        </span>
      </div>
    </div>
  );
}
